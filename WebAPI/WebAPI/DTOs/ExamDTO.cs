using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class ExamDTO
    {

    }
    public class UpdateExamDTO
    {
        public string? ExamType { get; set; } = string.Empty;
        public string? ExamName { get; set; } = string.Empty;
    }

    public class CreateExamDTO
    {
        [Required]
        public string ExamType { get; set; } = string.Empty;
        [Required]
        public string ExamName { get; set; } = string.Empty;
    }

    public class CreateExamItemDTO
    {
        public string RefTable { get; set; } = string.Empty;
        public int RefId { get; set; }
        public int DisplayOrder { get; set; }
    }
    public class ExamResponseDTO
    {
        public int ExamId { get; set; }
        public string ExamType { get; set; } = string.Empty;
        public string ExamName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public List<CreateExamItemDTO> Items { get; set; } = new();
    }
    public class ExamAttemptSummaryDTO
    {
        public long AttemptId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamName { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public decimal TotalScore { get; set; }
    }
    public class ExamAttemptDTO
    {
        public long AttemptId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamName { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public decimal TotalScore { get; set; }
        public string AnswerText { get; set; } = string.Empty;
    }
    public class SubmitSectionDTO
    {
        public int ExamId { get; set; }
        public object Answers { get; set; } = new(); // Accepts any JSON object/array
        public DateTime StartedAt { get; set; }
    }
    public class SubmitAttemptDTO
    {
        public int ExamId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
    }
}
