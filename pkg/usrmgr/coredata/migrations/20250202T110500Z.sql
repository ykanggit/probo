CREATE TABLE usrmgr_users (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE usrmgr_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES usrmgr_users(id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);
