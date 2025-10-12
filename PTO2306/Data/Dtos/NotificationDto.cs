namespace PTO2306.Data.Dtos;

public class NotificationDto
{
   public int Id { get; set; }
   public string SenderName { get; set; }
   public string? ProfilePictureUrl { get; set; }
   public string Message { get; set; }
   public bool IsRead { get; set; }
   public string Timestamp { get; set; }
}