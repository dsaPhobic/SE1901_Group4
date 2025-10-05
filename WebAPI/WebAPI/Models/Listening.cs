using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Listening
{
    public int ListeningId { get; set; }

    public int ExamId { get; set; }

    public string ListeningContent { get; set; } = null!;

    public string ListeningQuestion { get; set; } = null!;

    public string? ListeningType { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CorrectAnswer { get; set; }

    public virtual Exam Exam { get; set; } = null!;
}
