namespace WebAPI.Models
{
    public class Post_Tag
    {
        public int PostId { get; set; }
        public int TagId { get; set; }
        public virtual Post Post { get; set; } = null!;
        public virtual Tag Tag { get; set; } = null!;
    }
}
