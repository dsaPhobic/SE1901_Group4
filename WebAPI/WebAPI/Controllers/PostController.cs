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

        public PostController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetPosts(
            [FromQuery] int page = 1, 
            [FromQuery] int limit = 10)
        {
            var posts = await _postService.GetPostsAsync(page, limit);
            return Ok(posts);
        }

        [HttpGet("filter/{filter}")]
        public async Task<ActionResult<IEnumerable<PostDTO>>> GetPostsByFilter(
            string filter, 
            [FromQuery] int page = 1, 
            [FromQuery] int limit = 10)
        {
            var posts = await _postService.GetPostsByFilterAsync(filter, page, limit);
            return Ok(posts);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PostDTO>> GetPost(int id)
        {
            var post = await _postService.GetPostByIdAsync(id);
            if (post == null) return NotFound("Post not found");
            
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId.HasValue)
            {
                post.IsVoted = await _postService.IsPostVotedByUser(id, userId.Value);
            }
            
            return Ok(post);
        }

        [HttpPost]
        public async Task<ActionResult<PostDTO>> CreatePost([FromBody] CreatePostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to create posts");

            try
            {
                var post = await _postService.CreatePostAsync(dto, userId.Value);
                return CreatedAtAction(nameof(GetPost), new { id = post.PostId }, post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePost(int id, [FromBody] UpdatePostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to update posts");

            try
            {
                await _postService.UpdatePostAsync(id, dto, userId.Value);
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
        public async Task<IActionResult> DeletePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to delete posts");

            try
            {
                await _postService.DeletePostAsync(id, userId.Value);
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
        public async Task<IActionResult> VotePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to vote");

            try
            {
                await _postService.VotePostAsync(id, userId.Value);
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
        public async Task<IActionResult> UnvotePost(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to unvote");

            try
            {
                await _postService.UnvotePostAsync(id, userId.Value);
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
        public async Task<IActionResult> ReportPost(int id, [FromBody] ReportPostDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to report posts");

            try
            {
                await _postService.ReportPostAsync(id, dto.Reason, userId.Value);
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
    }
}
