using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;
using PTO2306.Middleware;

namespace PTO2306.Services;

public interface INotificationService
{
    Task SendNotificationToUserAsync(Guid recipientId, Guid senderId, string message);
    Task SendNotificationToUsersAsync(List<Guid> recipientIds, Guid senderId, string message);
}

public class NotificationService(IHubContext<NotificationHub> hubContext, AppDbContext db) : INotificationService
{
    public async Task SendNotificationToUserAsync(Guid recipientId, Guid senderId, string message)
    {
        var sender = await db.Users
            .Include(userModel => userModel.UserProfile)
            .Where(u => u.Id == senderId)
            .FirstOrDefaultAsync();
        
        NotificationModel notifModel = new ()
        {
            SenderId = senderId,
            UserId = recipientId,
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
            .Group($"user_{recipientId}")
            .SendAsync("ReceiveNotification", dto);
    }

    public async Task SendNotificationToUsersAsync(List<Guid> recipientIds, Guid senderId, string message)
    {
        var sender = await db.Users
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(u => u.Id == senderId);

        if (sender == null)
            return;

        var notifications = new List<NotificationModel>();
        var notificationDtos = new List<NotificationDto>();

        foreach (var userId in recipientIds)
        {
            var notifModel = new NotificationModel
            {
                SenderId = senderId,
                UserId = userId,
                Message = message,
                Sender = sender
            };

            notifications.Add(notifModel);

            notificationDtos.Add(new NotificationDto
            {
                Id = notifModel.Id,
                SenderName = sender.UserProfile?.DisplayName ?? "Unknown",
                ProfilePictureUrl = sender.UserProfile?.ProfilePictureUrl,
                Message = notifModel.Message,
                IsRead = notifModel.IsRead,
                Timestamp = notifModel.Timestamp.ToString("O")
            });
        }

        db.Notifications.AddRange(notifications);
        await db.SaveChangesAsync();

        foreach (var (userId, dto) in recipientIds.Zip(notificationDtos))
        {
            await hubContext.Clients
                .Group($"user_{userId}")
                .SendAsync("ReceiveNotification", dto);
        }
    }
}