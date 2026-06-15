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

    public DbSet<Post> Posts => Set<Post>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // A Post's Owner and AcceptedBy both point at ApplicationUser, but
        // EF Core can't infer two separate relationships to the same entity
        // automatically — we configure each explicitly and disable cascade
        // delete so that deleting a user doesn't cascade-delete unrelated posts.
        builder.Entity<Post>()
            .HasOne(p => p.Owner)
            .WithMany()
            .HasForeignKey(p => p.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Post>()
            .HasOne(p => p.AcceptedBy)
            .WithMany()
            .HasForeignKey(p => p.AcceptedByUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Store enums as strings in Postgres rather than ints — much easier
        // to read when inspecting the DB directly (e.g. via Neon's SQL editor),
        // at a negligible storage cost for a project this size.
        builder.Entity<Post>()
            .Property(p => p.Type)
            .HasConversion<string>();

        builder.Entity<Post>()
            .Property(p => p.Status)
            .HasConversion<string>();
    }
}