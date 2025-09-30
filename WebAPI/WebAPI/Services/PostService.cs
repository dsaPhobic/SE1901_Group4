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

        public async Task<IEnumerable<PostDTO>> GetPostsAsync(int page, int limit)
        {
            var posts = await _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Load tags separately
            foreach (var post in posts)
            {
                var postTags = await _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == post.PostId)
                    .Include(pt => pt.Tag)
                    .ToListAsync();
                post.Tags = postTags.Select(pt => pt.Tag).ToList();
            }

            return posts.Select(ToDTO);
        }

        public async Task<IEnumerable<PostDTO>> GetPostsByFilterAsync(string filter, int page, int limit)
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

            var posts = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            // Load tags separately
            foreach (var post in posts)
            {
                var postTags = await _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == post.PostId)
                    .Include(pt => pt.Tag)
                    .ToListAsync();
                post.Tags = postTags.Select(pt => pt.Tag).ToList();
            }

            return posts.Select(ToDTO);
        }

        public async Task<PostDTO?> GetPostByIdAsync(int id)
        {
            var post = await _context.Post
                .Include(p => p.User)
                .Include(p => p.Comments)
                .Include(p => p.PostLikes)
                .FirstOrDefaultAsync(p => p.PostId == id);

            if (post == null) return null;

            // Load tags
            var postTags = await _context.Set<Post_Tag>()
                .Where(pt => pt.PostId == post.PostId)
                .Include(pt => pt.Tag)
                .ToListAsync();
            post.Tags = postTags.Select(pt => pt.Tag).ToList();

            // Increment view count
            post.ViewCount = (post.ViewCount ?? 0) + 1;
            await _context.SaveChangesAsync();

            return ToDTO(post);
        }

        public async Task<PostDTO> CreatePostAsync(CreatePostDTO dto, int userId)
        {
            var user = await _userRepository.GetById(userId);
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
            await _context.SaveChangesAsync();

            // Add tags
            if (dto.TagNames.Any())
            {
                await AddTagsToPost(post.PostId, dto.TagNames);
            }

            return await GetPostByIdAsync(post.PostId) ?? throw new InvalidOperationException("Failed to create post");
        }

        public async Task UpdatePostAsync(int id, UpdatePostDTO dto, int userId)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = await _userRepository.GetById(userId);
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
                // Remove existing tags
                var existingTags = await _context.Set<Post_Tag>()
                    .Where(pt => pt.PostId == id)
                    .ToListAsync();
                _context.Set<Post_Tag>().RemoveRange(existingTags);

                // Add new tags
                await AddTagsToPost(id, dto.TagNames);
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeletePostAsync(int id, int userId)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = await _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (post.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this post");

            _context.Post.Remove(post);
            await _context.SaveChangesAsync();
        }

        public async Task VotePostAsync(int id, int userId)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var existingLike = await _context.PostLike
                .FirstOrDefaultAsync(pl => pl.PostId == id && pl.UserId == userId);

            if (existingLike != null)
                throw new InvalidOperationException("You have already voted for this post");

            var like = new PostLike
            {
                PostId = id,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.PostLike.Add(like);
            await _context.SaveChangesAsync();
        }

        public async Task UnvotePostAsync(int id, int userId)
        {
            var like = await _context.PostLike
                .FirstOrDefaultAsync(pl => pl.PostId == id && pl.UserId == userId);

            if (like == null)
                throw new InvalidOperationException("You haven't voted for this post");

            _context.PostLike.Remove(like);
            await _context.SaveChangesAsync();
        }

        public async Task ReportPostAsync(int id, string reason, int userId)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var report = new Report
            {
                UserId = userId,
                Content = reason,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.Report.Add(report);
            await _context.SaveChangesAsync();
        }

        private async Task AddTagsToPost(int postId, List<string> tagNames)
        {
            foreach (var tagName in tagNames)
            {
                var tag = await _context.Tag
                    .FirstOrDefaultAsync(t => t.TagName == tagName);

                if (tag == null)
                {
                    tag = new Tag { TagName = tagName };
                    _context.Tag.Add(tag);
                    await _context.SaveChangesAsync();
                }

                var postTag = new Post_Tag
                {
                    PostId = postId,
                    TagId = tag.TagId
                };

                _context.Set<Post_Tag>().Add(postTag);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsPostVotedByUser(int postId, int userId)
        {
            return await _context.PostLike
                .AnyAsync(pl => pl.PostId == postId && pl.UserId == userId);
        }

        private PostDTO ToDTO(Post post)
        {
            return new PostDTO
            {
                PostId = post.PostId,
                Title = post.Title,
                Content = post.Content,
                Category = "General", // You can add category field to Post model
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                ViewCount = post.ViewCount ?? 0,
                CommentCount = post.Comments.Count,
                VoteCount = post.PostLikes.Count,
                IsVoted = false, // Will be set by controller
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
