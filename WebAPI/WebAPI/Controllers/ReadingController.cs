using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReadingController : ControllerBase
    {
        private readonly IReadingService _readingService;

        public ReadingController(IReadingService service)
        {
            _readingService = service;
        }

        // Create a new reading question (admin only)
        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult<ReadingDto> Create([FromBody] CreateReadingDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            var result = _readingService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.ReadingId }, result);
        }

        // Get one reading question by id
        [HttpGet("{id}")]
        public ActionResult<ReadingDto> GetById(int id)
        {
            var result = _readingService.GetById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Get all reading questions for an exam
        [HttpGet("exam/{examId}")]
        public ActionResult<IEnumerable<ReadingDto>> GetByExam(int examId)
        {
            var list = _readingService.GetByExam(examId);
            return Ok(list);
        }

        // Update a reading question (admin only)
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public ActionResult<ReadingDto> Update(int id, [FromBody] UpdateReadingDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            var result = _readingService.Update(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Delete a reading question
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            var deleted = _readingService.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
