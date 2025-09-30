using Microsoft.EntityFrameworkCore;
using WebAPI.Models;

namespace WebAPI.Data
{
  
    public partial class ApplicationDbContext : DbContext
    {
        
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
        public virtual DbSet<Post_Tag> Post_Tag { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.CommentId).HasName("PK__Comment__E7957687C296B01F");

                entity.ToTable("Comment");

                entity.Property(e => e.CommentId).HasColumnName("comment_id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.LikeNumber).HasColumnName("like_number");
                entity.Property(e => e.ParentCommentId).HasColumnName("parent_comment_id");
                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.ParentComment).WithMany(p => p.InverseParentComment)
                    .HasForeignKey(d => d.ParentCommentId)
                    .HasConstraintName("FK__Comment__parent___778AC167");

                entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                    .HasForeignKey(d => d.PostId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Comment__post_id__75A278F5");

                entity.HasOne(d => d.User).WithMany(p => p.Comments)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Comment__user_id__76969D2E");
            });

            modelBuilder.Entity<Exam>(entity =>
            {
                entity.HasKey(e => e.ExamId).HasName("PK__Exam__9C8C7BE9C702D48D");

                entity.ToTable("Exam");

                entity.Property(e => e.ExamId).HasColumnName("exam_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.ExamName)
                    .HasMaxLength(100)
                    .HasColumnName("exam_name");
                entity.Property(e => e.ExamType)
                    .HasMaxLength(20)
                    .HasColumnName("exam_type");
            });

            modelBuilder.Entity<ExamAnswer>(entity =>
            {
                entity.HasKey(e => e.AnswerId).HasName("PK__ExamAnsw__33724318BE69D9A4");

                entity.ToTable("ExamAnswer");

                entity.HasIndex(e => new { e.AttemptId, e.ItemId }, "UX_ExamAnswer").IsUnique();

                entity.Property(e => e.AnswerId).HasColumnName("answer_id");
                entity.Property(e => e.AnswerBlob)
                    .HasMaxLength(512)
                    .HasColumnName("answer_blob");
                entity.Property(e => e.AnswerText).HasColumnName("answer_text");
                entity.Property(e => e.AttemptId).HasColumnName("attempt_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.IsCorrect).HasColumnName("is_correct");
                entity.Property(e => e.ItemId).HasColumnName("item_id");
                entity.Property(e => e.Score)
                    .HasColumnType("decimal(5, 2)")
                    .HasColumnName("score");

                entity.HasOne(d => d.Attempt).WithMany(p => p.ExamAnswers)
                    .HasForeignKey(d => d.AttemptId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ExamAnswe__attem__49C3F6B7");

                entity.HasOne(d => d.Item).WithMany(p => p.ExamAnswers)
                    .HasForeignKey(d => d.ItemId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ExamAnswe__item___4AB81AF0");
            });

            modelBuilder.Entity<ExamAttempt>(entity =>
            {
                entity.HasKey(e => e.AttemptId).HasName("PK__ExamAtte__5621F949E731502E");

                entity.ToTable("ExamAttempt");

                entity.Property(e => e.AttemptId).HasColumnName("attempt_id");
                entity.Property(e => e.ExamId).HasColumnName("exam_id");
                entity.Property(e => e.StartedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("started_at");
                entity.Property(e => e.SubmittedAt)
                    .HasPrecision(0)
                    .HasColumnName("submitted_at");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Exam).WithMany(p => p.ExamAttempts)
                    .HasForeignKey(d => d.ExamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ExamAttem__exam___440B1D61");

                entity.HasOne(d => d.User).WithMany(p => p.ExamAttempts)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ExamAttem__user___44FF419A");
            });

            modelBuilder.Entity<ExamItem>(entity =>
            {
                entity.HasKey(e => e.ItemId).HasName("PK__ExamItem__52020FDD4B58908D");

                entity.ToTable("ExamItem");

                entity.HasIndex(e => new { e.ExamId, e.DisplayOrder }, "IX_ExamItem_exam");

                entity.Property(e => e.ItemId).HasColumnName("item_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.DisplayOrder).HasColumnName("display_order");
                entity.Property(e => e.ExamId).HasColumnName("exam_id");
                entity.Property(e => e.RefId).HasColumnName("ref_id");
                entity.Property(e => e.RefTable)
                    .HasMaxLength(20)
                    .HasColumnName("ref_table");

                entity.HasOne(d => d.Exam).WithMany(p => p.ExamItems)
                    .HasForeignKey(d => d.ExamId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ExamItem__exam_i__403A8C7D");
            });

            modelBuilder.Entity<Listening>(entity =>
            {
                entity.HasKey(e => e.ListeningId).HasName("PK__Listenin__91F7AA8D0A88C3A8");

                entity.ToTable("Listening");

                entity.Property(e => e.ListeningId).HasColumnName("listening_id");
                entity.Property(e => e.ListeningContent).HasColumnName("listening_content");
                entity.Property(e => e.ListeningQuestion).HasColumnName("listening_question");
                entity.Property(e => e.ListeningType)
                    .HasMaxLength(50)
                    .HasColumnName("listening_type");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.NotificationId).HasName("PK__Notifica__E059842F0D1EAED9");

                entity.ToTable("Notification");

                entity.Property(e => e.NotificationId).HasColumnName("notification_id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.IsRead).HasColumnName("is_read");
                entity.Property(e => e.Type)
                    .HasMaxLength(30)
                    .HasColumnName("type");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User).WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Notificat__user___6D0D32F4");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.PostId).HasName("PK__Post__3ED787666EAF0D81");

                entity.ToTable("Post");

                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.Title)
                    .HasMaxLength(200)
                    .HasColumnName("title");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.UpdatedAt)
                    .HasPrecision(0)
                    .HasColumnName("updated_at");
                entity.Property(e => e.ViewCount).HasColumnName("view_count");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User).WithMany(p => p.Posts)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Post__user_id__71D1E811");

                entity.HasMany(d => d.Tags).WithMany(p => p.Posts)
                    .UsingEntity<Dictionary<string, object>>(
                        "PostTag",
                        r => r.HasOne<Tag>().WithMany()
                            .HasForeignKey("TagId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__Post_Tag__tag_id__00200768"),
                        l => l.HasOne<Post>().WithMany()
                            .HasForeignKey("PostId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__Post_Tag__post_i__7F2BE32F"),
                        j =>
                        {
                            j.HasKey("PostId", "TagId").HasName("PK__Post_Tag__4AFEED4D40095113");
                            j.ToTable("Post_Tag");
                            j.IndexerProperty<int>("PostId").HasColumnName("post_id");
                            j.IndexerProperty<int>("TagId").HasColumnName("tag_id");
                        });
            });

            modelBuilder.Entity<PostLike>(entity =>
            {
                entity.HasKey(e => new { e.PostId, e.UserId }).HasName("PK__PostLike__D54C641668B8C345");

                entity.ToTable("PostLike");

                entity.Property(e => e.PostId).HasColumnName("post_id");
                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");

                entity.HasOne(d => d.Post).WithMany(p => p.PostLikes)
                    .HasForeignKey(d => d.PostId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PostLike__post_i__02FC7413");

                entity.HasOne(d => d.User).WithMany(p => p.PostLikes)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__PostLike__user_i__03F0984C");
            });

            modelBuilder.Entity<Reading>(entity =>
            {
                entity.HasKey(e => e.ReadingId).HasName("PK__Reading__8091F95A2F1FB203");

                entity.ToTable("Reading");

                entity.Property(e => e.ReadingId).HasColumnName("reading_id");
                entity.Property(e => e.ReadingContent).HasColumnName("reading_content");
                entity.Property(e => e.ReadingQuestion).HasColumnName("reading_question");
                entity.Property(e => e.ReadingType)
                    .HasMaxLength(50)
                    .HasColumnName("reading_type");
            });

            modelBuilder.Entity<Report>(entity =>
            {
                entity.HasKey(e => e.ReportId).HasName("PK__Report__779B7C589EC9B5E3");

                entity.ToTable("Report");

                entity.Property(e => e.ReportId).HasColumnName("report_id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.Status)
                    .HasMaxLength(50)
                    .HasDefaultValue("Pending")
                    .HasColumnName("status");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User).WithMany(p => p.Reports)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Report__user_id__60A75C0F");
            });

            modelBuilder.Entity<Speaking>(entity =>
            {
                entity.HasKey(e => e.SpeakingId).HasName("PK__Speaking__598C6973C5D9136A");

                entity.ToTable("Speaking");

                entity.Property(e => e.SpeakingId).HasColumnName("speaking_id");
                entity.Property(e => e.SpeakingQuestion).HasColumnName("speaking_question");
                entity.Property(e => e.SpeakingType)
                    .HasMaxLength(50)
                    .HasColumnName("speaking_type");
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.TagId).HasName("PK__Tag__4296A2B65970D7BC");

                entity.ToTable("Tag");

                entity.HasIndex(e => e.TagName, "UQ__Tag__E298655CA5EF38BD").IsUnique();

                entity.Property(e => e.TagId).HasColumnName("tag_id");
                entity.Property(e => e.TagName)
                    .HasMaxLength(50)
                    .HasColumnName("tag_name");
            });

            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.TransactionId).HasName("PK__Transact__85C600AF72F38544");

                entity.ToTable("Transactions");

                entity.Property(e => e.TransactionId).HasColumnName("transaction_id");
                entity.Property(e => e.Amount)
                    .HasColumnType("decimal(18, 2)")
                    .HasColumnName("amount");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.Currency)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasDefaultValue("VND")
                    .IsFixedLength()
                    .HasColumnName("currency");
                entity.Property(e => e.PaymentMethod)
                    .HasMaxLength(30)
                    .HasColumnName("payment_method");
                entity.Property(e => e.ProviderTxnId)
                    .HasMaxLength(100)
                    .HasColumnName("provider_txn_id");
                entity.Property(e => e.Purpose)
                    .HasMaxLength(50)
                    .HasDefaultValue("VIP")
                    .HasColumnName("purpose");
                entity.Property(e => e.Status)
                    .HasMaxLength(20)
                    .HasDefaultValue("PENDING")
                    .HasColumnName("status");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User).WithMany(p => p.Transactions)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Transacti__user___656C112C");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId).HasName("PK__Users__B9BE370F8208A11F");

                entity.ToTable("Users");

                entity.HasIndex(e => e.Email, "UQ__Users__AB6E616418A9BBE3").IsUnique();

                entity.HasIndex(e => e.Username, "UQ__Users__F3DBC572977AB95F").IsUnique();

                entity.Property(e => e.UserId).HasColumnName("user_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.Email)
                    .HasMaxLength(150)
                    .HasColumnName("email");
                entity.Property(e => e.Firstname)
                    .HasMaxLength(100)
                    .HasColumnName("firstname");
                entity.Property(e => e.Lastname)
                    .HasMaxLength(100)
                    .HasColumnName("lastname");
                entity.Property(e => e.PasswordHash)
                    .HasMaxLength(256)
                    .HasColumnName("password_hash");
                entity.Property(e => e.PasswordSalt)
                    .HasMaxLength(128)
                    .HasColumnName("password_salt");
                entity.Property(e => e.Role)
                    .HasMaxLength(50)
                    .HasDefaultValue("user")
                    .HasColumnName("role");
                entity.Property(e => e.UpdatedAt)
                    .HasPrecision(0)
                    .HasColumnName("updated_at");
                entity.Property(e => e.Username)
                    .HasMaxLength(100)
                    .HasColumnName("username");
            });

            modelBuilder.Entity<VocabGroup>(entity =>
            {
                entity.HasKey(e => e.GroupId).HasName("PK__VocabGro__D57795A0AB20D47E");

                entity.ToTable("VocabGroup");

                entity.HasIndex(e => new { e.UserId, e.Groupname }, "UX_group_user").IsUnique();

                entity.Property(e => e.GroupId).HasColumnName("group_id");
                entity.Property(e => e.CreatedAt)
                    .HasPrecision(0)
                    .HasDefaultValueSql("(sysdatetime())")
                    .HasColumnName("created_at");
                entity.Property(e => e.Groupname)
                    .HasMaxLength(100)
                    .HasColumnName("groupname");
                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User).WithMany(p => p.VocabGroups)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__VocabGrou__user___571DF1D5");

                entity.HasMany(d => d.Words).WithMany(p => p.Groups)
                    .UsingEntity<Dictionary<string, object>>(
                        "VocabGroupWord",
                        r => r.HasOne<Word>().WithMany()
                            .HasForeignKey("WordId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__VocabGrou__word___5DCAEF64"),
                        l => l.HasOne<VocabGroup>().WithMany()
                            .HasForeignKey("GroupId")
                            .OnDelete(DeleteBehavior.ClientSetNull)
                            .HasConstraintName("FK__VocabGrou__group__5CD6CB2B"),
                        j =>
                        {
                            j.HasKey("GroupId", "WordId").HasName("PK__VocabGro__C2883474CEDF8177");
                            j.ToTable("VocabGroup_Word");
                            j.IndexerProperty<int>("GroupId").HasColumnName("group_id");
                            j.IndexerProperty<int>("WordId").HasColumnName("word_id");
                        });
            });

            modelBuilder.Entity<Word>(entity =>
            {
                entity.HasKey(e => e.WordId).HasName("PK__Word__7FFA1D4039C4B1A6");

                entity.ToTable("Word");

                entity.Property(e => e.WordId).HasColumnName("word_id");
                entity.Property(e => e.Audio)
                    .HasMaxLength(512)
                    .HasColumnName("audio");
                entity.Property(e => e.Example).HasColumnName("example");
                entity.Property(e => e.Meaning)
                    .HasMaxLength(255)
                    .HasColumnName("meaning");
                entity.Property(e => e.Word1)
                    .HasMaxLength(100)
                    .HasColumnName("word");
            });

            modelBuilder.Entity<Writing>(entity =>
            {
                entity.HasKey(e => e.WritingId).HasName("PK__Writing__4AE2633EE8B92172");

                entity.ToTable("Writing");

                entity.Property(e => e.WritingId).HasColumnName("writing_id");
                entity.Property(e => e.WritingQuestion).HasColumnName("writing_question");
                entity.Property(e => e.WritingType)
                    .HasMaxLength(50)
                    .HasColumnName("writing_type");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}