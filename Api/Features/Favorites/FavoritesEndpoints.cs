using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Api.Data;
using Api.Features.Posts;
using Api.Models;

namespace Api.Features.Favorites;

public static class FavoritesEndpoints
{
    public static void MapFavoritesEndpoints(this WebApplication app)
    {
        // --- Add to favorites ---------------------------------------------------
        app.MapPost("/api/posts/{postId}/favorite", async (
            string postId,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var postExists = await db.Posts.AnyAsync(p => p.Id == postId);
            if (!postExists)
            {
                return Results.NotFound(new { message = "Post not found." });
            }

            var alreadyFavorited = await db.Favorites
                .AnyAsync(f => f.UserId == userId && f.PostId == postId);

            if (!alreadyFavorited)
            {
                db.Favorites.Add(new Favorite { UserId = userId, PostId = postId });
                await db.SaveChangesAsync();
            }

            // Idempotent: favoriting an already-favorited post is a no-op success,
            // not an error — simpler for the mobile UI (just toggle, don't worry
            // about double-taps).
            return Results.Ok(new { favorited = true });
        }).RequireAuthorization().WithTags("Favorites");

        // --- Remove from favorites ------------------------------------------------
        app.MapDelete("/api/posts/{postId}/favorite", async (
            string postId,
            ClaimsPrincipal principal,
            AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var favorite = await db.Favorites
                .FirstOrDefaultAsync(f => f.UserId == userId && f.PostId == postId);

            if (favorite is not null)
            {
                db.Favorites.Remove(favorite);
                await db.SaveChangesAsync();
            }

            // Also idempotent — removing a non-existent favorite is a success.
            return Results.Ok(new { favorited = false });
        }).RequireAuthorization().WithTags("Favorites");

        // --- My favorites ----------------------------------------------------------
        // Returns the full Post details for everything the current user has
        // favorited — this is the main feed for the mobile driver app's
        // "Favorites" tab.
        app.MapGet("/api/favorites", async (ClaimsPrincipal principal, AppDbContext db) =>
        {
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var posts = await db.Favorites
                .Where(f => f.UserId == userId)
                .Include(f => f.Post!.Owner)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => f.Post!)
                .ToListAsync();

            return Results.Ok(posts.Select(PostResponse.FromEntity));
        }).RequireAuthorization().WithTags("Favorites");
    }
}