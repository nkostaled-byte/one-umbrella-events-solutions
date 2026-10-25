-- Creates the One Umbrella client record for the existing My Grafix Worker.
-- Safe to re-run: it does not update or overwrite any existing client.
-- Run this in the Supabase SQL Editor for the Worker project's database.

WITH existing_client AS (
  SELECT client_id, business_name, owner_email, active
  FROM public.clients
  WHERE client_id = 'cli-oue26x'
     OR lower(business_name) = lower('One Umbrella Events Solutions')
     OR lower(owner_email) = lower('chaukealbino1@gmail.com')
  LIMIT 1
), inserted_client AS (
  INSERT INTO public.clients (
    client_id,
    auth_user_id,
    business_name,
    owner_email,
    active
  )
  SELECT
    'cli-oue26x',
    NULL,
    'One Umbrella Events Solutions',
    'chaukealbino1@gmail.com',
    TRUE
  WHERE NOT EXISTS (SELECT 1 FROM existing_client)
  ON CONFLICT (client_id) DO NOTHING
  RETURNING client_id, business_name, owner_email, active
)
SELECT 'created' AS result, client_id, business_name, owner_email, active
FROM inserted_client
UNION ALL
SELECT 'existing_record_found' AS result, client_id, business_name, owner_email, active
FROM existing_client;

-- If this creates the record, set the frontend build variable to:
-- VITE_FORMS_CLIENT_ID=cli-oue26x
-- After the owner signs in through the Worker claim flow, it can associate the
-- matching unclaimed owner_email record with that authenticated account.
