namespace PTO2306.Data.Models;

public class UserModel
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; } 
    public required string PasswordHash { get; set; }
}