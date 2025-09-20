using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
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
        protectedUser.MapPost("/profile", CreateProfile);
        protectedUser.MapPut("/profile", UpdateProfile);
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
            Skills = p.Skills.Select(us => us.Skill.Name).ToList()
         })
         .FirstOrDefaultAsync();
      
      if (profile == null)
         return TypedResults.NotFound();

      return TypedResults.Ok(profile);

   }
  
   private static async Task<Results<Ok<UserProfileDto>,NotFound, BadRequest<string>>> CreateProfile(
      AppDbContext db,
      HttpContext http,
      UserProfileDto dto
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
         DisplayName = dto.DisplayName,
         Bio = dto.Bio,
         City = dto.City,
         Country = dto.Country,
         Skills = new List<UserSkill>(),
      };

      if (dto.Skills != null)
         foreach (var skillName in dto.Skills)
         {
            var skill = await db.Skills.FirstOrDefaultAsync(s => s.Name == skillName)
                        ?? new SkillModel { Name = skillName };

            profile.Skills.Add(new UserSkill { Skill = skill });
         }

      db.UserProfiles.Add(profile);
      await db.SaveChangesAsync();

      return TypedResults.Ok(dto);
   }

  
   private static async Task<Results<Ok<UserProfileDto>, NotFound>> UpdateProfile(
      AppDbContext db,
      HttpContext http,
      UserProfileDto dto
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

      profile.DisplayName = dto.DisplayName;
      profile.Bio = dto.Bio;
      profile.City = dto.City;
      profile.Country = dto.Country;
      profile.UpdatedAt = DateTime.UtcNow;

      profile.Skills.Clear();
      if (dto.Skills != null)
         foreach (var skillName in dto.Skills)
         {
            var skill = await db.Skills.FirstOrDefaultAsync(s => s.Name == skillName)
                        ?? new SkillModel { Name = skillName };

            profile.Skills.Add(new UserSkill { UserProfile = profile, Skill = skill });
         }

      await db.SaveChangesAsync();

      return TypedResults.Ok(dto);
   }

}