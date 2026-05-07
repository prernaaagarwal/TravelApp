# Bing Webmaster Tools — submission checklist

> Goal: get Wander Women indexed by Bing within 14 days. Bing powers
> ChatGPT search and Microsoft Copilot — Google indexing is not enough
> in 2026. 30 minutes one-time setup, then forget about it.

## Why Bing matters more than founders realize

Bing's organic search market share is small (~3%). But:
- **ChatGPT search uses Bing's index** — every query routed through
  ChatGPT's web tool hits Bing first, not Google
- **Microsoft Copilot** is built on Bing
- **DuckDuckGo's results** come substantially from Bing
- **Yahoo / AOL / smaller engines** sometimes use Bing
- Bing's index is a **separate citation pool** for AI engines

You don't need rank-1 on Bing. You need to be **indexed**, with structured
data flagged, so when ChatGPT searches, your content is in the candidate
set.

## Step-by-step (30 min, one-time)

### 1. Set up Bing Webmaster Tools account (5 min)

1. Go to <https://www.bing.com/webmasters>
2. Sign in with a Microsoft account (use a dedicated `webmaster@wanderwomen.in` if you don't have one)
3. Click "Add a site" → enter `https://wanderwomen.in`

### 2. Verify domain ownership (10 min — pick one method)

Three methods. **Pick the easiest based on your DNS host.**

**Method A — XML file upload (works for any host)**
1. Bing gives you a file like `BingSiteAuth.xml`
2. Place it at `public/BingSiteAuth.xml` in the repo
3. Commit + deploy
4. In Bing → "Verify"

**Method B — Meta tag (works for any host)**
1. Bing gives you a meta tag like `<meta name="msvalidate.01" content="ABC123" />`
2. Add it to `app/layout.tsx` in the `<head>` element via Next.js Metadata API:

```tsx
export const metadata = {
  // ...existing metadata
  verification: {
    other: {
      "msvalidate.01": "YOUR_BING_VERIFICATION_CODE",
    },
  },
};
```

3. Deploy
4. In Bing → "Verify"

**Method C — Google Search Console import (fastest if you already have GSC)**
1. If you've already verified the domain in Google Search Console:
2. Bing has a "Import from Google" feature → click it
3. One-click import, no DNS or file changes needed
4. Recommended path

### 3. Submit the sitemap (5 min)

1. In Bing Webmaster → Sitemaps → Submit sitemap
2. Enter: `https://wanderwomen.in/sitemap.xml`
3. Wait 24–48 hours for first crawl
4. Re-submit anytime sitemap content changes substantially

### 4. Submit individual URLs for fast indexing (5 min)

Bing has a daily quota (typically 10 URLs/day for new sites, 100 for
verified). Submit your top 25 intel cards directly:

1. URL Submission → enter URL → Submit
2. Repeat for each of the 25 cards (do 10 today, 10 tomorrow, 5 day 3)
3. Same for the 22 Beware Board city pages

**Priority order:**
1. `/` (homepage)
2. `/methodology`
3. `/pricing`
4. `/intel/goa-india`, `/intel/jaipur-india`, `/intel/rishikesh-india`
5. `/community/beware/goa-india`, `/community/beware/jaipur-india`
6. The remaining intel cards
7. The remaining Beware Board cities

### 5. Enable IndexNow (5 min — IMPORTANT for speed)

IndexNow is Microsoft's protocol for instantly notifying Bing when your
content changes. It's how you keep up with daily Beware Board updates.

1. Generate a key (any random string, 32+ chars):
   ```
   openssl rand -hex 16
   ```
2. Add it to your env: `INDEXNOW_KEY=<key>`
3. Place a file at `public/<key>.txt` containing just the key:
   ```bash
   echo "<key>" > public/<key>.txt
   ```
4. Add a server-side hook that POSTs to IndexNow when:
   - A new intel card is published
   - A new Beware report is approved

   Example (add to `lib/indexnow.ts`):

   ```ts
   export async function notifyIndexNow(urls: string[]) {
     const key = process.env.INDEXNOW_KEY;
     if (!key) return;
     await fetch("https://api.indexnow.org/IndexNow", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         host: "wanderwomen.in",
         key,
         keyLocation: `https://wanderwomen.in/${key}.txt`,
         urlList: urls,
       }),
     }).catch(() => {});
   }
   ```

5. Call `notifyIndexNow` from your moderation-approval action when a
   beware report is approved, and from the intel-card publish flow.

This is a 1-day build. Without it, Bing crawls slowly. With it, your
fresh content lands in the index (and therefore in ChatGPT's search
results) within hours.

## Verification — how to know it worked

### Within 48 hours
- Bing Webmaster → Site Explorer → see if pages are crawled
- Try `site:wanderwomen.in` on bing.com — count results

### Within 14 days
- Should have 50+ pages indexed
- ChatGPT search should start citing your URLs (test with the
  Perplexity audit protocol — substitute ChatGPT search)

### If still not indexed after 14 days
- Check `app/robots.ts` — confirm Bing's user agent isn't blocked
- Check the sitemap is reachable: visit `https://wanderwomen.in/sitemap.xml`
  in incognito
- Re-submit URLs manually
- Open a support ticket in Bing Webmaster

## What to add to the pitch after this

> *"We're submitted to Bing Webmaster Tools, IndexNow is wired so new
> Beware reports propagate to Bing within hours, and our sitemap
> coverage is at 100%. ChatGPT search reaches our content via Bing —
> that's a separate citation channel from Google."*

That's the answer to "what's your AEO infrastructure look like."

## What to NOT do

- Don't pay for paid Bing inclusion. Free organic submission is enough.
- Don't submit the same URL multiple times in 24 hours — quota wasted.
- Don't ignore the Crawl Errors report — Bing flags issues that Google
  doesn't.
- Don't disable Bing in robots.ts. (It isn't disabled by default; just
  noting in case someone tries to.)

## Time budget

| Step | Minutes |
|---|---|
| Create Bing Webmaster account | 5 |
| Verify domain (Method C, fastest) | 5 |
| Submit sitemap | 5 |
| Submit 10 priority URLs | 10 |
| Generate IndexNow key + place file | 5 |
| **Total** | **30** |

Plus 1 day of engineering for the IndexNow hook in publish/moderation
flows. Worth every minute.

## Update this doc

Mark each step done with a date as you complete it:

- [ ] Bing Webmaster account created
- [ ] Domain verified (method: ___)
- [ ] Sitemap submitted
- [ ] First batch of 10 URLs submitted
- [ ] IndexNow key generated and `<key>.txt` placed in `/public`
- [ ] IndexNow hook deployed in publish/approve flows
- [ ] First indexing confirmed (`site:wanderwomen.in` returns N results)
