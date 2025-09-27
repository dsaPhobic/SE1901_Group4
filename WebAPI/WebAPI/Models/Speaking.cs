using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Speaking
{
    public int SpeakingId { get; set; }

    public string SpeakingQuestion { get; set; } = null!;

    public string? SpeakingType { get; set; }
}
