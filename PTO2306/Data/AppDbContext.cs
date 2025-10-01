using Microsoft.EntityFrameworkCore;
using PTO2306.Data.Models;

namespace PTO2306.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
   public DbSet<UserModel> Users { get; set; } 
   public DbSet<RefreshTokenModel> RefreshTokens { get; set; }
   public DbSet<UserProfile> UserProfiles { get; set; }
   public DbSet<UserSkill> UserSkills { get; set; }
   public DbSet<SkillModel> Skills { get; set; }
   public DbSet<TagModel> Tags { get; set; }
   public DbSet<ListingModel> Listings { get; set; }
   public DbSet<ListingTags> ListingTags { get; set; }

   protected override void OnModelCreating(ModelBuilder builder)
   {
       builder.Entity<RefreshTokenModel>()
           .HasOne(u => u.User)
           .WithMany()
           .HasForeignKey(u => u.UserId);
       
       builder.Entity<UserModel>()
           .HasOne(u => u.UserProfile)
           .WithOne(p => p.User)
           .HasForeignKey<UserProfile>(p => p.UserId);

       builder.Entity<UserProfile>()
           .HasKey(p => p.UserId);

       builder.Entity<UserSkill>()
           .HasKey(us => new { us.UserProfileId, us.SkillId });
       
       builder.Entity<UserSkill>()
           .HasOne(us => us.UserProfile)
           .WithMany(p => p.Skills)
           .HasForeignKey(us => us.UserProfileId);

       builder.Entity<UserSkill>()
           .HasOne(us => us.Skill)
           .WithMany()
           .HasForeignKey(us => us.SkillId);
       
       builder.Entity<SkillModel>()
           .HasIndex(t => t.Name)
           .IsUnique();
       
       builder.Entity<ListingTags>()
           .HasKey(lt => new { lt.ListingId, lt.TagId });

       builder.Entity<ListingTags>()
           .HasOne(lt => lt.Listing)
           .WithMany(l => l.ListingTags)
           .HasForeignKey(lt => lt.ListingId);

       builder.Entity<ListingTags>()
           .HasOne(lt => lt.Tag)
           .WithMany()
           .HasForeignKey(lt => lt.TagId);

       builder.Entity<TagModel>()
           .HasIndex(t => t.Name)
           .IsUnique();
   }
}