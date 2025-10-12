using PTO2306.Data.Models;

namespace PTO2306.Data.Dtos;

public class ConnectionRequestDto
{
    public Guid ListingId { get; set; }
    public Guid SenderId { get; set; }
    public string DisplayName { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public RequestStatus Status { get; set; }
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RespondedAt { get; set; } 
}