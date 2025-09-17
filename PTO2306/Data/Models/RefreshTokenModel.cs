namespace PTO2306.Data.Models;

public class RefreshTokenModel
{
    public Guid Id { get; set; }
    public required string Token { get; set; }
    public required Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime ExpiresAt { get; set; }

    public UserModel User { get; set; } = null!;
}