using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Models;

namespace Api.Features.Posts;

public static class PostsEndpoints
{
    public static void MapPostsEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/posts").WithTags("Posts");

        // --- Create a post ----------------------------------------------------
        // Any authenticated user can create a post — in the product spec,
        // "buyers" and "sellers" are just roles a user happens to be playing
        // for a given post, not separate accounts.
        group.MapPost("/", async (
            CreatePostRequest request,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                return Results.BadRequest(new { message = "Title is required." });
            }
            if (string.IsNullOrWhiteSpace(request.PickupArea) || string.IsNullOrWhiteSpace(request.DropoffArea))
            {
                return Results.BadRequest(new { message = "Pickup and dropoff areas are required." });
            }

            var post = new Post
            {
                Type = request.Type,
                OwnerId = userId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                LengthCm = request.LengthCm,
                WidthCm = request.WidthCm,
                HeightCm = request.HeightCm,
                WeightKg = request.WeightKg,
                PickupArea = request.PickupArea.Trim(),
                DropoffArea = request.DropoffArea.Trim(),
                PriceOffered = request.PriceOffered,
            };

            db.Posts.Add(post);
            await db.SaveChangesAsync();

            // Reload with Owner included so the response has OwnerDisplayName populated.
            await db.Entry(post).Reference(p => p.Owner).LoadAsync();

            return Results.Created($"/api/posts/{post.Id}", PostResponse.FromEntity(post));
        }).RequireAuthorization();

        // --- Browse / list posts ----------------------------------------------
        // Public endpoint — anyone (even logged-out visitors) can browse the
        // marketplace. Supports basic filtering via query string, e.g.:
        //   /api/posts?status=Open&type=ItemAvailable&pickupArea=Kallio
        group.MapGet("/", async (
            AppDbContext db,
            PostStatus? status,
            PostType? type,
            string? pickupArea) =>
        {
            var query = db.Posts.Include(p => p.Owner).AsQueryable();

            // Default to showing only Open posts unless a status is explicitly
            // requested — browsing the marketplace should show "what can I take",
            // not completed/cancelled history.
            query = query.Where(p => p.Status == (status ?? PostStatus.Open));

            if (type is not null)
            {
                query = query.Where(p => p.Type == type);
            }

            if (!string.IsNullOrWhiteSpace(pickupArea))
            {
                query = query.Where(p => p.PickupArea.Contains(pickupArea));
            }

            var posts = await query
                .OrderByDescending(p => p.CreatedAt)
                .Take(100) // simple safety limit for a portfolio demo
                .ToListAsync();

            return Results.Ok(posts.Select(PostResponse.FromEntity));
        });

        // --- Get a single post --------------------------------------------------
        group.MapGet("/{id}", async (string id, AppDbContext db) =>
        {
            var post = await db.Posts.Include(p => p.Owner).Include(p => p.AcceptedBy)
                .FirstOrDefaultAsync(p => p.Id == id);

            return post is null
                ? Results.NotFound()
                : Results.Ok(PostResponse.FromEntity(post));
        });

        // --- My posts ------------------------------------------------------------
        // Posts the current user created — their personal dashboard view.
        group.MapGet("/mine", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var posts = await db.Posts
                .Include(p => p.Owner)
                .Where(p => p.OwnerId == userId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Results.Ok(posts.Select(PostResponse.FromEntity));
        }).RequireAuthorization();

        // --- Accept a post (driver picks it up) -----------------------------------
        // Transitions Open -> Accepted. Kept intentionally simple for this step:
        // first authenticated user to call this "wins" the post. No favorites
        // table yet — that's a natural follow-up once this loop works end to end.
        group.MapPost("/{id}/accept", async (
            string id,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var post = await db.Posts.FindAsync(id);
            if (post is null)
            {
                return Results.NotFound();
            }

            if (post.OwnerId == userId)
            {
                return Results.BadRequest(new { message = "You can't accept your own post." });
            }

            if (post.Status != PostStatus.Open)
            {
                return Results.Conflict(new { message = "This post has already been accepted or is no longer open." });
            }

            post.Status = PostStatus.Accepted;
            post.AcceptedByUserId = userId;
            post.AcceptedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();

            await db.Entry(post).Reference(p => p.Owner).LoadAsync();
            await db.Entry(post).Reference(p => p.AcceptedBy).LoadAsync();

            return Results.Ok(PostResponse.FromEntity(post));
        }).RequireAuthorization();
    }
}