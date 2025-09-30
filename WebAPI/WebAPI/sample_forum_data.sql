-- Insert sample tags
INSERT INTO Tag (tag_name) VALUES 
('IELTS'), ('Speaking'), ('Writing'), ('Reading'), ('Listening'),
('Vocabulary'), ('Grammar'), ('Confidence'), ('Apps'), ('Recommendations');

-- Insert sample posts
INSERT INTO Post (user_id, title, content, created_at, view_count) VALUES 
(1, 'How to improve English speaking confidence?', 'I have been studying English for 2 years but I still feel nervous when speaking. What are some effective ways to build confidence in speaking English?', SYSDATETIME(), 125),
(1, 'Best apps for vocabulary building', 'Can anyone recommend good mobile apps for building vocabulary? I am preparing for IELTS and need to expand my word bank.', SYSDATETIME(), 89),
(1, 'IELTS Writing Task 2: Common mistakes to avoid', 'What are the most common mistakes students make in IELTS Writing Task 2? Please share your experience and tips.', SYSDATETIME(), 156);

-- Insert sample comments
INSERT INTO Comment (post_id, user_id, content, created_at, like_number) VALUES 
(1, 1, 'Practice speaking with native speakers on language exchange apps like HelloTalk or Tandem.', SYSDATETIME(), 5),
(1, 1, 'Record yourself speaking and listen back to identify areas for improvement.', SYSDATETIME(), 3),
(2, 1, 'I recommend Anki for spaced repetition learning. It''s very effective for vocabulary.', SYSDATETIME(), 8),
(2, 1, 'Quizlet is also great for creating custom vocabulary sets.', SYSDATETIME(), 4);

-- Insert post-tag relationships
INSERT INTO Post_Tag (post_id, tag_id) VALUES 
(1, 1), (1, 2), (1, 8),  -- IELTS, Speaking, Confidence
(2, 1), (2, 6), (2, 9),  -- IELTS, Vocabulary, Apps  
(3, 1), (3, 4), (3, 10); -- IELTS, Writing, Recommendations

-- Insert sample post likes
INSERT INTO PostLike (post_id, user_id, created_at) VALUES 
(1, 1, SYSDATETIME()),
(2, 1, SYSDATETIME()),
(3, 1, SYSDATETIME());
