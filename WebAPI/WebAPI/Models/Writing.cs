using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Writing
{
    public int WritingId { get; set; }

    public string WritingQuestion { get; set; } = null!;

    public string? WritingType { get; set; }
}
