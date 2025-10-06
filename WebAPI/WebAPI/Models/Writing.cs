using WebAPI.Models;

public partial class Writing
{
    public int WritingId { get; set; }
    public int ExamId { get; set; }
    public string WritingQuestion { get; set; } = null!;
    public string? WritingType { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime CreatedAt { get; set; }

    public string? ImageUrl { get; set; } 

    public virtual Exam Exam { get; set; } = null!;
}
