using Microsoft.EntityFrameworkCore;
using PTO2306.Data.Models;

namespace PTO2306.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
   public DbSet<UserModel> Users { get; set; } 
   public DbSet<RefreshTokenModel> RefreshTokens { get; set; }

   protected override void OnModelCreating(ModelBuilder builder)
   {
       builder.Entity<RefreshTokenModel>()
           .HasOne(u => u.User)
           .WithMany()
           .HasForeignKey(u => u.UserId);
   }
}