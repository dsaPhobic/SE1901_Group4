-- Add Title and ViewCount columns to Post table
ALTER TABLE Post ADD Title NVARCHAR(200) NOT NULL DEFAULT 'Untitled';
ALTER TABLE Post ADD UpdatedAt DATETIME2(0) NULL;
ALTER TABLE Post ADD ViewCount INT NULL DEFAULT 0;

-- Update existing posts to have a default title
UPDATE Post SET Title = 'Question about ' + CAST(PostId AS NVARCHAR(10)) WHERE Title = 'Untitled';
