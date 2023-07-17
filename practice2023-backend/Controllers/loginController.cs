using Microsoft.AspNetCore.Mvc;

namespace practice2023_backend.Controllers;


[ApiController]
[Route("[controller]")]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Post([FromForm] LoginDto loginRequest)
    {

        User? user;
        using (ApplicationContext db = new ApplicationContext())
        {
            user = db.Users.FirstOrDefault(c => c.Login == loginRequest.Login && c.Password == loginRequest.Password);
            if (User == null)
            {
                return BadRequest(new { message = "Неверный логин или пароль" });
            }
        }
        return Ok(user);
    }
}