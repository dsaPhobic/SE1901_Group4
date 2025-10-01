namespace WebAPI.DTOs
{
    public class WordDto
    {
        public string Term { get; set; } = null!;
        public string? Meaning { get; set; }
        public string? Audio { get; set; }
        public string? Example { get; set; }
        public List<int> GroupIds { get; set; } = new();
    }

}
