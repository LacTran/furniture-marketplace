using Microsoft.AspNetCore.Identity;

namespace Api.Data;

public static class RoleSeeder
{
    public static readonly string[] AllRoles = { "Buyer", "Seller", "Driver", "Admin" };

    public static async Task EnsureRolesExistAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        foreach (var role in AllRoles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}
