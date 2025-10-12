namespace PTO2306.Data.Models;

public class UserSkill
{
    public Guid UserProfileId { get; set; }
    public UserProfileModel UserProfileModel { get; set; } = null!;

    public int SkillId { get; set; }
    public SkillModel Skill { get; set; } = null!;
    public bool IsTeaching { get; set; } = false;

}