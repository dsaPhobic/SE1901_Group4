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

        public async Task<IEnumerable<CommentDTO>> GetCommentsByPostIdAsync(int postId)
        {
            var comments = await _context.Comment
                .Include(c => c.User)
                .Include(c => c.InverseParentComment)
                .Where(c => c.PostId == postId && c.ParentCommentId == null)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return comments.Select(ToDTO);
        }

        public async Task<CommentDTO?> GetCommentByIdAsync(int id)
        {
            var comment = await _context.Comment
                .Include(c => c.User)
                .Include(c => c.InverseParentComment)
                .FirstOrDefaultAsync(c => c.CommentId == id);

            if (comment == null) return null;

            return ToDTO(comment);
        }

        public async Task<CommentDTO> CreateCommentAsync(int postId, CreateCommentDTO dto, int userId)
        {
            var post = await _context.Post.FindAsync(postId);
            if (post == null) throw new KeyNotFoundException("Post not found");

            var user = await _userRepository.GetById(userId);
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
            await _context.SaveChangesAsync();

            return await GetCommentByIdAsync(comment.CommentId) ?? throw new InvalidOperationException("Failed to create comment");
        }

        public async Task UpdateCommentAsync(int id, UpdateCommentDTO dto, int userId)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            var user = await _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (comment.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to update this comment");

            comment.Content = dto.Content;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(int id, int userId)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            var user = await _userRepository.GetById(userId);
            if (user == null) throw new UnauthorizedAccessException("User not found");

            if (comment.UserId != userId && user.Role != "admin")
                throw new UnauthorizedAccessException("You don't have permission to delete this comment");

            _context.Comment.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task LikeCommentAsync(int id, int userId)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            // For simplicity, we'll just increment the like number
            // In a real application, you'd want a separate CommentLike table
            comment.LikeNumber++;
            await _context.SaveChangesAsync();
        }

        public async Task UnlikeCommentAsync(int id, int userId)
        {
            var comment = await _context.Comment.FindAsync(id);
            if (comment == null) throw new KeyNotFoundException("Comment not found");

            if (comment.LikeNumber > 0)
            {
                comment.LikeNumber--;
                await _context.SaveChangesAsync();
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
