using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentDTO>> GetCommentsByPostIdAsync(int postId);
        Task<CommentDTO?> GetCommentByIdAsync(int id);
        Task<CommentDTO> CreateCommentAsync(int postId, CreateCommentDTO dto, int userId);
        Task UpdateCommentAsync(int id, UpdateCommentDTO dto, int userId);
        Task DeleteCommentAsync(int id, int userId);
        Task LikeCommentAsync(int id, int userId);
        Task UnlikeCommentAsync(int id, int userId);
    }
}
