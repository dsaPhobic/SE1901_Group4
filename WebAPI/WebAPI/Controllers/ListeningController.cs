using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListeningController : ControllerBase
    {
        private readonly IListeningService _ListeningService;

        public ListeningController(IListeningService service)
        {
            _ListeningService = service;
        }

        // Create a new Listening question (admin only)
        [HttpPost]
        public ActionResult<ListeningDto> Create([FromBody] CreateListeningDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            var result = _ListeningService.Create(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.ListeningId }, result);
        }

        // Get one Listening question by id
        [HttpGet("{id}")]
        public ActionResult<ListeningDto> GetById(int id)
        {
            var result = _ListeningService.GetById(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Get all Listening questions for an exam
        [HttpGet("exam/{examId}")]
        public ActionResult<IEnumerable<ListeningDto>> GetByExam(int examId)
        {
            var list = _ListeningService.GetByExam(examId);
            return Ok(list);
        }

        // Update a Listening question (admin only)
        [HttpPut("{id}")]
        public ActionResult<ListeningDto> Update(int id, [FromBody] UpdateListeningDto dto)
        {
            if (dto == null) return BadRequest("Invalid payload");
            var result = _ListeningService.Update(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Delete a Listening question
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var deleted = _ListeningService.Delete(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
