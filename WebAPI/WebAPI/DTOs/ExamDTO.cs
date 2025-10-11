using System.ComponentModel.DataAnnotations;
using WebAPI.Models;

namespace WebAPI.DTOs
{
    public class ExamDto
    {
        public int ExamId { get; set; }

        public string ExamType { get; set; } = null!;

        public string ExamName { get; set; } = null!;

        public DateTime CreatedAt { get; set; }

        public virtual ICollection<ListeningDto> Listenings { get; set; } = new List<ListeningDto>();

        public virtual ICollection<ReadingDto> Readings { get; set; } = new List<ReadingDto>();

        public virtual ICollection<Speaking> Speakings { get; set; } = new List<Speaking>();

        public virtual ICollection<WritingDTO> Writings { get; set; } = new List<WritingDTO>();
    }
    public class UpdateExamDto
    {
        public string? ExamType { get; set; } = string.Empty;
        public string? ExamName { get; set; } = string.Empty;
    }

    public class CreateExamDto
    {
        [Required]
        public string ExamType { get; set; } = string.Empty;
        [Required]
        public string ExamName { get; set; } = string.Empty;
    }

    public class ExamAttemptSummaryDto
    {
        public long AttemptId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamName { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public decimal TotalScore { get; set; }
    }
    public class ExamAttemptDto
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
    public class SubmitSectionDto
    {
        public int ExamId { get; set; }
        public object Answers { get; set; } = new(); // Accepts any JSON object/array
        public DateTime StartedAt { get; set; }
    }
    public class SubmitAttemptDto
    {
        public int ExamId { get; set; }
        public string AnswerText { get; set; } = string.Empty;
        public DateTime StartedAt { get; set; }
        public decimal Score { get; set; }
    }
}
