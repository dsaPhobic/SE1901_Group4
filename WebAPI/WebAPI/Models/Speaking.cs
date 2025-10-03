using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Speaking
{
    public int SpeakingId { get; set; }

    public int ExamId { get; set; }

    public string SpeakingQuestion { get; set; } = null!;

    public string? SpeakingType { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Exam Exam { get; set; } = null!;
}
