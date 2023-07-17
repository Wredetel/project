
public class RegisterDto
{
    public string Login { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? LastName { get; set; }
    public string? FirstName { get; set; }
    public string? ContactInfo { get; set; }
    public string? Achievement { get; set; }
    public IFormFile? File { get; set; }
}