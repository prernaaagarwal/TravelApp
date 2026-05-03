#!/usr/bin/env python3
"""
Brings Tokyo, Bangkok, Hanoi, Seoul, Paris intel cards to full parity
with India cards (and matching what we just did for Dubai).

Per city: audience fix → "both", TLDR object → 5-item array, transport
3 modes, pre-book checklist, dos/donts.

Updates JSON in place + writes supabase/migrations/020_fix_intl_intel.sql.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "lib/mock-data/intel-cards.json"
MIG_PATH = ROOT / "supabase/migrations/020_fix_intl_intel.sql"

CITIES = {
    "tokyo-japan": {
        "tldr": [
            "Tokyo is the safest megacity in the world for solo women — but solo dining and quiet trains are the norm. Don't speak loudly, don't make eye contact on the train, and you'll fit right in.",
            "Use the women-only metro carriage on JR and Tokyo Metro lines during morning rush (7:30–9:30am) and after 11pm. Marked with pink stickers at platform; men using them get fined.",
            "Tipping is rude — never tip in restaurants, taxis, or hotels. Service charge is included; offering extra implies the service wasn't worth its price.",
            "Get a Suica or PASMO IC card on day 1 — works on every train, bus, and convenience store. Tap and go, no fumbling for change at midnight.",
            "Tattoos = no entry to most onsen and public baths. Cover with bandages or book a private onsen at a ryokan. Solo women tattoo-friendly options exist; ask hostel desk.",
        ],
        "transport": [
            {"mode": "JR Yamanote Line + Metro (women-only carriage)", "tip": "The Yamanote loop covers every major district. Women-only carriages on JR Saikyo, Chuo, and most Metro lines from 7:30–9:30am and after 11pm — pink stickers mark them. Use them; men face ¥1,000+ fines.", "approxCost": "¥150–320 per ride | ¥800 day pass (~₹100–500)"},
            {"mode": "Taxi (LE.TAXI app, female-driver request)", "tip": "Taxis are everywhere and clean but expensive. Use LE.TAXI or GO app — both let you note 'female driver preferred' in app preferences. Doors open automatically — never touch them.", "approxCost": "¥730 starting fare | typical ride ¥1,500–4,000 (~₹900–2,400)"},
            {"mode": "Capsule hotel transit (women-only floors)", "tip": "If you miss the last train (around 12:30am), capsule hotels with women-only floors (Nine Hours, First Cabin, Khaosan) are safer and cheaper than waiting for a taxi. Coded floor access, female-only showers.", "approxCost": "¥3,500–6,000/night (~₹2,100–3,600)"},
        ],
        "preBookChecklist": [
            "Order Suica or PASMO IC card at the airport — Welcome Suica desk at Narita/Haneda, no deposit, expires in 28 days",
            "Book any ryokan with private onsen at least 2 weeks ahead — solo female demand is high, especially in autumn",
            "Save embassy emergency line and your hotel's address in Japanese — write it down (taxi drivers may not read romaji)",
            "Download Google Translate offline Japanese pack and Maps offline area for Tokyo",
            "If visiting onsen with tattoos, find tattoo-friendly options (onsen-tattoo.com) — only ~10% of onsen allow them",
        ],
        "dosAndDonts": {
            "do": [
                "Use the women-only carriage on metro at peak times — it's there for a reason and Japanese women use it without exception",
                "Eat ramen and sushi alone at the counter — solo dining is the cultural norm, not a flag",
                "Carry coins for shrines and small purchases — Japan is more cash-friendly than people expect",
                "Bow when receiving anything (change, business card, food) — small gesture, big difference in how people respond",
            ],
            "dont": [
                "Tip anyone, ever — it's actively rude and considered an insult to professional pride",
                "Talk loudly on the train or take phone calls — silence is enforced socially",
                "Walk into a restaurant with shoes on if you see slippers at the entrance — slip into them, leave shoes facing out",
                "Take photos of geisha or anyone in traditional dress without asking — most are tourists in rented kimono, but it's still a social offence",
            ],
        },
        "audience": "both",
    },

    "bangkok-thailand": {
        "tldr": [
            "Bangkok is one of the easiest first solo trips in Asia — English signage, BTS Skytrain, abundant Grab cabs, and Thai people are genuinely warm to solo female travellers.",
            "Use BTS Skytrain or MRT Subway over taxis whenever possible — AC, cheap, and the Sukhumvit/Silom lines cover everywhere you'll need to go. Tuk-tuks are tourist traps, not transport.",
            "Modesty matters at temples — Wat Phra Kaew, Wat Pho, Grand Palace require shoulders and knees covered. Carry a sarong or scarf in your bag.",
            "Patpong / Soi Cowboy / Nana stretches in Sukhumvit are red-light zones — fine to walk through but don't engage with touts and don't enter clubs offering 'shows' (overcharge scams).",
            "Female Thai massage parlours are legitimate and excellent — Health Land, Let's Relax, Wat Pho School are women-only on request, AED 350–800 for 90 mins.",
        ],
        "transport": [
            {"mode": "BTS Skytrain + MRT Subway", "tip": "Both have ladies-first carriages signposted at peak hours (7–9am, 5–7pm) — not enforced as strictly as Tokyo but used. AC throughout, cheap, English signage. Buy a Rabbit card for BTS, MRT card separately.", "approxCost": "฿16–62 per ride (~₹40–150)"},
            {"mode": "Grab (Thai version of Uber)", "tip": "Default ride app. 'GrabCar' is private cars — safer than taxi for solo women, in-app tracking, fixed price. Avoid 'GrabBike' (scooter taxi) at night.", "approxCost": "฿80–250 across central Bangkok (~₹190–600)"},
            {"mode": "Boat ferry (Chao Phraya)", "tip": "Tourist ferry from Sathorn pier connects all the riverside temples — ฿15 per stop or ฿180 day pass. Safe, women-comfortable, and the views beat any taxi window.", "approxCost": "฿15–50 per stop | ฿180 day pass (~₹35–430)"},
        ],
        "preBookChecklist": [
            "Get a Thai SIM at the airport (AIS or True) — ฿200–400 for 8 days, essential for Grab",
            "Book hostel/hotel in Asok, Phrom Phong, or Silom for first trip — BTS-connected, walkable, safest after dark",
            "Save Tourist Police: 1155 (24/7 English) — they handle tourist-specific issues separately from regular police",
            "Pack a sarong or scarf — needed for every temple visit, no exceptions",
            "Download Grab app and link a card before landing — works at airport for ฿250 fixed-price ride to Sukhumvit",
        ],
        "dosAndDonts": {
            "do": [
                "Use BTS or Grab for all transit — cheap, AC, no negotiation",
                "Try street food at busy stalls (high turnover = fresh) — Bangkok street food is some of the safest in Asia",
                "Smile and wai (slight bow with hands together) when greeting — opens every door",
                "Carry small bills (฿20s, ฿100s) — many street vendors and tuk-tuks 'don't have change' for ฿1,000s",
            ],
            "dont": [
                "Touch a monk if you're female — even accidentally. Step aside on the footpath when they pass",
                "Disrespect the King or royal family in any conversation — lese-majesty is a real prison sentence",
                "Take a 'tour' from a tuk-tuk driver to a 'special temple' — it's a gem-shop overcharge trap, every time",
                "Drink the tap water — bottled only, even for brushing teeth in budget guesthouses",
            ],
        },
        "audience": "both",
    },

    "hanoi-vietnam": {
        "tldr": [
            "Hanoi is the friendliest North Vietnam base for solo women — but the road-crossing skill is real (no traffic lights, scooters everywhere). Walk slowly and steadily, never stop, never run.",
            "The Old Quarter is the default base — heritage, walkable, lake-centred. Stay within 10 min of Hoan Kiem Lake your first trip.",
            "Cash is king — Vietnamese dong has lots of zeros (1 USD ≈ 25,000 VND). ATMs everywhere, but BIDV and Vietcombank have the best rates and lowest fees.",
            "Grab is the default ride app, not Uber. GrabCar (4-wheel) for solo women — avoid GrabBike (scooter taxi) at night.",
            "Egg coffee, banh mi, and pho are the trinity. Eat them at women-run street stalls — they're clean, cheap, and natural meet-up spots for other solo female travellers.",
        ],
        "transport": [
            {"mode": "Grab (GrabCar — avoid GrabBike at night)", "tip": "Default ride app. Use GrabCar (4-wheel) for safety; GrabBike (scooter pillion) is fine in daylight but skip at night. Driver rating system works — only accept 4.7+ stars.", "approxCost": "₫30,000–80,000 across Old Quarter (~₹100–270) | ₫350,000 to airport (~₹1,200)"},
            {"mode": "Cyclo (rickshaw)", "tip": "Slow tourist cyclo rides through Old Quarter — agree price before getting in (₫150,000 for 1 hour is fair). Female-passenger-friendly cyclo drivers wear blue shirts and operate from main hotels.", "approxCost": "₫150,000–250,000/hour (~₹500–850)"},
            {"mode": "SE3 Reunification Express train (overnight to Hue/Da Nang)", "tip": "Book a soft sleeper, 4-berth cabin — request all-female cabin via 12go.asia or Baolau. Far safer than night bus. Berths 1-2 (lower) are best for solo women — easier escape if needed.", "approxCost": "$45–80 soft sleeper Hanoi → Hue (~₹3,800–6,800)"},
        ],
        "preBookChecklist": [
            "Get a Vietnamese SIM at Noi Bai airport (Viettel or Vinaphone) — $5 for 7 days, essential for Grab and Maps",
            "Book accommodation in Old Quarter (Hoan Kiem) for first trip — walkable, women-friendly, safest after dark",
            "Save Tourist Police: 1800-1145 (English) — they specifically handle visitor scam complaints",
            "Download offline Google Maps for Hanoi + Halong Bay area — signal drops in the karsts",
            "Practice crossing the road on a quiet street first — keep eye contact with scooter drivers, walk slow and steady, they will go around you",
        ],
        "dosAndDonts": {
            "do": [
                "Take Grab for any ride longer than 10 min — cheaper than tourist haggling, in-app tracking",
                "Eat at busy street stalls with low plastic stools — they're the safest food in Hanoi",
                "Cross roads slowly and steadily, never run or stop — scooters predict your path and flow around you",
                "Carry small dong notes (₫10,000, ₫20,000) — vendors rarely have change for ₫500,000",
            ],
            "dont": [
                "Hire a 'tour' that comes to you in your hotel lobby — book Halong Bay only via reputable agencies (Lily's Travel, Indochina Junk)",
                "Take photos of Vietnamese military or police checkpoints — instant detention",
                "Drink the tap water — bottled only, including for brushing teeth",
                "Ride a scooter yourself if you've never done it — Hanoi traffic is not the place to learn",
            ],
        },
        "audience": "both",
    },

    "seoul-south-korea": {
        "tldr": [
            "Seoul is one of the safest cities for solo women in the world — the subway runs till midnight, 24-hour cafés are everywhere, and women walking alone at 2am is normal.",
            "Get a T-Money card on day 1 — works on subway, bus, taxi, convenience stores. Tap and go, no Korean needed.",
            "Use KakaoT app instead of Uber — it's the local default, English-supported, and offers 'Female Driver' option at slight surcharge.",
            "Jjimjilbang (Korean bathhouse) culture is excellent for solo women — strict gender-separated floors, women's floor is enormous and 24/7 in major chains.",
            "Eating alone in Korea was historically odd but has shifted — solo Korean barbecue restaurants and ramen counters are now mainstream.",
        ],
        "transport": [
            {"mode": "Seoul Subway (T-Money card)", "tip": "9 lines, English signage, runs 5:30am–midnight. Buy T-Money at any convenience store, recharge at subway machines. Some lines have women-only carriages during peak hours (line 9, certain hours).", "approxCost": "₩1,400 base fare | ₩2,000–3,000 typical ride (~₹85–180)"},
            {"mode": "KakaoT (with Female Driver option)", "tip": "Korean ride app, supports English. Premium tier offers 'Female Driver' — slight surcharge but female-driven taxi within 10 min, far safer for late-night rides.", "approxCost": "₩4,800 starting fare | ₩8,000–18,000 typical (~₹290–1,100)"},
            {"mode": "Airport Express (AREX)", "tip": "Direct express from Incheon to Seoul Station in 43 min, ₩9,500. Far better than the bus or regular all-stop train. Women-and-children-quiet zones in some carriages.", "approxCost": "₩9,500 one-way (~₹575)"},
        ],
        "preBookChecklist": [
            "Order a T-Money card or download it to your phone via Apple Pay/Samsung Pay before landing",
            "Book hostel/hotel in Myeongdong, Hongdae, or Itaewon for first trip — all major subway lines connect here",
            "Save Tourist Police: 1330 (24/7, English-speaking) — different number from regular police, faster English support",
            "Download Naver Maps and Papago translator (Google Maps doesn't work well in Korea due to mapping restrictions)",
            "Pack one warm layer year-round — even summer evenings cool to 18°C, winters drop below 0°C",
        ],
        "dosAndDonts": {
            "do": [
                "Stay overnight in a 24-hour jjimjilbang if you miss the last subway — women's floor is safer and cheaper (₩15,000) than a taxi ride home",
                "Use KakaoT 'Female Driver' option for any ride after 10pm — it's why the option exists",
                "Carry your hotel name in Korean (한글) — write it down or have it in Naver Maps",
                "Bow slightly when greeting elders — the depth of the bow signals respect, even if you don't speak Korean",
            ],
            "dont": [
                "Pour your own drink at meals with Koreans — wait for someone else to pour, then pour theirs in return",
                "Stick chopsticks upright in rice — same funeral symbolism as Japan, considered very rude",
                "Refuse to drink soju with elders if offered — it's a bonding ritual, sip and accept",
                "Tip in restaurants or taxis — service is always included, tipping confuses staff",
            ],
        },
        "audience": "both",
    },

    "paris-france": {
        "tldr": [
            "Paris is generally safe for solo women but pickpocketing is the constant low-grade risk — keep your bag closed, your phone in your pocket, and wear it crossbody.",
            "The Métro is fast and extensive but Line 13 has the worst reputation (groping, pickpockets at peak hours) — use Lines 1, 4, or 6 when possible. Avoid Châtelet Les Halles after 11pm alone.",
            "Walking the Seine is one of the safest things you can do at any hour — well-lit, well-policed, always foot traffic from Pont Neuf to Pont Alexandre III.",
            "Restaurants always include service compris (15%) — tipping more is a kind gesture but never expected. Round up the bill or leave €1–2.",
            "The 18th and 19th arrondissements have areas that are less safe at night — stay in Marais, Saint-Germain, or 6th/7th for first solo trip.",
        ],
        "transport": [
            {"mode": "Métro (Navigo Easy card)", "tip": "Buy Navigo Easy card at any station — €2 for the card, then load with €1.69 single tickets or €8.45 day pass. Avoid Line 13 if possible — it's the most groping-reported line. Use Lines 1, 4, 6, 14 instead.", "approxCost": "€1.69 single ride | €8.45 day pass (~₹150–760)"},
            {"mode": "G7 Taxi or Uber (with female driver option)", "tip": "G7 is the largest official Paris taxi company — has a 'Femmes au volant' (women drivers) option. Uber has 'Uber Women Drivers' in Paris. Both reliable and worth the slight surcharge for late-night rides.", "approxCost": "€7 starting fare | €15–35 across central Paris (~₹630–3,150)"},
            {"mode": "Vélib' bike share", "tip": "15,000+ rental bikes across Paris, dedicated bike lanes on most major streets. €5/day pass, €0.50 first 30 min after that. The fastest way across central Paris in good weather.", "approxCost": "€5 day pass | €0.50–2/30min (~₹450 day)"},
        ],
        "preBookChecklist": [
            "Order Navigo Easy or Paris Visite pass before landing — saves 15 min queueing at CDG",
            "Book accommodation in Marais (3rd/4th), Saint-Germain (6th), or Latin Quarter (5th) for first solo trip",
            "Save SOS Médecins (24/7 doctor): 3624 — and Police: 17 — both English-supported",
            "Download offline Google Maps for Paris central + Métro PDF map (Citymapper Paris is excellent)",
            "Activate roaming or buy a French Orange/Free SIM at the airport — €10–20 for 5GB, essential for rideshare apps",
        ],
        "dosAndDonts": {
            "do": [
                "Wear your bag crossbody with the opening against your body — every Métro pickpocket targets dangling shoulder bags",
                "Walk the Seine after dark — well-lit, well-policed, beautiful, completely safe",
                "Say 'Bonjour madame/monsieur' when entering a shop — skipping it is rude and you'll get worse service",
                "Eat lunch alone at a café counter — solo dining is normal, no one stares",
            ],
            "dont": [
                "Use Line 13 after 9pm if you can avoid it — switch to Lines 1 or 6 for parallel routes",
                "Engage with anyone offering a 'free bracelet' near Sacré-Coeur — they tie it on then demand €20",
                "Sign petitions from anyone on the street near tourist sites — pickpocket distraction tactic",
                "Wave a metro map open or stare at your phone at major stations like Châtelet — same reason",
            ],
        },
        "audience": "both",
    },
}

# ── UPDATE JSON ──────────────────────────────────────────────────────────────
cards = json.loads(JSON_PATH.read_text())
modified = []
for card in cards:
    if card["slug"] not in CITIES: continue
    fix = CITIES[card["slug"]]
    card["audience"] = fix["audience"]
    card["tldr"] = fix["tldr"]
    card["transport"] = fix["transport"]
    card["preBookChecklist"] = fix["preBookChecklist"]
    card["dosAndDonts"] = fix["dosAndDonts"]
    modified.append(card["slug"])

JSON_PATH.write_text(json.dumps(cards, indent=2, ensure_ascii=False) + "\n")
print(f"Updated {len(modified)} cards: {modified}")

# ── WRITE MIGRATION ──────────────────────────────────────────────────────────
def jsonb(value):
    s = json.dumps(value, ensure_ascii=False).replace("'", "''")
    return f"'{s}'::jsonb"

lines = [
    "-- ─────────────────────────────────────────────────────────────────────────────",
    "-- 020_fix_intl_intel.sql",
    "-- Brings Tokyo, Bangkok, Hanoi, Seoul, Paris intel cards to full parity:",
    "-- audience fix → \"both\", tldr converted from object to array, transport,",
    "-- pre-book checklist, dos/donts.",
    "-- ─────────────────────────────────────────────────────────────────────────────",
    "",
]
for slug in modified:
    card = next(c for c in cards if c["slug"] == slug)
    lines.append("UPDATE intel_cards SET")
    lines.append(f"  audience = 'both',")
    lines.append(f"  tldr = {jsonb(card['tldr'])},")
    lines.append(f"  transport = {jsonb(card['transport'])},")
    lines.append(f"  pre_book_checklist = {jsonb(card['preBookChecklist'])},")
    lines.append(f"  dos_and_donts = {jsonb(card['dosAndDonts'])}")
    lines.append(f"WHERE slug = '{slug}';\n")

MIG_PATH.write_text("\n".join(lines))
print(f"Wrote migration: {MIG_PATH}")
