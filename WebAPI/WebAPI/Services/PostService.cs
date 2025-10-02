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
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            foreach (var post in posts)
            {
                var postTags = _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == post.PostId)
                    .Include(pt => pt.Tag)
                    .ToList();
                post.Tags = postTags.Select(pt => pt.Tag).ToList();
            }

            return posts.Select(ToDTO);
        }

        public IEnumerable<PostDTO> GetPostsByFilter(string filter, int page, int limit)
        {
            var query = _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .AsQueryable();

            query = filter.ToLower() switch
            {
                "new" => query.OrderByDescending(p => p.CreatedAt),
                "top" => query.OrderByDescending(p => p.PostLikes.Count),
                "hot" => query.OrderByDescending(p => p.Comments.Count + p.PostLikes.Count),
                "closed" => query.Where(p => p.Comments.Any(c => c.Content.Contains("CLOSED"))),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };

            var posts = query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToList();

            foreach (var post in posts)
            {
                var postTags = _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == post.PostId)
                    .Include(pt => pt.Tag)
                    .ToList();
                post.Tags = postTags.Select(pt => pt.Tag).ToList();
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

            var postTags = _context.Set<Post_Tag>()
                .Where(pt => pt.PostId == post.PostId)
                .Include(pt => pt.Tag)
                .ToList();
            post.Tags = postTags.Select(pt => pt.Tag).ToList();

            post.ViewCount = (post.ViewCount ?? 0) + 1;
            _context.SaveChanges();

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
                var existingTags = _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == id)
                    .ToList();
                _context.Set<Post_Tag>().RemoveRange(existingTags);

                AddTagsToPost(id, dto.TagNames);
            }

            _context.SaveChanges();
        }

        public void DeletePost(int id, int userId)
        {
            var post = _context.Post.Find(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (post.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this post");

            _context.Post.Remove(post);
            _context.SaveChanges();
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
                PostId = id, // fixed missing relation
                Content = reason,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Report.Add(report);
            _context.SaveChanges();
        }

        private void AddTagsToPost(int postId, List<string> tagNames)
        {
            foreach (var tagName in tagNames)
            {
                var tag = _context.Tag.FirstOrDefault(t => t.TagName == tagName);

                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    _context.Tag.Add(tag);
                    _context.SaveChanges();
                }

                var postTag = new Post_Tag
                {
                    PostId = postId,
                    TagId = tag.TagId
                };

                _context.Set<Post_Tag>().Add(postTag);
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
                Category = "General",
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                ViewCount = post.ViewCount ?? 0,
                CommentCount = post.Comments.Count,
                VoteCount = post.PostLikes.Count,
                IsVoted = false,
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
    }
}
