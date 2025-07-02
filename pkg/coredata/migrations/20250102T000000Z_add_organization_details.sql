-- Add optional organization detail fields
ALTER TABLE organizations ADD COLUMN mailing_address TEXT;
ALTER TABLE organizations ADD COLUMN telephone_number TEXT;
ALTER TABLE organizations ADD COLUMN website_url TEXT;
ALTER TABLE organizations ADD COLUMN security_compliance_email TEXT;
ALTER TABLE organizations ADD COLUMN company_description TEXT;
ALTER TABLE organizations ADD COLUMN company_legal_name TEXT; 