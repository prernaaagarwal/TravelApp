#!/usr/bin/env python3
"""
Fills out stub intel cards: Kasol, Hampi, and the 6 international cities
(Tokyo, Bangkok, Hanoi, Dubai, Seoul, Paris).

- Kasol: replaces 1 mislabeled scam with 5 Kasol-specific ones; adds 2 gems
- Hampi: adds 4 more scams (3 → 7); adds 4 more gems (4 → 8)
- International (6 cities): adds 3 neighborhoods + 4 hidden gems each

Updates lib/mock-data/intel-cards.json in place AND writes a SQL migration
to supabase/migrations/018_fill_stub_intel_cards.sql that UPDATEs the
intel_cards table to match.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "lib/mock-data/intel-cards.json"
MIGRATION_PATH = ROOT / "supabase/migrations/018_fill_stub_intel_cards.sql"

# ─────────────────────────────────────────────────────────────────────────────
# KASOL — replace the mislabeled Goa scam with 5 Kasol-specific ones
# ─────────────────────────────────────────────────────────────────────────────
KASOL_SCAMS = [
    {
        "title": "Charas push at trailheads and cafés",
        "severity": "critical",
        "where": "Kasol main bazaar, Tosh trailhead, Chalal village",
        "what": "Local 'guides' approach solo travellers offering charas; once accepted, an accomplice in plainclothes appears claiming to be police and demands ₹20,000–₹50,000 to drop charges. NDPS Act in India = 1 year minimum for any quantity, no bail.",
        "avoid": "Refuse all offers — including from people who seem like fellow travellers. There are no real plainclothes drug officers operating this way; if anyone claims to be one, ask for ID and call 100. Walk to a busy café immediately."
    },
    {
        "title": "Kheerganga 'guide' overcharge",
        "severity": "high",
        "where": "Kasol bus stand, Barshaini trailhead",
        "what": "Self-appointed guides demand ₹2,500–₹4,000 for a Kheerganga trek that is well-marked and doesn't need a guide. They sometimes vanish at the halfway point.",
        "avoid": "The trail is signposted the whole way and shared with hundreds of trekkers daily. If you genuinely want a guide, book through your guesthouse — ₹800–1,200 is the fair rate, paid only on return."
    },
    {
        "title": "Camping equipment 'damage' on return",
        "severity": "high",
        "where": "Trek shops in Kasol main bazaar",
        "what": "Sleeping bags / tents / trek poles rented out, then 'damage' claimed on return — usually ₹500–2,000 deducted from a ₹3,000 deposit.",
        "avoid": "Photograph and video every item on rental, with the shopkeeper visible. Refuse shops that demand passport as deposit. Stick to rentals booked through your guesthouse — they have ongoing relationships with the shops."
    },
    {
        "title": "Bhuntar to Kasol shared taxi pile-on",
        "severity": "medium",
        "where": "Bhuntar bus stand",
        "what": "Drivers quote ₹100–120 per seat then pack 8+ people in a 6-seater, or charge an extra ₹200 'luggage fee' on arrival in Kasol.",
        "avoid": "Confirm seat count and total price before getting in. HRTC bus is ₹40–60 and slower but completely safe. Last bus is around 6pm — plan to arrive before."
    },
    {
        "title": "Guesthouse no-cancellation booking trap",
        "severity": "medium",
        "where": "Booking platforms, Kasol main bazaar",
        "what": "Booked rooms turn out to be much smaller / damp / on a different floor than photos. 'No refund' policy invoked when you ask to leave.",
        "avoid": "Walk in if possible — Kasol almost always has rooms outside July/August peak. If booking ahead, message the host on WhatsApp first to confirm room number, photos of the actual room, and check-in process."
    },
]

KASOL_NEW_GEMS = [
    {
        "name": "Evergreen Café (Kasol main bazaar)",
        "type": "Café",
        "angle": "VS — Verified Safe",
        "why": "Long-running café with reliable WiFi, good shakshuka, and an owner who knows every solo female traveller in the valley. Natural meet-up spot in the morning; he'll connect you with other women heading to Kheerganga.",
        "approxCost": "Coffee ₹100 | Meal ₹250–400"
    },
    {
        "name": "Nirvana Café Guesthouse (Chalal)",
        "type": "Guesthouse",
        "angle": "VS — Verified Safe",
        "why": "15-minute walk from Kasol on the quieter Chalal side. Run by a Himachali family. River-view rooms, women-comfortable, and they call ahead to your next stop in the valley.",
        "approxCost": "₹1,200–2,000 private"
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# HAMPI — append 4 more scams, 4 more hidden gems
# ─────────────────────────────────────────────────────────────────────────────
HAMPI_NEW_SCAMS = [
    {
        "title": "Auto from Hospet station overcharge",
        "severity": "medium",
        "where": "Hospet Junction railway station",
        "what": "Autos at Hospet quote ₹600–800 for the 13km ride to Hampi when the standard fare is ₹250–350.",
        "avoid": "Use the pre-paid auto stand inside the station — printed receipt with auto number. Or take the local bus (₹35) from outside the station to Hampi Bazaar; they run every 30 minutes."
    },
    {
        "title": "Coracle 'private hire' upsell",
        "severity": "medium",
        "where": "Tungabhadra River crossing",
        "what": "Boatmen offer 'private' coracle rides for ₹500–1,000 instead of the ₹20 shared crossing — claiming the shared one isn't running.",
        "avoid": "The shared coracle runs from sunrise to sunset, ₹20 flat. If you genuinely want a private hour-long sunset coracle ride, the official rate is ₹400 — pay at the ASI booth, not on the boat."
    },
    {
        "title": "Sunset 'rooftop' minimum order",
        "severity": "low",
        "where": "Cafés on island side at sunset",
        "what": "Some cafés enforce a ₹500–800 per-person minimum for rooftop seating during the sunset window — not posted anywhere visible.",
        "avoid": "Ask about minimum charge before sitting down. Mowgli, Laughing Buddha, and Goan Corner are transparent. Or just walk to Anegundi rocks and watch sunset for free."
    },
    {
        "title": "Scooter rental without papers",
        "severity": "high",
        "where": "Hampi Bazaar rental shops",
        "what": "Rentals offered without proper paperwork, then if you're stopped by police you're liable. Some shops also rent unregistered scooters.",
        "avoid": "Insist on seeing the scooter's RC and insurance papers before paying. The licence plate must be yellow (commercial) not white. Carry your physical driving licence — digital copy gets you fined."
    },
]

HAMPI_NEW_GEMS = [
    {
        "name": "Mango Tree Restaurant (Hampi Bazaar)",
        "type": "Restaurant",
        "angle": "VS — Verified Safe",
        "why": "Hampi institution since the 90s. Banana-leaf thali, river view, women-comfortable. The original location moved but the food is unchanged. Solo-female-traveller heaven for breakfast and sunset dinner.",
        "approxCost": "Thali ₹200–350 | Continental ₹250–500"
    },
    {
        "name": "Goan Corner (Virupapuragadde)",
        "type": "Guesthouse + restaurant",
        "angle": "VS — Verified Safe",
        "why": "The most consistently-recommended stay on the island side. Mango trees, hammocks, women-comfortable dorm and private rooms. Owner Sahu connects guests for sunrise treks and bouldering. The community vibe makes solo trips feel less solo.",
        "approxCost": "₹450 dorm | ₹1,200–2,000 private"
    },
    {
        "name": "Vitthala Temple at sunrise",
        "type": "Cultural site",
        "angle": "VS — Verified Safe",
        "why": "The famous stone chariot. Open from 6am — go before 8am and you'll have it almost to yourself, no touts. Free with the ₹500 Hampi pass (covers all monuments for one day). Cycle there from Hampi Bazaar in 15 minutes.",
        "approxCost": "₹500 day pass | Free with valid ASI ticket"
    },
    {
        "name": "Anegundi village walk",
        "type": "Cultural experience",
        "angle": "VS — Verified Safe",
        "why": "Cross the river to Virupapuragadde, then walk 3km to Anegundi — the older twin of Hampi, where most locals live. Quieter, no touts, women-run craft cooperative (Kishkinda Trust) makes banana-fibre baskets you can buy directly.",
        "approxCost": "Free walk | Crafts ₹200–800"
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# INTERNATIONAL CITIES — neighborhoods + hidden gems
# ─────────────────────────────────────────────────────────────────────────────
INTL_DATA = {
    "tokyo-japan": {
        "neighborhoods": [
            {"name": "Shinjuku", "safetyRating": 5, "vibe": "Hyper-dense, neon, late-night, transit hub", "stayHere": True, "notes": "Best base for first-timers — JR Yamanote loop access, women-only floors at most chain hotels (APA, Sotetsu Fresa). East side is calmer than Kabukicho."},
            {"name": "Shibuya", "safetyRating": 5, "vibe": "Youth culture, fashion, all-night cafés", "stayHere": True, "notes": "More walkable than Shinjuku, easier to navigate. Hostel scene (Nui., Trunk House) is excellent for solo female travellers."},
            {"name": "Asakusa", "safetyRating": 5, "vibe": "Old Tokyo, Senso-ji temple, ryokan country", "stayHere": True, "notes": "Quieter, traditional, best for first-time travellers wanting the 'old Japan' feel. Khaosan Tokyo Origami is the go-to women-friendly hostel."}
        ],
        "hiddenGems": [
            {"name": "Sotetsu Fresa Inn (women-only floors)", "type": "Business hotel chain", "angle": "VS — Verified Safe", "why": "Affordable Japanese business hotel with dedicated women-only floors. Branches in Shinjuku, Ginza, Ueno. Key-card lift access ensures men can't reach women's floors. Solo Japanese women's preferred chain.", "approxCost": "¥7,000–11,000/night (~₹4,000–6,500)"},
            {"name": "Onsen Ryokan Yuen Shinjuku", "type": "Ryokan with rooftop onsen", "angle": "VS — Verified Safe", "why": "Modern ryokan with women-only onsen on the rooftop overlooking Shinjuku. Walking distance from station. The traditional-meets-modern experience without leaving central Tokyo.", "approxCost": "¥18,000–28,000/night (~₹11,000–17,000)"},
            {"name": "Yanaka Ginza (downtown shotengai)", "type": "Old-school shopping street", "angle": "VS — Verified Safe", "why": "Survived WWII bombing intact. Old wooden shopfronts, ¥100 croquettes, women-run sembei (rice cracker) stalls. Far calmer than Asakusa for a 'real Tokyo' afternoon.", "approxCost": "Free walk | Snacks ¥100–500 (~₹60–300)"},
            {"name": "Onsen Spa LaQua (Tokyo Dome)", "type": "Day spa with women's floor", "angle": "VS — Verified Safe", "why": "Six-floor onsen complex right in central Tokyo. Women's floor has private hot baths, sauna, sleep pods. Open till 9am next day — solo women safely overnight here when missing the last train.", "approxCost": "¥3,200 day pass | ¥4,500 with overnight (~₹2,000–2,800)"}
        ]
    },
    "bangkok-thailand": {
        "neighborhoods": [
            {"name": "Sukhumvit (Asok / Phrom Phong)", "safetyRating": 5, "vibe": "Modern, BTS-connected, expat-friendly", "stayHere": True, "notes": "Best base for solo women. Clean, well-policed, walkable to BTS Skytrain. Avoid the Soi Cowboy / Nana stretches at night — stay between Phloen Chit and Phrom Phong."},
            {"name": "Silom / Sathorn", "safetyRating": 4, "vibe": "Business district by day, food street by night", "stayHere": True, "notes": "Less touristy than Sukhumvit, excellent street food, good MRT access. Patpong night market is fine for solo browsing — ignore the 'ping pong show' touts."},
            {"name": "Khao San Road area", "safetyRating": 3, "vibe": "Backpacker chaos, cheap, loud", "stayHere": False, "notes": "Iconic but not solo-female-friendly at night. If staying, use Rambuttri parallel street (calmer). Better as a half-day visit than overnight stay."}
        ],
        "hiddenGems": [
            {"name": "Lub d Hostel Siam (women's dorms)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Award-winning hostel chain with female-only dorms in central Siam. Coded floor access, in-room safes, female staff on every shift. Best place to meet other solo women.", "approxCost": "฿650–950 dorm | ฿2,000–3,500 private (~₹1,500–8,000)"},
            {"name": "Wat Pho massage school", "type": "Traditional Thai massage", "angle": "VS — Verified Safe", "why": "The original Thai massage school, attached to the temple. Female therapists, female-only treatment rooms on request. Far safer than random street parlours; a 1-hour foot massage is ฿320.", "approxCost": "฿320–550 (~₹750–1,300)"},
            {"name": "Or Tor Kor Market (women-run stalls)", "type": "Local market", "angle": "VS — Verified Safe", "why": "Bangkok's best fresh-produce market, next to the better-known Chatuchak. Most stalls are run by Thai women. Excellent food court, no tourist scams, AC throughout.", "approxCost": "Meal ฿100–250 (~₹250–600)"},
            {"name": "Divana Spa Sukhumvit", "type": "Day spa", "angle": "VS — Verified Safe", "why": "Female-founded Thai spa chain. Treatments in private suites, all-female therapists by default. Booked solid by Bangkok's expat women — book 2 days ahead.", "approxCost": "฿2,500–5,500 (~₹6,000–13,000)"}
        ]
    },
    "hanoi-vietnam": {
        "neighborhoods": [
            {"name": "Old Quarter (Hoan Kiem)", "safetyRating": 5, "vibe": "Heritage, walkable, lake-centred", "stayHere": True, "notes": "Best base for first-time solo women. Most attractions within 15-min walk. Crossing the road is the main risk — walk slowly and steadily, never stop in traffic."},
            {"name": "French Quarter (Ba Dinh)", "safetyRating": 5, "vibe": "Wide boulevards, embassies, museums", "stayHere": True, "notes": "Quieter and more upmarket than Old Quarter. Sofitel Metropole here. Good for second-time visitors who want a calmer base."},
            {"name": "Tay Ho (West Lake)", "safetyRating": 5, "vibe": "Expat area, lakeside cafés, longer-stay vibe", "stayHere": True, "notes": "30 minutes from Old Quarter by Grab. Best for digital nomads and 1-week-plus stays. Cleanest air in Hanoi, plenty of women-friendly cafés."}
        ],
        "hiddenGems": [
            {"name": "Hanoi Backpackers Downtown (women dorm)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Long-running hostel chain with dedicated 6-bed women-only dorm. Female staff at reception, organises walking tours specifically for solo women. Daily bookings fill by 2pm — reserve ahead.", "approxCost": "$8–12 dorm | $25–45 private (~₹650–3,800)"},
            {"name": "Note Coffee (Hoan Kiem Lake)", "type": "Café", "angle": "VS — Verified Safe", "why": "Two-storey café with thousands of customer notes pinned to every wall. Women-comfortable, reliable WiFi, lake-view second floor. Egg coffee here is the best in the Old Quarter.", "approxCost": "₫30,000–60,000 (~₹100–200)"},
            {"name": "Banh Mi 25 (Hang Ca street)", "type": "Street food", "angle": "VS — Verified Safe", "why": "Female-run, family-owned banh mi stall featured in Anthony Bourdain's Hanoi episode. Spotless prep area, queue moves fast, women-comfortable seating area inside.", "approxCost": "₫30,000–55,000 (~₹100–180)"},
            {"name": "Hidden Hanoi cooking class (Tay Ho)", "type": "Cooking class", "angle": "VS — Verified Safe", "why": "Female-run cooking school. Includes morning market visit with the chef, then 4 dishes you cook yourself. Class size capped at 8. Excellent way to meet other solo women travellers.", "approxCost": "$45–55 (~₹3,800–4,600)"}
        ]
    },
    "dubai-uae": {
        "neighborhoods": [
            {"name": "Downtown Dubai", "safetyRating": 5, "vibe": "Burj Khalifa, Dubai Mall, Metro-connected", "stayHere": True, "notes": "Safest and most central base. Dress code is relaxed in malls and restaurants but cover shoulders/knees in souks and mosques. Metro is air-conditioned, women-only carriage available."},
            {"name": "Dubai Marina", "safetyRating": 5, "vibe": "Beach access, expat-heavy, resort feel", "stayHere": True, "notes": "Very safe, beach within walking distance, all major chains. Western dress code accepted at beach clubs. Good base if you want sea + city in one trip."},
            {"name": "Deira (old Dubai)", "safetyRating": 4, "vibe": "Souks, traditional, working-class", "stayHere": False, "notes": "Visit for gold and spice souks but stay elsewhere — accommodation is older, predominantly male hotel guests, and visibly western women attract more attention here than in newer areas."}
        ],
        "hiddenGems": [
            {"name": "Rove Downtown (women-friendly mid-range)", "type": "Hotel", "angle": "VS — Verified Safe", "why": "UAE-based mid-range chain that operates with explicit solo-female-traveller focus. Card-key floor access, female front desk on every shift, walking distance to Dubai Mall and Metro.", "approxCost": "AED 350–550/night (~₹8,000–13,000)"},
            {"name": "Metro women-and-children carriage", "type": "Transport", "angle": "VS — Verified Safe", "why": "Dubai Metro has a designated pink carriage for women and children only. AC, calm, and entirely safe at any hour. Use it especially during peak commute hours.", "approxCost": "AED 3–8 per ride (~₹70–180)"},
            {"name": "Al Seef heritage walk (sunset)", "type": "Cultural walk", "angle": "VS — Verified Safe", "why": "Restored creek-side Old Dubai with abra (water taxi) crossing for AED 1. Female-friendly cafés, no aggressive touts, free entry. Best at sunset when temperatures drop.", "approxCost": "AED 1 abra crossing | Café spend AED 30–80 (~₹25–1,800)"},
            {"name": "Cleopatra's Spa (Wafi Mall)", "type": "Day spa", "angle": "VS — Verified Safe", "why": "Long-established women-only day spa in Wafi Mall. Hammam treatments, female-only floors, relaxation rooms with proper privacy. The default recommendation among Dubai expat women.", "approxCost": "AED 250–600 (~₹6,000–14,000)"}
        ]
    },
    "seoul-south-korea": {
        "neighborhoods": [
            {"name": "Myeongdong", "safetyRating": 5, "vibe": "Shopping district, central, transit hub", "stayHere": True, "notes": "Best base for first-timers. Subway lines 2 + 4 cross here. Loud and busy by day; quieter at night. K-beauty stores everywhere, English signage."},
            {"name": "Hongdae", "safetyRating": 5, "vibe": "University area, indie cafés, nightlife", "stayHere": True, "notes": "Younger crowd, lots of solo female travellers, walkable. Clubs are safe (door staff strict), cafés open till 4am. Excellent for digital nomads."},
            {"name": "Itaewon", "safetyRating": 4, "vibe": "International, restaurants, expat-heavy", "stayHere": True, "notes": "Most diverse food scene in Seoul. Fine for stays but the main strip can be rowdy after 11pm — pick a hotel one street back from Itaewon-ro."}
        ],
        "hiddenGems": [
            {"name": "Itaewon G Guesthouse (women dorm)", "type": "Guesthouse", "angle": "VS — Verified Safe", "why": "Long-running female-only dorm in Itaewon. Female owner, female staff. Free Korean breakfast, in-room lockers, helpful with subway navigation. Books out 2 weeks ahead in autumn.", "approxCost": "₩30,000–45,000 dorm (~₹1,800–2,800)"},
            {"name": "Dragon Hill Spa (24-hour jjimjilbang)", "type": "Korean spa", "angle": "VS — Verified Safe", "why": "Massive 7-floor jjimjilbang with women-only sleeping floor. Solo women safely sleep here when missing the last subway. Indoor and outdoor hot pools, separate by gender.", "approxCost": "₩15,000 day | ₩18,000 overnight (~₹950–1,150)"},
            {"name": "Myeongdong Kyoja kalguksu", "type": "Restaurant", "angle": "VS — Verified Safe", "why": "70-year-old, multi-generational female-led kalguksu (knife-cut noodles) institution. One menu, four items, queue moves fast, women-comfortable solo seating. The default Seoul lunch among Korean grandmothers.", "approxCost": "₩9,000–11,000 (~₹570–700)"},
            {"name": "Bukchon Hanok Village walking tour", "type": "Cultural walk", "angle": "VS — Verified Safe", "why": "Traditional Korean hanok houses on foot. Free walking tours run by Seoul tourism (book at Visit Seoul website). Women-friendly, English-speaking guides, 2 hours. Go early — quietest before 9am.", "approxCost": "Free | Hanbok rental ₩15,000–25,000 (~₹950–1,600)"}
        ]
    },
    "paris-france": {
        "neighborhoods": [
            {"name": "Le Marais (3rd / 4th)", "safetyRating": 5, "vibe": "Heritage, gay-friendly, cafés, walkable", "stayHere": True, "notes": "Safest central base for solo women. Lively until late, well-lit streets, many female-run boutiques. Walking distance to Notre Dame, Pompidou, Bastille."},
            {"name": "Saint-Germain (6th)", "safetyRating": 5, "vibe": "Literary, café culture, upmarket", "stayHere": True, "notes": "Quieter and more refined than Marais. Excellent cafés (Café de Flore, Les Deux Magots), bookshops, walkable to Louvre. Best for second-time visitors who want calm."},
            {"name": "Montmartre (18th)", "safetyRating": 4, "vibe": "Hilly, artist-history, Sacré-Coeur", "stayHere": True, "notes": "Stay between Abbesses and Pigalle Métro stations — north slope is calm, south slope (Pigalle) is sex-shop territory. Walking up to Sacré-Coeur after dark is fine in groups, not alone."}
        ],
        "hiddenGems": [
            {"name": "St Christopher's Inn Paris (women dorm)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Riverside hostel with dedicated 6-bed women-only dorm. Coded floor access, en-suite bathroom in dorm. Walking distance to Gare du Nord — perfect first/last night before Eurostar.", "approxCost": "€32–48 dorm | €85–140 private (~₹3,000–13,000)"},
            {"name": "Le Train Bleu (Gare de Lyon)", "type": "Restaurant", "angle": "VS — Verified Safe", "why": "Belle Époque restaurant inside Gare de Lyon — listed historic monument. Excellent solo dining counter, no minimum order, classic French food. Safe to linger over lunch alone for 2+ hours.", "approxCost": "Lunch €35–55 | À la carte €60–110 (~₹3,200–10,000)"},
            {"name": "Hammam de la Mosquée de Paris", "type": "Hammam (women-only)", "angle": "VS — Verified Safe", "why": "Traditional Moroccan hammam attached to the Grand Mosque. Women-only days (check schedule). Steam room, gommage scrub, mint tea and pastry included. The Parisian secret for solo women's spa days.", "approxCost": "€18 entry | €38 with gommage (~₹1,650–3,500)"},
            {"name": "Walking the Seine after sunset", "type": "Free experience", "angle": "VS — Verified Safe", "why": "From Pont Neuf to Pont Alexandre III is about 2km of well-lit, well-policed Seine bank. Always foot traffic, even at midnight. Free, beautiful, completely safe for solo women.", "approxCost": "Free"}
        ]
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# UPDATE THE JSON
# ─────────────────────────────────────────────────────────────────────────────
cards = json.loads(JSON_PATH.read_text())
modified = []

for card in cards:
    slug = card["slug"]

    if slug == "kasol-india":
        card["scams"] = KASOL_SCAMS
        card["hiddenGems"] = card.get("hiddenGems", []) + KASOL_NEW_GEMS
        modified.append(slug)

    elif slug == "hampi-india":
        card["scams"] = card.get("scams", []) + HAMPI_NEW_SCAMS
        card["hiddenGems"] = card.get("hiddenGems", []) + HAMPI_NEW_GEMS
        modified.append(slug)

    elif slug in INTL_DATA:
        card["neighborhoods"] = INTL_DATA[slug]["neighborhoods"]
        card["hiddenGems"] = INTL_DATA[slug]["hiddenGems"]
        modified.append(slug)

JSON_PATH.write_text(json.dumps(cards, indent=2, ensure_ascii=False) + "\n")
print(f"Updated JSON for {len(modified)} cards: {modified}")

# ─────────────────────────────────────────────────────────────────────────────
# WRITE THE SQL MIGRATION
# ─────────────────────────────────────────────────────────────────────────────
def sql_jsonb(value):
    """Encode a Python dict/list as a Postgres jsonb literal with escaped quotes."""
    s = json.dumps(value, ensure_ascii=False)
    s = s.replace("'", "''")
    return f"'{s}'::jsonb"

sql_lines = [
    "-- ─────────────────────────────────────────────────────────────────────────────",
    "-- 018_fill_stub_intel_cards.sql",
    "-- Fills out 8 stub intel cards: Kasol, Hampi, and 6 international cities.",
    "-- ─────────────────────────────────────────────────────────────────────────────",
    "",
]

for slug in modified:
    card = next(c for c in cards if c["slug"] == slug)
    parts = []
    if slug in {"kasol-india", "hampi-india"}:
        parts.append(f"  scams = {sql_jsonb(card['scams'])}")
        parts.append(f"  hidden_gems = {sql_jsonb(card['hiddenGems'])}")
    else:
        parts.append(f"  neighborhoods = {sql_jsonb(card['neighborhoods'])}")
        parts.append(f"  hidden_gems = {sql_jsonb(card['hiddenGems'])}")
    sql_lines.append(f"UPDATE intel_cards SET")
    sql_lines.append(",\n".join(parts))
    sql_lines.append(f"WHERE slug = '{slug}';\n")

MIGRATION_PATH.write_text("\n".join(sql_lines))
print(f"Wrote migration: {MIGRATION_PATH}")
