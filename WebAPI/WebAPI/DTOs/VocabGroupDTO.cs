namespace WebAPI.DTOs
{
    public class VocabGroupDto
    {
        public int GroupId { get; set; }
        public string Groupname { get; set; } = null!;
        public int UserId { get; set; }
        public DateTime? CreatedAt { get; set; }

        // chỉ cần trả ra list WordIds thay vì nguyên object Word
        public List<int> WordIds { get; set; } = new();
    }
}
