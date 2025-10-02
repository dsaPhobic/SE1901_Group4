using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class CommentDTO
    {
        public int CommentId { get; set; }
        public string Content { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public int LikeNumber { get; set; }
        public int? ParentCommentId { get; set; }
        public UserDTO User { get; set; } = null!;
        public List<CommentDTO> Replies { get; set; } = new List<CommentDTO>();
    }

    public class CreateCommentDTO
    {
        [Required]
        public string Content { get; set; } = null!;

        public int? ParentCommentId { get; set; }
    }

    public class UpdateCommentDTO
    {
        [Required]
        public string Content { get; set; } = null!;
    }
}