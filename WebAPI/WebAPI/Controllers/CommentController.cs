using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/forum/comments")]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet("post/{postId}")]
        public ActionResult<IEnumerable<CommentDTO>> GetCommentsByPostId(int postId)
        {
            var comments = _commentService.GetCommentsByPostId(postId);
            return Ok(comments);
        }

        [HttpGet("{id}")]
        public ActionResult<CommentDTO> GetComment(int id)
        {
            var comment = _commentService.GetCommentById(id);
            if (comment == null) return NotFound("Comment not found");
            return Ok(comment);
        }

        [HttpPost("post/{postId}")]
        public ActionResult<CommentDTO> CreateComment(int postId, [FromBody] CreateCommentDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to create comments");

            try
            {
                var comment = _commentService.CreateComment(postId, dto, userId.Value);
                return CreatedAtAction(nameof(GetComment), new { id = comment.CommentId }, comment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateComment(int id, [FromBody] UpdateCommentDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to update comments");

            try
            {
                _commentService.UpdateComment(id, dto, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteComment(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to delete comments");

            try
            {
                _commentService.DeleteComment(id, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }

        [HttpPost("{id}/like")]
        public IActionResult LikeComment(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to like comments");

            try
            {
                _commentService.LikeComment(id, userId.Value);
                return Ok("Comment liked successfully");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/like")]
        public IActionResult UnlikeComment(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to unlike comments");

            try
            {
                _commentService.UnlikeComment(id, userId.Value);
                return Ok("Comment unliked successfully");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/vote")]
        public IActionResult VoteComment(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to vote on comments");

            try
            {
                _commentService.VoteComment(id, userId.Value);
                return Ok("Comment voted successfully");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/vote")]
        public IActionResult UnvoteComment(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to unvote comments");

            try
            {
                _commentService.UnvoteComment(id, userId.Value);
                return Ok("Comment unvoted successfully");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
