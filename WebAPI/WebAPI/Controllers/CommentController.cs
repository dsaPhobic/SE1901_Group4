using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/forum/posts/{postId}/comments")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CommentDTO>>> GetComments(int postId)
        {
            var comments = await _commentService.GetCommentsByPostIdAsync(postId);
            return Ok(comments);
        }

        [HttpPost]
        public async Task<ActionResult<CommentDTO>> CreateComment(int postId, [FromBody] CreateCommentDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to create comments");

            try
            {
                var comment = await _commentService.CreateCommentAsync(postId, dto, userId.Value);
                return CreatedAtAction(nameof(GetComment), new { postId, commentId = comment.CommentId }, comment);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{commentId}")]
        public async Task<ActionResult<CommentDTO>> GetComment(int postId, int commentId)
        {
            var comment = await _commentService.GetCommentByIdAsync(commentId);
            if (comment == null) return NotFound("Comment not found");
            return Ok(comment);
        }

        [HttpPut("{commentId}")]
        public async Task<IActionResult> UpdateComment(int postId, int commentId, [FromBody] UpdateCommentDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to update comments");

            try
            {
                await _commentService.UpdateCommentAsync(commentId, dto, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Comment not found");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You don't have permission to update this comment");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int postId, int commentId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to delete comments");

            try
            {
                await _commentService.DeleteCommentAsync(commentId, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Comment not found");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You don't have permission to delete this comment");
            }
        }

        [HttpPost("{commentId}/like")]
        public async Task<IActionResult> LikeComment(int postId, int commentId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to like comments");

            try
            {
                await _commentService.LikeCommentAsync(commentId, userId.Value);
                return Ok("Comment liked successfully");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Comment not found");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{commentId}/like")]
        public async Task<IActionResult> UnlikeComment(int postId, int commentId)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to unlike comments");

            try
            {
                await _commentService.UnlikeCommentAsync(commentId, userId.Value);
                return Ok("Comment unliked successfully");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Comment not found");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
