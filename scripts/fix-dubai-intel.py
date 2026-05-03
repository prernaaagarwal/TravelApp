#!/usr/bin/env python3
"""
Brings the Dubai intel card to full parity with the India cards.

Fixes:
- audience: "foreign-women" → "both" (Dubai is a top destination for Indian women too)
- tldr: old object {summary, safetyRating, topTip} → 5-item string array
- transport: empty → 3 modes (Metro pink carriage, Careem, RTA taxi)
- preBookChecklist: empty → 5 items
- dosAndDonts: empty → 4 do + 4 dont

Updates JSON in place AND generates supabase/migrations/019_fix_dubai_intel.sql.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "lib/mock-data/intel-cards.json"
MIG_PATH = ROOT / "supabase/migrations/019_fix_dubai_intel.sql"

DUBAI_TLDR = [
    "Dubai is one of the safest cities in the world for solo women — but strict laws apply. Dress modestly outside hotel and beach zones; cover shoulders and knees in malls and souks.",
    "Public displays of affection are illegal — no holding hands or kissing in public, even between married couples. Drinking alcohol is only legal in licensed venues (hotel bars and restaurants).",
    "Use only RTA taxis (cream with red roof), Careem, or Uber. Pink taxis (female driver only) available via Careem app — request via the 'Pink Taxi' option.",
    "Dubai Metro has a women-and-children-only pink carriage — use it during peak hours and at night, completely safe and AC-cool.",
    "Cash dirhams are useful for souks but everywhere else takes cards. ATM withdrawal fees are AED 25 — withdraw bigger amounts less often.",
]

DUBAI_TRANSPORT = [
    {
        "mode": "Dubai Metro (women-and-children pink carriage)",
        "tip": "Use the dedicated pink carriage at the front of every train — women-and-children only, enforced strictly by AED 100 fine for men. Two lines (Red + Green) cover Downtown, Marina, Mall of the Emirates, Airport.",
        "approxCost": "AED 3–8 per ride (~₹70–180) | Day pass AED 22 (~₹500)"
    },
    {
        "mode": "Careem (with Pink Taxi option)",
        "tip": "UAE-founded ride app, more reliable than Uber locally. Select 'Pink Taxi' in vehicle options for a female driver — wait time 5–15 min, available across central Dubai. The default app for solo women.",
        "approxCost": "AED 25–60 short rides | AED 80–150 across the city (~₹570–3,400)"
    },
    {
        "mode": "RTA Taxi (cream + red roof)",
        "tip": "Government-regulated — meter is mandatory, refuse any driver who quotes a flat rate. Hail at official taxi stands or via 'Smart Taxi' button at every Metro exit. Pink-roof taxis are female-driver only — flag those if you spot one.",
        "approxCost": "Starting fare AED 12 | average ride AED 25–55 (~₹570–1,250)"
    },
]

DUBAI_PRE_BOOK = [
    "Download Careem app and link your card before landing — works at airport for AED 100 fixed-price ride to Downtown",
    "Book accommodation in Downtown, Marina, or JBR for first trip — most central, safest, all metro-connected",
    "Save Tourist Police: 800-4438 (24/7, English-speaking) — faster response than 999 for non-emergency",
    "Pack one long-sleeve dress or kurta for visits to mosques (Sheikh Zayed Grand Mosque requires shoulders, knees, and hair covered)",
    "If flying via Mopa connection or Indian carrier: confirm your visa validity 24 hours before — Indian passports get 14-day visa-on-arrival but it must be activated correctly",
]

DUBAI_DOS_DONTS = {
    "do": [
        "Use the Metro pink carriage during rush hour and after 8pm — completely safe and faster than cars",
        "Carry the Tourist Police WhatsApp (+971-4-606-2222) — they respond in English within minutes for any harassment",
        "Use Careem 'Pink Taxi' option for late-night rides — female driver, slightly slower wait, peace of mind",
        "Save your hotel name in Arabic before arriving — useful when giving directions to non-English-speaking taxi drivers",
    ],
    "dont": [
        "Drink alcohol outside licensed venues — public intoxication is jail time, not a fine",
        "Take photos of women in hijab, of police, or of government buildings — instant arrest, no exceptions",
        "Hold hands or kiss in public, even with your husband — same penalty for tourists as locals",
        "Take an unlicensed cab from any tourist area — Cancun-style overcharge scams are common; insist on RTA or Careem only",
    ],
}

DUBAI_NEW_GEMS = [
    {
        "name": "She Spa at Dubai Ladies Club (Jumeirah)",
        "type": "Women-only beach club + spa",
        "angle": "VS — Verified Safe",
        "why": "Members-only women's beach club but offers AED 350 day passes for visitors. Beach, pool, spa, restaurants — entirely women-only. The Dubai default for solo female travellers wanting a quiet beach day without male attention.",
        "approxCost": "AED 350 day pass (~₹8,000) | Spa add-ons AED 200–600"
    },
    {
        "name": "RTA Smart Taxi app (women-driver filter)",
        "type": "Transport tool",
        "angle": "VS — Verified Safe",
        "why": "Government RTA app with explicit 'Female Driver' toggle — request only women-driven taxis (Pink Taxis). 5–10 min wait, slightly higher fare. The single best tool for women navigating Dubai at night.",
        "approxCost": "Starting AED 12 | typical AED 30–60 (~₹680–1,400)"
    },
]

# ── UPDATE JSON ──────────────────────────────────────────────────────────────
cards = json.loads(JSON_PATH.read_text())
for card in cards:
    if card["slug"] != "dubai-uae":
        continue
    card["audience"] = "both"
    card["tldr"] = DUBAI_TLDR
    card["transport"] = DUBAI_TRANSPORT
    card["preBookChecklist"] = DUBAI_PRE_BOOK
    card["dosAndDonts"] = DUBAI_DOS_DONTS
    card["hiddenGems"] = card.get("hiddenGems", []) + DUBAI_NEW_GEMS
    card["isPremium"] = True
    card["premiumPreview"] = (
        "Premium covers: the 4 women-only beach clubs and spas (with day-pass pricing), "
        "the 6 RTA-licensed female taxi-driver routes, modesty-compliant outfit guides "
        "for the 3 main mosques, and the Indian-passport visa loophole that gets you "
        "30 days instead of 14."
    )
    print(f"Updated dubai-uae")
    break

JSON_PATH.write_text(json.dumps(cards, indent=2, ensure_ascii=False) + "\n")

# ── WRITE MIGRATION ──────────────────────────────────────────────────────────
def jsonb(value):
    s = json.dumps(value, ensure_ascii=False).replace("'", "''")
    return f"'{s}'::jsonb"

dubai = next(c for c in cards if c["slug"] == "dubai-uae")
mig = f"""-- ─────────────────────────────────────────────────────────────────────────────
-- 019_fix_dubai_intel.sql
-- Brings Dubai intel card to full parity:
-- audience fix, TLDR converted from object to array, transport, pre-book
-- checklist, dos/donts, plus 2 more hidden gems and premium preview.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE intel_cards SET
  audience = 'both',
  tldr = {jsonb(dubai['tldr'])},
  transport = {jsonb(dubai['transport'])},
  pre_book_checklist = {jsonb(dubai['preBookChecklist'])},
  dos_and_donts = {jsonb(dubai['dosAndDonts'])},
  hidden_gems = {jsonb(dubai['hiddenGems'])},
  is_premium = true,
  premium_preview = {jsonb(dubai['premiumPreview'])[:-7]}'
WHERE slug = 'dubai-uae';
"""
# fix the bizarre ending — the premium_preview is a string not jsonb
mig = mig.replace(
    f"premium_preview = {jsonb(dubai['premiumPreview'])[:-7]}'",
    "premium_preview = '" + dubai["premiumPreview"].replace("'", "''") + "'"
)
MIG_PATH.write_text(mig)
print(f"Wrote migration: {MIG_PATH}")
