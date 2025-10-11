using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;
using PTO2306.Middleware;

namespace PTO2306.Services;

public interface INotificationService
{
    Task SendNotificationToUserAsync(Guid userId, Guid senderId, string message);
    // Task SendNotificationToUsersAsync(IEnumerable<Guid> userIds, Guid senderId, string message);
}

public class NotificationService(IHubContext<NotificationHub> hubContext, AppDbContext db) : INotificationService
{
    public async Task SendNotificationToUserAsync(Guid userId, Guid senderId, string message)
    {
        var sender = await db.Users
            .Include(userModel => userModel.UserProfile)
            .Where(u => u.Id == senderId)
            .FirstOrDefaultAsync();
        
        NotificationModel notifModel = new ()
        {
            SenderId = senderId,
            UserId = userId,
            Message = message,
            Sender = sender
        };
        
        db.Notifications.Add(notifModel);
        await db.SaveChangesAsync();


        NotificationDto dto = new()
        {
            Id = notifModel.Id,
            SenderName = sender?.UserProfile?.DisplayName ?? "Unknown",
            ProfilePictureUrl = sender?.UserProfile?.ProfilePictureUrl,
            Message = notifModel.Message,
            IsRead = notifModel.IsRead,
            Timestamp = notifModel.Timestamp.ToString("O")
        };
        
        await hubContext.Clients
            .Group($"user_{userId}")
            .SendAsync("ReceiveNotification", dto);
    }

    // public async Task SendNotificationToUsersAsync(IEnumerable<Guid> userIds, Guid senderId, string message)
    // {
    //     var groups = userIds.Select(id => $"user_{id}").ToList();
    //     
    //     await hubContext.Clients
    //         .Groups(groups)
    //         .SendAsync("ReceiveNotification", new
    //         {
    //             message,
    //             timestamp = DateTime.UtcNow
    //         });
    // }
}