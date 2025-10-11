using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Text.Json.Serialization;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamController : ControllerBase
    {
        private readonly IExamService _examService;
        private readonly IReadingService _readingService;

        public ExamController(IExamService service,IReadingService readingService) => (_examService,_readingService) = (service,readingService);

        // ========= CREATE EXAM =========
        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<ExamDto> Create([FromBody] CreateExamDto exam)
        {
            if (exam == null) return BadRequest("Invalid payload");

            var created = _examService.Create(exam);
            if (created == null) return BadRequest("Failed to create exam");

            // ✅ Convert entity to DTO to avoid cycles
            var dto = ConvertToDto(created);
            return CreatedAtAction(nameof(GetById), new { id = dto.ExamId }, dto);
        }

        // ========= GET EXAM BY ID =========
        [HttpGet("{id}")]
        public ActionResult<ExamDto> GetById(int id)
        {
            var exam = _examService.GetById(id);
            if (exam == null) return NotFound();

            var dto = ConvertToDto(exam);
            return Ok(dto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<ExamDto>> GetAll()
        {
            var list = _examService.GetAll();

            // ✅ Map all to DTOs
            var dtoList = list.Select(ConvertToDto).ToList();

            // ✅ Use safe JSON serializer as fallback
            var jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                WriteIndented = true
            };

            return new JsonResult(dtoList, jsonOptions);
        }

        // ========= UPDATE EXAM =========
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public ActionResult<ExamDto> Update(int id, [FromBody] UpdateExamDto exam)
        {
            if (exam == null) return BadRequest("Invalid payload");
            var updated = _examService.Update(id, exam);
            if (updated == null) return NotFound();

            return Ok(ConvertToDto(updated));
        }

        // ========= DELETE EXAM =========
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var deleted = _examService.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }

        // ========= USER ATTEMPTS =========
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<ExamAttemptSummaryDto>> GetExamAttemptsByUser(int userId)
        {
            var attempts = _examService.GetExamAttemptsByUser(userId);
            return Ok(attempts);
        }

        [HttpGet("attempt/{attemptId}")]
        public ActionResult<ExamAttemptSummaryDto> GetExamAttemptDetail(long attemptId)
        {
            var attempt = _examService.GetExamAttemptDetail(attemptId);
            if (attempt == null) return NotFound();

            return Ok(attempt);
        }

        [HttpPost("submit")]
        public ActionResult<ExamAttemptDto> SubmitAnswers([FromBody] SubmitAttemptDto dto)
        {
            if (dto == null || string.IsNullOrEmpty(dto.AnswerText))
                return BadRequest("Invalid or empty payload.");

            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null)
                return Unauthorized("Please login to submit exam.");

            try
            {
                var exam = _examService.GetById(dto.ExamId);
                if (exam == null)
                    return NotFound("Exam not found.");

                decimal score = 0;

                if (exam.ExamType.Equals("reading", StringComparison.OrdinalIgnoreCase))
                {
                    // ✅ 1. Parse the new JSON structure: [{ skillId, answers: [] }]
                    var userGroups = System.Text.Json.JsonSerializer
                        .Deserialize<List<UserAnswerGroup>>(dto.AnswerText)
                        ?? new List<UserAnswerGroup>();

                    // ✅ 2. Fetch all reading tasks
                    var readings = _readingService.GetByExam(dto.ExamId);

                    int totalQuestions = 0;
                    int correctCount = 0;

                    foreach (var reading in readings)
                    {
                        // find user’s submitted group
                        var userGroup = userGroups.FirstOrDefault(g => g.SkillId == reading.ReadingId);
                        if (userGroup == null) continue;

                        // parse correct answers
                        List<string> correctAnswers = new();
                        if (!string.IsNullOrEmpty(reading.CorrectAnswer))
                        {
                            try
                            {
                                correctAnswers = System.Text.Json.JsonSerializer
                                    .Deserialize<List<string>>(reading.CorrectAnswer)
                                    ?? new();
                            }
                            catch { }
                        }

                        // ✅ compare arrays
                        totalQuestions += correctAnswers.Count;
                        foreach (var ans in userGroup.Answers)
                        {
                            if (correctAnswers.Any(c =>
                                string.Equals(ans?.Trim(), c?.Trim(), StringComparison.OrdinalIgnoreCase)))
                            {
                                correctCount++;
                            }
                        }
                    }

                    // ✅ 3. Compute IELTS-style 0–9 score
                    score = totalQuestions > 0
                        ? Math.Round((decimal)correctCount / totalQuestions * 9, 2)
                        : 0;
                }

                // attach score and save
                dto.Score = score;
                var attempt = _examService.SubmitAttempt(dto, userId.Value);

                var result = new ExamAttemptDto
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

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Error submitting answers.",
                    Exception = ex.Message,
                    StackTrace = ex.StackTrace
                });
            }
        }

        // ✅ Local record to parse the nested JSON answer structure
        private record UserAnswerGroup(int SkillId, List<string> Answers);


        // ========= PRIVATE HELPER =========
        private static ExamDto ConvertToDto(Exam exam)
        {
            return new ExamDto
            {
                ExamId = exam.ExamId,
                ExamName = exam.ExamName,
                ExamType = exam.ExamType,
                CreatedAt = exam.CreatedAt,
                Readings = exam.Readings?.Select(r => new ReadingDto
                {
                    ReadingId = r.ReadingId,
                    ExamId = r.ExamId,
                    ReadingContent = r.ReadingContent,
                    ReadingQuestion = r.ReadingQuestion,
                    ReadingType = r.ReadingType,
                    DisplayOrder = r.DisplayOrder,
                    CreatedAt = r.CreatedAt,
                    CorrectAnswer = r.CorrectAnswer,
                    QuestionHtml = r.QuestionHtml
                }).ToList() ?? new List<ReadingDto>(),

                Listenings = exam.Listenings?.Select(r => new ListeningDto
                {
                    ListeningId = r.ListeningId,
                    ExamId = r.ExamId,
                    ListeningContent = r.ListeningContent,
                    ListeningQuestion = r.ListeningQuestion,
                    ListeningType = r.ListeningType,
                    DisplayOrder = r.DisplayOrder,
                    CreatedAt = r.CreatedAt,
                    CorrectAnswer = r.CorrectAnswer,
                    QuestionHtml = r.QuestionHtml
                }).ToList() ?? new List<ListeningDto>(),
                Speakings = exam.Speakings ?? new List<Speaking>(),
                Writings = exam.Writings?.Select(r => new WritingDTO
                {
                    WritingId = r.WritingId,
                    ExamId = r.ExamId,
                    WritingQuestion = r.WritingQuestion,
                    DisplayOrder = r.DisplayOrder,
                    CreatedAt = r.CreatedAt
                }).ToList() ?? new List<WritingDTO>()
            };
        }
    }
}
