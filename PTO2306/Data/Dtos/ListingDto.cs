using PTO2306.Data.Models;

namespace PTO2306.Data.Dtos;

public class ListingDto
{
    public Guid Id { get; set; }
    
    public string DisplayName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public string Title { get; set; } = null!;
    public string? Subtitle { get; set; } = null!;
    public string? Description { get; set; }

    public ListingType Type { get; set; } 
    public SkillLevel? SkillLevel { get; set; }
    public Availability? Availability { get; set; }
    public Mode? Mode { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public bool IsOwner  { get; set; }

    public List<TagDto> Tags { get; set; } = new();
}