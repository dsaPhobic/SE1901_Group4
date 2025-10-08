using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class PostService : IPostService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserRepository _userRepository;

        public PostService(ApplicationDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public IEnumerable<PostDTO> GetPosts(int page, int limit, int? userId = null)
        {
            var posts = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Where(p => !p.IsHidden && p.Status == "approved") // Chỉ hiển thị posts đã được duyệt
                .OrderByDescending(p => p.IsPinned) // Pinned posts lên đầu
                .ThenByDescending(p => p.CreatedAt) // Sau đó sắp xếp theo thời gian
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            foreach (var post in posts)
            {
                var postTags = _context.Entry(post)
                    .Collection(p => p.Tags)
                    .Query()
                    .ToList();
            }

            return posts.Select(p => ToDTO(p, userId));
        }

        public IEnumerable<PostDTO> GetPostsByFilter(string filter, int page, int limit, int? userId = null)
        {
            var query = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .AsQueryable();

            query = filter.ToLower() switch
            {
                "new" => query.Where(p => !p.IsHidden && p.Status == "approved" && (userId == null || !_context.UserPostHide.Any(uph => uph.UserId == userId && uph.PostId == p.PostId))).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt),
                "top" => query.Where(p => !p.IsHidden && p.Status == "approved" && (userId == null || !_context.UserPostHide.Any(uph => uph.UserId == userId && uph.PostId == p.PostId))).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.PostLikes.Count),
                "hot" => query.Where(p => !p.IsHidden && p.Status == "approved" && (userId == null || !_context.UserPostHide.Any(uph => uph.UserId == userId && uph.PostId == p.PostId))).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.ViewCount),
                "closed" => userId.HasValue ? query.Where(p => _context.UserPostHide.Any(uph => uph.UserId == userId && uph.PostId == p.PostId)).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt) : query.Where(p => false),
                _ => query.Where(p => !p.IsHidden && p.Status == "approved" && (userId == null || !_context.UserPostHide.Any(uph => uph.UserId == userId && uph.PostId == p.PostId))).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt)
            };

            var posts = query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            foreach (var post in posts)
            {
                var postTags = _context.Entry(post)
                    .Collection(p => p.Tags)
                    .Query()
                    .ToList();
            }

            return posts.Select(p => ToDTO(p, userId));
        }

        public PostDTO? GetPostById(int id, int? userId = null)
        {
            var post = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .FirstOrDefault(p => p.PostId == id);

            if (post == null) return null;

            var postTags = _context.Entry(post)
                .Collection(p => p.Tags)
                .Query()
                .ToList();

            return ToDTO(post, userId);
        }

        public PostDTO CreatePost(CreatePostDTO dto, int userId)
        {
            var user = _userRepository.GetById(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var post = new Post
            {
                UserId = userId,
                Title = dto.Title,
                Content = dto.Content,
                CreatedAt = DateTime.UtcNow,
                ViewCount = 0,
                Status = "pending" // Tất cả posts mới đều ở trạng thái pending
            };

            _context.Post.Add(post);
            _context.SaveChanges();

            if (dto.TagNames.Any())
            {
                AddTagsToPost(post.PostId, dto.TagNames);
            }

            return GetPostById(post.PostId) ?? throw new InvalidOperationException("Failed to create post");
        }

        public void UpdatePost(int id, UpdatePostDTO dto, int userId)
        {
            var post = _context.Post.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (post.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to update this post");

            if (!string.IsNullOrWhiteSpace(dto.Title))
                post.Title = dto.Title;

            if (!string.IsNullOrWhiteSpace(dto.Content))
                post.Content = dto.Content;

            post.UpdatedAt = DateTime.UtcNow;

            if (dto.TagNames != null && dto.TagNames.Any())
            {
                // Clear existing tags
                post.Tags.Clear();
                _context.SaveChanges();

                AddTagsToPost(id, dto.TagNames);
            }

            _context.SaveChanges();
        }

        public void DeletePost(int id, int userId)
        {
            var post = _context.Post
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Include(p => p.Reports)
                .Include(p => p.Tags)
                .FirstOrDefault(p => p.PostId == id);
                
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (post.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this post");

            try
            {
                // Xóa các dữ liệu liên quan theo thứ tự đúng
                // 1. Lấy tất cả comments của post (bao gồm nested comments)
                var allComments = _context.Comment.Where(c => c.PostId == id).ToList();
                
                // 2. Xóa tất cả CommentLikes của comments trong post
                var allCommentLikes = _context.CommentLike
                    .Where(cl => allComments.Select(c => c.CommentId).Contains(cl.CommentId))
                    .ToList();
                _context.CommentLike.RemoveRange(allCommentLikes);
                
                // 3. Xóa tất cả comments của post (bao gồm nested comments)
                _context.Comment.RemoveRange(allComments);
                
                // 4. Xóa tất cả likes của post
                _context.PostLike.RemoveRange(post.PostLikes);
                
                // 5. Xóa tất cả reports của post
                _context.Report.RemoveRange(post.Reports);
                
                // 6. Xóa Post_Tag relationships (many-to-many)
                // Clear tags collection trước khi xóa post
                post.Tags.Clear();
                
                // 7. Xóa post
                _context.Post.Remove(post);
                
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error deleting post: {ex.Message}", ex);
            }
        }

        public void VotePost(int id, int userId)
        {
            var post = _context.Post.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var existingLike = _context.PostLike
                .FirstOrDefault(pl => pl.PostId == id && pl.UserId == userId);

            if (existingLike != null)
                throw new InvalidOperationException("You have already voted for this post");

            var like = new PostLike
            {
                PostId = id,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.PostLike.Add(like);
            _context.SaveChanges();
        }

        public void UnvotePost(int id, int userId)
        {
            var like = _context.PostLike
                .FirstOrDefault(pl => pl.PostId == id && pl.UserId == userId);

            if (like == null)
                throw new InvalidOperationException("You haven't voted for this post");

            _context.PostLike.Remove(like);
            _context.SaveChanges();
        }

        public void ReportPost(int id, string reason, int userId)
        {
            var post = _context.Post.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var report = new Report
            {
                UserId = userId,
                PostId = id,
                Content = reason,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Report.Add(report);
            _context.SaveChanges();
        }

        private void AddTagsToPost(int postId, List<string> tagNames)
        {
            var post = _context.Post.Find(postId);
            if (post == null) return;

            foreach (var tagName in tagNames)
            {
                var tag = _context.Tag.FirstOrDefault(t => t.TagName == tagName);

                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    _context.Tag.Add(tag);
                    _context.SaveChanges();
                }

                // Add tag to post's Tags collection
                post.Tags.Add(tag);
            }

            _context.SaveChanges();
        }

        public bool IsPostVotedByUser(int postId, int userId)
        {
            return _context.PostLike
                .Any(pl => pl.PostId == postId && pl.UserId == userId);
        }

        private PostDTO ToDTO(Post post, int? userId = null)
        {
            return new PostDTO
            {
                PostId = post.PostId,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                ViewCount = post.ViewCount ?? 0,
                CommentCount = post.Comments.Count, // Đếm tất cả comments (bao gồm replies)
                VoteCount = post.PostLikes.Count,
                IsVoted = userId.HasValue ? IsPostVotedByUser(post.PostId, userId.Value) : false,
                IsPinned = post.IsPinned,
                RejectionReason = post.RejectionReason,
                User = new UserDTO
                {
                    UserId = post.User.UserId,
                    Username = post.User.Username,
                    Email = post.User.Email,
                    Firstname = post.User.Firstname,
                    Lastname = post.User.Lastname,
                    Role = post.User.Role
                },
                Tags = post.Tags.Select(t => new TagDTO
                {
                    TagId = t.TagId,
                    TagName = t.TagName
                }).ToList()
            };
        }

        public void IncrementViewCount(int postId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) return;

            // Use atomic increment to prevent race conditions
            post.ViewCount = (post.ViewCount ?? 0) + 1;
            _context.SaveChanges();
        }

        public void PinPost(int postId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            post.IsPinned = true;
            _context.SaveChanges();
        }

        public void UnpinPost(int postId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            post.IsPinned = false;
            _context.SaveChanges();
        }

        public void HidePost(int postId, int userId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            // Kiểm tra xem user đã ẩn post này chưa
            var existingHide = _context.UserPostHide
                .FirstOrDefault(uph => uph.UserId == userId && uph.PostId == postId);

            if (existingHide == null)
            {
                // Thêm vào UserPostHide thay vì set IsHidden
                var userPostHide = new UserPostHide
                {
                    UserId = userId,
                    PostId = postId,
                    HiddenAt = DateTime.UtcNow
                };
                _context.UserPostHide.Add(userPostHide);
                _context.SaveChanges();
            }
        }

        public void UnhidePost(int postId, int userId)
        {
            var existingHide = _context.UserPostHide
                .FirstOrDefault(uph => uph.UserId == userId && uph.PostId == postId);

            if (existingHide != null)
            {
                _context.UserPostHide.Remove(existingHide);
                _context.SaveChanges();
            }
        }

        // Moderator methods
        public ModeratorStatsDTO GetModeratorStats()
        {
            return new ModeratorStatsDTO
            {
                TotalPosts = _context.Post.Count(p => p.Status == "approved"),
                PendingPosts = _context.Post.Count(p => p.Status == "pending"),
                ReportedPosts = _context.Report.Count(),
                RejectedPosts = _context.Post.Count(p => p.Status == "rejected")
            };
        }

        public IEnumerable<PostDTO> GetPendingPosts(int page, int limit)
        {
            var posts = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Where(p => p.Status == "pending")
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return posts.Select(p => ToDTO(p));
        }

        public IEnumerable<ReportedPostDTO> GetReportedPosts(int page, int limit)
        {
            var reportedPosts = _context.Report
                .Include(r => r.Post)
                .ThenInclude(p => p.User)
                .OrderByDescending(r => r.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return reportedPosts.Select(r => new ReportedPostDTO
            {
                PostId = r.PostId,
                Title = r.Post?.Title ?? "",
                Content = r.Post?.Content ?? "",
                Author = r.Post?.User?.Username ?? "",
                CreatedAt = r.Post?.CreatedAt ?? DateTime.UtcNow,
                ReportReason = r.Content,
                ReportCount = 1, // Mock count
                Status = "Reported"
            });
        }

        public IEnumerable<PostDTO> GetRejectedPosts(int page, int limit)
        {
            var posts = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Where(p => p.Status == "rejected")
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            return posts.Select(p => ToDTO(p));
        }

        public void ApprovePost(int postId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            post.Status = "approved";
            post.RejectionReason = null; // Clear rejection reason if any
            _context.SaveChanges();
        }

        public void RejectPost(int postId, string reason)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            post.Status = "rejected";
            post.RejectionReason = reason;

            // Tạo notification cho user
            var notification = new Notification
            {
                UserId = post.UserId,
                Content = $"Bài viết '{post.Title}' của bạn đã bị từ chối. Lý do: {reason}",
                Type = "post_rejected",
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notification.Add(notification);
            _context.SaveChanges();
        }

        public IEnumerable<ChartDataDTO> GetPostsChartData(int month, int year)
        {
            var startDate = new DateTime(year, month, 1);
            var endDate = startDate.AddMonths(1);

            var posts = _context.Post
                .Where(p => p.CreatedAt >= startDate && p.CreatedAt < endDate)
                .GroupBy(p => p.CreatedAt.Date)
                .Select(g => new ChartDataDTO
                {
                    Label = g.Key.ToString("M/d"),
                    Value = g.Count(),
                    Date = g.Key
                })
                .OrderBy(x => x.Date)
                .ToList();

            return posts;
        }

        public IEnumerable<NotificationDTO> GetModeratorNotifications()
        {
            // Mock notifications - in real implementation, you would have a notifications table
            return new List<NotificationDTO>
            {
                new NotificationDTO
                {
                    NotificationId = 1,
                    Title = "New pending post",
                    Content = "A new post is waiting for approval",
                    Type = "pending",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow.AddHours(-2)
                },
                new NotificationDTO
                {
                    NotificationId = 2,
                    Title = "Post reported",
                    Content = "A post has been reported by users",
                    Type = "reported",
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow.AddHours(-4)
                }
            };
        }

        public void MarkNotificationAsRead(int notificationId)
        {
            // Mock implementation - in real scenario, update notification status
            Console.WriteLine($"Marking notification {notificationId} as read");
        }

    }
}
