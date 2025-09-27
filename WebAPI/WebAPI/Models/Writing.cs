

namespace WebAPI.Models
{

    public class Writing
    {
        public int WritingId { get; set; }

        public string WritingQuestion { get; set; } = null!;

        public string? WritingType { get; set; }
    }
}
