# Auth setup — Google OAuth + Email OTP code

Two providers shipped: **Google OAuth** (one-click sign-in) and **email OTP code**
(6-digit code with magic-link fallback). Both go through Supabase Auth.

The frontend code is wired up (`/components/account/AuthForm.tsx`). What's left
is configuration in the Supabase Dashboard and Google Cloud Console.

## 1. Email OTP code (~5 min)

By default `signInWithOtp` sends only a magic link. To also include a 6-digit
code in the same email, update the email template:

1. Supabase Dashboard → **Authentication** → **Email Templates** → **Magic Link**
2. Replace the body with this (or merge into your existing one):
   ```html
   <h2>Your Wander Women sign-in code</h2>
   <p>Enter this code in the browser tab where you started signing in:</p>
   <p style="font-size: 28px; font-family: monospace; letter-spacing: 8px; padding: 12px 0;">
     {{ .Token }}
   </p>
   <p>Or click this link to sign in instantly:</p>
   <p><a href="{{ .ConfirmationURL }}">Sign in to Wander Women</a></p>
   <p style="color: #888; font-size: 12px;">This code expires in 1 hour.</p>
   ```
3. Save.

That's it. The code path uses `verifyOtp({ email, token, type: 'email' })`.
The link path uses `/auth/callback` (already wired).

## 2. Google OAuth (~15 min)

### Step A — Google Cloud Console
1. Go to https://console.cloud.google.com → create project (or pick existing)
2. **APIs & Services** → **OAuth consent screen**:
   - Type: **External**
   - App name: `Wander Women`
   - User support email: your email
   - Logo: optional, the Wander Women favicon works
   - Authorised domains: `supabase.co` (and your custom domain if any)
   - Scopes: leave defaults (`openid`, `profile`, `email`)
   - Save
3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID**:
   - Application type: **Web application**
   - Name: `Wander Women — Supabase`
   - Authorised JavaScript origins:
     ```
     https://vykbvnkpfqfmcilovzsw.supabase.co
     https://wanderwomen.app           # or your prod domain
     http://localhost:3000              # for local dev
     ```
   - Authorised redirect URIs:
     ```
     https://vykbvnkpfqfmcilovzsw.supabase.co/auth/v1/callback
     ```
   - Click **Create**. Copy the **Client ID** and **Client secret** that pop up.

### Step B — Supabase Dashboard
1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Toggle **Enable**
3. Paste the **Client ID** and **Client secret** from Google
4. Leave the redirect URL as-is
5. Save.

### Step C — Test
1. Go to `/account/login` on production
2. Click **Continue with Google**
3. Should redirect to Google → consent → back to your site signed in.

### If it fails
- "redirect_uri_mismatch": the URI in the Supabase config must exactly match
  what's pasted into Google Cloud Console. Trailing slashes matter.
- "OAuth consent screen not verified": for public access, submit the consent
  screen for verification (Google takes ~2 weeks). Until then, you can add
  testers under **OAuth consent screen** → **Test users**.

## 3. Verify both work

After setup, hit `/account/login`:
- Email + code should reach you with both link and 6-digit code
- Google button should redirect through OAuth

If either fails, check **Supabase Dashboard → Logs → Auth Logs**.
