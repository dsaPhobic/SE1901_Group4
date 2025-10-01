using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/exam")]
    public class ExamController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ExamController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("submitted-days")]
        public async Task<IActionResult> GetSubmittedDays()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var today = DateTime.UtcNow;
            var firstDayOfMonth = new DateTime(today.Year, today.Month, 1);
            var firstDayNextMonth = firstDayOfMonth.AddMonths(1);

            var submitted = await _db.ExamAttempt
             .Where(a => a.UserId == userId
             && a.SubmittedAt != null
             && a.StartedAt >= firstDayOfMonth
             && a.StartedAt < firstDayNextMonth)
            .Select(a => a.StartedAt.Date)
            .Distinct()
            .ToListAsync();

            return Ok(submitted.Select(d => d.ToString("yyyy-MM-dd")));

        }
    }
}
