using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Repositories;

namespace WebAPI.Services
{
    public class CommentService : ICommentService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserRepository _userRepository;

        public CommentService(ApplicationDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public IEnumerable<CommentDTO> GetCommentsByPostId(int postId, int? userId = null)
        {
            // Load tất cả comments của post
            var allComments = _context.Comment
                .Include(c => c.User)
                .Include(c => c.CommentLikes)
                .Where(c => c.PostId == postId)
                .ToList();

            // Chỉ lấy root comments
            var rootComments = allComments
                .Where(c => c.ParentCommentId == null)
                .OrderBy(c => c.CreatedAt)
                .ToList();

            return rootComments.Select(c => ToDTOWithReplies(c, allComments, userId));
        }

        public CommentDTO? GetCommentById(int id, int? currentUserId = null)
        {
            var comment = _context.Comment
                .Include(c => c.User)
                .Include(c => c.InverseParentComment)
                .Include(c => c.CommentLikes)
                .FirstOrDefault(c => c.CommentId == id);

            if (comment == null) return null;

            return ToDTO(comment, currentUserId);
        }

        public CommentDTO CreateComment(int postId, CreateCommentDTO dto, int userId)
        {
            var post = _context.Post.Find(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var comment = new Comment
            {
                PostId = postId,
                UserId = userId,
                Content = dto.Content,
                ParentCommentId = dto.ParentCommentId,
                LikeNumber = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comment.Add(comment);
            _context.SaveChanges();

            return GetCommentById(comment.CommentId) ?? throw new InvalidOperationException("Failed to create comment");
        }

        public CommentDTO CreateReply(int parentCommentId, CreateCommentDTO dto, int userId)
        {
            var parentComment = _context.Comment.Find(parentCommentId);
            if (parentComment == null) throw new KeyNotFoundException("Parent comment not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new KeyNotFoundException("User not found");

            var reply = new Comment
            {
                PostId = parentComment.PostId,
                UserId = userId,
                Content = dto.Content,
                ParentCommentId = parentCommentId,
                LikeNumber = 0,
                CreatedAt = DateTime.UtcNow
            };

            _context.Comment.Add(reply);
            _context.SaveChanges();

            return GetCommentById(reply.CommentId) ?? throw new InvalidOperationException("Failed to create reply");
        }

        public void UpdateComment(int id, UpdateCommentDTO dto, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (comment.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to update this comment");

            comment.Content = dto.Content;
            _context.SaveChanges();
        }

        public void DeleteComment(int id, int userId)
        {
            var comment = _context.Comment
                .Include(c => c.Post)
                .FirstOrDefault(c => c.CommentId == id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            // Cho phép xóa nếu:
            // 1. User là chủ comment
            // 2. User là admin
            // 3. User là chủ bài viết (post owner)
            bool canDelete = comment.UserId == userId || 
                            user.Role == "admin" || 
                            comment.Post.UserId == userId;

            if (!canDelete)
                throw new UnauthorizedAccessException("You don't have permission to delete this comment");

            try
            {
                // Xóa tất cả nested comments (replies) trước
                var nestedComments = _context.Comment.Where(c => c.ParentCommentId == id).ToList();
                if (nestedComments.Any())
                {
                    // Xóa tất cả CommentLikes của nested comments
                    var nestedCommentLikes = _context.CommentLike
                        .Where(cl => nestedComments.Select(c => c.CommentId).Contains(cl.CommentId))
                        .ToList();
                    _context.CommentLike.RemoveRange(nestedCommentLikes);
                    
                    // Xóa nested comments
                    _context.Comment.RemoveRange(nestedComments);
                }
                
                // Xóa tất cả CommentLikes của comment chính
                var commentLikes = _context.CommentLike.Where(cl => cl.CommentId == id).ToList();
                _context.CommentLike.RemoveRange(commentLikes);
                
                // Xóa comment chính
                _context.Comment.Remove(comment);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error deleting comment: {ex.Message}", ex);
            }
        }

        public void LikeComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            // Check if user already liked this comment
            var existingLike = _context.CommentLike
                .FirstOrDefault(cl => cl.CommentId == id && cl.UserId == userId);

            if (existingLike != null)
                throw new InvalidOperationException("You have already liked this comment");

            // Add new like record
            var commentLike = new CommentLike
            {
                CommentId = id,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            _context.CommentLike.Add(commentLike);
            _context.SaveChanges();
        }

        public void UnlikeComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            // Check if user has liked this comment
            var existingLike = _context.CommentLike
                .FirstOrDefault(cl => cl.CommentId == id && cl.UserId == userId);

            if (existingLike == null)
                throw new InvalidOperationException("You haven't liked this comment");

            // Remove like record
            _context.CommentLike.Remove(existingLike);
            _context.SaveChanges();
        }


        private CommentDTO ToDTO(Comment comment, int? currentUserId = null)
        {
            // Check if user has voted for this comment using the loaded CommentLikes
            bool isVoted = false;
            if (currentUserId.HasValue)
            {
                isVoted = comment.CommentLikes.Any(cl => cl.UserId == currentUserId.Value);
            }

            return new CommentDTO
            {
                CommentId = comment.CommentId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                LikeNumber = comment.CommentLikes.Count,
                VoteCount = comment.CommentLikes.Count,
                IsVoted = isVoted,
                ParentCommentId = comment.ParentCommentId,
                User = new UserDTO
                {
                    UserId = comment.User.UserId,
                    Username = comment.User.Username,
                    Email = comment.User.Email,
                    Firstname = comment.User.Firstname,
                    Lastname = comment.User.Lastname,
                    Role = comment.User.Role,
                    Avatar = comment.User.Avatar
                },
                Replies = new List<CommentDTO>() // Don't load replies in ToDTO, use ToDTOWithReplies instead
            };
        }

        private CommentDTO ToDTOWithReplies(Comment comment, List<Comment> allComments, int? currentUserId)
        {
            var replies = allComments
                .Where(c => c.ParentCommentId == comment.CommentId)
                .OrderBy(c => c.CreatedAt)
                .Select(c => ToDTOWithReplies(c, allComments, currentUserId))
                .ToList();

            // Check if user has voted for this comment using the loaded CommentLikes
            bool isVoted = false;
            if (currentUserId.HasValue)
            {
                isVoted = comment.CommentLikes.Any(cl => cl.UserId == currentUserId.Value);
            }

            return new CommentDTO
            {
                CommentId = comment.CommentId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                LikeNumber = comment.CommentLikes.Count,
                VoteCount = comment.CommentLikes.Count,
                IsVoted = isVoted,
                ParentCommentId = comment.ParentCommentId,
                User = new UserDTO
                {
                    UserId = comment.User.UserId,
                    Username = comment.User.Username,
                    Email = comment.User.Email,
                    Firstname = comment.User.Firstname,
                    Lastname = comment.User.Lastname,
                    Role = comment.User.Role,
                    Avatar = comment.User.Avatar
                },
                Replies = replies
            };
        }

        private bool IsCommentVotedByUser(int commentId, int userId)
        {
            return _context.CommentLike
                .Any(cl => cl.CommentId == commentId && cl.UserId == userId);
        }
    }
}
