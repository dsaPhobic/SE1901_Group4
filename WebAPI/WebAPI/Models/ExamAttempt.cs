using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ExamAttempt
{
    public long AttemptId { get; set; }

    public int ExamId { get; set; }

    public int UserId { get; set; }

    public string? AnswerText { get; set; }

    public decimal? Score { get; set; }

    public DateTime StartedAt { get; set; }

    public DateTime? SubmittedAt { get; set; }

    public virtual Exam Exam { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
