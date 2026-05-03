# Deploying Wander Women to Vercel

Step-by-step. ~30 minutes if Supabase is already set up.

---

## 1. Push to GitHub
You're already on `main` and pushing. Skip.

## 2. Vercel project setup
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import the GitHub repo
3. Framework auto-detects as Next.js — leave defaults
4. **Don't deploy yet** — go to Environment Variables first

## 3. Environment variables (Vercel → Settings → Environment Variables)

Paste each one, mark as available in **all environments** (Production, Preview, Development):

| Key | Value | Where to find it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (long token) | Supabase → Project Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Project Settings → API → `service_role` `secret` — **never expose client-side** |
| `NEXT_PUBLIC_WW_WHATSAPP` | `91XXXXXXXXXX` | Your WhatsApp Business number (no +, no spaces) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | After domain is set up — fill it in then redeploy |

## 4. Deploy
Click **Deploy**. First build takes ~3 min.

After first deploy, you'll get a URL like `wander-women-xyz.vercel.app`.

## 5. Custom domain (optional but recommended)
1. Vercel → Project → Settings → Domains
2. Add your domain (e.g. `wanderwomen.in`)
3. Vercel shows DNS records to add at your registrar
4. Wait 5–60 min for DNS propagation + automatic HTTPS provisioning

After domain is live, update `NEXT_PUBLIC_SITE_URL` to the production domain and redeploy.

## 6. Supabase auth — add the production URL to allowlist

**This is the step that breaks magic-link sign-in if missed.**

1. Supabase → Authentication → URL Configuration
2. **Site URL**: `https://your-domain.com` (or the Vercel preview URL initially)
3. **Redirect URLs (allowlist)** — add all of these:
   - `https://your-domain.com/auth/callback`
   - `https://*.vercel.app/auth/callback` (for preview deploys)
   - `http://localhost:3000/auth/callback` (for local dev)

If you skip this, users will get redirected to `/account/login?error=auth` after clicking their magic link.

## 7. Storage bucket (for beware report photos)

If not already done in Supabase setup:
1. Supabase → Storage → New bucket
2. Name: `beware-photos`
3. **Public bucket: ON** (so report photos render publicly)
4. Add this RLS policy on `storage.objects`:
   ```sql
   create policy "Authenticated users upload beware photos"
   on storage.objects for insert to authenticated
   with check (bucket_id = 'beware-photos');

   create policy "Anyone reads beware photos"
   on storage.objects for select to public
   using (bucket_id = 'beware-photos');
   ```

## 8. Verify post-deploy

Walk through this checklist on the production URL:
- [ ] Homepage renders with hero image
- [ ] Click "Travel India" → onboarding shows India destinations only
- [ ] `/intel/goa-india` loads with photos
- [ ] `/community/beware/goa-india` loads with map + pins
- [ ] Sign up with a real email → magic link arrives → click → lands on `/onboarding`
- [ ] Submit a test beware report → appears in `/admin` queue (when logged in as admin)
- [ ] Mobile bottom nav visible on phone width
- [ ] Social share preview: paste production URL into a WhatsApp chat → should show hero image + title

## 9. Run Lighthouse

Chrome DevTools → Lighthouse → Mobile → Performance + Accessibility.
Target ≥ 85 for both per PRD Section 12.

If Performance < 85, common fixes:
- Compress hero image further (currently ~200KB, target ~80KB)
- Add `loading="lazy"` to any below-fold images
- Verify `priority` flag is only on hero image, not all images

If Accessibility < 95, run a static audit:
- Look for icon-only buttons missing `aria-label`
- Check color contrast on rust-on-cream and gold-light text

---

## Troubleshooting

**Magic link redirects to `/account/login?error=auth`**
→ Production URL not in Supabase Auth Redirect URLs allowlist (Step 6)

**Image errors: "Invalid src prop on `next/image`"**
→ The image host isn't in `next.config.ts` `images.remotePatterns`. Add it and redeploy.

**Beware map shows pins but photos don't load**
→ `beware-photos` bucket isn't public, or RLS blocks `SELECT` (Step 7)

**Build fails: "Missing environment variables"**
→ One of the required env vars in Step 3 is unset. Check Vercel logs.
