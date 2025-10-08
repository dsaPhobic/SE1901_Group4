using WebAPI.DTOs;

namespace WebAPI.Services
{
    public interface IPostService
    {
        IEnumerable<PostDTO> GetPosts(int page, int limit, int? userId = null);
        IEnumerable<PostDTO> GetPostsByFilter(string filter, int page, int limit, int? userId = null);
        PostDTO? GetPostById(int id, int? userId = null);
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
        void HidePost(int postId, int userId);
        void UnhidePost(int postId, int userId);
        
        // Moderator methods
        ModeratorStatsDTO GetModeratorStats();
        IEnumerable<PostDTO> GetPendingPosts(int page, int limit);
        IEnumerable<ReportedPostDTO> GetReportedPosts(int page, int limit);
        IEnumerable<PostDTO> GetRejectedPosts(int page, int limit);
        void ApprovePost(int postId);
        void RejectPost(int postId, string reason);
        IEnumerable<ChartDataDTO> GetPostsChartData(int month, int year);
        IEnumerable<NotificationDTO> GetModeratorNotifications();
        void MarkNotificationAsRead(int notificationId);
    }
}
