using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.DTOs;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<NotificationDTO>> GetNotifications()
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to view notifications");

            var notifications = _context.Notification
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(50)
                .Select(n => new NotificationDTO
                {
                    NotificationId = n.NotificationId,
                    Content = n.Content,
                    Type = n.Type,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt
                })
                .ToList();

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to mark notifications as read");

            var notification = _context.Notification
                .FirstOrDefault(n => n.NotificationId == id && n.UserId == userId);

            if (notification == null) return NotFound("Notification not found");

            notification.IsRead = true;
            _context.SaveChanges();

            return Ok(new { message = "Notification marked as read" });
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNotification(int id)
        {
            var userId = HttpContext.Session.GetInt32("UserId");
            if (userId == null) return Unauthorized("Please login to delete notifications");

            var notification = _context.Notification
                .FirstOrDefault(n => n.NotificationId == id && n.UserId == userId);

            if (notification == null) return NotFound("Notification not found");

            _context.Notification.Remove(notification);
            _context.SaveChanges();

            return Ok(new { message = "Notification deleted" });
        }
    }
}


