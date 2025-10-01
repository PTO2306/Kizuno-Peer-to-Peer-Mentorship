namespace PTO2306.Data.Dtos;

public class UserProfileDto
{
        public string? DisplayName { get; set; }
        public string? Bio { get; set; }
        public string? City { get; set; }
        public string? Country {get; set; } 
        public List<SkillDto>? Skills {get; set; } 
        public string? ProfilePictureUrl { get; set; }
}