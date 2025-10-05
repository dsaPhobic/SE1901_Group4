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
            var userId = HttpContext.Session.GetInt32("UserId");
            var posts = _postService.GetPosts(page, limit, userId);
            return Ok(posts);
        }

        [HttpGet("filter/{filter}")]
        public ActionResult<IEnumerable<PostDTO>> GetPostsByFilter(
            string filter,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var posts = _postService.GetPostsByFilter(filter, page, limit, userId);
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public ActionResult<PostDTO> GetPost(int id, [FromQuery] bool incrementView = true)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            var post = _postService.GetPostById(id, userId);
            if (post == null) return NotFound("Post not found");

            // Only increment view count if incrementView is true
            if (incrementView)
            {
                _postService.IncrementViewCount(id);
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

        [HttpPost("{id}/pin")]
        public ActionResult PinPost(int id)
        {
            try
            {
                _postService.PinPost(id);
                return Ok(new { message = "Post pinned successfully" });
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

        [HttpPost("{id}/unpin")]
        public ActionResult UnpinPost(int id)
        {
            try
            {
                _postService.UnpinPost(id);
                return Ok(new { message = "Post unpinned successfully" });
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

        [HttpPost("{id}/hide")]
        public ActionResult HidePost(int id)
        {
            try
            {
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null) return Unauthorized("Please login to hide posts");

                _postService.HidePost(id, userId.Value);
                return Ok(new { message = "Post hidden successfully" });
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

        [HttpPost("{id}/unhide")]
        public ActionResult UnhidePost(int id)
        {
            try
            {
                var userId = HttpContext.Session.GetInt32("UserId");
                if (userId == null) return Unauthorized("Please login to unhide posts");

                _postService.UnhidePost(id, userId.Value);
                return Ok(new { message = "Post unhidden successfully" });
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

        [HttpPost("{id}/report")]
        public ActionResult ReportPost(int id, [FromBody] ReportPostRequest request)
        {
            try
            {
                var userId = HttpContext.Session.GetInt32("UserId");
                if (!userId.HasValue) return Unauthorized("User not logged in");

                _postService.ReportPost(id, request.Reason, userId.Value);
                return Ok(new { message = "Post reported successfully" });
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

    public class ReportPostRequest
    {
        public string Reason { get; set; }
    }
}
