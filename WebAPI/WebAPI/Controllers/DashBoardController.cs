using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashBoardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashBoardController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả attempt của 1 user
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<object>> GetExamAttemptsByUser(int userId)
        {
            var attempts = _context.ExamAttempt
                .Where(a => a.UserId == userId)
                .Include(a => a.Exam)
                .Select(a => new
                {
                    a.AttemptId,
                    a.StartedAt,
                    a.SubmittedAt,
                    a.ExamId,
                    ExamName = a.Exam.ExamName,
                    ExamType = a.Exam.ExamType,
                    a.Score,
                    a.AnswerText
                })
                .ToList();

            return Ok(attempts);
        }

        [HttpGet("{attemptId}")]
        public ActionResult<object> GetExamAttemptDetail(long attemptId)
        {
            var attempt = _context.ExamAttempt
                .Where(a => a.AttemptId == attemptId)
                .Include(a => a.Exam)
                .Select(a => new
                {
                    a.AttemptId,
                    a.StartedAt,
                    a.SubmittedAt,
                    a.ExamId,
                    ExamName = a.Exam.ExamName,
                    ExamType = a.Exam.ExamType,
                    a.Score,
                    a.AnswerText
                })
                .FirstOrDefault();

            if (attempt == null) return NotFound();

            return Ok(attempt);
        }


    }
}
