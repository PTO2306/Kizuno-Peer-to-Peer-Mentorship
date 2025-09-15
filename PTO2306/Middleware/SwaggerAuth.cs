using System.Text;

namespace PTO2306.Middleware;

public class SwaggerAuth(RequestDelegate next, IConfiguration config)
{
    private readonly string _username = config["SwaggerAuth:Username"]!;
    private readonly string _password = config["SwaggerAuth:Password"]!;

    public async Task Invoke(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/swagger"))
        {
            string authHeader = context.Request.Headers["Authorization"];

            if (authHeader != null && authHeader.StartsWith("Basic "))
            {
                var encodedCreds = authHeader["Basic ".Length..].Trim();
                var creds = Encoding.UTF8.GetString(Convert.FromBase64String(encodedCreds)).Split(':', 2);

                if (creds.Length == 2 && creds[0] == _username && creds[1] == _password)
                {
                    await next(context); // success
                    return;
                }
            }

            context.Response.Headers["WWW-Authenticate"] = "Basic";
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        await next(context);
    }
}