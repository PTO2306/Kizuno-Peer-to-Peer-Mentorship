namespace PTO2306.Data.Models;

public class UserSkill
{
    public Guid UserProfileId { get; set; }
    public UserProfile UserProfile { get; set; } = null!;

    public int SkillId { get; set; }
    public SkillModel Skill { get; set; } = null!;

}