-- ════════════════════════════════════════════════════════════════════════
-- Ximo — promote a user to admin (one-time, run in the Supabase SQL editor).
--
-- Admins can use /app/admin/moderation to approve community posts/comments and
-- brand ads. Without at least one admin, all new community content stays
-- "pending" forever and never appears in the public feed.
--
-- HOW TO USE:
--   1. Replace the email below with YOUR account email.
--   2. Run this whole snippet in Supabase → SQL editor.
--   3. Reload /app/admin/moderation — you should now see the queue.
-- ════════════════════════════════════════════════════════════════════════

update public.profiles p
set role = 'admin'
from auth.users u
where u.id = p.id
  and u.email = 'tu-correo@ejemplo.com';   -- ← CHANGE THIS to your email

-- Verify:
-- select p.id, u.email, p.role
-- from public.profiles p join auth.users u on u.id = p.id
-- where p.role = 'admin';
