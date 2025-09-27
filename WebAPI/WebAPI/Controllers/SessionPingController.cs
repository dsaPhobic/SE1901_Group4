using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("session-ping")]
    public class SessionPingController : ControllerBase
    {
        [HttpGet("set/{val}")]
        public IActionResult Set(string val)
        {
            HttpContext.Session.SetString("ping", val);
            return Ok(new { saved = val });
        }

        [HttpGet("get")]
        public IActionResult Get()
        {
            var v = HttpContext.Session.GetString("ping");
            return Ok(new { ping = v });
        }
    }
}
