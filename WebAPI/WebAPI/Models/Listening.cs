using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Listening
{
    public int ListeningId { get; set; }

    public string ListeningContent { get; set; } = null!;

    public string ListeningQuestion { get; set; } = null!;

    public string? ListeningType { get; set; }
}
