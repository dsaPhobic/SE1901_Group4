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

    public virtual ICollection<Listening> Listenings { get; set; } = new List<Listening>();

    public virtual ICollection<Reading> Readings { get; set; } = new List<Reading>();

    public virtual ICollection<Speaking> Speakings { get; set; } = new List<Speaking>();

    public virtual ICollection<Writing> Writings { get; set; } = new List<Writing>();
}
