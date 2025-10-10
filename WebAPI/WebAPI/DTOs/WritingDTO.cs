namespace WebAPI.DTOs
{
    public class WritingDTO
    {
        public int WritingId { get; set; }
        public int ExamId { get; set; }
        public string WritingQuestion { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ImageUrl { get; set; }
    }

    // ========== Thêm mới phục vụ chấm bài ==========
    public class WritingGradeRequestDTO
    {
        public int ExamId { get; set; }
        public string Mode { get; set; } = "single"; // "single" hoặc "full"
        public List<WritingAnswerDTO> Answers { get; set; } = new();
    }

    public class WritingAnswerDTO
    {
        public int WritingId { get; set; }
        public int DisplayOrder { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
    }

    public class WritingGradeResponseDTO
    {
        public int WritingId { get; set; }
        public decimal Band { get; set; }
        public string FeedbackJson { get; set; } = string.Empty;
    }

    public class FullWritingGradeResponse
    {
        public int ExamId { get; set; }
        public List<WritingGradeResponseDTO> Results { get; set; } = new();
    }
}
