using System;

namespace WebAPI.Models
{
    public class UserSignInHistory
    {
        public int SigninId { get; set; }
        public int UserId { get; set; }
        public string? IpAddress { get; set; }
        public string? DeviceInfo { get; set; }
        public string? Location { get; set; }
        public DateTime SignedInAt { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
