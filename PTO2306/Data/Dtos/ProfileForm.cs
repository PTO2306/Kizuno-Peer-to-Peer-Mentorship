namespace PTO2306.Data.Dtos;

public class ProfileForm
{
    public string DisplayName { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public List<SkillDto>? Skills { get; set; } 
    public IFormFile? ProfilePicture { get; set; }
}