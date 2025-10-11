namespace PTO2306.Data.Models;

public enum RequestStatus
{
    Pending,
    Accepted,
    Declined
    
}
public class ConnectionRequestModel
{
    public Guid ListingId { get; set; }
    public Guid SenderId { get; set; }
    public RequestStatus Status { get; set; } = RequestStatus.Pending;
    public string? Message { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RespondedAt { get; set; } 
    
    public ListingModel Listing { get; set; }
    public UserModel Sender { get; set; }
}