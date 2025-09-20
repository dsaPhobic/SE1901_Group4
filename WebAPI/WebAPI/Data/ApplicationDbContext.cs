using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        //public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        //{

        //}
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Exam> Exam { get; set; }
        public virtual DbSet<ExamItem> ExamItem { get; set; }
        public virtual DbSet<ExamAttempt> ExamAttempt { get; set; }
        public virtual DbSet<ExamAnswer> ExamAnswer { get; set; }
        public virtual DbSet<Reading> Reading { get; set; }
        public virtual DbSet<Listening> Listening { get; set; }
        public virtual DbSet<Writing> Writing { get; set; }
        public virtual DbSet<Speaking> Speaking { get; set; }
        public virtual DbSet<VocabGroup> VocabGroup { get; set; }
        public virtual DbSet<Word> Word { get; set; }
        public virtual DbSet<Report> Report { get; set; }
        public virtual DbSet<Transaction> Transaction { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<Post> Post { get; set; }
        public virtual DbSet<Comment> Comment { get; set; }
        public virtual DbSet<Tag> Tag { get; set; }
        public virtual DbSet<PostLike> PostLike { get; set; }
    }
}
