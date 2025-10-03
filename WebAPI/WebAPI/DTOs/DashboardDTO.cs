using System;

namespace WebAPI.DTOs
{
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

    public class ExamAnswerDTO
    {
        public long AnswerId { get; set; }
        public int ItemId { get; set; }
        public string? AnswerText { get; set; }
        public decimal? Score { get; set; }
        public bool? IsCorrect { get; set; }
    }

    public class ExamAttemptDetailDTO
    {
        public long AttemptId { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public int ExamId { get; set; }
        public string ExamName { get; set; } = string.Empty;
        public string ExamType { get; set; } = string.Empty;
        public decimal TotalScore { get; set; }
        public List<ExamAnswerDTO> Answers { get; set; } = new List<ExamAnswerDTO>();
    }
}
