using Microsoft.AspNetCore.Mvc;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _users;
        public UserController(IUserService users) => _users = users;

        // GET /users/me
        [HttpGet("profile")]
        public ActionResult<UserDTO> GetProfile()
        {
            var uid = HttpContext.Session.GetInt32("UserId");
            if (uid == null) return Unauthorized("Chưa đăng nhập");

            var user = _users.GetById(uid.Value);
            if (user == null) return NotFound("Không tìm thấy user");

            return new UserDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Role = user.Role
            };
        }

        // GET /users/{id}
        [HttpGet("{id:int}")]
        public ActionResult<UserDTO> GetById(int id)
        {
            var user = _users.GetById(id);
            if (user == null) return NotFound("Không tìm thấy user");

            return new UserDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Role = user.Role
            };
        }

        // POST /users  (register)
        [HttpPost]
        public ActionResult<UserDTO> Register([FromBody] RegisterRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = _users.Register(dto);
                var result = new UserDTO
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    Firstname = user.Firstname,
                    Lastname = user.Lastname,
                    Role = user.Role
                };
                return CreatedAtAction(nameof(GetById), new { id = user.UserId }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // PUT /users/{id}
        [HttpPut("{id:int}")]       
        public IActionResult Update(int id, [FromBody] UpdateUserDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var currentId = HttpContext.Session.GetInt32("UserId");
            if (currentId == null) return Unauthorized("Chưa đăng nhập");

            try
            {
                _users.Update(id, dto, currentId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                // either not logged in or not permitted
                return Forbid(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // DELETE /users/{id}
        [HttpDelete("{id:int}")]
        public IActionResult Delete(int id)
        {
            var currentId = HttpContext.Session.GetInt32("UserId");
            if (currentId == null) return Unauthorized("Chưa đăng nhập");

            try
            {
                _users.Delete(id, currentId.Value);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
        }
    }
}
