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

        public IEnumerable<PostDTO> GetPosts(int page, int limit)
        {
            var posts = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Where(p => !p.IsHidden) // Không hiển thị posts đã bị ẩn
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

            return posts.Select(ToDTO);
        }

        public IEnumerable<PostDTO> GetPostsByFilter(string filter, int page, int limit)
        {
            var query = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .Where(p => !p.IsHidden) // Không hiển thị posts đã bị ẩn
                .AsQueryable();

            query = filter.ToLower() switch
            {
                "new" => query.OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt),
                "top" => query.OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.PostLikes.Count),
                "hot" => query.OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.Comments.Count(c => c.ParentCommentId == null) + p.PostLikes.Count),
                "closed" => query.Where(p => p.Comments.Any(c => c.Content.Contains("CLOSED") && c.ParentCommentId == null)).OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.IsPinned).ThenByDescending(p => p.CreatedAt)
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

            return posts.Select(ToDTO);
        }

        public PostDTO? GetPostById(int id)
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

            return ToDTO(post);
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
                ViewCount = 0
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
                // 1. Xóa tất cả comments của post (bao gồm nested comments)
                var allComments = _context.Comment.Where(c => c.PostId == id).ToList();
                _context.Comment.RemoveRange(allComments);
                
                // 2. Xóa tất cả likes của post
                _context.PostLike.RemoveRange(post.PostLikes);
                
                // 3. Xóa tất cả reports của post
                _context.Report.RemoveRange(post.Reports);
                
                // 4. Xóa Post_Tag relationships (many-to-many)
                // Clear tags collection trước khi xóa post
                post.Tags.Clear();
                
                // 5. Xóa post
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

        private PostDTO ToDTO(Post post)
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
                IsVoted = false,
                IsPinned = post.IsPinned,
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

        public void HidePost(int postId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            post.IsHidden = true;
            _context.SaveChanges();
        }

    }
}
