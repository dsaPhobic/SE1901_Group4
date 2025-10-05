using System;

namespace WebAPI.Models
{
    public partial class CommentLike
    {
        public int CommentLikeId { get; set; }
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public virtual Comment Comment { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }
}

