using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;

namespace PTO2306.Endpoints;

public static class NotificationEndpoints
{
       public static void MapNotificationEndpoints(this IEndpointRouteBuilder app)
    {
        var protectedUser = app.MapGroup("/user")
            .RequireAuthorization();

        protectedUser.MapGet("/notifications", GetNotifications);
        protectedUser.MapPut("/notifications/read-all", MarkAllNotificationsAsRead);
        protectedUser.MapDelete("/notifications/read-all", DeleteAllNotifications);
    }

    private static async Task<Results<Ok<List<NotificationDto>>, NotFound>> GetNotifications(
        AppDbContext db,
        HttpContext http
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return TypedResults.NotFound();

        var userIdParsed = Guid.Parse(userId);

        var notifications =  await db.Notifications
            .Where(n => n.UserId == userIdParsed)
            .OrderByDescending(n => n.Timestamp)
            .Select(n => new NotificationDto
            {
                Id = n.Id,
                SenderName = n.Sender.UserProfile.DisplayName ?? "Unknown",
                ProfilePictureUrl = n.Sender.UserProfile.ProfilePictureUrl,
                Message = n.Message,
                IsRead = n.IsRead,
                Timestamp = n.Timestamp.ToString("O")
            }).ToListAsync();

        return TypedResults.Ok(notifications);
    }

    private static async Task<Results<Ok, NotFound>> MarkAllNotificationsAsRead(
        AppDbContext db,
        HttpContext http
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return TypedResults.NotFound();

        var userIdParsed = Guid.Parse(userId);

        var unreadNotifications = await db.Notifications
            .Where(n => n.UserId == userIdParsed && !n.IsRead)
            .ToListAsync();

        if (unreadNotifications.Count == 0)
            return TypedResults.Ok();

        foreach (var notification in unreadNotifications)
        {
            notification.IsRead = true;
        }

        await db.SaveChangesAsync();

        return TypedResults.Ok();
    } 
    
    private static async Task<Results<Ok, NotFound>> DeleteAllNotifications(
        AppDbContext db,
        HttpContext http
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return TypedResults.NotFound();

        var userIdParsed = Guid.Parse(userId);

        var notifs = await db.Notifications
            .Where(n => n.UserId == userIdParsed)
            .ToListAsync();

        db.RemoveRange(notifs);
        await db.SaveChangesAsync();

        return TypedResults.Ok();
    } 
}