-- Change foreign key constraints to allow organization deletion with cascade
ALTER TABLE data 
DROP CONSTRAINT data_organization_id_fkey;

ALTER TABLE data 
ADD CONSTRAINT data_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Update vendors table
ALTER TABLE vendors 
DROP CONSTRAINT IF EXISTS vendors_organization_id_fkey;

ALTER TABLE vendors 
ADD CONSTRAINT vendors_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Update frameworks table
ALTER TABLE frameworks 
DROP CONSTRAINT frameworks_organization_id_fkey;

ALTER TABLE frameworks 
ADD CONSTRAINT frameworks_organization_id_fkey
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

-- Update other tables that reference organizations
-- Note: These tables may not have explicit constraints, so we'll add them
ALTER TABLE peoples 
DROP CONSTRAINT IF EXISTS peoples_organization_id_fkey;

ALTER TABLE peoples 
ADD CONSTRAINT peoples_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE documents 
DROP CONSTRAINT IF EXISTS documents_organization_id_fkey;

ALTER TABLE documents 
ADD CONSTRAINT documents_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE measures 
DROP CONSTRAINT IF EXISTS measures_organization_id_fkey;

ALTER TABLE measures 
ADD CONSTRAINT measures_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE risks 
DROP CONSTRAINT IF EXISTS risks_organization_id_fkey;

ALTER TABLE risks 
ADD CONSTRAINT risks_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE;

ALTER TABLE assets 
DROP CONSTRAINT IF EXISTS assets_organization_id_fkey;

ALTER TABLE assets 
ADD CONSTRAINT assets_organization_id_fkey 
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE; 