using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WebAPI.DTOs;
using WebAPI.Models;
using WebAPI.Services;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        const string callbackPath = "";
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public ActionResult<UserDTO> Register([FromBody] RegisterRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = _userService.Register(dto);
                HttpContext.Session.SetInt32("UserId", user.UserId);
                return Created("", ToDto(user));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        [HttpPost("login")]
        public ActionResult<UserDTO> Login([FromBody] LoginRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = _userService.Authenticate(dto.Email, dto.Password);
            if (user == null) return Unauthorized("Invalid email or password");

            HttpContext.Session.SetInt32("UserId", user.UserId);
            return Ok(ToDto(user));
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("UserId");
            return Ok("Logged out successfully");
        }

        // 👉 Nút login Google sẽ gọi thẳng vào đây
        [HttpGet("google/login")]
        public IActionResult GoogleLogin()
        {
            // RedirectUri = action mình muốn chạy sau khi Google auth xong
            var redirectUrl = Url.Action("GoogleResponse", "Auth");
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, "Google");
        }

        [HttpGet("google/response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync("Cookies");
            if (!result.Succeeded) return Unauthorized();

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims.ToList();
            var email = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var name = claims?.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value;

            if (email == null) return BadRequest("Google did not return email");

            var user = _userService.GetByEmail(email);
            if (user == null)
            {
                user = new User
                {
                    Username = email.Split('@')[0],
                    Email = email,
                    Firstname = name ?? "",
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                };
                _userService.Register(new RegisterRequestDTO
                {
                    Username = user.Username,
                    Email = user.Email,
                    Password = Guid.NewGuid().ToString(),
                    Firstname = user.Firstname,
                    Lastname = user.Lastname
                });
                user = _userService.GetByEmail(email)!;
            }

            HttpContext.Session.SetInt32("UserId", user.UserId);

            // redirect lại FE
            return Redirect($"http://localhost:5173?login=success&email={user.Email}&username={user.Username}");
        }

        [HttpGet("me")]
        public ActionResult<UserDTO> Me()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized();

            var user = _userService.GetById(userId.Value);
            if (user == null) return Unauthorized();

            return Ok(ToDto(user));
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
