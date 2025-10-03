using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Reading
{
    public int ReadingId { get; set; }

    public int ExamId { get; set; }

    public string ReadingContent { get; set; } = null!;

    public string ReadingQuestion { get; set; } = null!;

    public string? ReadingType { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Exam Exam { get; set; } = null!;
}
