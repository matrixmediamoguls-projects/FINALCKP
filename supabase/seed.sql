-- Seed: default app settings
INSERT INTO app_settings (key, value)
VALUES ('addon_price', '5.00'::jsonb)
ON CONFLICT (key) DO NOTHING;
