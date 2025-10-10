namespace WebAPI.DTOs
{
    // For creating new reading question
    public class CreateReadingDto
    {
        public int ExamId { get; set; }
        public string ReadingContent { get; set; } = string.Empty;
        public string ReadingQuestion { get; set; } = string.Empty;
        public string? ReadingType { get; set; }
        public int DisplayOrder { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? QuestionHtml { get; set; }
    }

    // For updating an existing reading question
    public class UpdateReadingDto
    {
        public string? ReadingContent { get; set; }
        public string? ReadingQuestion { get; set; }
        public string? ReadingType { get; set; }
        public int? DisplayOrder { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? QuestionHtml { get; set; }
    }

    // For returning reading data to client
    public class ReadingDto
    {
        public int ReadingId { get; set; }
        public int ExamId { get; set; }
        public string ReadingContent { get; set; } = string.Empty;
        public string ReadingQuestion { get; set; } = string.Empty;
        public string? ReadingType { get; set; }
        public int DisplayOrder { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? QuestionHtml { get; set; }
    }
    public class SubmitReadingAttemptDto
    {
        public int ExamId { get; set; }
        public string Mode { get; set; } = "full";
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public List<ReadingAnswerDto> Answers { get; set; } = new();
    }

    public class ReadingAnswerDto
    {
        public int ReadingId { get; set; }
        public int DisplayOrder { get; set; }
        public string? AnswerText { get; set; }
    }

}

