using Microsoft.AspNetCore.Http.HttpResults;
using PTO2306.Data;
using PTO2306.Data.Dtos;

namespace PTO2306.Endpoints;

public static class ListingEndpoints
{
    public static void MapListingEndpoints(this IEndpointRouteBuilder app)
    {
        // Protected endpoints
        var protectedUser = app.MapGroup("/user")
            .RequireAuthorization(); 
    
        protectedUser.MapGet("/listing", GetListings);
        protectedUser.MapPost("/listing", CreateListing).DisableAntiforgery();
        protectedUser.MapPut("/listing", UpdateListing).DisableAntiforgery();
    }

    private static async Task<Results<Ok<List<ListingDto>>, NotFound>> GetListings(
        AppDbContext db,
        HttpContext http
    )
    {
        return TypedResults.Ok(new List<ListingDto>());
    }
    
    private static async Task<Results<Ok<ListingDto>, NotFound>> CreateListing(
        AppDbContext db,
        HttpContext http
    )
    {
        return TypedResults.Ok(new ListingDto());
    }
    
    private static async Task<Results<Ok<List<ListingDto>>, NotFound>> UpdateListing(
        AppDbContext db,
        HttpContext http
    )
    {
        return TypedResults.Ok(new List<ListingDto>());
    }

}