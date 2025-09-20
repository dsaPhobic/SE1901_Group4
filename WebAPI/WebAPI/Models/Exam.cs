using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Exam
{
    public int ExamId { get; set; }

    public string ExamType { get; set; } = null!;

    public string ExamName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<ExamAttempt> ExamAttempts { get; set; } = new List<ExamAttempt>();

    public virtual ICollection<ExamItem> ExamItems { get; set; } = new List<ExamItem>();
}
