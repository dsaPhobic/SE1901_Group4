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
}
