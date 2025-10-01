using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class VocabGroup
{
    public int GroupId { get; set; }

    public string Groupname { get; set; } = null!;

    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Word> Words { get; set; } = new List<Word>();
}
