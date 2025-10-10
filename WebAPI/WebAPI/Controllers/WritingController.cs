using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebAPI.DTOs;
using WebAPI.Services;
using WebAPI.ExternalServices;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WritingController : ControllerBase
    {
        private readonly IWritingService _writingService;
        private readonly OpenAIService _aiService;

        public WritingController(IWritingService service, OpenAIService aiService)
        {
            _writingService = service;
            _aiService = aiService;
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<WritingDTO> Create([FromBody] WritingDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid payload.");
            var result = _writingService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.WritingId }, result);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public ActionResult<WritingDTO> GetById(int id)
        {
            var result = _writingService.GetById(id);
            if (result == null)
                return NotFound();
            return Ok(result);
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
            if (dto == null)
                return BadRequest("Invalid payload.");
            var result = _writingService.Update(id, dto);
            if (result == null)
                return NotFound();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var deleted = _writingService.Delete(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }

      /*  [HttpPost("grade")]
        [AllowAnonymous]
        public IActionResult GradeWriting([FromBody] WritingSubmissionDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Answer))
                return BadRequest("Answer cannot be empty.");

            try
            {
                var result = _aiService.GradeWriting(dto.Question, dto.Answer);

                var json = JsonDocument.Parse(result.RootElement.GetRawText());
                var response = JsonSerializer.Deserialize<object>(json.RootElement.GetRawText());

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }*/
    }
}
