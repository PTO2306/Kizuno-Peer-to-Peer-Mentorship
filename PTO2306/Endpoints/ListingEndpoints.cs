using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;
using PTO2306.Services;

namespace PTO2306.Endpoints;

public static class ListingEndpoints
{
    public static void MapListingEndpoints(this IEndpointRouteBuilder app)
    {
        // Protected endpoints
        var protectedGeneral = app.MapGroup("")
            .RequireAuthorization();
        var protectedUser = app.MapGroup("/user")
            .RequireAuthorization(); 
    
        // User Listing Endpoints
        protectedUser.MapGet("/listing", GetUserListings);
        protectedUser.MapPost("/listing", CreateListing).DisableAntiforgery();
        protectedUser.MapPut("/listing", UpdateListing).DisableAntiforgery();
        protectedUser.MapDelete("/listing/{id}", DeleteListing).DisableAntiforgery();
        
        // General Listing Endpoints
        protectedGeneral.MapGet("/listings", GetListings);
        protectedGeneral.MapPost("/listing/request", CreateConnectionRequest);
        protectedGeneral.MapPut("/listing/request", UpdateConnectionRequest);
        protectedGeneral.MapGet("/listing/{id}/requests", GetListingRequests);

    }
 
    #region User Methods
        private static async Task<Results<Ok<List<ListingDto>>, NotFound>> GetUserListings(AppDbContext db, HttpContext http)
        {
            var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
                
            if (userId == null)
                return TypedResults.NotFound(); 
            
            var listings = await db.Listings
                .AsNoTracking()
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
                    }).ToList(),
                    ConnectionRequests = l.ConnectionRequests.Select(cr => new ConnectionRequestDto
                    {
                        SenderId = cr.Sender.Id,
                        DisplayName = cr.Sender.UserProfile.DisplayName ?? "Unknown",
                        ProfilePictureUrl = cr.Sender.UserProfile.ProfilePictureUrl,
                        Message = cr.Message,
                        Status = cr.Status,
                        CreatedAt = cr.CreatedAt,
                        RespondedAt = cr.RespondedAt
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
                .AsSplitQuery()
                .Include(l => l.User)
                    .ThenInclude(u => u.UserProfile)
                .Include(l => l.ListingTags)
                    .ThenInclude(lt => lt.Tag)
                .Include(l => l.ConnectionRequests)
                    .ThenInclude(cr => cr.Sender)
                        .ThenInclude(s => s.UserProfile)
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
                }).ToList(),
                ConnectionRequests = listing.ConnectionRequests.Select(cr => new ConnectionRequestDto
                {
                    SenderId = cr.Sender.Id,
                    DisplayName = cr.Sender.UserProfile?.DisplayName ?? "Unknown",
                    ProfilePictureUrl = cr.Sender.UserProfile?.ProfilePictureUrl,
                    Message = cr.Message,
                    Status = cr.Status,
                    CreatedAt = cr.CreatedAt,
                    RespondedAt = cr.RespondedAt
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
    #endregion
    
    #region General methods
    
        private static async Task<Ok<SearchDto>> GetListings(
            AppDbContext db,
            HttpContext http,
            [FromQuery] string? search = null,
            [FromQuery] ListingType? type = null,
            [FromQuery(Name = "tagNames")] string? tagNamesRaw = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10
            )
        {
            var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userId, out var currentUserId);

            var query = db.Listings
                .AsNoTracking()
                .Include(l => l.User)
                    .ThenInclude(u => u.UserProfile)
                .Include(l => l.ListingTags)
                    .ThenInclude(lt => lt.Tag)
                .AsQueryable();

            if (currentUserId != Guid.Empty)
                query = query.Where(l => l.UserId != currentUserId);

            if (type.HasValue)
                query = query.Where(l => l.Type == type.Value);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.ToLower();
                query = query.Where(l =>
                    l.Title.ToLower().Contains(term) ||
                    (l.Subtitle != null && l.Subtitle.ToLower().Contains(term)) ||
                    (l.Description != null && l.Description.ToLower().Contains(term)) ||
                    l.ListingTags.Any(lt => lt.Tag.Name.ToLower().Contains(term))
                );
            }

            if (!string.IsNullOrWhiteSpace(tagNamesRaw))
            {
                var tagNames = tagNamesRaw
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .ToList();

                query = query.Where(l => l.ListingTags
                    .Any(lt => tagNames.Contains(lt.Tag.Name)));
            }

            query = query.OrderByDescending(l => l.CreatedAt);

            var totalCount = await query.CountAsync();

            var listings = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
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
                    IsOwner = false,
                    Tags = l.ListingTags.Select(lt => new TagDto
                    {
                        Id = lt.Tag.Id,
                        Name = lt.Tag.Name
                    }).ToList()
                })
                .ToListAsync();

            return TypedResults.Ok(new SearchDto()
            {
                TotalCount = totalCount,
                HasMore = totalCount > page * pageSize,
                Listings =  listings
            });
        }

        private static async Task<Results<Ok<ConnectionRequestDto>, BadRequest<string>, Conflict<string>>> CreateConnectionRequest(
            AppDbContext db,
            HttpContext http,
            [FromServices] INotificationService notify,
            [FromBody] ConnectionRequestDto dto
        )
        {
            var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return TypedResults.BadRequest("User not authenticated.");
            
            var listing = await db.Listings
                .Include(l => l.User)
                .ThenInclude(u => u.UserProfile)
                .FirstOrDefaultAsync(l => l.Id == dto.ListingId);

            if (listing == null) return TypedResults.BadRequest("Listing not found.");

            if (listing.UserId == Guid.Parse(userId))
                return TypedResults.BadRequest("You cannot request a connection on your own listing.");

            var existing = await db.ConnectionRequests
                .FirstOrDefaultAsync(cr => cr.ListingId == dto.ListingId && cr.SenderId == Guid.Parse(userId));

            if (existing != null)
                return TypedResults.Conflict("A request already exists for this listing.");

            var userProfile = await db.UserProfiles.FirstOrDefaultAsync(u => u.UserId == Guid.Parse(userId));
            if (userProfile == null) return TypedResults.BadRequest("User not authenticated.");
            
            var connection = new ConnectionRequestModel
            {
                ListingId = dto.ListingId,
                SenderId = Guid.Parse(userId),
                Message = dto.Message,
                CreatedAt = DateTime.UtcNow,
                Status = RequestStatus.Pending,
            };

            db.ConnectionRequests.Add(connection);
            await db.SaveChangesAsync();
            
            await notify.SendNotificationToUserAsync(
                listing.UserId,
                Guid.Parse(userId),
                $"{userProfile.DisplayName} sent you a connection request."
            );

            var result = new ConnectionRequestDto
            {
                ListingId = connection.ListingId,
                SenderId = connection.SenderId,
                DisplayName = userProfile.DisplayName ?? "Unknown",
                ProfilePictureUrl = userProfile.ProfilePictureUrl,
                Message = connection.Message,
                Status = connection.Status,
                CreatedAt = connection.CreatedAt,
                RespondedAt = connection.RespondedAt
            };

            return TypedResults.Ok(result);
        }

        private static async Task<Results<Ok, BadRequest<string>, NotFound<string>>> UpdateConnectionRequest(
            AppDbContext db,
            HttpContext http,
            [FromServices] INotificationService notify,
            [FromBody] ConnectionRequestDto dto
        )
        {
            var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return TypedResults.BadRequest("User not authenticated.");

            var request = await db.ConnectionRequests
                .Include(cr => cr.Listing)
                .FirstOrDefaultAsync(cr => cr.ListingId == dto.ListingId && cr.SenderId == dto.SenderId);

            if (request == null) return TypedResults.NotFound("Request not found.");

            if (request.Listing.UserId != Guid.Parse(userId))
                return TypedResults.BadRequest("You are not authorized to update this request.");

            if (dto.Status != RequestStatus.Accepted && dto.Status != RequestStatus.Declined)
                return TypedResults.BadRequest("Invalid status update.");

            request.Status = dto.Status;
            request.RespondedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            var ownerName = (await db.UserProfiles
                .Where(p => p.UserId == Guid.Parse(userId))
                .Select(p => p.DisplayName)
                .FirstOrDefaultAsync()) ?? "The listing owner";
            
            var message = request.Status switch
            {
                RequestStatus.Accepted => $"{ownerName} accepted your connection request.",
                RequestStatus.Declined => $"{ownerName} declined your connection request.",
                _ => $"{ownerName} updated your connection request."
            };

            await notify.SendNotificationToUserAsync(
                dto.SenderId,
                Guid.Parse(userId),
                message
            );

            return TypedResults.Ok();
        }


        private static async Task<Results<Ok<List<ConnectionRequestDto>>, BadRequest<string>>> GetListingRequests(
            AppDbContext db,
            HttpContext http,
            Guid id
        )
        {
            var userId = http.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return TypedResults.BadRequest("User not authenticated.");

            var listing = await db.Listings
                .Include(l => l.ConnectionRequests)
                    .ThenInclude(cr => cr.Sender)
                        .ThenInclude(s => s.UserProfile)
                .FirstOrDefaultAsync(l => l.Id == id && l.UserId == Guid.Parse(userId));

            if (listing == null)
                return TypedResults.BadRequest("Listing not found or you do not own it.");

            var requests = listing.ConnectionRequests.Select(cr => new ConnectionRequestDto
            {
                ListingId = cr.ListingId,
                SenderId = cr.SenderId,
                DisplayName = cr.Sender.UserProfile?.DisplayName ?? "Unknown",
                ProfilePictureUrl = cr.Sender.UserProfile?.ProfilePictureUrl,
                Message = cr.Message,
                Status = cr.Status,
                CreatedAt = cr.CreatedAt,
                RespondedAt = cr.RespondedAt
            }).ToList();

            return TypedResults.Ok(requests);
        }

    #endregion
}