-- Add organization_id column to usrmgr_users table
ALTER TABLE usrmgr_users ADD COLUMN organization_id TEXT REFERENCES organizations(id);

-- Create an index for faster lookups
CREATE INDEX usrmgr_users_organization_id_idx ON usrmgr_users(organization_id); 