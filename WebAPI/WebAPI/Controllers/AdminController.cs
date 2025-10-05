using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;

        public AdminController(IUserService userService)
        {
            _userService = userService;
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

        // ✅ CHỈ ADMIN XEM TOÀN BỘ USER
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
