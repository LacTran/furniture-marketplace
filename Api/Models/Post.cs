namespace Api.Models;

// Mirrors the two post types from the product spec:
// - ItemAvailable: a buyer has "access" to an item (e.g. favorited on Tori.fi)
//   and wants transport lined up, possibly before they've even bought it.
// - PickupRequest: someone needs an item moved ASAP (e.g. a seller who needs
//   it gone, or a buyer who already has the item and needs it transported now).
public enum PostType
{
    ItemAvailable,
    PickupRequest,
}

// Status lifecycle: Open -> Accepted -> Completed (or Cancelled at any point
// before Completed). "Favorites" (drivers bookmarking a post) are tracked
// separately and don't change status — only an explicit "accept" does.
public enum PostStatus
{
    Open,
    Accepted,
    Completed,
    Cancelled,
}

public class Post
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public PostType Type { get; set; }
    public PostStatus Status { get; set; } = PostStatus.Open;

    public string OwnerId { get; set; } = string.Empty;
    public ApplicationUser? Owner { get; set; }

    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }

    // Dimensions/weight are optional — not every poster will know them precisely,
    // but when provided they help drivers judge whether it fits their car.
    public decimal? LengthCm { get; set; }
    public decimal? WidthCm { get; set; }
    public decimal? HeightCm { get; set; }
    public decimal? WeightKg { get; set; }

    // Free-text area names for now (e.g. "Kallio", "Vallila") rather than
    // full geocoding — keeps this step simple. Could become lat/lng later.
    public string PickupArea { get; set; } = string.Empty;
    public string DropoffArea { get; set; } = string.Empty;

    public decimal? PriceOffered { get; set; }

    // Who (if anyone) accepted this post, and when.
    public string? AcceptedByUserId { get; set; }
    public ApplicationUser? AcceptedBy { get; set; }
    public DateTime? AcceptedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}