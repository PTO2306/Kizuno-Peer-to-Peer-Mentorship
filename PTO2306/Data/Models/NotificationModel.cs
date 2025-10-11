namespace PTO2306.Data.Models;

public class NotificationModel
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public Guid SenderId { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
    
    public UserModel? Sender { get; set; }
}