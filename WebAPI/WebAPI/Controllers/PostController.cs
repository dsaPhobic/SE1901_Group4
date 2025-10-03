using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/forum/posts")]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly ICommentService _commentService;

        public PostController(IPostService postService, ICommentService commentService)
        {
            _postService = postService;
            _commentService = commentService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PostDTO>> GetPosts(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            var posts = _postService.GetPosts(page, limit);
            return Ok(posts);
        }

        [HttpGet("filter/{filter}")]
        public ActionResult<IEnumerable<PostDTO>> GetPostsByFilter(
            string filter,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            var posts = _postService.GetPostsByFilter(filter, page, limit);
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public ActionResult<PostDTO> GetPost(int id)
        {
            var post = _postService.GetPostById(id);
            if (post == null) return NotFound("Post not found");

            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId.HasValue)
            {
                post.IsVoted = _postService.IsPostVotedByUser(id, userId.Value);
            }

            return Ok(post);
        }

        [HttpPost]
        public ActionResult<PostDTO> CreatePost([FromBody] CreatePostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to create posts");

            try
            {
                var post = _postService.CreatePost(dto, userId.Value);
                return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdatePost(int id, [FromBody] UpdatePostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to update posts");

            try
            {
                _postService.UpdatePost(id, dto, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You don't have permission to update this post");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public IActionResult DeletePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to delete posts");

            try
            {
                _postService.DeletePost(id, userId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found");
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid("You don't have permission to delete this post");
            }
        }

        [HttpPost("{id}/vote")]
        public IActionResult VotePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to vote");

            try
            {
                _postService.VotePost(id, userId.Value);
                return Ok("Post voted successfully");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}/vote")]
        public IActionResult UnvotePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to unvote");

            try
            {
                _postService.UnvotePost(id, userId.Value);
                return Ok("Post unvoted successfully");
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Post not found");
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{id}/report")]
        public IActionResult ReportPost(int id, [FromBody] ReportPostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to report posts");

            try
            {
                _postService.ReportPost(id, dto.Reason, userId.Value);
                return Ok("Post reported successfully");
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

        // Comment endpoints
        [HttpGet("{id}/comments")]
        public ActionResult<IEnumerable<CommentDTO>> GetCommentsByPostId(int id)
        {
            var comments = _commentService.GetCommentsByPostId(id);
            return Ok(comments);
        }

        [HttpPost("{id}/comments")]
        public ActionResult<CommentDTO> CreateComment(int id, [FromBody] CreateCommentDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to create comments");

            try
            {
                var comment = _commentService.CreateComment(id, dto, userId.Value);
                return CreatedAtAction(nameof(GetCommentsByPostId), new { id }, comment);
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
