namespace WebAPI.DTOs
{
    public class WritingDTO
    {
        public int WritingId { get; set; }
        public int ExamId { get; set; }
        public string WritingQuestion { get; set; } = string.Empty;
        public string? WritingType { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
    }
}
