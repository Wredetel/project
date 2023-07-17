using Microsoft.AspNetCore.Mvc;

namespace practice2023_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class NewsFeedController : ControllerBase
{
    /*private static readonly PostDto[] Posts = new[]
        {
            new PostDto{Text = "Хорошо провели время", Author ="Илья", PublishDate =  new DateTime(2023,05,05, 14,25,0), Photo ="1.jpg", AuthorPhoto ="iliya.png" },
            new PostDto{ Text = "Покатались на досках", Author ="Дарья", PublishDate =  new DateTime(2023,05,23, 17,11,0), Photo ="2.jpg", AuthorPhoto ="daria.jpg" },
            new PostDto{ Text = "Еще раз поедем", Author ="Александр", PublishDate =  new DateTime(2023,05,30, 20,33,0), Photo ="3.jpg", AuthorPhoto ="sasha.png" }
        };
    */

    [HttpGet/*(Name = "GetPosts") */]
    public PostDto[] Get()
    {
        PostDto[] Posts = new PostDto[] { };
        using (ApplicationContext db = new ApplicationContext())
        {
            // var postsFromDb = db.Post.ToArray();
            Posts = db.Post.Select(c =>
            new PostDto
            {
                Text = c.Text,
                Author = c.Author.FirstName,
                PublishDate = c.PublishDate,
                Photo = c.Photo,
                AuthorPhoto = c.Author.Photo
            }
            ).OrderByDescending(c=>c.PublishDate).ToArray();
        }

        return Posts;
    }

    [HttpPost]
    [Authorize]
    public IActionResult Post([FromForm] AddPostDto postRequest)
    {



        //1 получит Ид юзера. сейчас будет первый из бд потом берем ид авториз юзера
        //2 созран изображение, получить на него ссылку 
        //3 создать обьект Post и сохранить его в бд


        using (ApplicationContext db = new ApplicationContext())
        {

                var userId = (int?)HttpContext.Items["UserId"];
                 User author = db.Users.First(c => c.Id == userId);
            var photo = postRequest.File != null ? ImageSaveHelper.SaveImage(postRequest.File) : null;
            var post = new Post
            {
                Author = author,
                Text = postRequest.Text,
                Photo = photo,
                PublishDate = DateTime.Now
            };

            db.Post.Add(post);
            db.SaveChanges();
        }
        return Ok();

    }

}

