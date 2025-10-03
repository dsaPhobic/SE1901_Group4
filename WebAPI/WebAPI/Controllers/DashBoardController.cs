using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashBoardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashBoardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        // Lấy tất cả attempt của 1 user
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<ExamAttemptSummaryDTO>> GetExamAttemptsByUser(int userId)
        {
            var attempts = _dashboardService.GetExamAttemptsByUser(userId);
            return Ok(attempts);
        }

        [HttpGet("{attemptId}")]
        public ActionResult<ExamAttemptDetailDTO> GetExamAttemptDetail(long attemptId)
        {
            var attempt = _dashboardService.GetExamAttemptDetail(attemptId);
            if (attempt == null) return NotFound();

            return Ok(attempt);
        }


    }
}
