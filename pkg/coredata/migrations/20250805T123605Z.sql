-- First, update rows where created_at is null but sent_at is not null
UPDATE emails
SET created_at = sent_at,
    updated_at = sent_at
WHERE created_at IS NULL AND sent_at IS NOT NULL;

-- Then, update rows where both created_at and sent_at are null
UPDATE emails
SET created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE created_at IS NULL AND sent_at IS NULL;

-- Finally, update rows where created_at is very old (before 2000)
UPDATE emails
SET created_at = sent_at,
    updated_at = sent_at
WHERE created_at < '2000-01-01' AND sent_at IS NOT NULL;

-- For very old rows where sent_at is also null, set to current timestamp
UPDATE emails
SET created_at = CURRENT_TIMESTAMP,
    updated_at = CURRENT_TIMESTAMP
WHERE created_at < '2000-01-01' AND sent_at IS NULL;
