-- ===========================================
-- USERS
-- ===========================================
CREATE TABLE Users (
    user_id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(100) NOT NULL UNIQUE,
    email NVARCHAR(150) NOT NULL UNIQUE,
    password_hash VARBINARY(256) NOT NULL,
    password_salt VARBINARY(128) NOT NULL,
    firstname NVARCHAR(100) NULL,
    lastname NVARCHAR(100) NULL,
    role NVARCHAR(50) NOT NULL DEFAULT N'user',
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2(0) NULL
);

-- ===========================================
-- EXAM CORE STRUCTURE
-- ===========================================
CREATE TABLE Exam (
    exam_id INT IDENTITY PRIMARY KEY,
    exam_type NVARCHAR(20) NOT NULL CHECK (exam_type IN ('Reading','Listening','Writing','Speaking')),
    exam_name NVARCHAR(100) NOT NULL,
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE ExamItem (
    item_id INT IDENTITY PRIMARY KEY,
    exam_id INT NOT NULL FOREIGN KEY REFERENCES Exam(exam_id),
    ref_table NVARCHAR(20) NOT NULL, 
    ref_id INT NOT NULL,
    display_order INT NOT NULL,
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

CREATE INDEX IX_ExamItem_exam ON ExamItem(exam_id, display_order);

CREATE TABLE ExamAttempt (
    attempt_id BIGINT IDENTITY PRIMARY KEY,
    exam_id INT NOT NULL FOREIGN KEY REFERENCES Exam(exam_id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    started_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    submitted_at DATETIME2(0) NULL
);

CREATE TABLE ExamAnswer (
    answer_id BIGINT IDENTITY PRIMARY KEY,
    attempt_id BIGINT NOT NULL FOREIGN KEY REFERENCES ExamAttempt(attempt_id),
    item_id INT NOT NULL FOREIGN KEY REFERENCES ExamItem(item_id),
    answer_text NVARCHAR(MAX) NULL,
    answer_blob NVARCHAR(512) NULL,
    is_correct BIT NULL,
    score DECIMAL(5,2) NULL,
    created_at DATETIME2(0) DEFAULT SYSDATETIME(),
    CONSTRAINT UX_ExamAnswer UNIQUE (attempt_id, item_id)
);

-- ===========================================
-- QUESTION BANKS
-- ===========================================
CREATE TABLE Reading (
    reading_id INT IDENTITY PRIMARY KEY,
    reading_content NVARCHAR(MAX) NOT NULL,
    reading_question NVARCHAR(MAX) NOT NULL,
    reading_type NVARCHAR(50) NULL
);

CREATE TABLE Listening (
    listening_id INT IDENTITY PRIMARY KEY,
    listening_content NVARCHAR(MAX) NOT NULL,
    listening_question NVARCHAR(MAX) NOT NULL,
    listening_type NVARCHAR(50) NULL
);

CREATE TABLE Writing (
    writing_id INT IDENTITY PRIMARY KEY,
    writing_question NVARCHAR(MAX) NOT NULL,
    writing_type NVARCHAR(50) NULL
);

CREATE TABLE Speaking (
    speaking_id INT IDENTITY PRIMARY KEY,
    speaking_question NVARCHAR(MAX) NOT NULL,
    speaking_type NVARCHAR(50) NULL
);

-- ===========================================
-- VOCABULARY
-- ===========================================
CREATE TABLE VocabGroup (
    group_id INT IDENTITY PRIMARY KEY,
    groupname NVARCHAR(100) NOT NULL,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME2(0) DEFAULT SYSDATETIME(),
    CONSTRAINT UX_group_user UNIQUE (user_id, groupname)
);

CREATE TABLE Word (
    word_id INT IDENTITY PRIMARY KEY,
    word NVARCHAR(100) NOT NULL,
    meaning NVARCHAR(255) NULL,
    audio NVARCHAR(512) NULL,
    example NVARCHAR(MAX) NULL
);

CREATE TABLE VocabGroup_Word (
    group_id INT NOT NULL FOREIGN KEY REFERENCES VocabGroup(group_id),
    word_id INT NOT NULL FOREIGN KEY REFERENCES Word(word_id),
    PRIMARY KEY (group_id, word_id)
);

-- ===========================================
-- REPORTS
-- ===========================================
CREATE TABLE Report (
    report_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    content NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(50) NOT NULL DEFAULT N'Pending',
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

-- ===========================================
-- TRANSACTIONS
-- ===========================================
CREATE TABLE Transactions (
    transaction_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    amount DECIMAL(18,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'VND',
    payment_method NVARCHAR(30) NULL,
    provider_txn_id NVARCHAR(100) NULL,
    purpose NVARCHAR(50) NOT NULL DEFAULT N'VIP',
    status NVARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING','PAID','FAILED','REFUNDED')),
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

-- ===========================================
-- NOTIFICATIONS
-- ===========================================
CREATE TABLE Notification (
    notification_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    content NVARCHAR(MAX) NOT NULL,
    type NVARCHAR(30) NULL,
    is_read BIT NOT NULL DEFAULT 0,
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

-- ===========================================
-- FORUM
-- ===========================================
CREATE TABLE Post (
    post_id INT IDENTITY PRIMARY KEY,
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE Comment (
    comment_id INT IDENTITY PRIMARY KEY,
    post_id INT NOT NULL FOREIGN KEY REFERENCES Post(post_id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    parent_comment_id INT NULL FOREIGN KEY REFERENCES Comment(comment_id),
    content NVARCHAR(MAX) NOT NULL,
    like_number INT NOT NULL DEFAULT 0,
    created_at DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE Tag (
    tag_id INT IDENTITY PRIMARY KEY,
    tag_name NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE Post_Tag (
    post_id INT NOT NULL FOREIGN KEY REFERENCES Post(post_id),
    tag_id INT NOT NULL FOREIGN KEY REFERENCES Tag(tag_id),
    PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE PostLike (
    post_id INT NOT NULL FOREIGN KEY REFERENCES Post(post_id),
    user_id INT NOT NULL FOREIGN KEY REFERENCES Users(user_id),
    created_at DATETIME2(0) DEFAULT SYSDATETIME(),
    PRIMARY KEY (post_id, user_id)
);

