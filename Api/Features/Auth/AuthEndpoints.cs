using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Api.Models;

namespace Api.Features.Auth;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/register", async (
            RegisterRequest request,
            UserManager<ApplicationUser> userManager,
            IConfiguration config) =>
        {
            var existing = await userManager.FindByEmailAsync(request.Email);
            if (existing is not null)
            {
                return Results.Conflict(new { message = "A user with this email already exists." });
            }

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                DisplayName = request.DisplayName,
            };

            var result = await userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return Results.BadRequest(new { errors = result.Errors.Select(e => e.Description) });
            }

            // Everyone starts as a "Buyer" by default — they can later
            // opt in to driving (Driver role) or selling (Seller role)
            // from their profile. Keeps registration friction minimal.
            await userManager.AddToRoleAsync(user, "Buyer");

            var token = GenerateJwt(user, new[] { "Buyer" }, config);
            return Results.Ok(new AuthResponse(token, user.Id, user.Email!, user.DisplayName, new[] { "Buyer" }));
        });

        group.MapPost("/login", async (
            LoginRequest request,
            UserManager<ApplicationUser> userManager,
            IConfiguration config) =>
        {
            var user = await userManager.FindByEmailAsync(request.Email);
            if (user is null || !await userManager.CheckPasswordAsync(user, request.Password))
            {
                return Results.Unauthorized();
            }

            var roles = (await userManager.GetRolesAsync(user)).ToArray();
            var token = GenerateJwt(user, roles, config);
            return Results.Ok(new AuthResponse(token, user.Id, user.Email!, user.DisplayName, roles));
        });

        // Simple authenticated "who am I" endpoint — useful for the frontend
        // to validate a stored token on app load, and a good smoke test
        // for the auth flow end-to-end.
        group.MapGet("/me", (ClaimsPrincipal principal) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            var email = principal.FindFirstValue(ClaimTypes.Email);
            var roles = principal.FindAll(ClaimTypes.Role).Select(c => c.Value);
            return Results.Ok(new { userId, email, roles });
        }).RequireAuthorization();
    }

    private static string GenerateJwt(ApplicationUser user, string[] roles, IConfiguration config)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email ?? string.Empty),
            new(ClaimTypes.Name, user.DisplayName),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
