using System.Net;
using System.Text;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PTO2306.Data;
using PTO2306.Data.Models;
using PTO2306.Endpoints;
using PTO2306.Middleware;
using PTO2306.Services;

namespace PTO2306;

public static class Configuration
{
   public static void RegisterServices(this WebApplicationBuilder builder)
   {
      // JWT
      builder.Services
         .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
         .AddJwtBearer(options =>
         {
            options.TokenValidationParameters = new()
            {
               ValidateIssuer = true,
               ValidateAudience = true,
               ValidateLifetime = true,
               ValidateIssuerSigningKey = true,
               ValidIssuer = builder.Configuration["Jwt:Issuer"],
               ValidAudience = builder.Configuration["Jwt:Audience"],
               IssuerSigningKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
               )
            };

            options.Events = new JwtBearerEvents
            {
               OnMessageReceived = context =>
               {
                  context.Token = context.Request.Cookies["accessToken"];

                  if (!string.IsNullOrEmpty(context.Token)) return Task.CompletedTask;
                  
                  var accessToken = context.Request.Query["access_token"];
                  var path = context.HttpContext.Request.Path;
                    
                  if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/notificationHub"))
                  {
                     context.Token = accessToken;
                  }

                  return Task.CompletedTask;
               }
            };
         });

      builder.Services
         .AddEndpointsApiExplorer()
         .AddAuthorization();
      
      builder.Services.AddSignalR();

      builder.Services
         .Configure<JsonOptions>(options => options.SerializerOptions.Converters.Add(new JsonStringEnumConverter()));
      
      // DB CONTEXT  
      builder.Services.AddDbContext<AppDbContext>(options =>
          options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

      // CORS
      builder.Services.AddCors(options =>
      {
         var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
         options.AddPolicy("corsPolicy", b =>
         {
            b.WithOrigins(allowedOrigins!)
               .AllowAnyHeader()
               .WithMethods("GET", "POST", "PUT", "DELETE")
               .AllowCredentials();
         });
      });
      
      // SERVICES
      builder.Services.AddScoped<TokenProvider>();
      builder.Services.AddScoped<IPasswordHasher<UserModel>, PasswordHasher<UserModel>>();
      builder.Services.AddScoped<IEmailSender, MailService>();
      builder.Services.AddScoped<INotificationService, NotificationService>();
   }

   public static void RegisterSwagger(this WebApplicationBuilder builder)
   {
      builder.Services
         .AddSwaggerGen(o =>
         {
            o.SwaggerDoc("v1", new OpenApiInfo
            {
               Title = "PTO2306 API",
               Version = "v1"
            });

            o.AddServer(new OpenApiServer
            {
               Url = "/pto2306"
            });
            
            OpenApiSecurityScheme scheme = new()
            {
               Name = "JWT Authentication",
               Description = "Enter JWT token in this field",
               In = ParameterLocation.Header,
               Type = SecuritySchemeType.Http,
               Scheme = JwtBearerDefaults.AuthenticationScheme,
               BearerFormat = "JWT",
            };
            
            o.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, scheme);

            OpenApiSecurityRequirement requirement = new()
            {
               {
                  new OpenApiSecurityScheme
                  {
                     Reference = new OpenApiReference
                     {
                        Type = ReferenceType.SecurityScheme,
                        Id = JwtBearerDefaults.AuthenticationScheme
                     }
                  },
                  []
               }
            };
            
            o.AddSecurityRequirement(requirement);
         });
   }
   public static void RegisterMiddlewares(this WebApplication app)
   {
      app.UsePathBase("/pto2306");
      app.UseRouting();
      
      // Migrate on startup
      using (var scope = app.Services.CreateScope())
      {
         var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
         db.Database.Migrate();
      }
      
      // Use Services
      app.UseStaticFiles();
      app.UseHttpsRedirection();
      app.UseCors("corsPolicy");
      app.UseAuthentication();
      app.UseAuthorization();
      
      // Map endpoints
      app.MapUserEndpoints();
      app.MapProfileEndpoints();
      app.MapListingEndpoints();
      app.MapNotificationEndpoints();
         
      app.MapHub<NotificationHub>("/notificationHub");
      
      app.UseMiddleware<SwaggerAuth>();
      app.UseSwagger();
      app.UseSwaggerUI(c =>
      {
         c.SwaggerEndpoint("/pto2306/swagger/v1/swagger.json", "PTO2306 API V1");

         c.RoutePrefix = "swagger";
      });
   }
}
