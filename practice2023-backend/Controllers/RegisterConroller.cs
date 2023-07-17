using Microsoft.AspNetCore.Mvc;

namespace practice2023_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class RegisterController : ControllerBase
{

    [HttpPost]
    public IActionResult Post([FromForm] RegisterDto registerRequest)
    {
        User? user; // пользователь, которого мы создадим.
        // берем инфо из БД
        using (ApplicationContext db = new ApplicationContext())
        {

            // проверяем что пользователя с таким псевдонимом нет
            user = db.Users.FirstOrDefault(c => c.Login == registerRequest.Login);
            if (user != null)
            {
                return BadRequest(new { message = "Login already in use" });
            }

            // проверяем что пользователя с таким email нет
            user = db.Users.FirstOrDefault(c => c.Email == registerRequest.Email);
            if (user != null)
            {
                return BadRequest(new { message = "Email already in use" });
            }
            // все ок - будем создавать пользователя

            // загрузим аватар пользователя
            var photo = registerRequest.File != null ? ImageSaveHelper.SaveImage(registerRequest.File) : null;
            var newUser = new User
            {
                Login = registerRequest.Login,
                Email = registerRequest.Email,
                Password = registerRequest.Password,
                LastName = registerRequest.LastName,
                FirstName = registerRequest.FirstName,
                ContactInfo = registerRequest.ContactInfo,
                Achievement = registerRequest.Achievement,
                Photo = photo
            };
            db.Users.Add(newUser);
            db.SaveChanges();
        }
        return Ok();
    }

}