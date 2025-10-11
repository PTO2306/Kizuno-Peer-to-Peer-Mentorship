namespace PTO2306.Data.Models;

public class UserProfileModel
{
    public Guid UserId { get; set; }
    public UserModel User { get; set; } = null!;

    public string? DisplayName { get; set; }
    public string? Bio { get; set; }

    public string? City { get; set; }
    public string? Country { get; set; }

    public bool IsMentor { get; set; }
    public bool IsMentee { get; set; }
    
    public string? ProfilePictureUrl { get; set; } 

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public List<UserSkill> Skills { get; set; } = new(); 
}