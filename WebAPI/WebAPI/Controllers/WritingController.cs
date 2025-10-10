using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WritingController : ControllerBase
    {
        private readonly IWritingService _writingService;

        public WritingController(IWritingService writingService)
        {
            _writingService = writingService;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<WritingDTO> Create([FromBody] WritingDTO dto)
        {
            if (dto == null) return BadRequest("Invalid payload.");
            var result = _writingService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.WritingId }, result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public ActionResult<WritingDTO> GetById(int id)
        {
            var result = _writingService.GetById(id);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpGet("exam/{examId}")]
        [AllowAnonymous]
        public ActionResult<IEnumerable<WritingDTO>> GetByExam(int examId)
        {
            var list = _writingService.GetByExam(examId);
            return Ok(list);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public ActionResult<WritingDTO> Update(int id, [FromBody] WritingDTO dto)
        {
            var result = _writingService.Update(id, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var deleted = _writingService.Delete(id);
            return deleted ? NoContent() : NotFound();
        }


        [HttpPost("grade")]
        [AllowAnonymous]
        public IActionResult GradeWriting([FromBody] WritingGradeRequestDTO dto)
        {
            if (dto == null || dto.Answers == null || dto.Answers.Count == 0)
                return BadRequest("Invalid or empty answers.");

            try
            {
                var userIdStr = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;
                if (userIdStr == null) return Unauthorized("User not logged in.");
                int userId = int.Parse(userIdStr);

                var result = _writingService.GradeWriting(dto, userId);

                var parsed = JsonDocument.Parse(result.RootElement.GetRawText());
                return Ok(parsed);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }


    }
}
