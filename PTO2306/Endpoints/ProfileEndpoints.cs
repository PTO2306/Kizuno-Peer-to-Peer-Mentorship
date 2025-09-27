using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;

namespace PTO2306.Endpoints;

public static class ProfileEndpoints
{
    public static void MapProfileEndpoints(this IEndpointRouteBuilder app)
    {
        // Protected endpoints
        var protectedUser = app.MapGroup("/user")
            .RequireAuthorization(); 

        protectedUser.MapGet("/profile", GetProfile);
        protectedUser.MapPost("/profile", CreateProfile).DisableAntiforgery();
        protectedUser.MapPut("/profile", UpdateProfile).DisableAntiforgery();
    }
   private static async Task<Results<Ok<UserProfileDto>, NotFound>> GetProfile(
      AppDbContext db,
      HttpContext http
   )
   { 
      var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            
      if (userId == null)
         return TypedResults.NotFound();

      var userIdParsed = Guid.Parse(userId);
      var profile = await db.UserProfiles
         .Where(p => p.UserId == userIdParsed )
         .Select(p => new UserProfileDto
         {
            DisplayName = p.DisplayName,
            Bio = p.Bio,
            City = p.City,
            Country = p.Country,
            Skills = p.Skills.Select(us => us.Skill.Name).ToList(),
            ProfilePictureUrl = p.ProfilePictureUrl,
         })
         .FirstOrDefaultAsync();
      
      if (profile == null)
         return TypedResults.NotFound();

      return TypedResults.Ok(profile);

   }
  
   private static async Task<Results<Ok<UserProfileDto>,NotFound, BadRequest<string>>> CreateProfile(
      AppDbContext db,
      HttpContext http,
      [FromForm] ProfileForm form,
      IWebHostEnvironment env
   )
   {
      var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            
      if (userId == null)
         return TypedResults.NotFound();

      var userIdParsed = Guid.Parse(userId);

      var existing = await db.UserProfiles.AnyAsync(p => p.UserId == userIdParsed);
      if (existing)
         return TypedResults.BadRequest("Profile already exists");

      var profile = new UserProfile
      {
         UserId = userIdParsed,
         DisplayName = form.DisplayName,
         Bio = form.Bio,
         City = form.City,
         Country = form.Country,
         Skills = new List<UserSkill>(),
      };

      if (!string.IsNullOrEmpty(form.Skills))
      {
         var skillNames = JsonSerializer.Deserialize<List<string>>(form.Skills);
         if (skillNames != null)
         {
            foreach (var skillName in skillNames)
            {
               var skill = await db.Skills.FirstOrDefaultAsync(s => s.Name == skillName)
                           ?? new SkillModel { Name = skillName };
               profile.Skills.Add(new UserSkill { Skill = skill });
            }
         }
      }

      if (form.ProfilePicture != null && form.ProfilePicture.Length > 0)
      {
         var uploadsPath = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads", "profiles");
         Directory.CreateDirectory(uploadsPath);

         var extension = Path.GetExtension(form.ProfilePicture.FileName).ToLowerInvariant();
         var fileName = $"{Guid.NewGuid()}{extension}";
         var filePath = Path.Combine(uploadsPath, fileName);

         await using var stream = new FileStream(filePath, FileMode.Create);
         await form.ProfilePicture.CopyToAsync(stream);

         profile.ProfilePictureUrl = $"/uploads/profiles/{fileName}";
      }

      db.UserProfiles.Add(profile);
      await db.SaveChangesAsync();

      return TypedResults.Ok(new UserProfileDto
      {
         DisplayName = profile.DisplayName,
         Bio = profile.Bio,
         City = profile.City,
         Country = profile.Country,
         Skills = profile.Skills.Select(s => s.Skill.Name).ToList(),
         ProfilePictureUrl = profile.ProfilePictureUrl
      });

   }

  
   private static async Task<Results<Ok<UserProfileDto>, NotFound>> UpdateProfile(
      AppDbContext db,
      HttpContext http,
      [FromForm] ProfileForm form,
      IWebHostEnvironment env
   )
   {
      var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            
      if (userId == null)
         return TypedResults.NotFound();

      var userIdParsed = Guid.Parse(userId);

      var profile = await db.UserProfiles
         .Include(p => p.Skills)
         .ThenInclude(us => us.Skill)
         .FirstOrDefaultAsync(p => p.UserId == userIdParsed);

      if (profile == null)
         return TypedResults.NotFound();

      profile.DisplayName = form.DisplayName;
      profile.Bio = form.Bio;
      profile.City = form.City;
      profile.Country = form.Country;
      profile.UpdatedAt = DateTime.UtcNow;

      profile.Skills.Clear();
      if (!string.IsNullOrEmpty(form.Skills))
      {
         var skillNames = JsonSerializer.Deserialize<List<string>>(form.Skills);
         if (skillNames != null)
         {
            foreach (var skillName in skillNames)
            {
               var skill = await db.Skills.FirstOrDefaultAsync(s => s.Name == skillName)
                           ?? new SkillModel { Name = skillName };
               profile.Skills.Add(new UserSkill { UserProfile = profile, Skill = skill });
            }
         }
      }

      if (form.ProfilePicture != null && form.ProfilePicture.Length > 0)
      {
         var uploadsPath = Path.Combine(env.WebRootPath ?? "wwwroot", "uploads", "profiles");
         Directory.CreateDirectory(uploadsPath);

         if (!string.IsNullOrEmpty(profile.ProfilePictureUrl))
         {
            var oldPath = Path.Combine(env.WebRootPath ?? "wwwroot", profile.ProfilePictureUrl.TrimStart('/'));
            if (File.Exists(oldPath))
               File.Delete(oldPath);
         }

         var extension = Path.GetExtension(form.ProfilePicture.FileName).ToLowerInvariant();
         var fileName = $"{Guid.NewGuid()}{extension}";
         var filePath = Path.Combine(uploadsPath, fileName);

         await using var stream = new FileStream(filePath, FileMode.Create);
         await form.ProfilePicture.CopyToAsync(stream);

         profile.ProfilePictureUrl = $"/uploads/profiles/{fileName}";
      }

      await db.SaveChangesAsync();

      return TypedResults.Ok(new UserProfileDto
      {
         DisplayName = profile.DisplayName,
         Bio = profile.Bio,
         City = profile.City,
         Country = profile.Country,
         Skills = profile.Skills.Select(s => s.Skill.Name).ToList(),
         ProfilePictureUrl = profile.ProfilePictureUrl
      });

   }

}