using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using PTO2306.Data;
using PTO2306.Data.Dtos;
using PTO2306.Data.Models;
using PTO2306.Services;

namespace PTO2306.Endpoints;

public static class UserEndpoints
{
   public static void MapUserEndpoints(this IEndpointRouteBuilder app)
   {
      var user = app.MapGroup("/user");

      user.MapPost("/login", Login);
      user.MapPost("/refresh", Refresh);
      user.MapPost("/register", Register);
      user.MapGet("/verify", Verify);

      // Protected endpoints
      var protectedUser = user.MapGroup("")
         .RequireAuthorization();

      protectedUser.MapGet("/status", CheckAuth);
      protectedUser.MapGet("/logout", Logout);
   }

   private static async Task<Results<Ok, UnauthorizedHttpResult>> Login(
      [FromBody] LoginDto loginDto,
      AppDbContext db,
      HttpContext http,
      TokenProvider tokenProvider,
      IPasswordHasher<UserModel> hasher
   )
   {
      try
      {
         if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
            throw new Exception();
         
         var user = await db.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsVerified == true) ?? throw new Exception();
         var result = hasher.VerifyHashedPassword(user, user.PasswordHash, loginDto.Password);
         
         if (result != PasswordVerificationResult.Success)
            throw new Exception();

         var accessToken = tokenProvider.Create(user);

         RefreshTokenModel refreshToken = new()
         {
            UserId = user.Id,
            Token = tokenProvider.GenerateRefreshToken(),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7)

         };

         db.RefreshTokens.RemoveRange(db.RefreshTokens.Where(r => r.UserId == user.Id));
         db.RefreshTokens.Add(refreshToken);
         await db.SaveChangesAsync();

         CookieOptions options = new()
         {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshToken.ExpiresAt,
         };
         
         http.Response.Cookies.Append("accessToken", accessToken, options);
         http.Response.Cookies.Append("refreshToken", refreshToken.Token, options);
         
         return TypedResults.Ok();

      }
      catch (Exception)
      {
         return TypedResults.Unauthorized();
      }
   }

   public static async Task<Results<Ok, UnauthorizedHttpResult>> Refresh(
      AppDbContext db,
      HttpContext http,
      TokenProvider tokenProvider
   )
   {

      try
      {
         var refreshTokenValue = http.Request.Cookies["refreshToken"];

         if (string.IsNullOrWhiteSpace(refreshTokenValue))
            throw new Exception();

         var refreshToken = await db.RefreshTokens
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Token == refreshTokenValue);

         if (refreshToken == null || refreshToken.ExpiresAt < DateTime.UtcNow)
            throw new Exception();

         var accessToken = tokenProvider.Create(refreshToken.User);

         refreshToken.Token = tokenProvider.GenerateRefreshToken();
         refreshToken.ExpiresAt = DateTime.UtcNow.AddDays(7);
         refreshToken.UpdatedAt = DateTime.UtcNow;

         db.RefreshTokens.Update(refreshToken);

         CookieOptions options = new()
         {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = refreshToken.ExpiresAt,
         };

         http.Response.Cookies.Append("accessToken", accessToken, options);
         http.Response.Cookies.Append("refreshToken", refreshToken.Token, options);

         return TypedResults.Ok();
      }
      catch (Exception)
      {
         return TypedResults.Unauthorized();
      }
   }

   public static async Task<Results<Ok, UnauthorizedHttpResult>> Logout(
      AppDbContext db,
      HttpContext http
   )
   {
      http.Response.Cookies.Delete("accessToken");
      http.Response.Cookies.Delete("refreshToken");
      
      var storedToken = await db.RefreshTokens.FirstOrDefaultAsync(x => x.Token == http.Request.Cookies["accessToken"]);
      if (storedToken != null)
      {
         db.RefreshTokens.Remove(storedToken);
         await db.SaveChangesAsync();
      }
      return TypedResults.Ok();
   }
   
   private static async Task<Results<Ok<string>, BadRequest<string>>> Register(
      [FromBody] LoginDto loginDto,
      AppDbContext db,
      IPasswordHasher<UserModel> hasher,
      IEmailSender emailSender 
   )
   {
      if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
         return TypedResults.BadRequest("Email and password are required.");

      if (await db.Users.AnyAsync(u => u.Email == loginDto.Email))
         return TypedResults.BadRequest("Email already registered.");

      var user = new UserModel
      {
         Email = loginDto.Email,
         PasswordHash = hasher.HashPassword(null!, loginDto.Password),
         VerificationToken = Guid.NewGuid().ToString()
      };

      db.Users.Add(user);
      await db.SaveChangesAsync();

      // Build verification link
      var verifyUrl = $"https://yourdomain.com/user/verify?token={user.VerificationToken}";

      // Send email
      // await emailSender.SendEmailAsync(
      //    user.Email,
      //    "Verify your account",
      //    $"Click <a href='{verifyUrl}'>here</a> to verify your account."
      // );

      // return TypedResults.Ok("Registration successful. Please check your email to verify your account.");
      return TypedResults.Ok(user.VerificationToken);
   }

   private static async Task<Results<Ok, BadRequest<string>>> Verify(
      [FromQuery] string token,
      AppDbContext db
   )
   {
      var user = await db.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);

      if (user == null)
         return TypedResults.BadRequest("Invalid verification token.");

      user.IsVerified = true;
      user.VerifiedAt = DateTime.UtcNow;
      user.VerificationToken = null;

      await db.SaveChangesAsync();

      return TypedResults.Ok();
   }

   private static Results<Ok, BadRequest> CheckAuth()
   {
      return TypedResults.Ok();
   }
}