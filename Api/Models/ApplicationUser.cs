using Microsoft.AspNetCore.Identity;

namespace Api.Models;

// Extends the default Identity user with the fields our domain needs.
// Roles (Buyer, Seller, Driver, Admin) are handled separately via IdentityRole,
// since a single user can hold multiple roles (e.g. someone who both posts
// items AND occasionally drives).
public class ApplicationUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Simple running average; recalculated whenever a new Review is added.
    public double Rating { get; set; } = 0;
    public int RatingCount { get; set; } = 0;
}
