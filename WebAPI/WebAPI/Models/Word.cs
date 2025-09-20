using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Word
{
    public int WordId { get; set; }

    public string Word1 { get; set; } = null!;

    public string? Meaning { get; set; }

    public string? Audio { get; set; }

    public string? Example { get; set; }

    public virtual ICollection<VocabGroup> Groups { get; set; } = new List<VocabGroup>();
}
