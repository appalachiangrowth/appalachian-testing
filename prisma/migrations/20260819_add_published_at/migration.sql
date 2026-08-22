-- ============================================================
-- Comprehensive migration: ensure production DB matches Prisma schema
-- Run this on the production MySQL database.
-- Safe to re-run — each statement is idempotent.
-- ============================================================

-- ─── 1. Blog table: add missing columns ───
-- MySQL does not support ADD COLUMN IF NOT EXISTS natively,
-- so we check INFORMATION_SCHEMA first.

SET @dbname = DATABASE();

-- publishedAt
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'publishedAt');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN publishedAt DATETIME(3) NULL', 'SELECT ''publishedAt already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- views (backtick-quoted because it's a MySQL reserved word)
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'views');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN `views` INT NOT NULL DEFAULT 0', 'SELECT "views already exists"');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- metaTitle
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'metaTitle');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN metaTitle VARCHAR(191) NULL', 'SELECT ''metaTitle already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- metaDescription
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'metaDescription');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN metaDescription TEXT NULL', 'SELECT ''metaDescription already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- canonicalUrl
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'canonicalUrl');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN canonicalUrl VARCHAR(191) NULL', 'SELECT ''canonicalUrl already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ogTitle
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'ogTitle');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN ogTitle VARCHAR(191) NULL', 'SELECT ''ogTitle already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ogDescription
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'ogDescription');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN ogDescription TEXT NULL', 'SELECT ''ogDescription already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ogImage
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'ogImage');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN ogImage VARCHAR(191) NULL', 'SELECT ''ogImage already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- readTime
SET @col = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'Blog' AND COLUMN_NAME = 'readTime');
SET @sql = IF(@col = 0, 'ALTER TABLE Blog ADD COLUMN readTime INT NOT NULL DEFAULT 5', 'SELECT ''readTime already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ─── 2. Create BlogCategory table if missing ───
CREATE TABLE IF NOT EXISTS BlogCategory (
  id          VARCHAR(30)  NOT NULL PRIMARY KEY,
  name        VARCHAR(191) NOT NULL,
  slug        VARCHAR(191) NOT NULL,
  description TEXT         NULL,
  sortOrder   INT          NOT NULL DEFAULT 0,
  createdAt   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX BlogCategory_name_key (name),
  UNIQUE INDEX BlogCategory_slug_key (slug)
);

-- ─── 3. Create BlogTag table if missing ───
CREATE TABLE IF NOT EXISTS BlogTag (
  id        VARCHAR(30)  NOT NULL PRIMARY KEY,
  name      VARCHAR(191) NOT NULL,
  slug      VARCHAR(191) NOT NULL,
  createdAt DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updatedAt DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  UNIQUE INDEX BlogTag_name_key (name),
  UNIQUE INDEX BlogTag_slug_key (slug)
);

-- ─── 4. Create PostTag join table if missing ───
CREATE TABLE IF NOT EXISTS PostTag (
  postId VARCHAR(30) NOT NULL,
  tagId  VARCHAR(30) NOT NULL,
  PRIMARY KEY (postId, tagId),
  INDEX PostTag_tagId_idx (tagId)
);

-- ─── 5. Add foreign key constraints if missing ───
-- (Only add if the constraint does not already exist)

-- PostTag -> Blog
SET @fk = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'PostTag' AND CONSTRAINT_NAME = 'PostTag_postId_fkey');
SET @sql = IF(@fk = 0, 'ALTER TABLE PostTag ADD CONSTRAINT PostTag_postId_fkey FOREIGN KEY (postId) REFERENCES Blog(id) ON DELETE CASCADE', 'SELECT ''PostTag_postId_fkey already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- PostTag -> BlogTag
SET @fk = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = @dbname AND TABLE_NAME = 'PostTag' AND CONSTRAINT_NAME = 'PostTag_tagId_fkey');
SET @sql = IF(@fk = 0, 'ALTER TABLE PostTag ADD CONSTRAINT PostTag_tagId_fkey FOREIGN KEY (tagId) REFERENCES BlogTag(id) ON DELETE CASCADE', 'SELECT ''PostTag_tagId_fkey already exists''');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
