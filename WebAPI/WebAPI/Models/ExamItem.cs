using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class ExamItem
{
    public int ItemId { get; set; }

    public int ExamId { get; set; }

    public string RefTable { get; set; } = null!;

    public int RefId { get; set; }

    public int DisplayOrder { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual Exam Exam { get; set; } = null!;

    public virtual ICollection<ExamAnswer> ExamAnswers { get; set; } = new List<ExamAnswer>();
}
