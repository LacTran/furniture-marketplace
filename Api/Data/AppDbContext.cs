using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Api.Models;

namespace Api.Data;

// IdentityDbContext gives us Users, Roles, and the join tables for free.
// We'll add domain tables (Posts, Favorites, etc.) here as we build them out
// in later steps of the build order.
public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Example customization: Identity defaults some string columns to
        // very large lengths, which Postgres handles fine, but it's worth
        // being deliberate. Left as default for now — revisit if needed.
    }
}
