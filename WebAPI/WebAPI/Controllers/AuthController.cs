using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        // ========== REGISTER ==========
        [HttpPost("register")]
        public ActionResult<UserDTO> Register([FromBody] RegisterRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var user = _userService.Register(dto);
                return Created("", ToDto(user));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        // ========== LOGIN ==========
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login([FromBody] LoginRequestDTO dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = _userService.Authenticate(dto.Email, dto.Password);
            if (user == null) return Unauthorized("Invalid email or password");

            // Tạo claims cho cookie auth
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                });

            return Ok(ToDto(user));
        }

        // ========== LOGOUT ==========
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok("Logged out successfully");
        }

        // ========== ME ==========
        [HttpGet("me")]
        public ActionResult<UserDTO> Me()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
                return Unauthorized();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = _userService.GetById(int.Parse(userId));
            if (user == null) return Unauthorized();

            return Ok(new UserDTO
            {
                UserId = user.UserId,
                Username = user.Username,
                Email = user.Email,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Role = user.Role
            });
        }


        // ========== GOOGLE LOGIN ==========
        [HttpGet("google/login")]
        public IActionResult GoogleLogin()
        {
            var redirectUrl = Url.Action("GoogleResponse", "Auth");
            var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
            return Challenge(properties, "Google");
        }

        [HttpGet("google/response")]
        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync("Google");
            if (!result.Succeeded) return Unauthorized();

            var email = result.Principal.FindFirstValue(ClaimTypes.Email);
            var name = result.Principal.FindFirstValue(ClaimTypes.Name);

            if (email == null) return BadRequest("Google did not return email");

            var user = _userService.GetByEmail(email);
            if (user == null)
            {
                user = _userService.Register(new RegisterRequestDTO
                {
                    Username = email.Split('@')[0],
                    Email = email,
                    Password = Guid.NewGuid().ToString(),
                    Firstname = name ?? "",
                    Lastname = ""
                });
            }

            // Đăng nhập với cookie
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(60)
                });

            return Redirect($"http://localhost:5173?login=success&email={user.Email}&username={user.Username}");
        }

        // ========== HELPER ==========
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
