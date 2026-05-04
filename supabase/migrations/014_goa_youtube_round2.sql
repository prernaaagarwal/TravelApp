-- 014_goa_youtube_round2.sql
-- Round 2 of YouTube community research for Goa: 12 beware reports + 2 experience posts.
-- Beware reports: status='approved', GPS pinned for the scam map (pins + heatmap).
-- Community posts: status='approved', tab='experiences', will surface on /community.
-- reported_by_id / author_id are NULL (community-sourced, not user-submitted).
-- Run this in Supabase SQL Editor.

-- ─── BEWARE REPORTS ───────────────────────────────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, gps_lat, gps_lng, status)
VALUES

-- goa-bw-013: Physical driving licence mandatory
(
  'goa-india', 'Goa', 'Transport',
  $t$Physical driving licence mandatory — digital copy gets you fined and impounded$t$,
  'high',
  $d$Goa law enforcement has zero tolerance on this. You must carry the original physical driving licence when operating any rental vehicle. Digital copies on DigiLocker or photos on your phone are not accepted. Forgetting it results in heavy on-the-spot fines and immediate vehicle impoundment — leaving you stranded, often in areas with no transport alternatives. Before leaving your accommodation, run a three-point check: licence, cash, offline maps. Keep the licence in a small crossbody bag that stays on you at all times — not in the scooter storage box. If you genuinely forget it, do not ride. Call a cab instead.$d$,
  'YouTube Community Research',
  'All roads — particularly police checkpoints near Baga, Calangute, and on NH66',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-bw-014: Yellow plate only
(
  'goa-india', 'Goa', 'Transport',
  $t$Yellow number plate only — white plate rentals trigger police intervention$t$,
  'high',
  $d$Legal rental vehicles in Goa must display Yellow Number Plates (commercial registration). Many informal rental operators offer private white-plate vehicles at a lower rate. Operating a white-plate vehicle as a rental is illegal and results in aggressive police intervention, on-the-spot fines, and significant travel disruption. Multiple travelers have been caught mid-trip. Before handing over any money, check the number plate. Yellow = legal. White = do not rent. If a shop offers a white-plate vehicle, walk away. Pay slightly more for a legitimate rental — the fine and disruption cost far more.$d$,
  'YouTube Community Research',
  'Rental shops across North Goa — particularly informal operators near Baga, Calangute, Anjuna',
  '[]', 15.5740, 73.7345, 'approved'
),

-- goa-bw-015: Taxi union blocks app cabs from hotels
(
  'goa-india', 'Goa', 'Transport',
  $t$Taxi union blocks app-based rides from hotel porches — walk to main road first$t$,
  'high',
  $d$Local taxi unions in Goa actively prevent Ola, Uber, and Goa Miles drivers from picking up passengers directly at hotel entrances. Drivers are confronted and sometimes forced to leave without the passenger. To use any app-based or non-union transport, you must walk 5–10 minutes with your luggage to the main road before booking. This is not communicated by hotels. Book your ride once you are already walking toward the main road — not from your room. Time your checkout to allow for the walk. At night, go with another traveler or ask hotel staff to accompany you to the road. Do not stand alone with luggage at the hotel gate waiting for an app cab.$d$,
  'YouTube Community Research',
  'Hotels and guesthouses across North Goa — Baga, Calangute, Anjuna, Vagator',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-bw-016: Mopa airport mismatch for South Goa stays
(
  'goa-india', 'Goa', 'Transport',
  $t$Landing at Mopa for South Goa stay — 2.5 hour expensive taxi ride$t$,
  'medium',
  $d$Manohar International Airport (Mopa/GOX) is located in North Goa. Travelers who book the cheapest flight into Mopa for a South Goa stay face a 2.5-hour, ₹2,000–3,000+ taxi journey to reach Palolem, Agonda, or Benaulim. This is a common and expensive mistake made by first-time Goa visitors drawn to cheaper Mopa flight prices. Match your airport to your stay area. North Goa (Anjuna, Vagator, Arambol) → Mopa (GOX). South Goa (Palolem, Agonda, Benaulim) + Panjim → Dabolim (GOI). The flight price difference is almost never worth the taxi cost and 2.5 hours of transit.$d$,
  'YouTube Community Research',
  'Manohar International Airport (GOX), Mopa, North Goa',
  '[]', 15.7427, 73.8678, 'approved'
),

-- goa-bw-017: Baga/Calangute harassment for solo women
(
  'goa-india', 'Goa', 'Street / market',
  $t$Baga and Calangute — harassment risk for solo women, particularly at night$t$,
  'high',
  $d$Baga, Calangute, and central Candolim are consistently flagged by solo women travelers as high-harassment zones. Large groups of men, heavy drinking culture, and dense crowds create an environment where intrusive behaviour is common, particularly after dark. One traveler specifically documented a dangerous party scene where medical emergencies were ignored by bystanders. The drinking culture in these zones has been described as predatory. If you want beach and cafe culture without the harassment risk, base yourself in Ashwem, Morjim, or Arambol in the north, or Palolem in the south. If you visit Baga/Calangute, do it during the day only. Leave before dark. Never leave your drink unattended. Trust your gut immediately — do not wait to feel safer.$d$,
  'YouTube Community Research',
  'Baga Beach, Calangute Beach, Candolim central stretch — North Goa',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-bw-018: Real-time location social media risk
(
  'goa-india', 'Goa', 'Other',
  $t$Do not announce your real-time location on social media while in Goa$t$,
  'medium',
  $d$Multiple solo women travelers specifically flagged this. Posting your current location (hotel name, beach, area) in real time on Instagram Stories or WhatsApp status while you are still there creates a targeted vulnerability — particularly relevant in dense tourist areas where solo women are visible. Post content only after you have left the location. Batch your social media posts and post after you have moved on. Share live location only with your trusted emergency contacts privately — not publicly. This is especially important for solo travelers staying alone in guesthouses or hostels.$d$,
  'YouTube Community Research',
  'General — applies across Goa',
  '[]', 15.2993, 74.1240, 'approved'
),

-- goa-bw-019: Baggage limit 15kg
(
  'goa-india', 'Goa', 'Transport',
  $t$Domestic airline baggage limit is 15kg — not 25kg despite what staff may say$t$,
  'medium',
  $d$Standard domestic airline baggage allowance in India is 15kg. Some airline staff at check-in or boarding have mentioned a 25kg limit — this is a staff-only perk that does not apply to regular passengers. Travelers who pack to 25kg expecting it to be accepted face excess baggage fees at check-in. For Goa trips specifically, where beach gear, wet clothes, and shopping add weight, this catches travelers off guard. Check your specific ticket's baggage allowance when you book — it is stated in your booking confirmation. Do not rely on verbal information from airline staff. If you are planning to shop in Goa, either pack light coming in or budget for excess baggage fees or a separate check-in bag.$d$,
  'YouTube Community Research',
  'Goa airports (GOX and GOI) — domestic departures',
  '[]', 15.3808, 73.8314, 'approved'
),

-- goa-bw-020: Room secondary latch missing
(
  'goa-india', 'Goa', 'Accommodation',
  $t$Room secondary latch missing — demand a room change, not a repair promise$t$,
  'high',
  $d$Multiple accommodation checks across Goa have found rooms where the secondary security latch (door chain or bolt) is broken, missing, or non-functional. Hotels often promise a repair that doesn't arrive. For solo women, a room with only the primary lock is a genuine overnight security risk — staff and other guests can enter. On check-in, before unpacking anything, test the secondary latch. If it does not work: do not accept a repair promise. Ask for a different room immediately. If no alternative is available, use a portable door wedge alarm (₹300–500 on Amazon) — carry one for every trip. This is non-negotiable for solo overnight stays.$d$,
  'YouTube Community Research',
  'General — applies across all accommodation types in Goa',
  '[]', 15.5400, 73.7600, 'approved'
),

-- goa-bw-021: Cola Beach Jeep Union mandatory entry
(
  'goa-india', 'Goa', 'Transport',
  $t$Cola Beach Jeep Union — ₹100–200 per person to access the beach$t$,
  'medium',
  $d$Cola Beach in South Goa has a unique freshwater lagoon and is genuinely beautiful. However, the dirt road access is controlled entirely by a local Jeep Union. There is no alternative route — you cannot walk or drive your own vehicle in. The union charges ₹100–200 per person for the jeep transfer. This is not clearly disclosed on any mainstream travel listing for Cola Beach. Budget ₹200 per person for the Jeep Union transfer when planning a Cola Beach visit. Carry cash — UPI and cards are not accepted. This is not a scam per se — it is a local arrangement — but it is an undisclosed mandatory cost. Factor it in.$d$,
  'YouTube Community Research',
  'Cola Beach access road, South Goa',
  '[]', 15.0820, 73.9350, 'approved'
),

-- goa-bw-022: Dudhsagar cash + jeep + life jackets
(
  'goa-india', 'Goa', 'Transport',
  $t$Dudhsagar — shared Jeep ₹600, entry ₹260, cash only, no UPI$t$,
  'medium',
  $d$Dudhsagar Falls requires a shared jeep from the forest checkpoint (₹600) plus a separate entry fee (₹260). Cash only — no UPI, no cards. The forest area has no mobile network, making digital payment or emergency UPI transfers impossible. Solo travelers who arrive without sufficient cash face being turned away or stranded at the checkpoint. Carry minimum ₹1,000 cash per person before leaving for Dudhsagar. Life jackets are mandatory and provided at the falls pool — do not remove them. Leave before 3pm — the return jeep schedule is strict and missing it leaves you in a forest with no transport and no network.$d$,
  'YouTube Community Research',
  'Dudhsagar Falls forest checkpoint, South Goa',
  '[]', 15.3141, 74.3143, 'approved'
),

-- goa-bw-023: Peak season pricing
(
  'goa-india', 'Goa', 'Accommodation',
  $t$High season pricing 200–300% above standard — book 2–3 months in advance$t$,
  'medium',
  $d$During November–December (peak season and New Year), Goa accommodation prices inflate by 200–300% above standard rates. Properties that cost ₹1,200/night in October can reach ₹3,600–4,800/night in December. Near-zero vacancy is common from mid-December. Solo women who book last-minute in peak season often end up in unvetted or poorly located properties because good options are fully booked. For any peak season trip (Nov–Feb), book accommodation 2–3 months in advance. Lock in your hostel or guesthouse before buying flights. Off-season (May–October) offers 50% price reductions — same quality, significantly fewer crowds, and easier to get into vetted safer properties.$d$,
  'YouTube Community Research',
  'All of Goa — particularly North Goa',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-bw-024: Video walkthrough rental vehicle
(
  'goa-india', 'Goa', 'Transport',
  $t$Video walkthrough rental vehicle before departure — fraud damage claims are real$t$,
  'high',
  $d$Multiple travelers report rental operators claiming pre-existing damage was caused by the renter after return. Without documented evidence of the vehicle condition before departure, there is no recourse. Deposit amounts of ₹2,000–5,000 have been withheld citing scratches or damage that existed before the rental. Before you touch the vehicle: open your camera and do a slow full video walkthrough of the entire bike or car — all four sides, under the seat, handlebars, mirrors, tyres. Note every scratch verbally on camera. Send the video to yourself immediately so the timestamp is logged. Show the operator you are doing this. Most fraudulent damage claims stop here.$d$,
  'YouTube Community Research',
  'Rental shops across North and South Goa',
  '[]', 15.5740, 73.7345, 'approved'
);

-- ─── COMMUNITY POSTS (experiences tab) ────────────────────────────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- goa-cp-006: Solo Goa debrief
(
  'goa-cp-006', 'experiences',
  'YouTube Community Research', '25-29',
  $t$Complete solo Goa debrief — what I wish I knew before going$t$,
  $c$Went to Goa solo. Here is everything I wish someone had told me upfront. Transport: Ola and Uber barely work. Download Goa Miles before you land. Rent a scooter only if you have a physical licence with you — not a digital copy, the actual card. Check the number plate is yellow before you pay anything. Do a video of the entire bike before riding. Fuel it immediately — every rental I heard of came near-empty. Baga and Calangute: fine during the day, leave before dark. The harassment level in these areas after 9pm is real and consistent. Ashwem, Morjim, Arambol in the north are significantly more peaceful. Palolem in the south is the best overall solo women experience. Room check: test the secondary latch the moment you walk in. If it doesn't work, ask for a different room before you unpack. Never post your location in real time — batch your Stories and post after you've moved. Power bank is not optional. South Goa has network dead zones. Dudhsagar needs ₹1,000 cash minimum, no UPI works there. Cola Beach has a mandatory Jeep Union ₹200 entry — cash only. The best Goa is the one most people don't go to: Butterfly Beach, Ozran, Kegdole, Cabo de Rama. Get there early, go on a weekday.$c$,
  'goa-india', '[]', 'approved'
),

-- goa-cp-007: Group trip costs and mistakes
(
  'goa-cp-007', 'experiences',
  'YouTube Community Research', '25-29',
  $t$Group trip to Goa — the real costs, mistakes, and what worked$t$,
  $c$Went with a group of 5 women. Here is what we actually spent and what went wrong. High season (December) pricing was brutal — properties we had shortlisted in October had tripled by the time we booked in November. Lesson: book accommodation before you book flights in peak season. The villa from Day 3 onwards was the best decision — private kitchen, washing machine (essential, we went through clothes fast), infinity pool, everyone finally relaxed. Blinkit and Zepto do not deliver in Goa — do not rely on them for supplies. We had to use local kirana shops or drive to a supermarket. Group travel logistics: assign one person as the logistics lead. Distributed planning by committee caused constant delays and one full-day of confusion. For the villa kitchen, we brought a coffee maker and milk frother from home — it made mornings significantly better than relying on resort breakfast. Medical kit: remote beach villas are far from pharmacies. Bring your own basic kit. Casino Big Daddy on the Mandovi River: ₹4,000 entry, 21+ only. Worth it if that is your scene, but know the entry cost upfront. The floating casino feeder boats leave from specific ghats — identify this before you go so you are not wandering at night.$c$,
  'goa-india', '[]', 'approved'
);
