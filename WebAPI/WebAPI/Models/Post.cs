using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Post
{
    public int PostId { get; set; }

    public int UserId { get; set; }

    public string Content { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string Title { get; set; } = null!;

    public DateTime? UpdatedAt { get; set; }

    public int? ViewCount { get; set; }

    public bool IsPinned { get; set; } = false;

    public bool IsHidden { get; set; } = false;

    public string Status { get; set; } = "pending"; // pending, approved, rejected

    public string? RejectionReason { get; set; }

    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();

    public virtual ICollection<PostLike> PostLikes { get; set; } = new List<PostLike>();

    public virtual ICollection<Report> Reports { get; set; } = new List<Report>();

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Tag> Tags { get; set; } = new List<Tag>();
}
