-- Backfill wholesaler_id in audit_logs for wholesale users
UPDATE audit_logs
SET wholesaler_id = profiles.id
FROM profiles
WHERE audit_logs.user_id = profiles.id
  AND profiles.role = 'wholesale'
  AND audit_logs.wholesaler_id IS NULL;

-- Backfill retailer_id in audit_logs for retail users
UPDATE audit_logs
SET retailer_id = profiles.id
FROM profiles
WHERE audit_logs.user_id = profiles.id
  AND profiles.role = 'retail'
  AND audit_logs.retailer_id IS NULL; 