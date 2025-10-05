using System;
using System.Collections.Generic;

namespace WebAPI.Models;

public partial class Comment
{
    public int CommentId { get; set; }

    public int PostId { get; set; }

    public int UserId { get; set; }

    public int? ParentCommentId { get; set; }

    public string Content { get; set; } = null!;

    public int LikeNumber { get; set; }

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<Comment> InverseParentComment { get; set; } = new List<Comment>();

    public virtual Comment? ParentComment { get; set; }

    public virtual Post Post { get; set; } = null!;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<CommentLike> CommentLikes { get; set; } = new List<CommentLike>();
}
