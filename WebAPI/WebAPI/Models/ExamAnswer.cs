using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ExamAnswer
{
    public long AnswerId { get; set; }

    public long AttemptId { get; set; }

    public int ItemId { get; set; }

    public string? AnswerText { get; set; }

    public string? AnswerBlob { get; set; }

    public bool? IsCorrect { get; set; }

    public decimal? Score { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ExamAttempt Attempt { get; set; } = null!;

    public virtual ExamItem Item { get; set; } = null!;
}
