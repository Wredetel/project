using Microsoft.EntityFrameworkCore;

public class ApplicationContext:DbContext{
public DbSet<User> Users {get;set;} = null! ;
public DbSet<Post> Post {get;set;} = null! ;

public ApplicationContext()

{
    bool databaseCreated = Database.EnsureCreated();
    if (databaseCreated)
    {
         User user1 = new User { Login = "daria", FirstName = "Дарья", Photo = "daria.jpg", Email = "daria@surf.ru", Password = "*" };
            User user2 = new User { Login = "iliya", FirstName = "Илья", Photo = "iliya.png", Email = "iliya@surf.ru", Password = "*" };
            User user3 = new User { Login = "sasha", FirstName = "Александр", Photo = "sasha.png", Email = "sasha@surf.ru", Password = "*" };

          Post post1 = new Post { Text = "Хорошо провели время", Author = user1, PublishDate = new DateTime(2023, 05, 05, 14, 25, 0), Photo = "1.jpg" };
            Post post2 = new Post { Text = "Покатались на досках", Author = user2, PublishDate = new DateTime(2023, 05, 23, 17, 11, 0), Photo = "2.jpg" };
            Post post3 = new Post { Text = "Еще раз поедем", Author = user3, PublishDate = new DateTime(2023, 05, 30, 20, 33, 0), Photo = "3.jpg" };  

            Users.Add(user1);
            Users.Add(user2);
            Users.Add(user3);

            Post.Add(post1);
            Post.Add(post2);
            Post.Add(post3);

            SaveChanges();
    }



}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Database=practice2023;Username=postgres;Password=1");
    }
}