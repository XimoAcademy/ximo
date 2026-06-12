-- ════════════════════════════════════════════════════════════════════════
-- Ximo — make the brand-ads storage bucket publicly readable
--
-- The BrandAdForm uploads media to the `brand-ads` bucket and stores the
-- result of getPublicUrl() as the ad's media_url. That public URL only
-- resolves if the bucket is public — otherwise the saved link is dead and the
-- uploaded image/video never renders in review or in the community feed.
--
-- Ad media is meant to be seen, so we flip the bucket to public. Write access
-- stays restricted to the file's owner via the existing
-- `brand_ads_owner_write` RLS policy, so only the uploading brand can add or
-- replace files.
-- ════════════════════════════════════════════════════════════════════════

update storage.buckets
set public = true
where id = 'brand-ads';
