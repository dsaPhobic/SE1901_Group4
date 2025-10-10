using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebAPI.Models
{
    public class WritingFeedback
    {
        [Key]
        public int FeedbackId { get; set; }

        [ForeignKey("ExamAttempt")]
        public long AttemptId { get; set; }

        [ForeignKey("Writing")]
        public int WritingId { get; set; }

        public decimal? TaskAchievement { get; set; }
        public decimal? CoherenceCohesion { get; set; }
        public decimal? LexicalResource { get; set; }
        public decimal? GrammarAccuracy { get; set; }
        public decimal? Overall { get; set; }

        public string? GrammarVocabJson { get; set; }   
        public string? FeedbackSections { get; set; }   
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Writing? Writing { get; set; }
        public ExamAttempt? ExamAttempt { get; set; }
    }
}
