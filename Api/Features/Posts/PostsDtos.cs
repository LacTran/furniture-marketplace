using Api.Models;

namespace Api.Features.Posts;

public record CreatePostRequest(
    PostType Type,
    string Title,
    string? Description,
    decimal? LengthCm,
    decimal? WidthCm,
    decimal? HeightCm,
    decimal? WeightKg,
    string PickupArea,
    string DropoffArea,
    decimal? PriceOffered
);

// Flat response shape — avoids exposing EF navigation properties directly
// and gives the frontend exactly what it needs, including a human-readable
// owner name rather than just an ID.
public record PostResponse(
    string Id,
    string Type,
    string Status,
    string OwnerId,
    string OwnerDisplayName,
    string Title,
    string? Description,
    decimal? LengthCm,
    decimal? WidthCm,
    decimal? HeightCm,
    decimal? WeightKg,
    string PickupArea,
    string DropoffArea,
    decimal? PriceOffered,
    string? AcceptedByUserId,
    DateTime? AcceptedAt,
    DateTime CreatedAt
)
{
    public static PostResponse FromEntity(Post post) => new(
        post.Id,
        post.Type.ToString(),
        post.Status.ToString(),
        post.OwnerId,
        post.Owner?.DisplayName ?? string.Empty,
        post.Title,
        post.Description,
        post.LengthCm,
        post.WidthCm,
        post.HeightCm,
        post.WeightKg,
        post.PickupArea,
        post.DropoffArea,
        post.PriceOffered,
        post.AcceptedByUserId,
        post.AcceptedAt,
        post.CreatedAt
    );
}