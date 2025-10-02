using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Report
{
    public int ReportId { get; set; }

    public int UserId { get; set; }
    public int PostId { get; set; }
    public string Content { get; set; } = null!;

    public string Status { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Post Post { get; set; } = null!;
}
