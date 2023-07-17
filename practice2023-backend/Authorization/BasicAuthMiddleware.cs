using System.Net.Http.Headers;
using System.Text;
public class BasicAuthMiddleware
{

    private readonly RequestDelegate _next;

    public BasicAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }
    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Headers.ContainsKey("Authorization"))
        {
            var authHeader = AuthenticationHeaderValue.Parse(context.Request.Headers["Authorization"]);
            if (authHeader.Parameter != null)
            {
                var credBytes = Convert.FromBase64String(authHeader.Parameter);
                var credentials = Encoding.UTF8.GetString(credBytes).Split(':', 2);
                var username = credentials[0];
                var password = credentials[1];

                using (ApplicationContext db = new ApplicationContext())
                {
                    var user = db.Users.FirstOrDefault(c => c.Login == username && c.Password == password);
                    if (user != null)
                    {
                        context.Items["UserId"] = user.Id;
                    }
                }
            }
        }
        await _next(context);
    }

}