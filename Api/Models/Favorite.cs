namespace Api.Models;

// A driver "favoriting" a post — bookmarking it for later, as described in
// the product spec ("buyers post items, drivers favorite for when convenient").
// Composite key (UserId, PostId) — a user can favorite a given post at most once,
// enforced at the database level rather than via application logic.
public class Favorite
{
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }

    public string PostId { get; set; } = string.Empty;
    public Post? Post { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}