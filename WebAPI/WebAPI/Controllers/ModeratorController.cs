using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/moderator")]
    public class ModeratorController : ControllerBase
    {
        private readonly IPostService _postService;
        private readonly IUserService _userService;

        public ModeratorController(IPostService postService, IUserService userService)
        {
            _postService = postService;
            _userService = userService;
        }

        // GET /api/moderator/stats
        [HttpGet("stats")]
        public ActionResult<ModeratorStatsDTO> GetStats()
        {
            try
            {
                var stats = _postService.GetModeratorStats();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/posts/pending
        [HttpGet("posts/pending")]
        public ActionResult<IEnumerable<PostDTO>> GetPendingPosts(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            try
            {
                var posts = _postService.GetPendingPosts(page, limit);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/posts/reported
        [HttpGet("posts/reported")]
        public ActionResult<IEnumerable<ReportedPostDTO>> GetReportedPosts(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            try
            {
                var posts = _postService.GetReportedPosts(page, limit);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/posts/rejected
        [HttpGet("posts/rejected")]
        public ActionResult<IEnumerable<PostDTO>> GetRejectedPosts(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            try
            {
                var posts = _postService.GetRejectedPosts(page, limit);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST /api/moderator/posts/{id}/approve
        [HttpPost("posts/{id}/approve")]
        public ActionResult ApprovePost(int id)
        {
            try
            {
                _postService.ApprovePost(id);
                return Ok(new { message = "Post approved successfully" });
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

        // POST /api/moderator/posts/{id}/reject
        [HttpPost("posts/{id}/reject")]
        public ActionResult RejectPost(int id, [FromBody] RejectPostRequest request)
        {
            try
            {
                _postService.RejectPost(id, request.Reason);
                return Ok(new { message = "Post rejected successfully" });
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

        // GET /api/moderator/posts/{id}
        [HttpGet("posts/{id}")]
        public ActionResult<PostDTO> GetPostDetail(int id)
        {
            try
            {
                var post = _postService.GetPostById(id);
                if (post == null) return NotFound("Post not found");
                return Ok(post);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/users
        [HttpGet("users")]
        public ActionResult<IEnumerable<UserStatsDTO>> GetUsers(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10)
        {
            try
            {
                var users = _userService.GetUsersWithStats(page, limit);
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/users/{id}/stats
        [HttpGet("users/{id}/stats")]
        public ActionResult<UserStatsDTO> GetUserStats(int id)
        {
            try
            {
                var stats = _userService.GetUserStats(id);
                if (stats == null) return NotFound("User not found");
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/chart/posts
        [HttpGet("chart/posts")]
        public ActionResult<IEnumerable<ChartDataDTO>> GetPostsChartData(
            [FromQuery] int month,
            [FromQuery] int year)
        {
            try
            {
                var data = _postService.GetPostsChartData(month, year);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET /api/moderator/notifications
        [HttpGet("notifications")]
        public ActionResult<IEnumerable<NotificationDTO>> GetNotifications()
        {
            try
            {
                var notifications = _postService.GetModeratorNotifications();
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT /api/moderator/notifications/{id}/read
        [HttpPut("notifications/{id}/read")]
        public ActionResult MarkNotificationAsRead(int id)
        {
            try
            {
                _postService.MarkNotificationAsRead(id);
                return Ok(new { message = "Notification marked as read" });
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

    public class RejectPostRequest
    {
        public string Reason { get; set; } = string.Empty;
    }
}


