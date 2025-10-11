using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;

namespace PTO2306.Endpoints;

public static class ListingEndpoints
{
    public static void MapListingEndpoints(this IEndpointRouteBuilder app)
    {
        // Protected endpoints
        var protectedGeneral = app.MapGroup("");
        var protectedUser = app.MapGroup("/user")
            .RequireAuthorization(); 
    
        // protectedGeneral.MapGet("/listings", GetAllListings);
        protectedUser.MapGet("/listing", GetUserListings);
        protectedUser.MapPost("/listing", CreateListing).DisableAntiforgery();
        protectedUser.MapPut("/listing", UpdateListing).DisableAntiforgery();
        protectedUser.MapDelete("/listing/{id}", DeleteListing).DisableAntiforgery();
    }
 
    private static async Task<Results<Ok<List<ListingDto>>, NotFound>> GetUserListings(AppDbContext db, HttpContext http)
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            
        if (userId == null)
            return TypedResults.NotFound(); 
        
        var listings = await db.Listings
            .Include(l => l.ListingTags)
                .ThenInclude(lt => lt.Tag)
            .Where(l => l.UserId == Guid.Parse(userId))
            .Select(l => new ListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Subtitle = l.Subtitle,
                Description = l.Description,
                DisplayName = l.User.UserProfile.DisplayName ?? "Unknown",
                ProfilePictureUrl = l.User.UserProfile.ProfilePictureUrl,
                Type = l.Type,
                SkillLevel = l.SkillLevel,
                Availability = l.Availability,
                Mode = l.Mode,
                CreatedAt = l.CreatedAt,
                UpdatedAt = l.UpdatedAt,
                IsOwner = true,
                Tags = l.ListingTags.Select(lt => new TagDto
                {
                    Id = lt.Tag.Id,
                    Name = lt.Tag.Name
                }).ToList()
            })
            .ToListAsync(); 

        return TypedResults.Ok(listings);
    }

    private static async Task<Results<Ok<ListingDto>, BadRequest<string>, NotFound<string>>> CreateListing(
        AppDbContext db,
        HttpContext http,
        [FromBody] ListingDto dto
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return TypedResults.BadRequest("User not authenticated.");
        
        var user = db.Users.Include(u => u.UserProfile).FirstOrDefault(u => u.Id == Guid.Parse(userId));
        if (user == null) return TypedResults.NotFound("User not found.");
        
        var listing = new ListingModel
        {
            Id = Guid.NewGuid(),
            UserId = Guid.Parse(userId),
            User = user,
            Title = dto.Title,
            Subtitle = dto.Subtitle,
            Description = dto.Description,
            Type = dto.Type,
            SkillLevel = dto.SkillLevel,
            Availability = dto.Availability,
            Mode = dto.Mode,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ListingTags = new List<ListingTagsModel>()
        };

        if (dto.Tags.Any())
        {
            foreach (var tagDto in dto.Tags)
            {
                var tag = await db.Tags.FirstOrDefaultAsync(t => t.Name == tagDto.Name)
                          ?? new TagModel { Name = tagDto.Name };

                listing.ListingTags.Add(new ListingTagsModel
                {
                    Listing = listing,
                    Tag = tag
                });
            }
        }

        db.Listings.Add(listing);
        await db.SaveChangesAsync();

        var result = new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Subtitle = listing.Subtitle,
            DisplayName = user.UserProfile?.DisplayName ?? "Unknown",
            ProfilePictureUrl = user.UserProfile?.ProfilePictureUrl,
            Description = listing.Description,
            Type = listing.Type,
            SkillLevel = listing.SkillLevel,
            Availability = listing.Availability,
            Mode = listing.Mode,
            CreatedAt = listing.CreatedAt,
            UpdatedAt = listing.UpdatedAt,
            IsOwner = true,
            Tags = listing.ListingTags.Select(lt => new TagDto
            {
                Id = lt.Tag.Id,
                Name = lt.Tag.Name
            }).ToList()
        };

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<ListingDto>, BadRequest<string>, NotFound>> UpdateListing(
        AppDbContext db,
        Guid id,
        HttpContext http,
        [FromBody] ListingDto dto
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return TypedResults.BadRequest("User not authenticated.");
        var listing = await db.Listings
            .Include(l => l.User)
                .ThenInclude(u => u.UserProfile)
            .Include(l => l.ListingTags)
                .ThenInclude(lt => lt.Tag)
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == Guid.Parse(userId));

        if (listing == null) return TypedResults.NotFound();

        listing.Title = dto.Title;
        listing.Description = dto.Description;
        listing.Type = dto.Type;
        listing.Subtitle = dto.Subtitle;
        listing.SkillLevel = dto.SkillLevel;
        listing.Availability = dto.Availability;
        listing.Mode = dto.Mode;
        listing.UpdatedAt = DateTime.UtcNow;

        listing.ListingTags.Clear();

        if (dto.Tags.Any())
        {
            foreach (var tagDto in dto.Tags)
            {
                var tag = await db.Tags.FirstOrDefaultAsync(t => t.Name == tagDto.Name)
                          ?? new TagModel { Name = tagDto.Name };

                listing.ListingTags.Add(new ListingTagsModel
                {
                    Listing = listing,
                    Tag = tag
                });
            }
        }

        await db.SaveChangesAsync();

        var result = new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title, 
            Subtitle = listing.Subtitle,
            DisplayName = listing.User.UserProfile?.DisplayName ?? "Unknown",
            ProfilePictureUrl = listing.User.UserProfile?.ProfilePictureUrl,
            Description = listing.Description,
            Type = listing.Type,
            SkillLevel = listing.SkillLevel,
            Availability = listing.Availability,
            Mode = listing.Mode,
            CreatedAt = listing.CreatedAt,
            UpdatedAt = listing.UpdatedAt,
            IsOwner = true,
            Tags = listing.ListingTags.Select(lt => new TagDto
            {
                Id = lt.Tag.Id,
                Name = lt.Tag.Name
            }).ToList()
        };

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok,BadRequest<string>, NotFound>> DeleteListing(
        AppDbContext db,
        HttpContext http,
        Guid id
    )
    {
        var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return TypedResults.BadRequest("User not authenticated.");
        
        var listing = await db.Listings
            .Include(l => l.ListingTags)
            .FirstOrDefaultAsync(l => l.Id == id && l.UserId == Guid.Parse(userId));

        if (listing == null) return TypedResults.NotFound();

        db.Listings.Remove(listing);
        await db.SaveChangesAsync();

        return TypedResults.Ok();
    }
}