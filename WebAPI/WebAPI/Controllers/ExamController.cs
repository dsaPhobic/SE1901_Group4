using Microsoft.AspNetCore.Mvc;
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

    }
}
