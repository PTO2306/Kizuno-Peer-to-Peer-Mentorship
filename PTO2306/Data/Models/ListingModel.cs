namespace PTO2306.Data.Models;
public enum ListingType
{
    Mentor,    // offering to teach/guide
    Mentee     // requesting guidance
}

public enum SkillLevel
{
    Beginner,
    Intermediate,
    Advanced,
    Expert
}

public enum Availability
{
    Anytime,
    Weekdays,
    Weekends,
    Evenings,
    Mornings,
    Afternoons
}

public enum Mode
{
    Online,
    InPerson,
    Hybrid
}


public class ListingModel
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    public required string Title { get; set; }
    public string? Subtitle { get; set; }
    public string? Description { get; set; }
    public ListingType Type { get; set; } 
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public List<ListingTagsModel> ListingTags { get; set; } = new();

    public SkillLevel? SkillLevel { get; set; }
    public Availability? Availability { get; set; }
    public Mode? Mode { get; set; }
    
    public UserModel User { get; set; }
}