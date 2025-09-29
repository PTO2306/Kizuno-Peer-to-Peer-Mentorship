namespace PTO2306.Data.Models;

public class ListingTags
{
    public Guid ListingId { get; set; }
    public ListingModel Listing { get; set; } = null!;
    public int TagId { get; set; }
    public TagModel Tag { get; set; } = null!;
}