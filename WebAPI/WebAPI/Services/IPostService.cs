using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IPostService
    {
        Task<IEnumerable<PostDTO>> GetPostsAsync(int page, int limit);
        Task<IEnumerable<PostDTO>> GetPostsByFilterAsync(string filter, int page, int limit);
        Task<PostDTO?> GetPostByIdAsync(int id);
        Task<PostDTO> CreatePostAsync(CreatePostDTO dto, int userId);
        Task UpdatePostAsync(int id, UpdatePostDTO dto, int userId);
        Task DeletePostAsync(int id, int userId);
        Task VotePostAsync(int id, int userId);
        Task UnvotePostAsync(int id, int userId);
        Task ReportPostAsync(int id, string reason, int userId);
        Task<bool> IsPostVotedByUser(int postId, int userId);
    }
}
