
public class User {

    public int Id { get; set; }
    public string? Login { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public string? ContactInfo { get; set; }
    public string? About { get; set; }
    public string? Achievement { get; set; }
    public string? Photo { get; set; }
    public List<Post> Posts { get; set; } = new();
}
