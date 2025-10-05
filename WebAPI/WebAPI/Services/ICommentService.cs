using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface ICommentService
    {
        IEnumerable<CommentDTO> GetCommentsByPostId(int postId, int? userId = null);
        CommentDTO? GetCommentById(int id, int? currentUserId = null);
        CommentDTO CreateComment(int postId, CreateCommentDTO dto, int userId);
        CommentDTO CreateReply(int parentCommentId, CreateCommentDTO dto, int userId);
        void UpdateComment(int id, UpdateCommentDTO dto, int userId);
        void DeleteComment(int id, int userId);
        void LikeComment(int id, int userId);
        void UnlikeComment(int id, int userId);
    }
}
