using System.ComponentModel.DataAnnotations;

namespace WebAPI.DTOs
{
    public class PostDTO
    {
        public int PostId { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string Category { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int ViewCount { get; set; }
        public int CommentCount { get; set; }
        public int VoteCount { get; set; }
        public bool IsVoted { get; set; }
        public UserDTO User { get; set; } = null!;
        public List<TagDTO> Tags { get; set; } = new List<TagDTO>();
    }

    public class CreatePostDTO
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        public string Content { get; set; } = null!;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = null!;

        public List<string> TagNames { get; set; } = new List<string>();
    }

    public class UpdatePostDTO
    {
        [StringLength(200)]
        public string? Title { get; set; }

        public string? Content { get; set; }

        [StringLength(50)]
        public string? Category { get; set; }

        public List<string>? TagNames { get; set; }
    }

    public class ReportPostDTO
    {
        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = null!;
    }
}

