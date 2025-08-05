CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE TABLE trust_centers (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tenant_id TEXT NOT NULL,
    active BOOLEAN NOT NULL,
    slug TEXT NOT NULL CHECK (slug ~ '^[a-z0-9_-]+$'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    UNIQUE(slug)
);

-- Create a function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(base_slug TEXT, organization_id TEXT) RETURNS TEXT AS $$
DECLARE
    counter INTEGER := 0;
    unique_slug TEXT := base_slug;
BEGIN
    -- Try the base slug first
    WHILE EXISTS (SELECT 1 FROM trust_centers WHERE slug = unique_slug) LOOP
        counter := counter + 1;
        unique_slug := base_slug || '-' || counter::TEXT;
    END LOOP;
    
    RETURN unique_slug;
END;
$$ LANGUAGE plpgsql;

-- Insert trust centers with unique slugs
INSERT INTO trust_centers (
    id,
    organization_id,
    tenant_id,
    active,
    slug,
    created_at,
    updated_at
)
SELECT
    generate_gid(decode_base64_unpadded(o.tenant_id), 22),
    o.id,
    o.tenant_id,
    false,
    generate_unique_slug(
        LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(
                    unaccent(o.name),
                    '[^a-zA-Z0-9\s]', '', 'g'
                ),
                '\s+', '-', 'g'
            )
        ),
        o.id
    ),
    NOW(),
    NOW()
FROM organizations o;

-- Drop the helper function
DROP FUNCTION generate_unique_slug(TEXT, TEXT);

ALTER TABLE documents ADD COLUMN show_on_trust_center BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE audits ADD COLUMN show_on_trust_center BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE vendors ADD COLUMN show_on_trust_center BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE documents ALTER COLUMN show_on_trust_center DROP DEFAULT;

ALTER TABLE audits ALTER COLUMN show_on_trust_center DROP DEFAULT;

ALTER TABLE vendors ALTER COLUMN show_on_trust_center DROP DEFAULT;
