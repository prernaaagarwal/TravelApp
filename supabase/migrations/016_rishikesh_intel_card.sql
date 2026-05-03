-- ─────────────────────────────────────────────────────────────────────────────
-- 016_rishikesh_intel_card.sql
-- Adds the Rishikesh intel card. Required because the homepage Section 01
-- "Open full Rishikesh dossier" CTA links to /intel/rishikesh-india.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO intel_cards (
  slug, destination, country, audience, contributor_slug, last_updated,
  verified_by_count, hero_image_url, tldr, neighborhoods, scams, transport,
  hidden_gems, pre_book_checklist, dos_and_donts, estimated_daily_budget,
  emergency_numbers, is_premium, premium_preview, affiliate_links
) VALUES (
  'rishikesh-india',
  'Rishikesh',
  'India',
  'both',
  'ananya-mumbai',
  '2026-04-30',
  9,
  '/images/intel-rishikesh.jpg',

  -- tldr
  '["Avoid Lakshman Jhula bridge after 9pm — groups of men, no police, zero lighting. Use Ram Jhula side instead.",
    "Most ashrams and cafes lock by 10pm — plan dinner for 7:30pm or you will be eating Maggi in your room.",
    "Pre-book Ola from Dehradun airport (₹1,800 fixed); never take station touts — add ₹500–800 to any price they quote.",
    "Dress conservatively the entire trip — shoulders and knees covered, always. This is a pilgrimage town, not a beach.",
    "Rafting operators on the ghats overcharge by 3–4x — book only via licensed operators, get printed receipt before boarding."]',

  -- neighborhoods
  '[{"name": "Tapovan", "safetyRating": 4, "vibe": "Yoga cafes, hostels, backpacker energy", "stayHere": true, "notes": "Best base for solo women. Most hostels are here, restaurants open late-ish (9pm), and there are enough people around at night to feel safe walking short distances."},
    {"name": "Swarg Ashram / Ram Jhula", "safetyRating": 4, "vibe": "Ashrams, ghats, spiritual atmosphere", "stayHere": true, "notes": "Quieter and more grounded than Tapovan. Excellent ghat access. Most ashrams here have 10pm gates — confirm curfew before booking."},
    {"name": "Lakshman Jhula", "safetyRating": 3, "vibe": "Busy market street, tourist density", "stayHere": false, "notes": "The bridge itself is closed (collapsed 2019, not rebuilt). The surrounding area has high tout and overcharge density. Fine for day visits; don'\''t stay here."}]',

  -- scams
  '[{"title": "Lakshman Jhula bridge after 9pm", "severity": "critical", "where": "Lakshman Jhula area", "what": "Groups of men congregate on the path near the old bridge site after dark. No police presence, no lighting. Multiple solo women have reported harassment walking this route at night.", "avoid": "Walk the Ram Jhula side after dark. If on the Lakshman Jhula side at night, take an auto back to your stay — do not walk alone."},
    {"title": "Fake yoga certification mills", "severity": "high", "where": "Tapovan, Swarg Ashram", "what": "200-hour TTC certificates from unregistered schools with no Yoga Alliance standing. Costs ₹30,000–₹80,000 for a certificate that won'\''t be recognised anywhere outside India.", "avoid": "Check the school'\''s Yoga Alliance RYS (Registered Yoga School) number at yogaalliance.org before paying. Legitimate schools list it publicly."},
    {"title": "Rafting overcharge and safety shortcuts", "severity": "high", "where": "Ghats near Shivpuri", "what": "Ghat touts quote ₹400–600 for 16km rafting then demand ₹1,500–2,500 on the riverbank. Life jackets are sometimes under-inflated or missing.", "avoid": "Book through Zostel, your hostel, or a Garhwal Mandal Vikas Nigam (GMVN) licensed operator. Get a receipt with safety gear listed. Refuse any boat without a functioning life jacket."},
    {"title": "Accommodation bait-and-switch", "severity": "high", "where": "Online booking platforms", "what": "Photos show a clean room with Ganga view; arrival reveals a damp interior room with no window. Common with small guesthouses listed on booking platforms.", "avoid": "Call ahead and ask specifically which floor and which side of the building your room is on. Request photos of the actual room, not stock shots."},
    {"title": "Auto overcharging from railway station", "severity": "medium", "where": "Rishikesh Railway Station (Yog Nagari)", "what": "Autos from the station quote ₹300–500 for rides that should cost ₹80–120. Very consistent at Yog Nagari station.", "avoid": "Use Ola or Rapido from the station. If no app coverage, walk to the main road and hail an auto there — prices drop immediately once you'\''re away from the station queue."}]',

  -- transport
  '[{"mode": "Ola / Rapido (app)", "tip": "Works in most of Rishikesh. Pre-book from Dehradun airport — the ride is 45min, fixed at approx ₹1,800. Do not accept any offer from touts at the airport exit.", "approxCost": "₹80–200 within town | ₹1,800 from Dehradun airport"},
    {"mode": "Auto-rickshaw (local)", "tip": "Useful for short hops between ghats. Always agree fare before getting in. ₹80–120 covers most in-town routes. Refuse drivers who approach you — walk 50m and flag one yourself.", "approxCost": "₹80–150 per trip"},
    {"mode": "Train to Haridwar + onward", "tip": "Nearest major railhead is Haridwar (30km, ₹150 Ola). Rishikesh'\''s own Yog Nagari station has limited connectivity. Book 3AC minimum — avoid sleeper on overnight trains. Berths B1-B2 are closest to the TTE cabin.", "approxCost": "₹150 Haridwar → Rishikesh by Ola"}]',

  -- hidden_gems
  '[{"name": "Ganga Beach House (Anjali, host)", "type": "Guesthouse", "angle": "VS — Verified Safe", "why": "Female-run guesthouse two minutes from Ram Jhula. Anjali leaves the gate unlocked till 1am and WhatsApps your emergency contact each evening. Consistently the top recommendation in solo-women travel groups.", "approxCost": "₹2,400/night including breakfast"},
    {"name": "Zostel Plus Rishikesh (Women'\''s Dorm)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "The most recommended hostel for solo women in Rishikesh. Women'\''s dorm is on a separate floor with a coded door. Rooftop café has Ganga views. Staff are used to solo female guests.", "approxCost": "₹650 dorm | ₹2,200 private"},
    {"name": "Beatles Café (Swarg Ashram)", "type": "Café + workspace", "angle": "VS — Verified Safe", "why": "Named after The Beatles'\'' 1968 Rishikesh stay. Calm, women-comfortable atmosphere, reliable WiFi, good filter coffee. Fills with solo female travellers most mornings — natural meet-up spot.", "approxCost": "Coffee ₹80–120 | Meal ₹200–400"},
    {"name": "Parmarth Niketan Ganga Aarti (7pm)", "type": "Cultural experience", "angle": "VS — Verified Safe", "why": "The largest and most orderly Ganga Aarti in Rishikesh. Parmarth Niketan has designated women'\''s seating areas and security volunteers. Far safer than smaller ad-hoc aarti spots. Free entry.", "approxCost": "Free"},
    {"name": "Vinyasa Yoga Academy (RYS-200 certified)", "type": "Yoga school", "angle": "VS — Verified Safe", "why": "Yoga Alliance registered. Short drop-in classes (₹400–600) available without committing to full TTC. Teachers are accredited. Good for a single morning class if you don'\''t want a 200-hour commitment.", "approxCost": "Drop-in ₹400–600 | Full TTC from ₹45,000"}]',

  -- pre_book_checklist
  '["Book accommodation with a confirmed check-in time — ashram gates lock at 10pm and most hostels want you by 11pm",
    "Pre-book Ola from Dehradun airport at least 2 hours before landing (surge pricing spikes on arrival)",
    "Save Rishikesh Police helpline: 0135-2430900",
    "If doing rafting, verify operator'\''s GMVN licence number before paying",
    "Pack conservative clothing for the entire trip — no shorts, shoulders covered; this applies in cafes and at ghats equally"]',

  -- dos_and_donts
  '{"do": ["Walk the Ram Jhula side after 9pm — better lighting, more foot traffic than Lakshman Jhula area",
           "Confirm your guesthouse curfew time before checking in — most ashrams lock at 10pm, plan dinner before 8pm",
           "Book rafting via your hostel or a GMVN-licensed operator — receipt with your name and safety gear listed",
           "Use Ola or Rapido for all transport — auto negotiation is exhausting and consistently loses"],
    "dont": ["Walk alone near the old Lakshman Jhula bridge site after dark",
             "Pay for a yoga TTC without verifying the school'\''s Yoga Alliance RYS number",
             "Hand over your phone or wallet to anyone claiming to be a plainclothes officer",
             "Accept food or drink from strangers at the ghats or on the overnight bus from Delhi"]}',

  -- estimated_daily_budget
  '{"backpacker": 1200, "midRange": 2800, "comfortable": 7000, "currency": "INR"}',

  -- emergency_numbers
  '[{"label": "Rishikesh Police", "number": "0135-2430900"},
    {"label": "Women'\''s Helpline", "number": "1091"},
    {"label": "AIIMS Rishikesh (nearest major hospital)", "number": "0135-2462926"},
    {"label": "Ambulance", "number": "108"}]',

  true,
  'Premium covers: the 5 Yoga Alliance-verified schools with women-only drop-in options, a full river-rafting safety checklist with the 3 operators to avoid by name, the best female-run guesthouses not listed on Booking.com, and the shoulder-season window (March, October) when prices drop 35% and crowds disappear.',
  '{"booking": "https://www.booking.com/searchresults.html?ss=Rishikesh&aid=PLACEHOLDER"}'
);
