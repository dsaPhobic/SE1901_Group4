using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Reading
{
    public int ReadingId { get; set; }

    public string ReadingContent { get; set; } = null!;

    public string ReadingQuestion { get; set; } = null!;

    public string? ReadingType { get; set; }
}
