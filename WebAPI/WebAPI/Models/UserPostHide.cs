using System;

namespace WebAPI.Models
{
    public partial class UserPostHide
    {
        public int UserPostHideId { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime HiddenAt { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Post Post { get; set; } = null!;
    }
}
