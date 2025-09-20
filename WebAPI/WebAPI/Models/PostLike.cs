using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class PostLike
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual User User { get; set; } = null!;
}
