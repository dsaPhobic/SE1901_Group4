using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;
using System.Text.Json;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;

        public ExamController(IExamService service) => _examService = service;

        // Create exam (admin only)
        [HttpPost]
        public ActionResult<Exam> Create([FromBody] CreateExamDTO exam)
        {
            if (exam == null) return BadRequest("Invalid payload");
            var result = _examService.Create(exam);
            return CreatedAtAction(nameof(GetById), new { id = result.ExamId }, result);
        }

        // Get exam by id
        [HttpGet("{id}")]
        public ActionResult<Exam> GetById(int id)
        {
            var result = _examService.GetById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Exam>> GetAll()
        {
            var list = _examService.GetAll();
            return Ok(list);
        }

        // Update exam (admin only)
        [HttpPut("{id}")]
        public ActionResult<Exam> Update(int id, [FromBody] UpdateExamDTO exam)
        {
            if (exam == null) return BadRequest("Invalid payload");
            var result = _examService.Update(id, exam);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Delete exam
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _examService.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // Lấy tất cả attempt của 1 user
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<ExamAttemptSummaryDTO>> GetExamAttemptsByUser(int userId)
        {
            var attempts = _examService.GetExamAttemptsByUser(userId);
            return Ok(attempts);
        }

        [HttpGet("attempt/{attemptId}")]
        public ActionResult<ExamAttemptSummaryDTO> GetExamAttemptDetail(long attemptId)
        {
            var attempt = _examService.GetExamAttemptDetail(attemptId);
            if (attempt == null) return NotFound();

            return Ok(attempt);
        }

        [HttpPost("attempt/submit")]
        public ActionResult<ExamAttemptDTO> SubmitAttempt([FromBody] SubmitAttemptDTO dto)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to submit exam");
            try
            {
                var attempt = _examService.SubmitAttempt(dto.ExamId, userId.Value, dto.AnswerText, dto.StartedAt);
                var result = new ExamAttemptDTO
                {
                    AttemptId = attempt.AttemptId,
                    StartedAt = attempt.StartedAt,
                    SubmittedAt = attempt.SubmittedAt,
                    ExamId = attempt.ExamId,
                    ExamName = attempt.Exam?.ExamName ?? string.Empty,
                    ExamType = attempt.Exam?.ExamType ?? string.Empty,
                    TotalScore = attempt.Score ?? 0,
                    AnswerText = attempt.AnswerText ?? string.Empty
                };
                return CreatedAtAction(nameof(GetExamAttemptDetail), new { attemptId = result.AttemptId }, result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Exam not found");
            }
        }
    }
}
