-- Migration: Add createdBy column to groups table
-- Run this SQL in your PostgreSQL database

-- Add the createdBy column to the groups table
ALTER TABLE groups ADD COLUMN "createdById" uuid;

-- Add foreign key constraint
ALTER TABLE groups ADD CONSTRAINT "FK_groups_createdBy" 
  FOREIGN KEY ("createdById") REFERENCES users(id) ON DELETE SET NULL;

-- Update existing groups to set the first member as the creator
-- This is a best-effort approach for existing data
UPDATE groups g
SET "createdById" = (
  SELECT gm.user_id 
  FROM group_members gm 
  WHERE gm.group_id = g.id 
  ORDER BY gm.user_id 
  LIMIT 1
);

-- Optional: Make the column NOT NULL after setting values
-- ALTER TABLE groups ALTER COLUMN "createdById" SET NOT NULL;
