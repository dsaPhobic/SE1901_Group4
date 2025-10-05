using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;
using WebAPI.Data;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ApplicationDbContext _db;

        public AdminController(IUserService userService, ApplicationDbContext db)
        {
            _userService = userService;
            _db = db;
        }

        [HttpPost("register-admin")]
        public ActionResult<UserDTO> RegisterAdmin([FromBody] RegisterRequestDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = _userService.RegisterAdmin(dto);
                return Created("", ToDto(user));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPut("grant/{userId}")]
        [Authorize(Roles = "admin")]
        public IActionResult GrantRole(int userId, [FromQuery] string role)
        {
            var target = _userService.GetById(userId);
            if (target == null)
                return NotFound("User not found.");

            if (target.Role == "admin")
                return BadRequest("Cannot modify another admin.");

            if (role != "user" && role != "moderator")
                return BadRequest("Invalid role. Allowed values: user, moderator.");

            target.Role = role;
            _userService.Update(target);

            return Ok(new { message = $"User {target.Username} is now a {target.Role}." });
        }

        [HttpGet("users")]
        [Authorize(Roles = "admin")]
        public ActionResult<IEnumerable<UserDTO>> GetAllUsers()
        {
            var users = _userService.GetAll().Select(ToDto).ToList();
            return Ok(users);
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "admin")]
        public ActionResult<UserDTO> GetUserById(int userId)
        {
            var target = _userService.GetById(userId);
            if (target == null)
                return NotFound("User not found.");

            return Ok(ToDto(target));
        }

        [HttpGet("dashboard")]
        [Authorize(Roles = "admin")]
        public IActionResult GetDashboardStats()
        {
            var totalUsers = _db.User.Count();
            var totalExams = _db.Exam.Count();
            var totalTransactions = _db.Transaction.Where(t => t.Status == "PAID").Sum(t => (decimal?)t.Amount) ?? 0;
            var totalAttempts = _db.ExamAttempt.Count();

            return Ok(new
            {
                totalUsers,
                totalExams,
                totalTransactions,
                totalAttempts
            });
        }

        [HttpGet("dashboard/sales-trend")]
        [Authorize(Roles = "admin")]
        public IActionResult GetSalesTrend()
        {
            var monthlySales = _db.Transaction
                .Where(t => t.Status == "PAID")
                .GroupBy(t => new { t.CreatedAt.Year, t.CreatedAt.Month })
                .Select(g => new
                {
                    year = g.Key.Year,
                    month = g.Key.Month,
                    total = g.Sum(x => x.Amount)
                })
                .OrderBy(g => g.year)
                .ThenBy(g => g.month)
                .ToList();

            return Ok(monthlySales);
        }

        private static UserDTO ToDto(User user) => new UserDTO
        {
            UserId = user.UserId,
            Username = user.Username,
            Email = user.Email,
            Firstname = user.Firstname,
            Lastname = user.Lastname,
            Role = user.Role
        };
    }
}
