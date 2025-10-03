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

        public IEnumerable<CommentDTO> GetCommentsByPostId(int postId)
        {
            var comments = _context.Comment
                .Include(c => c.User)
                .Include(c => c.InverseParentComment)
                .Where(c => c.PostId == postId && c.ParentCommentId == null)
                .OrderBy(c => c.CreatedAt)
                .ToList();

            return comments.Select(ToDTO);
        }

        public CommentDTO? GetCommentById(int id)
        {
            var comment = _context.Comment
                .Include(c => c.User)
                .Include(c => c.InverseParentComment)
                .FirstOrDefault(c => c.CommentId == id);

            if (comment == null) return null;

            return ToDTO(comment);
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
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            var user = _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (comment.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this comment");

            _context.Comment.Remove(comment);
            _context.SaveChanges();
        }

        public void LikeComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            comment.LikeNumber++;
            _context.SaveChanges();
        }

        public void UnlikeComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            if (comment.LikeNumber > 0)
            {
                comment.LikeNumber--;
                _context.SaveChanges();
            }
        }

        public void VoteComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            comment.LikeNumber++;
            _context.SaveChanges();
        }

        public void UnvoteComment(int id, int userId)
        {
            var comment = _context.Comment.Find(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            if (comment.LikeNumber > 0)
            {
                comment.LikeNumber--;
                _context.SaveChanges();
            }
        }

        private CommentDTO ToDTO(Comment comment)
        {
            return new CommentDTO
            {
                CommentId = comment.CommentId,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                LikeNumber = comment.LikeNumber,
                VoteCount = comment.LikeNumber,
                IsVoted = false, // This would need to be set based on current user
                ParentCommentId = comment.ParentCommentId,
                User = new UserDTO
                {
                    UserId = comment.User.UserId,
                    Username = comment.User.Username,
                    Email = comment.User.Email,
                    Firstname = comment.User.Firstname,
                    Lastname = comment.User.Lastname,
                    Role = comment.User.Role
                },
                Replies = comment.InverseParentComment.Select(ToDTO).ToList()
            };
        }
    }
}
