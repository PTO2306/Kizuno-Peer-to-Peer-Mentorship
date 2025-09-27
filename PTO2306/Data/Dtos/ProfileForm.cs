namespace PTO2306.Data.Dtos;

public class ProfileForm
{
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? Skills { get; set; } // will be JSON
    public IFormFile? ProfilePicture { get; set; }
}