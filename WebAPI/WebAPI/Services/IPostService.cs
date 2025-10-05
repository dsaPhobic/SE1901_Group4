using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IPostService
    {
        IEnumerable<PostDTO> GetPosts(int page, int limit);
        IEnumerable<PostDTO> GetPostsByFilter(string filter, int page, int limit);
        PostDTO? GetPostById(int id);
        PostDTO CreatePost(CreatePostDTO dto, int userId);
        void UpdatePost(int id, UpdatePostDTO dto, int userId);
        void DeletePost(int id, int userId);
        void VotePost(int id, int userId);
        void UnvotePost(int id, int userId);
        void ReportPost(int id, string reason, int userId);
        bool IsPostVotedByUser(int postId, int userId);
        void IncrementViewCount(int postId);
        void PinPost(int postId);
        void UnpinPost(int postId);
        void HidePost(int postId);
    }
}
