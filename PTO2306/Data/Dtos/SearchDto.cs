namespace PTO2306.Data.Dtos;

public class SearchDto
{
    public int TotalCount { get; set; }
    public bool HasMore { get; set; }
    public List<ListingDto> Listings { get; set; }
}