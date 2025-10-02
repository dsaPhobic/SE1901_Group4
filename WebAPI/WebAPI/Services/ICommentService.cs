using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface ICommentService
    {
        IEnumerable<CommentDTO> GetCommentsByPostId(int postId);
        CommentDTO? GetCommentById(int id);
        CommentDTO CreateComment(int postId, CreateCommentDTO dto, int userId);
        void UpdateComment(int id, UpdateCommentDTO dto, int userId);
        void DeleteComment(int id, int userId);
        void LikeComment(int id, int userId);
        void UnlikeComment(int id, int userId);
    }
}
