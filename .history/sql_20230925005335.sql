-- CREATE TABLE IF NOT EXISTS Users (
--     Id BLOB NOT NULL PRIMARY KEY,
--     Nickname TEXT NOT NULL UNIQUE,
--     FirstName TEXT,
--     LastName TEXT,
--     Age INTEGER,
--     Gender TEXT,
--     Email TEXT NOT NULL UNIQUE,
--     Password BLOB NOT NULL,
--     profileImg TEXT,
--     Created DATETIME NOT NULL
-- );

-- CREATE TABLE IF NOT EXISTS Categories (
-- Id BLOB NOT NULL PRIMARY KEY,
-- Name TEXT NOT NULL UNIQUE,
-- Description TEXT NOT NULL,
-- Created DATETIME NOT NULL
-- );

-- DROP TABLE Posts;

-- CREATE TABLE Posts (
-- Id BLOB NOT NULL PRIMARY KEY,
-- Title TEXT NOT NULL,
-- Body TEXT NOT NULL ,
-- UserId BLOB,
-- Created DATETIME NOT NULL,
-- FOREIGN KEY (UserId) REFERENCES Users(Id)
-- );

-- DROP TABLE  Comments;
-- CREATE TABLE IF NOT EXISTS Comments (
-- Id BLOB NOT NULL PRIMARY KEY,
-- Body TEXT NOT NULL ,
-- UserId BLOB,
-- PostId BLOB,
-- Created DATETIME NOT NULL,
-- FOREIGN KEY (UserId) REFERENCES Users(Id),
-- FOREIGN KEY (PostId) REFERENCES Posts(Id)
-- );

-- CREATE TABLE IF NOT EXISTS Sessions (
--   Id BLOB NOT NULL PRIMARY KEY,
--   user TEXT NOT NULL,
--   expires DATETIME NOT NULL,
--   userId BLOB,
--   UNIQUE (userId),
--   FOREIGN KEY (userId) REFERENCES Users(Id)
-- );

-- CREATE TABLE IF NOT EXISTS PostCat (
--     PostId BLOB,
--     CatId BLOB,
--     PRIMARY KEY (PostId, CatId),
--     FOREIGN KEY (PostId) REFERENCES Posts(Id),
--     FOREIGN KEY (CatID) REFERENCES Categories(Id)


-- );

-- DROP TABLE Posts;

-- CREATE TABLE IF NOT EXISTS Likes (
--     UserId BLOB,
--     PostId BLOB,
--     Liked BOOL,
--     Disliked BOOL,
--     PRIMARY KEY (UserId, PostId),
--     FOREIGN KEY (PostId) REFERENCES Posts(Id),
--     FOREIGN KEY (UserID) REFERENCES User(Id)

--     );

CREATE TABLE IF NOT EXISTS  CommentLikes (
    UserId BLOB,
    CommentId BLOB,
    Liked BOOL,
    Disliked BOOL,
    PRIMARY KEY (UserId, PostId),
    FOREIGN KEY () REFERENCES Posts(Id),
    FOREIGN KEY (UserID) REFERENCES User(Id)

    );

-- CREATE TABLE IF NOT EXISTS Messages (
--     Id BLOB NOT NULL PRIMARY KEY,
--     SenderId BLOB NOT NULL,
--     RecipientId BLOB NOT NULL,
--     Message TEXT NOT NULL,
--     Created DATETIME NOT NULL,
--     FOREIGN KEY (SenderId) REFERENCES Users(Id),
--     FOREIGN KEY (RecipientId) REFERENCES Users(Id)
-- );