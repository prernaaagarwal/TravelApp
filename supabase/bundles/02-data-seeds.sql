-- ======================================================================
-- Wander Women migration bundle: 02-data-seeds
-- Run this in Supabase SQL Editor (project: vykbvnkpfqfmcilovzsw)
-- Generated 2026-05-04 09:04 UTC
-- ======================================================================


-- ---- 011_goa_seed_reports.sql ----
-- 011_goa_seed_reports.sql
-- Seeds Goa beware reports and community posts from YouTube community research.
-- All reports inserted with status='approved' so they appear on map and community pages immediately.
-- reported_by_id is NULL (community-sourced, not user-submitted).
-- Run this in Supabase SQL Editor.

-- ─── BEWARE REPORTS ───────────────────────────────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, gps_lat, gps_lng, status)
VALUES

-- goa-bw-001: Baga Lane exit — isolated and unlit after dark
(
  'goa-india', 'Goa', 'Street / market',
  'Baga Lane exit — isolated and unlit after dark',
  'high',
  'The stretch from Baga Lane toward the La Solas exit is poorly lit with zero foot traffic after sunset. The transition from the busy shack area to the main road runs through an isolated connector lane that multiple women found anxiety-inducing. One group explicitly moved to a car-only policy after experiencing this stretch on foot. Arrange vehicle pickup directly at the Baga Lane establishment before you leave. Do not walk this stretch after dark. The safe exit is via the La Solas to main road route — identify it on Maps before leaving the shack.',
  'YouTube Community Research',
  'Baga Lane → La Solas exit, Baga Beach, North Goa',
  '[]', 15.5586, 73.7527, 'approved'
),

-- goa-bw-002: Google Maps sends you to empty locations on Divar Island
(
  'goa-india', 'Goa', 'Transport',
  'Google Maps sends you to empty locations on Divar Island',
  'high',
  'Solo traveler navigating to Divar Island for sunset was repeatedly directed by Google Maps to empty plots with no points of interest. This caused a 6–7 hour unplanned scooter journey, arriving back at 9pm in the dark — significantly increasing risk of accidents and predatory targeting. Digital infrastructure failure in rural/island Goa is a real and underreported risk. Download offline maps for Divar Island and surrounding areas before leaving. Ask your hostel for a physical landmark description of your destination. Never rely solely on Google Maps for island routes in Goa. Set a hard turnaround time: if you are not there by 4pm, turn back.',
  'YouTube Community Research',
  'Divar Island, North Goa',
  '[]', 15.5127, 73.8778, 'approved'
),

-- goa-bw-003: Uber and Ola have virtually no presence in Goa
(
  'goa-india', 'Goa', 'Transport',
  'Uber and Ola have virtually no presence in Goa',
  'high',
  'Multiple solo women travelers discovered on arrival that Uber and Ola do not operate meaningfully in North Goa — particularly in areas like Mandrem, Anjuna, and Vagator. This leaves solo women entirely dependent on local taxi unions (known for overcharging) or scooter rentals. This is not communicated upfront by any mainstream travel resource. Do not rely on Uber or Ola in Goa. Book GoaMiles via app for airport and intercity transfers — they are metered, professional, and safe. For local mobility rent a scooter from an established shop with a written receipt. Negotiate taxi fares before getting in and confirm in writing if possible.',
  'YouTube Community Research',
  'All of North Goa — particularly Mandrem, Anjuna, Vagator, Arambol',
  '[]', 15.5736, 73.7382, 'approved'
),

-- goa-bw-004: Rental scooters delivered on empty — no phone mount standard
(
  'goa-india', 'Goa', 'Transport',
  'Rental scooters delivered on empty — no phone mount standard',
  'medium',
  'Scooter rental shops in North Goa (Mandrem area reported specifically) deliver bikes with an empty fuel tank as standard practice. First stop must be a petrol pump. Additionally, rental scooters almost never come with phone mounts — navigating hilly winding terrain like Assagao without a mount requires repeated stops to check maps, increasing both time on road and distraction risk for solo riders. Bring your own portable phone mount (₹150–300 on Amazon, worth every rupee). Assume the bike arrives empty — ask the rental shop where the nearest petrol pump is before you leave. Check tyre pressure and brakes before signing anything.',
  'YouTube Community Research',
  'Scooter rental shops, North Goa — particularly Mandrem and Assagao area',
  '[]', 15.6490, 73.7316, 'approved'
),

-- goa-bw-005: Walking in May heat 12–4pm is dangerous
(
  'goa-india', 'Goa', 'Other',
  'Walking in May heat 12–4pm is dangerous — not just uncomfortable',
  'medium',
  'A solo traveler attempted a 10-minute walk at 3:30pm in early May and described the experience as overwhelming. North Goa''s May humidity is extreme — the heat index makes outdoor walking a genuine endurance and safety risk during peak hours, not just an inconvenience. Dehydration and disorientation increase accident and vulnerability risk significantly. Treat 12pm–4pm as a no-walk window in April–June. Schedule spa treatments, indoor rest, or hostel time during these hours. If you must go out: bring 1.5L water minimum, wear a wet scarf, and take a vehicle even for short distances. Eat before going out — skipping meals in heat slows reaction time.',
  'YouTube Community Research',
  'All of North Goa — particularly coastal areas',
  '[]', 15.5506, 73.7556, 'approved'
),

-- goa-bw-006: Tanzanite area (Anjuna) — secluded lane, needs vehicle at night
(
  'goa-india', 'Goa', 'Accommodation',
  'Anjuna Market lane — secluded and poorly lit after dark',
  'medium',
  'The lane behind Anjuna Market where several resorts are located offers a peaceful buffer from main-road noise — but the high greenery density and lack of main-road frontage creates a secluded, poorly lit environment that is challenging to navigate safely on foot after dark. Low tourist density during monsoon season amplifies the isolation factor. Pre-plan your evening return route before you leave the property. Arrange a vehicle even for short distances after sunset — the isolation of these lanes removes the safety of other people being around. Identify the main road access point on Google Maps before your first outing.',
  'YouTube Community Research',
  'Lane behind Anjuna Market, Anjuna, North Goa',
  '[]', 15.5757, 73.7432, 'approved'
),

-- goa-bw-007: Goa airport delays common
(
  'goa-india', 'Goa', 'Transport',
  'Goa airport delays common — arrive 3 hours early',
  'medium',
  'Goa''s Manohar International Airport (GOX) is susceptible to cascading delays from mainland airspace congestion. One-hour delays have been reported due to Delhi airspace issues. Missing a flight creates serious logistical and financial risk for a solo traveler with no support system. Arrive at GOX at least 3 hours before departure. The airport is well-equipped and comfortable — arriving early is not a hardship. Book flexible or changeable tickets where possible when flying solo.',
  'YouTube Community Research',
  'Manohar International Airport (GOX), North Goa',
  '[]', 15.7120, 73.9014, 'approved'
),

-- goa-bw-008: Anjuna pickup adds ₹100 exception fee to tour bus tickets
(
  'goa-india', 'Goa', 'Transport',
  'Anjuna pickup adds ₹100 undisclosed fee to tour bus tickets',
  'medium',
  'Standard public tour bus from North to South Goa costs ₹300. However, travelers boarding from Anjuna are charged an additional ₹100 exception fee for the remote pickup location — making the total ₹400. This is not disclosed upfront when booking and catches solo travelers off guard, especially first-timers budgeting tightly. Budget ₹400 not ₹300 if you are boarding from Anjuna. Confirm the total fare including pickup surcharge before boarding. If booking via an app or agent, ask explicitly: Is there an Anjuna pickup fee?',
  'YouTube Community Research',
  'Anjuna pickup point, North Goa — public tour buses to South Goa',
  '[]', 15.5736, 73.7382, 'approved'
),

-- goa-bw-009: Tour bus guide gives Hindi briefing first
(
  'goa-india', 'Goa', 'Transport',
  'Tour bus guide gives Hindi briefing first — English only on request',
  'medium',
  'On public tour buses in Goa, guides default to Hindi for all safety instructions, historical context, and logistics briefings. Non-Hindi speakers — including international travelers and English-only Indian travelers — receive no briefing unless they specifically ask for an English round. A solo international traveler reported feeling her brain go offline and missing critical instructions during the initial Hindi-only briefing. As soon as you board, tell the guide directly: Can you please give me the briefing in English? Most guides will accommodate. Sit near the guide rather than at the back. If booking a tour, ask the operator upfront whether English-language guiding is available.',
  'YouTube Community Research',
  'Public tour buses, North Goa to South Goa route',
  '[]', 15.4909, 73.8278, 'approved'
),

-- goa-bw-010: UNESCO World Heritage stop — 1 hour is not enough
(
  'goa-india', 'Goa', 'Temple / attraction',
  'UNESCO World Heritage stop — 1 hour for two major sites is not enough',
  'medium',
  'The standard public tour bus itinerary allocates only 1 hour for the Basilica of Bom Jesus and the adjacent Archaeological Museum combined. During peak crowd times this means the museum — which contains stone carvings dating to the 11th century — gets under 10 minutes of actual viewing time. Solo travelers who want to properly engage with these sites will be rushed and frustrated on the standard tour. If history and heritage are your priority, book a private tour or go independently — not on the standard group bus. The church entry is free, the upstairs gallery costs ₹10. Give yourself minimum 2 hours for both sites. Early morning (before 10am) has significantly lower crowd density.',
  'YouTube Community Research',
  'Basilica of Bom Jesus + Archaeological Museum, Old Goa, South Goa',
  '[]', 15.5009, 73.9116, 'approved'
),

-- goa-bw-011: Frequent hotel switching — the biggest energy drain on Goa trips
(
  'goa-india', 'Goa', 'Accommodation',
  'Frequent hotel switching — the biggest time and energy drain on Goa trips',
  'medium',
  'A group changed accommodation on Day 1, Day 2, Day 3, and Day 4 of their trip trying to sample multiple properties across North and South Goa. The result: most of the trip was consumed by checking in and out, logistics management, and travel fatigue rather than actual exploration. One last-minute cancellation caused a complete itinerary collapse. For solo women, frequent moves also multiply the number of new environments to assess for safety each time. Pick one base and stay there. For a 4-day trip, two maximum accommodation changes is the practical limit. For solo travel especially, settling into a property you have assessed for safety and then leaving resets your entire threat assessment. Stability equals safety.',
  'YouTube Community Research',
  'General — applies to all of Goa',
  '[]', 15.4909, 73.8278, 'approved'
),

-- goa-bw-012: Monsoon rain turns roads hazardous on scooters
(
  'goa-india', 'Goa', 'Transport',
  'Monsoon rain turns roads hazardous — defensive driving essential on scooters',
  'high',
  'Heavy monsoon rain in Goa reduces visibility significantly and makes roads slippery, especially on the hilly winding terrain of North Goa. For solo women on rental scooters — already navigating unfamiliar terrain without a phone mount — monsoon conditions dramatically increase accident risk. If rain starts while you are riding: pull over under a shelter and wait — monsoon showers in Goa often pass within 15–30 minutes. Do not ride in heavy rain. Wear closed shoes not sandals when scooting in monsoon. Keep a light rain jacket in your bag at all times. Reduce planned riding distance per day during monsoon season.',
  'YouTube Community Research',
  'All roads, North Goa — particularly hilly routes toward Assagao, Anjuna, Vagator',
  '[]', 15.5736, 73.7382, 'approved'
),

-- Report 1: Unregistered taxis overcharging at Dabolim Airport
(
  'goa-india', 'Goa', 'Transport',
  'Unregistered taxis overcharging tourists at Dabolim Airport & North Goa',
  'high',
  'Unregistered taxis at Dabolim Airport and across North Goa (Baga, Calangute) quote inflated fares with no meter and no recourse. The drive from the airport to South Goa alone takes approximately 1 hour 45 minutes — making overcharging costly. Always pre-book via the Goa Miles app for airport or station transfers. Goa Miles is reliable for drops but too expensive for sightseeing. Never negotiate with unregistered drivers outside the airport.',
  'YouTube Community Research',
  'Dabolim Airport / Baga / Calangute',
  '[]', 15.3806, 73.8314, 'approved'
),

-- Report 2: North Goa traffic trap
(
  'goa-india', 'Goa', 'Transport',
  'North Goa traffic trap — tourists stuck up to 4 hours in Baga & Calangute',
  'medium',
  'North Goa, particularly around Baga and Calangute, is plagued by extreme traffic congestion. Tourists in cars and taxis have reported being completely stuck for up to 4 hours. This is not an occasional problem — it is chronic during peak season and holidays. Renting a scooter (₹350–₹700/day) is the only realistic way to navigate. Avoid North Goa entirely if you are seeking peace — it is widely described as chaotic and energy-draining.',
  'YouTube Community Research',
  'Baga / Calangute, North Goa',
  '[]', 15.5544, 73.7518, 'approved'
),

-- Report 3: Scooter rental scam — charging for pre-existing damage
(
  'goa-india', 'Goa', 'Transport',
  'Scooter rental scam — shops charging for pre-existing damage',
  'high',
  'Scooter rental shops across Goa have been reported to charge tourists for damage that existed before the rental. Without documented proof, tourists have no way to dispute claims. Always shoot a full video walkthrough of the scooter before leaving the shop — every scratch, dent, and worn part. A valid ID is required for all rentals. Rental prices range from ₹350–₹700/day and can surge during holidays. Fuel is often unavailable at traditional gas stations in smaller towns — locals sell it in repurposed water bottles at roadside stands.',
  'YouTube Community Research',
  'Scooter rental shops across Goa',
  '[]', 15.5736, 73.7382, 'approved'
),

-- Report 4: Beach shack seafood bill shock
(
  'goa-india', 'Goa', 'Food & drink',
  'Beach shack seafood bill shock — prices not disclosed upfront',
  'high',
  'Multiple travellers have reported being hit with unexpectedly high bills at beach shacks, particularly for seafood. Prices are often not displayed on menus or quoted verbally before ordering. By the time the bill arrives, tourists have little recourse. Always ask for the price of every seafood item before ordering. This is especially prevalent in North Goa shacks near tourist beaches. Budget travellers should stick to local eateries for fish thalis at ₹120–₹200, which are transparent in pricing.',
  'YouTube Community Research',
  'Beach shacks, North Goa tourist beaches',
  '[]', 15.5570, 73.7553, 'approved'
),

-- Report 5: Dangerous swimming conditions — red flags
(
  'goa-india', 'Goa', 'Other',
  'Dangerous swimming conditions — red flags ignored by tourists',
  'critical',
  'Strong and unpredictable ocean currents kill tourists in Goa every season. Red flags are posted on beaches to indicate dangerous swimming conditions, but many tourists ignore or are unaware of their meaning. Open beaches like Agonda are particularly exposed. Never enter the water when a red flag is displayed. Additionally, the sun at open beaches is intense — sun exposure without shade or protection at beaches like Agonda has caused severe burns and heatstroke in tourists.',
  'YouTube Community Research',
  'Agonda Beach / open beaches across Goa',
  '[]', 14.9978, 73.9961, 'approved'
),

-- Report 6: Bag theft on crowded tourist beaches
(
  'goa-india', 'Goa', 'Street / market',
  'Bag theft on crowded tourist beaches',
  'high',
  'Theft of unattended bags is a persistent and well-documented problem on crowded Goa beaches, especially in North Goa. Phones, cash, passports, and cameras left on beach towels while swimming are common targets. Never leave bags unattended on the beach. Travel in groups where one person can watch belongings, or use waterproof pouches worn on your body while in the water.',
  'YouTube Community Research',
  'Crowded tourist beaches, North Goa',
  '[]', 15.5570, 73.7553, 'approved'
),

-- Report 7: Overtourism crisis — 800 tons of daily waste
(
  'goa-india', 'Goa', 'Other',
  'Overtourism crisis — 800 tons of daily waste impacting beaches and rivers',
  'medium',
  'Goa is in the grip of a severe overtourism crisis with approximately 6 tourists for every 1 local resident. The state generates 800 tons of waste daily, much of which ends up directly on beaches and in rivers. Travellers should be aware that many popular beaches are significantly more polluted than advertised. South Goa and hidden gems like Cola Beach and Netraali Waterfall are comparatively cleaner. Avoid North Goa beach areas if cleanliness and peace are priorities.',
  'YouTube Community Research',
  'North Goa beaches / rivers statewide',
  '[]', 15.5506, 73.7556, 'approved'
),

-- Report 8: Budget hostel price surge during peak season
(
  'goa-india', 'Goa', 'Accommodation',
  'Budget hostel price surge during peak season and holidays',
  'medium',
  'Budget hostels in Palolem, Vagator, and Anjuna, which typically cost ₹350–₹500/night, can surge significantly during peak season (November–February) and public holidays. Scooter rental prices similarly jump to the ₹700/day upper end. Travellers planning a ₹5,000 budget trip must account for these surges. Off-season travel (avoiding the monsoon period June–September due to heavy rain and humidity) can help normalize pricing. Always book hostels in advance during the November–February window.',
  'YouTube Community Research',
  'Palolem / Vagator / Anjuna',
  '[]', 15.6048, 73.7413, 'approved'
),

-- Report 9: Hidden jungle sanctuary — access via WhatsApp
(
  'goa-india', 'Goa', 'Temple / attraction',
  'Hidden jungle sanctuary — access only via local WhatsApp groups or flyers',
  'medium',
  'A secluded wellness spot known as The Sanctuary offering saunas, ice baths, and aromatherapy is not listed on standard travel platforms. Access is only possible through local WhatsApp groups or physical flyers distributed in certain cafes and hostels. This means tourists can easily be misled by unofficial or fake promoters charging entry fees for access. Verify legitimacy through hostel staff in Vagator or Anjuna before paying anyone claiming to offer access.',
  'YouTube Community Research',
  'The Sanctuary (jungle area, exact location via local flyers), Anjuna',
  '[]', 15.5736, 73.7382, 'approved'
),

-- Report 10: Anjuna Flea Market and Mapusa Market — counterfeit goods
(
  'goa-india', 'Goa', 'Street / market',
  'Anjuna Flea Market and Mapusa Market — watch for overpriced and counterfeit goods',
  'medium',
  'The Anjuna Flea Market (jewelry, quirky finds) and Mapusa Market (spices, cashews) are well-known tourist destinations but are also hotspots for overpriced goods marketed as artisanal or authentic. Prices are rarely fixed and vendors target tourists with inflated opening prices. Always bargain firmly. For genuine handmade macramé jewelry, Paradise Boutique is a recommended verified seller. For budget fashion, Zudio offers beachwear for ₹200–₹400 and is a safer, price-transparent alternative to market stalls.',
  'YouTube Community Research',
  'Anjuna Flea Market / Mapusa Market, North Goa',
  '[]', 15.5736, 73.7382, 'approved'
);


-- ─── COMMUNITY POSTS ──────────────────────────────────────────────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

(
  'goa-cp-001', 'experiences', 'Community Research', '18-24',
  'Solo birthday in Goa — Jungle by Mango Tree hostel honest review',
  'Stayed at Jungle by Mango Tree for my 23rd birthday — solo. Security felt genuinely good, 10/10 vibe. Rooms named after animals and regions (Elephant, Gorilla, Jaguar, China) rather than numbers — adds a personal touch that lowered my anxiety weirdly. Good workspace, social swings area, felt safe mingling. The real chaos came from navigation — not from people. Google Maps on Divar Island sent me to empty plots repeatedly. Ended up riding for 6–7 hours, arrived back at 9pm in the dark, arms and back completely wrecked. The island is beautiful but go with a specific offline-saved destination, not just a vague GPS point. No harassment, no scams, no safety incidents with people — just a complete digital infrastructure failure that turned a sunset trip into a survival mission.',
  'goa-india', '[]', 'approved'
),

(
  'goa-cp-002', 'experiences', 'Community Research', '25-32',
  '4 days solo in Mandrem — medical student between exams, honest debrief',
  'Went to Mandrem solo between finishing MBBS exams and starting internship. Needed to decompress, wanted to surf. Stayed at Leela Cottages — private solo cottages, two levels, direct beach access 20 steps away, private balcony. Genuinely felt like a safe sanctuary. Took surfing lessons with Sugar — 19 years old, five-time national champion, left school at 15 to pursue ocean. One of the most inspiring people I have met on any trip. The ocean was rough, came back with bruised knees, zero regrets. Practical realities: Uber/Ola don''t exist here. Rented a scooter at ₹500/day — hilly terrain is harder than flat cities, bring your own phone mount because none of the rentals have one and Assagao roads need your eyes on the road. Walking after 12pm in May is genuinely dangerous — humidity is unforgiving. Book indoor activities (spa, reading, embroidery) for 12–4pm. Vegetarian options exist but you have to look: Sol Kadhi at The Restaurant is mandatory. Savora by Cafe Deli in Assagao is worth a 30-minute ride for their house butter on white bread.',
  'goa-india', '[]', 'approved'
),

(
  'goa-cp-003', 'experiences', 'Community Research', '25-32',
  'Girls trip to Anjuna/Baga — monsoon season, honest safety notes',
  'Took a girls trip to North Goa during monsoon. Arrived Vande Bharat from Dadar (05:30 departure, arrives Thivim 12:30 — smooth, comfortable, recommended for women traveling in a group). Stayed at Tanzanite Boutique Resort in the lane behind Anjuna Market — peaceful, good greenery, but secluded. The 15–20 min walk to Anjuna Beach is fine during the day. Do NOT attempt it on foot at night. After Day 1, one person in our group officially gave up walking — we switched to car-only for all evening movement and it was absolutely the right call. The Baga Lane to La Solas exit stretch is the specific danger point — poor lighting, isolated, unsettling even in a group. We felt nervous the moment we left the shack area. Monsoon adds: fewer tourists means you are more often the only people on a path, rain cuts visibility, and some shack upper decks close during heavy downpours. Anjuna Beach itself during monsoon is quieter and respectful. Baga had more activity even off-season. Big Daddy Cruise from Baga was a highlight but plan your transport from beach to cruise terminal in advance — it is a multi-modal transfer.',
  'goa-india', '[]', 'approved'
),

(
  'goa-cp-004', 'experiences', 'Community Research', '18-24',
  'Solo in Goa as a Black international student — what nobody tells you',
  'I am a 24-year-old Zimbabwean student, based in Anjuna, and traveled solo to South Goa during monsoon. A few things nobody prepares you for as a visibly foreign solo woman in Goa: you will be stared at, sometimes admired, sometimes just genuinely curious — often all three in the same location. It is exhausting in a way that is hard to describe unless you have experienced being the only foreigner in a room. It does not feel unsafe most of the time — it feels visible. Dealing with it: use your headphones, set your own pace, and make peace with the fact that your presence alone is doing something for every other person from your background who comes after you. Practical notes: the 45-minute bus wait in the rain felt like a potential setup but was just normal local transport chaos — learn to distinguish between delay and danger. Tour buses speak Hindi first, English only if you ask. Public tour bus North-South costs ₹400 from Anjuna (₹300 base + ₹100 pickup fee). Shared taxi return ₹160 when split five ways. Basilica of Bom Jesus is free, museum upstairs is ₹10. Budget tripod from a local shop ₹700 — worth it for solo photography without depending on strangers. Use a remote shutter so you control your own shots. Rooms: lock from inside always. Back before dark always. Share your live location with someone who will notice if you go quiet.',
  'goa-india', '[]', 'approved'
),

(
  'goa-cp-005', 'experiences', 'Community Research', '25-32',
  'Girls trip chaos — what 4 hotel changes in 5 days actually costs you',
  'Went to Goa with a group. Changed hotels on Day 1, 2, 3, and then a villa from Day 4. Trying to experience different areas sounded good in planning. In reality: most of the trip was packing, checking out, finding the next place, checking in, unpacking, and by then it was evening. The villa from Day 4 onwards was the only time the trip actually felt like a trip — infinity pool, full kitchen, washing machine (essential in monsoon), everyone finally relaxed and started actually talking to each other. Lesson: pick one base. Two at most for a 5-day trip. For solo travel especially — every new property is a new safety assessment. New exits, new staff, new neighbourhood. Do it once, do it well. Practical finds from the trip: Blinkit delivers to remote villas (we used it for milk, coffee, garlic when we were too far from any shop). False deadlines work on slow-moving friends — told the group breakfast closed at 10am when it actually closed at 10:30am. In monsoon: abandon the long dresses immediately. Shorts and a light shirt — you will be wading through splash zones constantly. Stingray on the beach: do not touch or get close even if it looks dead. Stingray strikes are fatal and dead specimens can still have active venom.',
  'goa-india', '[]', 'approved'
);


-- ---- 012_goa_tripadvisor_beware.sql ----
-- 012_goa_tripadvisor_beware.sql
-- Seeds 15 Goa beware reports from TripAdvisor community research.
-- All inserted with status='approved' and GPS coordinates so they appear on the map immediately.
-- reported_by_id is NULL (community-sourced, not user-submitted).
-- Run this in Supabase SQL Editor.

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, gps_lat, gps_lng, status)
VALUES

-- goa-ta-001: Tito's Lane, Baga
(
  'goa-india', 'Goa', 'Street / market',
  'Baga Beach — solo women warned to avoid Tito''s Lane, especially at night',
  'high',
  'Multiple experienced travellers have flagged Tito''s Lane in Baga as unsafe for solo women tourists. One traveller booked 3 nights in Baga and checked out after just one night. The area around Tito''s Lane involves aggressive touts, drunk crowds, and persistent male attention that goes beyond normal. This is not a vibe issue — it is a repeated, specific safety warning from people who have been there. Solo women seeking a relaxed Goa experience should avoid this stretch entirely and opt for South Goa instead.',
  'Tripadvisor Community Research',
  'Tito''s Lane, Baga Beach, North Goa',
  '[]', 15.5569, 73.7545, 'approved'
),

-- goa-ta-002: Airport taxis
(
  'goa-india', 'Goa', 'Transport',
  'North Goa taxi drivers — no meter, no fixed rate, tourists routinely overcharged',
  'high',
  'Goa''s taxi union has blocked Uber and Ola in most areas, leaving tourists dependent on unregistered local taxis with no meters and no accountability. Solo women arriving at Dabolim Airport or travelling between North Goa beaches are particularly targeted with inflated fares. Drivers quote different prices to different people for the same journey. Always agree on a price before getting in, ask your accommodation to arrange transport, or use the Goa Miles app for airport transfers only. Never get into a taxi that approaches you first at tourist spots.',
  'Tripadvisor Community Research',
  'Dabolim Airport / Baga / Calangute / Candolim, North Goa',
  '[]', 15.3808, 73.8314, 'approved'
),

-- goa-ta-003: Beach shack bill shock
(
  'goa-india', 'Goa', 'Food & drink',
  'Beach shack seafood — prices not shown on menu, bill shock is common and deliberate',
  'high',
  'Beach shacks across Goa, particularly in North Goa tourist areas, do not display seafood prices on menus. Items like lobster, tiger prawns, and kingfish are priced at the server''s discretion and tourists are only told the total at the end. Bills that seem like they should be ₹600–800 can come back at ₹2,500–4,000. Solo women dining alone are more frequently targeted as there is no one to share the complaint with. Always ask the price of every seafood item individually before ordering. If a server refuses to quote a price, leave.',
  'Tripadvisor Community Research',
  'Beach shacks across North Goa — Baga, Calangute, Anjuna',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-ta-004: Scooter rental damage scam
(
  'goa-india', 'Goa', 'Transport',
  'Scooter rental shops — charging for pre-existing damage on return, no proof = no defence',
  'high',
  'A well-documented scam across Goa: rental shops note down existing scratches and damage vaguely or not at all, then claim new damage when you return the scooter. Without video evidence shot before you left the shop, you have no recourse and most tourists pay to avoid confrontation. Always shoot a full video of the entire scooter — every panel, every scratch, the odometer, the lock — before riding away. Send the video to yourself via WhatsApp so it is timestamped. This is non-negotiable regardless of how friendly the shop owner seems.',
  'Tripadvisor Community Research',
  'Scooter rental shops — Anjuna, Vagator, Baga, Palolem',
  '[]', 15.5740, 73.7345, 'approved'
),

-- goa-ta-005: Red flag rip currents (critical)
(
  'goa-india', 'Goa', 'Other',
  'Red flag warnings ignored — dangerous currents kill tourists in Goa every season',
  'critical',
  'Red flags on Goa beaches indicate dangerous swimming conditions due to strong and unpredictable currents. These are not cautionary suggestions — they are serious warnings. Tourist deaths from drowning occur every peak season, including at popular beaches. Many tourists, particularly first-timers, are unaware of the flag system or assume it is overly cautious. Do not enter the water when a red flag is displayed under any circumstances. Open beaches like Agonda are particularly exposed to strong currents even when the surface looks calm.',
  'Tripadvisor Community Research',
  'Agonda Beach / Palolem / Colva / all open beaches',
  '[]', 15.0377, 73.9831, 'approved'
),

-- goa-ta-006: Commission-based tour operators South Goa
(
  'goa-india', 'Goa', 'Street / market',
  'Fake or commission-based tour operators near South Goa hotels — day trip overpricing',
  'high',
  'Tour operators and freelance guides who approach solo women outside hotels in Palolem and Agonda frequently quote prices 3–4x higher than the going rate for standard day trips to Old Goa, Dudhsagar Falls, or spice plantations. They also take commission from specific restaurants and shops on the route, meaning your "tour" becomes a shopping circuit. Always book day trips through your hotel or a verified operator. Ask other travellers at your accommodation what they paid for the same trip before agreeing to anything.',
  'Tripadvisor Community Research',
  'Outside hotels and beach entrances — Palolem, Agonda, Patnem',
  '[]', 15.0107, 74.0230, 'approved'
),

-- goa-ta-007: Beach bag theft
(
  'goa-india', 'Goa', 'Street / market',
  'Beach bag theft — unattended belongings stolen while swimming, happens daily in peak season',
  'high',
  'Theft of bags, phones, and cameras left on beach towels while swimming is extremely common across Goa beaches in peak season (November–February). Solo women are particularly vulnerable as there is no travel companion to watch belongings. Thieves work quickly and professionally — by the time you are out of the water, they are gone. Never leave any valuables unattended on the beach. Use a waterproof pouch worn on your body while swimming. Most beach hut accommodations have in-room safes — use them every time.',
  'Tripadvisor Community Research',
  'All popular beaches — Baga, Calangute, Palolem, Agonda, Anjuna',
  '[]', 15.5556, 73.7527, 'approved'
),

-- goa-ta-008: North Goa traffic (solo women stuck in taxis)
(
  'goa-india', 'Goa', 'Transport',
  'North Goa extreme traffic — solo women in taxis stuck for hours with unknown drivers',
  'medium',
  'Traffic congestion in North Goa around Baga, Calangute, and Candolim is severe during peak season. Tourists have reported being stuck in taxis for up to 4 hours on short distances. For solo women this means extended time alone in a vehicle with an unknown driver, no clear route, and limited ability to exit. Avoid North Goa by car or taxi during weekends and holidays entirely. If you must travel, go early morning before 8am. Scooter rental (₹350–700/day) is the only realistic way to move freely — but always document the vehicle before riding.',
  'Tripadvisor Community Research',
  'Baga, Calangute, Candolim — North Goa',
  '[]', 15.5449, 73.7526, 'approved'
),

-- goa-ta-009: Beach hut security Agonda
(
  'goa-india', 'Goa', 'Accommodation',
  'Agonda beach hut locks — basic security only, do not leave valuables in the room',
  'medium',
  'Beach huts in Agonda and Palolem are typically wooden structures with basic padlock or latch systems. While the areas are generally safe and theft from rooms is not common, the physical security of these huts is minimal. Windows are often just mesh screens. Solo women should not leave passports, large amounts of cash, or expensive electronics in beach hut rooms. Use the in-room safe if provided, or ask reception to lock valuables in their main safe. This is standard practice at all Goa beach hut resorts.',
  'Tripadvisor Community Research',
  'Beach hut accommodation — Agonda, Palolem, Patnem',
  '[]', 15.0377, 73.9831, 'approved'
),

-- goa-ta-010: Spice plantation commission tours
(
  'goa-india', 'Goa', 'Temple / attraction',
  'Goa spice plantation tours — heavily commission-driven, ''free lunch'' is not free',
  'medium',
  'Spice plantation tours sold by hotel front desks and roadside operators across Goa typically include a "complimentary" lunch and are marketed as a cultural experience. In reality, these tours are heavily commission-based — the driver earns money from the plantation and the lunch is factored into an inflated tour price. The plantations themselves can be interesting but the experience is often rushed and the lunch quality is poor. Compare prices at multiple sources before booking and read recent reviews specifically for the operator, not just the plantation.',
  'Tripadvisor Community Research',
  'Tour operators across Goa — North and South',
  '[]', 15.3735, 74.0260, 'approved'
),

-- goa-ta-011: Sun / heatstroke risk
(
  'goa-india', 'Goa', 'Other',
  'Sun exposure at open Goa beaches — heatstroke risk is serious, especially for first-time India visitors',
  'high',
  'The sun in Goa is significantly more intense than most European or East Asian destinations. Tourists, particularly those arriving from the UK and Europe in January and February, severely underestimate the UV exposure on open beaches like Agonda and Palolem. Heatstroke and severe sunburn within the first 2–3 days are common, especially for mature travellers whose skin may be more sensitive. Seek shade between 11am–3pm without exception. Apply SPF50+ and reapply every 90 minutes. A wide-brimmed hat is not optional — it is essential.',
  'Tripadvisor Community Research',
  'Open beaches — Agonda, Palolem, Colva, Morjim',
  '[]', 15.0377, 73.9831, 'approved'
),

-- goa-ta-012: Anjuna / Mapusa fake goods
(
  'goa-india', 'Goa', 'Street / market',
  'Anjuna and Mapusa markets — fake antiques and ''handmade'' goods that are mass produced',
  'medium',
  'The Anjuna Flea Market and Mapusa Market are popular with tourists but are well-known among locals for selling mass-produced goods falsely described as handmade, antique, or locally crafted. Wooden statues, silver jewellery, pashminas, and "antique" coins are common culprits. Prices are always negotiable, which means the opening price is set assuming tourists will not bargain. If you are buying as a gift or souvenir, bargain firmly and assume nothing is as described unless you can verify it. For genuine handmade jewellery, seek out smaller verified sellers.',
  'Tripadvisor Community Research',
  'Anjuna Flea Market / Mapusa Market',
  '[]', 15.5740, 73.7345, 'approved'
),

-- goa-ta-013: Dudhsagar Falls jeep safety
(
  'goa-india', 'Goa', 'Temple / attraction',
  'Dudhsagar Falls day trip — road conditions and safety concerns solo women should know',
  'medium',
  'Dudhsagar Falls is a popular day trip from both North and South Goa. The jeep ride to the falls involves extremely rough, unpaved terrain and the vehicles are overcrowded. Solo women have reported being packed into jeeps with groups of men and experiencing the ride as uncomfortable and occasionally intimidating. The falls area itself is beautiful but crowded, and the return journey can be disorganised. Book through a reputable operator, confirm the group size and vehicle type before paying, and avoid going on weekends when crowds peak.',
  'Tripadvisor Community Research',
  'Dudhsagar Falls, Mollem — accessible from North and South Goa',
  '[]', 15.3141, 74.3143, 'approved'
),

-- goa-ta-014: Baga accommodation noise
(
  'goa-india', 'Goa', 'Accommodation',
  'Accommodation near Baga and Calangute — noise levels not disclosed at booking, sleep impossible',
  'medium',
  'Hotels and guesthouses within 500 metres of Baga Beach and Calangute frequently advertise as "peaceful" or "quiet" online, but are in earshot of clubs and beach parties that run until 3–4am during peak season (December–February). Solo women who have booked these accommodations expecting rest have reported nights of no sleep and no refund. Before booking any North Goa accommodation, check its exact distance from Tito''s Lane and Baga Beach on Google Maps. If it is less than 1km, assume noise will be an issue on weekends.',
  'Tripadvisor Community Research',
  'Hotels and guesthouses near Baga Beach and Calangute, North Goa',
  '[]', 15.5569, 73.7545, 'approved'
),

-- goa-ta-015: Panjim auto commission shops
(
  'goa-india', 'Goa', 'Transport',
  'Panjim Old Town — auto drivers taking solo women tourists to commission shops instead of requested destinations',
  'high',
  'Auto rickshaw drivers in Panjim and around Old Goa have been reported to take tourists — particularly solo women — to textile shops, jewellery stores, and "government emporiums" before or instead of their actual destination. Drivers earn commission from these shops for every tourist they bring in. The shops use high-pressure sales tactics. If a driver says your destination is "closed today" or suggests a detour to a "better place first", get out immediately and find another auto. Use Goa Miles for reliable point-to-point travel in Panjim.',
  'Tripadvisor Community Research',
  'Panjim / Old Goa — auto rickshaw stands near tourist sites',
  '[]', 15.4909, 73.8278, 'approved'
);


-- ---- 013_jaipur_tripadvisor_beware.sql ----
-- 013_jaipur_tripadvisor_beware.sql
-- Seeds 15 Jaipur beware reports from TripAdvisor + travel-safety community research.
-- All inserted with status='approved' and GPS coordinates so they appear on the map immediately.
-- reported_by_id is NULL (community-sourced, not user-submitted).
-- Run this in Supabase SQL Editor.

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, gps_lat, gps_lng, status)
VALUES

-- jaipur-ta-001: Gem & jewellery export scam (the big one)
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Jaipur gem & jewellery export scam — tourists convinced to "export" stones for profit, gems turn out to be worthless fakes$t$,
  'high',
  $d$Jaipur's most financially damaging and well-documented scam. A network of touts, auto drivers, and fake "friendly locals" befriend tourists near City Palace, Amber Fort, and Johari Bazaar, then convince them they can buy gems at wholesale or duty-free prices and resell them for large profit back home. The gems are fake — often glass, synthetic, or silver with gold polish — but come with convincing fake certificates of authenticity printed in the back of the shop. One documented case involved a US tourist defrauded of ₹6 crore for jewellery worth ₹300. The scammers vanished after the sale and police had to intervene via the US Embassy. According to a 2023 survey by India's Gem & Jewellery Export Promotion Council, nearly 1 in 4 tourists buying loose stones in Rajasthan were sold treated or imitation gems at genuine prices. Never buy gems, jewellery or stones based on a recommendation from a driver, guide, or stranger. Only buy from BIS hallmark-certified stores and always request an independent lab certificate from IGI or GIA — not one provided by the shop itself.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar / City Palace area / Amber Fort Road / across Old City',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-002: "Closed hotel/monument" redirect scam
(
  'jaipur-india', 'Jaipur', 'Transport',
  $t$Auto and taxi drivers claiming your hotel or monument is "closed" — to redirect you to commission shops$t$,
  'high',
  $d$One of Jaipur's most persistent and widespread scams, documented consistently across Tripadvisor forums, travel safety guides, and solo female travel accounts through 2025-2026. Auto rickshaw and taxi drivers — particularly near Amber Fort, Hawa Mahal, City Palace, and Jaipur Junction railway station — tell tourists their booked hotel is "full" or "closed", or that a monument is "shut for a government ceremony today". They then redirect tourists to a shop, guesthouse, or "tour operator" that pays them commission. One traveller reported being taken to a travel agent who charged 50% on top of the train fare, claiming the booking would otherwise not be confirmed. Always verify monument opening times directly via official websites before travel. Call your hotel directly if a driver claims it is closed. Use Uber or Ola for transparent GPS-tracked transport and avoid negotiating with drivers who approach you proactively near tourist sites.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Hawa Mahal / City Palace / Jaipur Junction railway station',
  '[]', 26.9197, 75.7878, 'approved'
),

-- jaipur-ta-003: Hawa Mahal photo / shop scam
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Hawa Mahal photo scam — "friendly" man lures tourists to rooftop for photos, turns aggressive when you won't buy from his shop$t$,
  'high',
  $d$A well-practiced individual operator outside Hawa Mahal approaches tourists and offers them access to the building opposite for better photos of the monument. Once tourists have taken their photos and realise they are inside the man's shop, he applies heavy pressure to buy goods. Multiple Tripadvisor reports describe the person becoming "quite nasty and abusive" if refused. This is not a random interaction — it is a rehearsed routine. He knows when tourists arrive, what to say, and how to escalate. Do not follow any stranger offering "special" access or photo opportunities near Hawa Mahal. The best photos of Hawa Mahal are taken from street level opposite the monument, which is free and requires no assistance.$d$,
  'Tripadvisor Community Research',
  'Opposite Hawa Mahal, Old City',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-004: Fake gem factory tours near Amber Fort
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Fake gem factory tours near Amber Fort — "artisans" cutting gems are staged, stones are glass$t$,
  'high',
  $d$Auto rickshaw drivers and unofficial guides routinely take tourists to "gem cutting factories" near Amber Fort Road under the guise of a free cultural experience. The "artisans" appearing to cut and polish stones are performing — the raw materials are absent and the finished stones on display are glass or plastic. One tourist who insisted on examining a tin of "rubies" the artisan was working with found them to be made of glass. Once inside, high-pressure sales tactics are applied. Certificates of authenticity are offered but are either fabricated or issued by non-existent labs. If you are taken to any gem factory by a driver or guide who suggested it — leave immediately. You did not choose to go there; they took you there to earn commission.$d$,
  'Tripadvisor Community Research',
  'Amber Fort Road / Ramgarh Mode area — commission-based gem shops',
  '[]', 26.9787, 75.8423, 'approved'
),

-- jaipur-ta-005: Auto rickshaw overcharging
(
  'jaipur-india', 'Jaipur', 'Transport',
  $t$Auto rickshaw overcharging — meters refused, tourist prices 5-10x local rate, no accountability$t$,
  'high',
  $d$Auto rickshaw drivers in Jaipur routinely quote prices 5-10 times the local rate to foreign tourists and refuse to use meters, claiming they are broken. Because there is no fixed metered system enforced, tourists have no basis for negotiation and drivers face no penalties. This is documented across every Jaipur travel safety guide for 2025-2026. The problem is worst near Amber Fort, Hawa Mahal, City Palace, and Jaipur Junction. Uber and Ola both operate widely in Jaipur with GPS tracking, fixed upfront pricing, and driver identification — use these for all journeys where possible. If you must use an auto rickshaw, agree on the exact fare before getting in, research approximate local fares in advance, and do not get in if the driver refuses to commit to a price.$d$,
  'Tripadvisor Community Research',
  'City-wide — worst near Amber Fort, Hawa Mahal, Jaipur Junction railway station',
  '[]', 26.9124, 75.7873, 'approved'
),

-- jaipur-ta-006: Fake government tourist offices
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Fake government tourist offices near Jaipur Junction and City Palace — overpriced tours, fake tickets, bogus packages$t$,
  'high',
  $d$Fraudulent "government tourist offices" operate near major transport hubs and tourist sites across Jaipur. They appear official — sometimes with signage suggesting government affiliation — but are private operators selling overpriced tour packages, fake entry tickets, and unnecessary services. They mislead tourists into believing official transport or accommodation is unavailable and that their package is the only option. This scam is well-documented in Jaipur, Delhi, and Agra along the Golden Triangle circuit. The actual government tourism body is ITDC (India Tourism Development Corporation). Never book tours or tickets from anyone who approaches you on the street or outside a station. Book directly through official monument websites, your accommodation, or verified platforms.$d$,
  'Tripadvisor Community Research',
  'Near Jaipur Junction railway station / City Palace / Hawa Mahal',
  '[]', 26.9197, 75.7878, 'approved'
),

-- jaipur-ta-007: Pickpocketing in markets
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Pickpocketing in Johari Bazaar and Bapu Bazaar — distraction theft in peak crowds, crossbody bags and phones targeted$t$,
  'high',
  $d$Johari Bazaar and Bapu Bazaar are Jaipur's most visited and most crowded markets, particularly during peak tourist season (October-March) and evenings when the markets are at their busiest. Pickpockets operate in the dense crowds using distraction techniques — someone engages you in conversation or blocks your path while an accomplice takes your phone, wallet, or camera. Multiple travel safety sources and Tripadvisor reviews for 2025-2026 specifically flag these markets as pickpocket risk zones. Do not carry your phone in your back pocket or an open bag. Use a crossbody bag worn in front of your body. Keep cash split across multiple locations. Weekday mornings (10am-12pm) are significantly less crowded and safer for shopping.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar / Bapu Bazaar / Old City market area',
  '[]', 26.9224, 75.8237, 'approved'
),

-- jaipur-ta-008: Unsolicited guides
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Unsolicited "guides" at Amber Fort and City Palace — unlicensed, pushy, commission-driven$t$,
  'medium',
  $d$Unlicensed individuals position themselves at the entrances to Amber Fort and City Palace and approach solo tourists — particularly solo women — who appear uncertain. They offer guided tours, claim to be official guides, and are extremely persistent. Once inside, they pressure tourists to visit affiliated shops and push for large cash tips. Licensed official guides wear government-issued ID badges and are booked through the Archaeological Survey of India counter at monument entrances. Anyone who approaches you before you reach the official counter is unlicensed. Politely refuse, say you have a guide arranged, and walk directly to the official booking counter. Solo women are specifically targeted as they are perceived as less likely to push back firmly.$d$,
  'Tripadvisor Community Research',
  'Amber Fort entrance / City Palace entrance',
  '[]', 26.9855, 75.8513, 'approved'
),

-- jaipur-ta-009: Fake ticket sellers
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Fake ticket sellers at monument entrances — outside Amber Fort, City Palace, Hawa Mahal$t$,
  'medium',
  $d$Individuals sell "entry tickets" outside Amber Fort, Hawa Mahal, and City Palace that are either fake or significantly overpriced compared to the official rate. They position themselves before the official ticket counters and approach tourists who are not yet sure where to buy. Official ticket counters are clearly marked inside the monument approach area — walk past anyone offering tickets on the street before you reach the official counter. For Amber Fort specifically, tickets can also be pre-booked online at the official Rajasthan tourism website. Current official entry prices for Amber Fort are ₹100 for Indian nationals and ₹500 for foreign tourists — anything above this from an unofficial seller is a scam.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Hawa Mahal / City Palace — outside official ticket counters',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-010: Bapu Bazaar duplicate goods
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Bapu Bazaar duplicate goods — fabrics, textiles and block prints sold as authentic Rajasthani craft are mass-produced fakes$t$,
  'medium',
  $d$Bapu Bazaar is marketed as a destination for authentic Rajasthani textiles, block-printed fabrics, and leather goods. However, multiple Tripadvisor reviewers and community sources flag that a significant portion of goods are duplicate items with chemical dyes, not natural block prints, and cheap synthetic fabrics sold as cotton. One Tripadvisor review specifically states "all clothes duplicate item fake item and chemical colours." Vendors quote tourist prices that can be 5-10x what a local would pay. Bargaining is essential — start at 30-40% of the quoted price. For genuinely authentic block prints, visit Sanganer (a short auto ride from Jaipur) where you can see the actual printing process and buy directly from artisan workshops.$d$,
  'Tripadvisor Community Research',
  'Bapu Bazaar / Tripolia Bazaar',
  '[]', 26.9224, 75.8211, 'approved'
),

-- jaipur-ta-011: Solo women at night in Old City
(
  'jaipur-india', 'Jaipur', 'Other',
  $t$Jaipur solo women at night — isolated Old City streets after 9pm are a genuine risk, not just a precaution$t$,
  'high',
  $d$Jaipur's NARI 2025 safety score was 59% — below the national average of 65% — reflecting a real and documented gap in women's sense of safety in the city. While the tourist zones around C-Scheme, MI Road, and Civil Lines are well-lit and considered safe into the night, the Old City areas around City Palace, Johari Bazaar, Bapu Bazaar, and Chandpole become significantly less safe for solo women after shops close (around 9-10pm). Streets become empty quickly, transport becomes irregular, and the area loses the protective cover of crowds. Do not walk alone through the Old City after dark. Book Uber or Ola for the return journey before you need it, not after you are already in an empty street. The Jaipur Metro runs only until 9:30pm and does not serve Amber Fort or the Old City market area.$d$,
  'Tripadvisor Community Research',
  'Old City — Johari Bazaar, Bapu Bazaar, Chandpole, City Palace area after 9pm',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-012: Summer heat / heatstroke (CRITICAL)
(
  'jaipur-india', 'Jaipur', 'Other',
  $t$Summer heat danger — tourists collapsing from heatstroke, Amber Fort sightseeing between 11am-3pm is a medical risk$t$,
  'critical',
  $d$Jaipur's summer temperatures (April-June) regularly reach 42-45°C. Tourists underestimate how quickly heat exhaustion develops when climbing exposed stone monuments like Amber Fort and Nahargarh Fort without shade. Multiple sources including Jaipur Insider's 2026 local tips guide explicitly warn against all outdoor sightseeing between 12pm-3pm during summer months. Heatstroke can develop within 30 minutes of exposure at these temperatures for visitors unacclimatised to dry heat. Visit Amber Fort between 6am-8am only in summer months. Carry a minimum of 2 litres of water per person. Wear a hat and light cotton that covers your arms. Symptoms of heatstroke (confusion, no sweating, very high temperature) require immediate emergency response — call 108.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Nahargarh Fort / Jaigarh Fort — all exposed hilltop monuments',
  '[]', 26.9855, 75.8513, 'approved'
),

-- jaipur-ta-013: Aggressive monkeys at Galta Ji
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Aggressive monkeys at Galta Ji (Monkey Temple) — snatching food, bags, and glasses from tourists$t$,
  'medium',
  $d$Galta Ji, also known as the Monkey Temple, is home to large groups of rhesus macaques that have become bold and aggressive due to years of tourist feeding. Monkeys at this site have been documented snatching food, open bags, glasses, phones, and water bottles directly from tourists. They can scratch or bite if they feel threatened or cornered. The World Travel Index's 2026 Jaipur safety guide specifically flags monkeys at temple sites as a safety concern requiring active caution. Do not carry any visible food near Galta Ji. Keep bags zipped and held close to your body. Do not make eye contact with or attempt to touch the monkeys. Do not feed them under any circumstances — feeding attracts more animals and increases aggression. If bitten or scratched, seek medical attention immediately as monkey bites carry infection risk.$d$,
  'Tripadvisor Community Research',
  'Galta Ji (Monkey Temple) — east of Jaipur city',
  '[]', 26.9170, 75.8530, 'approved'
),

-- jaipur-ta-014: Carpet & textile shop pressure tactics
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Carpet and textile shop pressure tactics — invited for "tea", subjected to hours of high-pressure selling$t$,
  'high',
  $d$A well-documented Jaipur scam operating near City Palace and through auto rickshaw drivers: tourists are invited into a carpet or textile shop for tea with no purchase obligation. Once inside, a rotating team of salespeople begins a structured high-pressure selling session that can last 2-3 hours. Items are presented as "handmade", "export quality", and "government certified". Prices begin very high and drop dramatically to create the impression of a deal. Shipping promises are made for items too large to carry. The carpets, textiles, and gems are typically not as described, certificates are not verifiable, and the promised shipping often fails to materialise. The moment you say yes to "just tea, no buying", you have entered the process. Politely refuse any invitation to enter shops suggested by your driver or a stranger on the street.$d$,
  'Tripadvisor Community Research',
  'Near City Palace / commission shops across Old City',
  '[]', 26.9258, 75.8237, 'approved'
),

-- jaipur-ta-015: Instagram-based jewellery fraud
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Instagram-based jewellery fraud — Jaipur sellers connecting with tourists online before arrival$t$,
  'high',
  $d$A newer and increasingly documented version of Jaipur's jewellery scam operates via Instagram and social media. Jaipur-based sellers connect with tourists planning trips to India through travel hashtags, DMs, and comment sections, building rapport before the tourist arrives. They present as small artisan businesses with beautiful product photos. Tourists then visit in person, purchase large quantities of "handmade" jewellery at agreed prices, and discover on return home that the goods are fake, silver-plated as gold, or significantly lower quality than photographed. The documented case of US tourist Cherish — defrauded of ₹6 crore over two years via Instagram contact with a Jaipur jeweller — resulted in a police case and US Embassy involvement. The sellers involved had used fake certificates throughout. Never make large jewellery purchases based on social media contact before or during travel. Insist on independent third-party certification for any purchase above ₹5,000.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar area / online-to-in-person scam originating in Jaipur',
  '[]', 26.9239, 75.8267, 'approved'
);


-- ---- 014_goa_youtube_round2.sql ----
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


-- ---- 015_fix_resubmit_rls.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 015_fix_resubmit_rls.sql
-- Adds the missing RLS policy that allows reporters to update their own
-- rejected reports back to pending status (resubmission).
-- Migration 010 only gave moderators/admins UPDATE rights — reporters were
-- silently blocked, causing resubmitReport() to update 0 rows without error.
-- ─────────────────────────────────────────────────────────────────────────────

create policy "Users resubmit own rejected reports" on beware_reports
  for update
  using  (auth.uid() = reported_by_id and status = 'rejected')
  with check (status = 'pending');


-- ---- 016_rishikesh_intel_card.sql ----
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


-- ---- 017_user_reports.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 017_user_reports.sql
-- Community flagging: any member can report a user profile.
-- Moderators/admins review and can deactivate the account.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists user_reports (
  id                uuid        primary key default gen_random_uuid(),
  reported_user_id  uuid        not null references profiles(id) on delete cascade,
  reported_by_id    uuid        not null references profiles(id) on delete cascade,
  reason            text        not null,
  details           text,
  status            text        not null default 'pending'
                                check (status in ('pending', 'reviewed', 'dismissed')),
  reviewed_by       uuid        references profiles(id) on delete set null,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),
  -- one report per (reporter, reported) pair — prevents spam
  unique(reported_user_id, reported_by_id)
);

alter table user_reports enable row level security;

-- Any logged-in user can file a report
create policy "Users insert user reports" on user_reports
  for insert with check (auth.uid() = reported_by_id);

-- Moderators/admins read all flags
create policy "Moderators read user reports" on user_reports
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );

-- Moderators/admins can update status (reviewed / dismissed)
create policy "Moderators update user reports" on user_reports
  for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('moderator', 'admin'))
  );


-- ---- 018_fill_stub_intel_cards.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 018_fill_stub_intel_cards.sql
-- Fills out 8 stub intel cards: Kasol, Hampi, and 6 international cities.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE intel_cards SET
  scams = '[{"title": "Charas push at trailheads and cafés", "severity": "critical", "where": "Kasol main bazaar, Tosh trailhead, Chalal village", "what": "Local ''guides'' approach solo travellers offering charas; once accepted, an accomplice in plainclothes appears claiming to be police and demands ₹20,000–₹50,000 to drop charges. NDPS Act in India = 1 year minimum for any quantity, no bail.", "avoid": "Refuse all offers — including from people who seem like fellow travellers. There are no real plainclothes drug officers operating this way; if anyone claims to be one, ask for ID and call 100. Walk to a busy café immediately."}, {"title": "Kheerganga ''guide'' overcharge", "severity": "high", "where": "Kasol bus stand, Barshaini trailhead", "what": "Self-appointed guides demand ₹2,500–₹4,000 for a Kheerganga trek that is well-marked and doesn''t need a guide. They sometimes vanish at the halfway point.", "avoid": "The trail is signposted the whole way and shared with hundreds of trekkers daily. If you genuinely want a guide, book through your guesthouse — ₹800–1,200 is the fair rate, paid only on return."}, {"title": "Camping equipment ''damage'' on return", "severity": "high", "where": "Trek shops in Kasol main bazaar", "what": "Sleeping bags / tents / trek poles rented out, then ''damage'' claimed on return — usually ₹500–2,000 deducted from a ₹3,000 deposit.", "avoid": "Photograph and video every item on rental, with the shopkeeper visible. Refuse shops that demand passport as deposit. Stick to rentals booked through your guesthouse — they have ongoing relationships with the shops."}, {"title": "Bhuntar to Kasol shared taxi pile-on", "severity": "medium", "where": "Bhuntar bus stand", "what": "Drivers quote ₹100–120 per seat then pack 8+ people in a 6-seater, or charge an extra ₹200 ''luggage fee'' on arrival in Kasol.", "avoid": "Confirm seat count and total price before getting in. HRTC bus is ₹40–60 and slower but completely safe. Last bus is around 6pm — plan to arrive before."}, {"title": "Guesthouse no-cancellation booking trap", "severity": "medium", "where": "Booking platforms, Kasol main bazaar", "what": "Booked rooms turn out to be much smaller / damp / on a different floor than photos. ''No refund'' policy invoked when you ask to leave.", "avoid": "Walk in if possible — Kasol almost always has rooms outside July/August peak. If booking ahead, message the host on WhatsApp first to confirm room number, photos of the actual room, and check-in process."}]'::jsonb,
  hidden_gems = '[{"name": "The Hosteller (Female Dorms)", "type": "Chain hostels with female-only dorm options", "angle": "VS — Verified Safe", "why": "Well-established chain with female-only dorms in Delhi, Manali, Kasol, Jaipur, Rishikesh, Coorg and more. Consistently recommended on Reddit solo women travel threads 2024–25.", "approxCost": "₹400–800 dorm | ₹1,500–3,000 private", "_source": "stay"}, {"name": "Zostel (Women’s Dorms)", "type": "Chain hostels with women’s dorms", "angle": "VS — Verified Safe", "why": "India''s largest hostel chain. Women-only dorm options available in most locations. Highly recommended on r/solotravel for Indian women 2024–25.", "approxCost": "₹350–700 dorm | ₹1,200–2,500 private", "_source": "stay"}, {"name": "Madpackers (Female Dorms)", "type": "Hostel chain with women-only dorms", "angle": "VS — Verified Safe", "why": "Popular backpacker chain. Women''s dorms in select locations. Younger vibe. Multiple 2024 reviews recommend for solo women travelers.", "approxCost": "₹400–800 dorm | ₹1,500–2,800 private", "_source": "stay"}, {"name": "Stops Hostels (Female Dorms)", "type": "Hostel chain with female dorms", "angle": "VS — Verified Safe", "why": "Women''s dorms in North India locations. Colourful, social hostels. Recommended in solo women India hostel lists 2024.", "approxCost": "₹350–700 dorm | ₹1,200–2,500 private", "_source": "stay"}, {"name": "Evergreen Café (Kasol main bazaar)", "type": "Café", "angle": "VS — Verified Safe", "why": "Long-running café with reliable WiFi, good shakshuka, and an owner who knows every solo female traveller in the valley. Natural meet-up spot in the morning; he''ll connect you with other women heading to Kheerganga.", "approxCost": "Coffee ₹100 | Meal ₹250–400"}, {"name": "Nirvana Café Guesthouse (Chalal)", "type": "Guesthouse", "angle": "VS — Verified Safe", "why": "15-minute walk from Kasol on the quieter Chalal side. Run by a Himachali family. River-view rooms, women-comfortable, and they call ahead to your next stop in the valley.", "approxCost": "₹1,200–2,000 private"}]'::jsonb
WHERE slug = 'kasol-india';

UPDATE intel_cards SET
  scams = '[{"title": "Coracle price inflation", "severity": "low", "where": "River crossing between temple and island sides", "what": "Official coracle fare is ₹20; touts charge ₹100–200 to first-timers.", "avoid": "Fixed government rate is ₹20 per person. Join the queue at the official ghat and pay only ₹20."}, {"title": "Bicycle rental damage claim", "severity": "medium", "where": "Rental shops both sides", "what": "Pre-existing damage cited on return; deposit held.", "avoid": "Photograph the bicycle before riding. Rentals are cheap enough (₹100/day) to not need a deposit — decline shops that demand one."}, {"title": "Guide ''royal tour'' overcharge", "severity": "low", "where": "Near Royal Enclosure, Vijayanagara ruins", "what": "Self-appointed guides approach at major ruins and quote ₹2,000+ for basic walking tour.", "avoid": "ASI-licensed guides are available through the ASI booth near Virupaksha Temple at fixed rates. Or use a good guidebook."}, {"title": "Auto from Hospet station overcharge", "severity": "medium", "where": "Hospet Junction railway station", "what": "Autos at Hospet quote ₹600–800 for the 13km ride to Hampi when the standard fare is ₹250–350.", "avoid": "Use the pre-paid auto stand inside the station — printed receipt with auto number. Or take the local bus (₹35) from outside the station to Hampi Bazaar; they run every 30 minutes."}, {"title": "Coracle ''private hire'' upsell", "severity": "medium", "where": "Tungabhadra River crossing", "what": "Boatmen offer ''private'' coracle rides for ₹500–1,000 instead of the ₹20 shared crossing — claiming the shared one isn''t running.", "avoid": "The shared coracle runs from sunrise to sunset, ₹20 flat. If you genuinely want a private hour-long sunset coracle ride, the official rate is ₹400 — pay at the ASI booth, not on the boat."}, {"title": "Sunset ''rooftop'' minimum order", "severity": "low", "where": "Cafés on island side at sunset", "what": "Some cafés enforce a ₹500–800 per-person minimum for rooftop seating during the sunset window — not posted anywhere visible.", "avoid": "Ask about minimum charge before sitting down. Mowgli, Laughing Buddha, and Goan Corner are transparent. Or just walk to Anegundi rocks and watch sunset for free."}, {"title": "Scooter rental without papers", "severity": "high", "where": "Hampi Bazaar rental shops", "what": "Rentals offered without proper paperwork, then if you''re stopped by police you''re liable. Some shops also rent unregistered scooters.", "avoid": "Insist on seeing the scooter''s RC and insurance papers before paying. The licence plate must be yellow (commercial) not white. Carry your physical driving licence — digital copy gets you fined."}]'::jsonb,
  hidden_gems = '[{"name": "The Hosteller (Female Dorms)", "type": "Chain hostels with female-only dorm options", "angle": "VS — Verified Safe", "why": "Well-established chain with female-only dorms in Delhi, Manali, Kasol, Jaipur, Rishikesh, Coorg and more. Consistently recommended on Reddit solo women travel threads 2024–25.", "approxCost": "₹400–800 dorm | ₹1,500–3,000 private", "_source": "stay"}, {"name": "Zostel (Women’s Dorms)", "type": "Chain hostels with women’s dorms", "angle": "VS — Verified Safe", "why": "India''s largest hostel chain. Women-only dorm options available in most locations. Highly recommended on r/solotravel for Indian women 2024–25.", "approxCost": "₹350–700 dorm | ₹1,200–2,500 private", "_source": "stay"}, {"name": "Madpackers (Female Dorms)", "type": "Hostel chain with women-only dorms", "angle": "VS — Verified Safe", "why": "Popular backpacker chain. Women''s dorms in select locations. Younger vibe. Multiple 2024 reviews recommend for solo women travelers.", "approxCost": "₹400–800 dorm | ₹1,500–2,800 private", "_source": "stay"}, {"name": "Stops Hostels (Female Dorms)", "type": "Hostel chain with female dorms", "angle": "VS — Verified Safe", "why": "Women''s dorms in North India locations. Colourful, social hostels. Recommended in solo women India hostel lists 2024.", "approxCost": "₹350–700 dorm | ₹1,200–2,500 private", "_source": "stay"}, {"name": "Mango Tree Restaurant (Hampi Bazaar)", "type": "Restaurant", "angle": "VS — Verified Safe", "why": "Hampi institution since the 90s. Banana-leaf thali, river view, women-comfortable. The original location moved but the food is unchanged. Solo-female-traveller heaven for breakfast and sunset dinner.", "approxCost": "Thali ₹200–350 | Continental ₹250–500"}, {"name": "Goan Corner (Virupapuragadde)", "type": "Guesthouse + restaurant", "angle": "VS — Verified Safe", "why": "The most consistently-recommended stay on the island side. Mango trees, hammocks, women-comfortable dorm and private rooms. Owner Sahu connects guests for sunrise treks and bouldering. The community vibe makes solo trips feel less solo.", "approxCost": "₹450 dorm | ₹1,200–2,000 private"}, {"name": "Vitthala Temple at sunrise", "type": "Cultural site", "angle": "VS — Verified Safe", "why": "The famous stone chariot. Open from 6am — go before 8am and you''ll have it almost to yourself, no touts. Free with the ₹500 Hampi pass (covers all monuments for one day). Cycle there from Hampi Bazaar in 15 minutes.", "approxCost": "₹500 day pass | Free with valid ASI ticket"}, {"name": "Anegundi village walk", "type": "Cultural experience", "angle": "VS — Verified Safe", "why": "Cross the river to Virupapuragadde, then walk 3km to Anegundi — the older twin of Hampi, where most locals live. Quieter, no touts, women-run craft cooperative (Kishkinda Trust) makes banana-fibre baskets you can buy directly.", "approxCost": "Free walk | Crafts ₹200–800"}]'::jsonb
WHERE slug = 'hampi-india';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Shinjuku", "safetyRating": 5, "vibe": "Hyper-dense, neon, late-night, transit hub", "stayHere": true, "notes": "Best base for first-timers — JR Yamanote loop access, women-only floors at most chain hotels (APA, Sotetsu Fresa). East side is calmer than Kabukicho."}, {"name": "Shibuya", "safetyRating": 5, "vibe": "Youth culture, fashion, all-night cafés", "stayHere": true, "notes": "More walkable than Shinjuku, easier to navigate. Hostel scene (Nui., Trunk House) is excellent for solo female travellers."}, {"name": "Asakusa", "safetyRating": 5, "vibe": "Old Tokyo, Senso-ji temple, ryokan country", "stayHere": true, "notes": "Quieter, traditional, best for first-time travellers wanting the ''old Japan'' feel. Khaosan Tokyo Origami is the go-to women-friendly hostel."}]'::jsonb,
  hidden_gems = '[{"name": "Sotetsu Fresa Inn (women-only floors)", "type": "Business hotel chain", "angle": "VS — Verified Safe", "why": "Affordable Japanese business hotel with dedicated women-only floors. Branches in Shinjuku, Ginza, Ueno. Key-card lift access ensures men can''t reach women''s floors. Solo Japanese women''s preferred chain.", "approxCost": "¥7,000–11,000/night (~₹4,000–6,500)"}, {"name": "Onsen Ryokan Yuen Shinjuku", "type": "Ryokan with rooftop onsen", "angle": "VS — Verified Safe", "why": "Modern ryokan with women-only onsen on the rooftop overlooking Shinjuku. Walking distance from station. The traditional-meets-modern experience without leaving central Tokyo.", "approxCost": "¥18,000–28,000/night (~₹11,000–17,000)"}, {"name": "Yanaka Ginza (downtown shotengai)", "type": "Old-school shopping street", "angle": "VS — Verified Safe", "why": "Survived WWII bombing intact. Old wooden shopfronts, ¥100 croquettes, women-run sembei (rice cracker) stalls. Far calmer than Asakusa for a ''real Tokyo'' afternoon.", "approxCost": "Free walk | Snacks ¥100–500 (~₹60–300)"}, {"name": "Onsen Spa LaQua (Tokyo Dome)", "type": "Day spa with women''s floor", "angle": "VS — Verified Safe", "why": "Six-floor onsen complex right in central Tokyo. Women''s floor has private hot baths, sauna, sleep pods. Open till 9am next day — solo women safely overnight here when missing the last train.", "approxCost": "¥3,200 day pass | ¥4,500 with overnight (~₹2,000–2,800)"}]'::jsonb
WHERE slug = 'tokyo-japan';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Sukhumvit (Asok / Phrom Phong)", "safetyRating": 5, "vibe": "Modern, BTS-connected, expat-friendly", "stayHere": true, "notes": "Best base for solo women. Clean, well-policed, walkable to BTS Skytrain. Avoid the Soi Cowboy / Nana stretches at night — stay between Phloen Chit and Phrom Phong."}, {"name": "Silom / Sathorn", "safetyRating": 4, "vibe": "Business district by day, food street by night", "stayHere": true, "notes": "Less touristy than Sukhumvit, excellent street food, good MRT access. Patpong night market is fine for solo browsing — ignore the ''ping pong show'' touts."}, {"name": "Khao San Road area", "safetyRating": 3, "vibe": "Backpacker chaos, cheap, loud", "stayHere": false, "notes": "Iconic but not solo-female-friendly at night. If staying, use Rambuttri parallel street (calmer). Better as a half-day visit than overnight stay."}]'::jsonb,
  hidden_gems = '[{"name": "Lub d Hostel Siam (women''s dorms)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Award-winning hostel chain with female-only dorms in central Siam. Coded floor access, in-room safes, female staff on every shift. Best place to meet other solo women.", "approxCost": "฿650–950 dorm | ฿2,000–3,500 private (~₹1,500–8,000)"}, {"name": "Wat Pho massage school", "type": "Traditional Thai massage", "angle": "VS — Verified Safe", "why": "The original Thai massage school, attached to the temple. Female therapists, female-only treatment rooms on request. Far safer than random street parlours; a 1-hour foot massage is ฿320.", "approxCost": "฿320–550 (~₹750–1,300)"}, {"name": "Or Tor Kor Market (women-run stalls)", "type": "Local market", "angle": "VS — Verified Safe", "why": "Bangkok''s best fresh-produce market, next to the better-known Chatuchak. Most stalls are run by Thai women. Excellent food court, no tourist scams, AC throughout.", "approxCost": "Meal ฿100–250 (~₹250–600)"}, {"name": "Divana Spa Sukhumvit", "type": "Day spa", "angle": "VS — Verified Safe", "why": "Female-founded Thai spa chain. Treatments in private suites, all-female therapists by default. Booked solid by Bangkok''s expat women — book 2 days ahead.", "approxCost": "฿2,500–5,500 (~₹6,000–13,000)"}]'::jsonb
WHERE slug = 'bangkok-thailand';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Old Quarter (Hoan Kiem)", "safetyRating": 5, "vibe": "Heritage, walkable, lake-centred", "stayHere": true, "notes": "Best base for first-time solo women. Most attractions within 15-min walk. Crossing the road is the main risk — walk slowly and steadily, never stop in traffic."}, {"name": "French Quarter (Ba Dinh)", "safetyRating": 5, "vibe": "Wide boulevards, embassies, museums", "stayHere": true, "notes": "Quieter and more upmarket than Old Quarter. Sofitel Metropole here. Good for second-time visitors who want a calmer base."}, {"name": "Tay Ho (West Lake)", "safetyRating": 5, "vibe": "Expat area, lakeside cafés, longer-stay vibe", "stayHere": true, "notes": "30 minutes from Old Quarter by Grab. Best for digital nomads and 1-week-plus stays. Cleanest air in Hanoi, plenty of women-friendly cafés."}]'::jsonb,
  hidden_gems = '[{"name": "Hanoi Backpackers Downtown (women dorm)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Long-running hostel chain with dedicated 6-bed women-only dorm. Female staff at reception, organises walking tours specifically for solo women. Daily bookings fill by 2pm — reserve ahead.", "approxCost": "$8–12 dorm | $25–45 private (~₹650–3,800)"}, {"name": "Note Coffee (Hoan Kiem Lake)", "type": "Café", "angle": "VS — Verified Safe", "why": "Two-storey café with thousands of customer notes pinned to every wall. Women-comfortable, reliable WiFi, lake-view second floor. Egg coffee here is the best in the Old Quarter.", "approxCost": "₫30,000–60,000 (~₹100–200)"}, {"name": "Banh Mi 25 (Hang Ca street)", "type": "Street food", "angle": "VS — Verified Safe", "why": "Female-run, family-owned banh mi stall featured in Anthony Bourdain''s Hanoi episode. Spotless prep area, queue moves fast, women-comfortable seating area inside.", "approxCost": "₫30,000–55,000 (~₹100–180)"}, {"name": "Hidden Hanoi cooking class (Tay Ho)", "type": "Cooking class", "angle": "VS — Verified Safe", "why": "Female-run cooking school. Includes morning market visit with the chef, then 4 dishes you cook yourself. Class size capped at 8. Excellent way to meet other solo women travellers.", "approxCost": "$45–55 (~₹3,800–4,600)"}]'::jsonb
WHERE slug = 'hanoi-vietnam';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Downtown Dubai", "safetyRating": 5, "vibe": "Burj Khalifa, Dubai Mall, Metro-connected", "stayHere": true, "notes": "Safest and most central base. Dress code is relaxed in malls and restaurants but cover shoulders/knees in souks and mosques. Metro is air-conditioned, women-only carriage available."}, {"name": "Dubai Marina", "safetyRating": 5, "vibe": "Beach access, expat-heavy, resort feel", "stayHere": true, "notes": "Very safe, beach within walking distance, all major chains. Western dress code accepted at beach clubs. Good base if you want sea + city in one trip."}, {"name": "Deira (old Dubai)", "safetyRating": 4, "vibe": "Souks, traditional, working-class", "stayHere": false, "notes": "Visit for gold and spice souks but stay elsewhere — accommodation is older, predominantly male hotel guests, and visibly western women attract more attention here than in newer areas."}]'::jsonb,
  hidden_gems = '[{"name": "Rove Downtown (women-friendly mid-range)", "type": "Hotel", "angle": "VS — Verified Safe", "why": "UAE-based mid-range chain that operates with explicit solo-female-traveller focus. Card-key floor access, female front desk on every shift, walking distance to Dubai Mall and Metro.", "approxCost": "AED 350–550/night (~₹8,000–13,000)"}, {"name": "Metro women-and-children carriage", "type": "Transport", "angle": "VS — Verified Safe", "why": "Dubai Metro has a designated pink carriage for women and children only. AC, calm, and entirely safe at any hour. Use it especially during peak commute hours.", "approxCost": "AED 3–8 per ride (~₹70–180)"}, {"name": "Al Seef heritage walk (sunset)", "type": "Cultural walk", "angle": "VS — Verified Safe", "why": "Restored creek-side Old Dubai with abra (water taxi) crossing for AED 1. Female-friendly cafés, no aggressive touts, free entry. Best at sunset when temperatures drop.", "approxCost": "AED 1 abra crossing | Café spend AED 30–80 (~₹25–1,800)"}, {"name": "Cleopatra''s Spa (Wafi Mall)", "type": "Day spa", "angle": "VS — Verified Safe", "why": "Long-established women-only day spa in Wafi Mall. Hammam treatments, female-only floors, relaxation rooms with proper privacy. The default recommendation among Dubai expat women.", "approxCost": "AED 250–600 (~₹6,000–14,000)"}]'::jsonb
WHERE slug = 'dubai-uae';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Myeongdong", "safetyRating": 5, "vibe": "Shopping district, central, transit hub", "stayHere": true, "notes": "Best base for first-timers. Subway lines 2 + 4 cross here. Loud and busy by day; quieter at night. K-beauty stores everywhere, English signage."}, {"name": "Hongdae", "safetyRating": 5, "vibe": "University area, indie cafés, nightlife", "stayHere": true, "notes": "Younger crowd, lots of solo female travellers, walkable. Clubs are safe (door staff strict), cafés open till 4am. Excellent for digital nomads."}, {"name": "Itaewon", "safetyRating": 4, "vibe": "International, restaurants, expat-heavy", "stayHere": true, "notes": "Most diverse food scene in Seoul. Fine for stays but the main strip can be rowdy after 11pm — pick a hotel one street back from Itaewon-ro."}]'::jsonb,
  hidden_gems = '[{"name": "Itaewon G Guesthouse (women dorm)", "type": "Guesthouse", "angle": "VS — Verified Safe", "why": "Long-running female-only dorm in Itaewon. Female owner, female staff. Free Korean breakfast, in-room lockers, helpful with subway navigation. Books out 2 weeks ahead in autumn.", "approxCost": "₩30,000–45,000 dorm (~₹1,800–2,800)"}, {"name": "Dragon Hill Spa (24-hour jjimjilbang)", "type": "Korean spa", "angle": "VS — Verified Safe", "why": "Massive 7-floor jjimjilbang with women-only sleeping floor. Solo women safely sleep here when missing the last subway. Indoor and outdoor hot pools, separate by gender.", "approxCost": "₩15,000 day | ₩18,000 overnight (~₹950–1,150)"}, {"name": "Myeongdong Kyoja kalguksu", "type": "Restaurant", "angle": "VS — Verified Safe", "why": "70-year-old, multi-generational female-led kalguksu (knife-cut noodles) institution. One menu, four items, queue moves fast, women-comfortable solo seating. The default Seoul lunch among Korean grandmothers.", "approxCost": "₩9,000–11,000 (~₹570–700)"}, {"name": "Bukchon Hanok Village walking tour", "type": "Cultural walk", "angle": "VS — Verified Safe", "why": "Traditional Korean hanok houses on foot. Free walking tours run by Seoul tourism (book at Visit Seoul website). Women-friendly, English-speaking guides, 2 hours. Go early — quietest before 9am.", "approxCost": "Free | Hanbok rental ₩15,000–25,000 (~₹950–1,600)"}]'::jsonb
WHERE slug = 'seoul-south-korea';

UPDATE intel_cards SET
  neighborhoods = '[{"name": "Le Marais (3rd / 4th)", "safetyRating": 5, "vibe": "Heritage, gay-friendly, cafés, walkable", "stayHere": true, "notes": "Safest central base for solo women. Lively until late, well-lit streets, many female-run boutiques. Walking distance to Notre Dame, Pompidou, Bastille."}, {"name": "Saint-Germain (6th)", "safetyRating": 5, "vibe": "Literary, café culture, upmarket", "stayHere": true, "notes": "Quieter and more refined than Marais. Excellent cafés (Café de Flore, Les Deux Magots), bookshops, walkable to Louvre. Best for second-time visitors who want calm."}, {"name": "Montmartre (18th)", "safetyRating": 4, "vibe": "Hilly, artist-history, Sacré-Coeur", "stayHere": true, "notes": "Stay between Abbesses and Pigalle Métro stations — north slope is calm, south slope (Pigalle) is sex-shop territory. Walking up to Sacré-Coeur after dark is fine in groups, not alone."}]'::jsonb,
  hidden_gems = '[{"name": "St Christopher''s Inn Paris (women dorm)", "type": "Hostel", "angle": "VS — Verified Safe", "why": "Riverside hostel with dedicated 6-bed women-only dorm. Coded floor access, en-suite bathroom in dorm. Walking distance to Gare du Nord — perfect first/last night before Eurostar.", "approxCost": "€32–48 dorm | €85–140 private (~₹3,000–13,000)"}, {"name": "Le Train Bleu (Gare de Lyon)", "type": "Restaurant", "angle": "VS — Verified Safe", "why": "Belle Époque restaurant inside Gare de Lyon — listed historic monument. Excellent solo dining counter, no minimum order, classic French food. Safe to linger over lunch alone for 2+ hours.", "approxCost": "Lunch €35–55 | À la carte €60–110 (~₹3,200–10,000)"}, {"name": "Hammam de la Mosquée de Paris", "type": "Hammam (women-only)", "angle": "VS — Verified Safe", "why": "Traditional Moroccan hammam attached to the Grand Mosque. Women-only days (check schedule). Steam room, gommage scrub, mint tea and pastry included. The Parisian secret for solo women''s spa days.", "approxCost": "€18 entry | €38 with gommage (~₹1,650–3,500)"}, {"name": "Walking the Seine after sunset", "type": "Free experience", "angle": "VS — Verified Safe", "why": "From Pont Neuf to Pont Alexandre III is about 2km of well-lit, well-policed Seine bank. Always foot traffic, even at midnight. Free, beautiful, completely safe for solo women.", "approxCost": "Free"}]'::jsonb
WHERE slug = 'paris-france';


-- ---- 019_fix_dubai_intel.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 019_fix_dubai_intel.sql
-- Brings Dubai intel card to full parity:
-- audience fix, TLDR converted from object to array, transport, pre-book
-- checklist, dos/donts, plus 2 more hidden gems and premium preview.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Dubai is one of the safest cities in the world for solo women — but strict laws apply. Dress modestly outside hotel and beach zones; cover shoulders and knees in malls and souks.", "Public displays of affection are illegal — no holding hands or kissing in public, even between married couples. Drinking alcohol is only legal in licensed venues (hotel bars and restaurants).", "Use only RTA taxis (cream with red roof), Careem, or Uber. Pink taxis (female driver only) available via Careem app — request via the ''Pink Taxi'' option.", "Dubai Metro has a women-and-children-only pink carriage — use it during peak hours and at night, completely safe and AC-cool.", "Cash dirhams are useful for souks but everywhere else takes cards. ATM withdrawal fees are AED 25 — withdraw bigger amounts less often."]'::jsonb,
  transport = '[{"mode": "Dubai Metro (women-and-children pink carriage)", "tip": "Use the dedicated pink carriage at the front of every train — women-and-children only, enforced strictly by AED 100 fine for men. Two lines (Red + Green) cover Downtown, Marina, Mall of the Emirates, Airport.", "approxCost": "AED 3–8 per ride (~₹70–180) | Day pass AED 22 (~₹500)"}, {"mode": "Careem (with Pink Taxi option)", "tip": "UAE-founded ride app, more reliable than Uber locally. Select ''Pink Taxi'' in vehicle options for a female driver — wait time 5–15 min, available across central Dubai. The default app for solo women.", "approxCost": "AED 25–60 short rides | AED 80–150 across the city (~₹570–3,400)"}, {"mode": "RTA Taxi (cream + red roof)", "tip": "Government-regulated — meter is mandatory, refuse any driver who quotes a flat rate. Hail at official taxi stands or via ''Smart Taxi'' button at every Metro exit. Pink-roof taxis are female-driver only — flag those if you spot one.", "approxCost": "Starting fare AED 12 | average ride AED 25–55 (~₹570–1,250)"}]'::jsonb,
  pre_book_checklist = '["Download Careem app and link your card before landing — works at airport for AED 100 fixed-price ride to Downtown", "Book accommodation in Downtown, Marina, or JBR for first trip — most central, safest, all metro-connected", "Save Tourist Police: 800-4438 (24/7, English-speaking) — faster response than 999 for non-emergency", "Pack one long-sleeve dress or kurta for visits to mosques (Sheikh Zayed Grand Mosque requires shoulders, knees, and hair covered)", "If flying via Mopa connection or Indian carrier: confirm your visa validity 24 hours before — Indian passports get 14-day visa-on-arrival but it must be activated correctly"]'::jsonb,
  dos_and_donts = '{"do": ["Use the Metro pink carriage during rush hour and after 8pm — completely safe and faster than cars", "Carry the Tourist Police WhatsApp (+971-4-606-2222) — they respond in English within minutes for any harassment", "Use Careem ''Pink Taxi'' option for late-night rides — female driver, slightly slower wait, peace of mind", "Save your hotel name in Arabic before arriving — useful when giving directions to non-English-speaking taxi drivers"], "dont": ["Drink alcohol outside licensed venues — public intoxication is jail time, not a fine", "Take photos of women in hijab, of police, or of government buildings — instant arrest, no exceptions", "Hold hands or kiss in public, even with your husband — same penalty for tourists as locals", "Take an unlicensed cab from any tourist area — Cancun-style overcharge scams are common; insist on RTA or Careem only"]}'::jsonb,
  hidden_gems = '[{"name": "Rove Downtown (women-friendly mid-range)", "type": "Hotel", "angle": "VS — Verified Safe", "why": "UAE-based mid-range chain that operates with explicit solo-female-traveller focus. Card-key floor access, female front desk on every shift, walking distance to Dubai Mall and Metro.", "approxCost": "AED 350–550/night (~₹8,000–13,000)"}, {"name": "Metro women-and-children carriage", "type": "Transport", "angle": "VS — Verified Safe", "why": "Dubai Metro has a designated pink carriage for women and children only. AC, calm, and entirely safe at any hour. Use it especially during peak commute hours.", "approxCost": "AED 3–8 per ride (~₹70–180)"}, {"name": "Al Seef heritage walk (sunset)", "type": "Cultural walk", "angle": "VS — Verified Safe", "why": "Restored creek-side Old Dubai with abra (water taxi) crossing for AED 1. Female-friendly cafés, no aggressive touts, free entry. Best at sunset when temperatures drop.", "approxCost": "AED 1 abra crossing | Café spend AED 30–80 (~₹25–1,800)"}, {"name": "Cleopatra''s Spa (Wafi Mall)", "type": "Day spa", "angle": "VS — Verified Safe", "why": "Long-established women-only day spa in Wafi Mall. Hammam treatments, female-only floors, relaxation rooms with proper privacy. The default recommendation among Dubai expat women.", "approxCost": "AED 250–600 (~₹6,000–14,000)"}, {"name": "She Spa at Dubai Ladies Club (Jumeirah)", "type": "Women-only beach club + spa", "angle": "VS — Verified Safe", "why": "Members-only women''s beach club but offers AED 350 day passes for visitors. Beach, pool, spa, restaurants — entirely women-only. The Dubai default for solo female travellers wanting a quiet beach day without male attention.", "approxCost": "AED 350 day pass (~₹8,000) | Spa add-ons AED 200–600"}, {"name": "RTA Smart Taxi app (women-driver filter)", "type": "Transport tool", "angle": "VS — Verified Safe", "why": "Government RTA app with explicit ''Female Driver'' toggle — request only women-driven taxis (Pink Taxis). 5–10 min wait, slightly higher fare. The single best tool for women navigating Dubai at night.", "approxCost": "Starting AED 12 | typical AED 30–60 (~₹680–1,400)"}]'::jsonb,
  is_premium = true,
  premium_preview = 'Premium covers: the 4 women-only beach clubs and spas (with day-pass pricing), the 6 RTA-licensed female taxi-driver routes, modesty-compliant outfit guides for the 3 main mosques, and the Indian-passport visa loophole that gets you 30 days instead of 14.'
WHERE slug = 'dubai-uae';


-- ---- 020_fix_intl_intel.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 020_fix_intl_intel.sql
-- Brings Tokyo, Bangkok, Hanoi, Seoul, Paris intel cards to full parity:
-- audience fix → "both", tldr converted from object to array, transport,
-- pre-book checklist, dos/donts.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Tokyo is the safest megacity in the world for solo women — but solo dining and quiet trains are the norm. Don''t speak loudly, don''t make eye contact on the train, and you''ll fit right in.", "Use the women-only metro carriage on JR and Tokyo Metro lines during morning rush (7:30–9:30am) and after 11pm. Marked with pink stickers at platform; men using them get fined.", "Tipping is rude — never tip in restaurants, taxis, or hotels. Service charge is included; offering extra implies the service wasn''t worth its price.", "Get a Suica or PASMO IC card on day 1 — works on every train, bus, and convenience store. Tap and go, no fumbling for change at midnight.", "Tattoos = no entry to most onsen and public baths. Cover with bandages or book a private onsen at a ryokan. Solo women tattoo-friendly options exist; ask hostel desk."]'::jsonb,
  transport = '[{"mode": "JR Yamanote Line + Metro (women-only carriage)", "tip": "The Yamanote loop covers every major district. Women-only carriages on JR Saikyo, Chuo, and most Metro lines from 7:30–9:30am and after 11pm — pink stickers mark them. Use them; men face ¥1,000+ fines.", "approxCost": "¥150–320 per ride | ¥800 day pass (~₹100–500)"}, {"mode": "Taxi (LE.TAXI app, female-driver request)", "tip": "Taxis are everywhere and clean but expensive. Use LE.TAXI or GO app — both let you note ''female driver preferred'' in app preferences. Doors open automatically — never touch them.", "approxCost": "¥730 starting fare | typical ride ¥1,500–4,000 (~₹900–2,400)"}, {"mode": "Capsule hotel transit (women-only floors)", "tip": "If you miss the last train (around 12:30am), capsule hotels with women-only floors (Nine Hours, First Cabin, Khaosan) are safer and cheaper than waiting for a taxi. Coded floor access, female-only showers.", "approxCost": "¥3,500–6,000/night (~₹2,100–3,600)"}]'::jsonb,
  pre_book_checklist = '["Order Suica or PASMO IC card at the airport — Welcome Suica desk at Narita/Haneda, no deposit, expires in 28 days", "Book any ryokan with private onsen at least 2 weeks ahead — solo female demand is high, especially in autumn", "Save embassy emergency line and your hotel''s address in Japanese — write it down (taxi drivers may not read romaji)", "Download Google Translate offline Japanese pack and Maps offline area for Tokyo", "If visiting onsen with tattoos, find tattoo-friendly options (onsen-tattoo.com) — only ~10% of onsen allow them"]'::jsonb,
  dos_and_donts = '{"do": ["Use the women-only carriage on metro at peak times — it''s there for a reason and Japanese women use it without exception", "Eat ramen and sushi alone at the counter — solo dining is the cultural norm, not a flag", "Carry coins for shrines and small purchases — Japan is more cash-friendly than people expect", "Bow when receiving anything (change, business card, food) — small gesture, big difference in how people respond"], "dont": ["Tip anyone, ever — it''s actively rude and considered an insult to professional pride", "Talk loudly on the train or take phone calls — silence is enforced socially", "Walk into a restaurant with shoes on if you see slippers at the entrance — slip into them, leave shoes facing out", "Take photos of geisha or anyone in traditional dress without asking — most are tourists in rented kimono, but it''s still a social offence"]}'::jsonb
WHERE slug = 'tokyo-japan';

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Bangkok is one of the easiest first solo trips in Asia — English signage, BTS Skytrain, abundant Grab cabs, and Thai people are genuinely warm to solo female travellers.", "Use BTS Skytrain or MRT Subway over taxis whenever possible — AC, cheap, and the Sukhumvit/Silom lines cover everywhere you''ll need to go. Tuk-tuks are tourist traps, not transport.", "Modesty matters at temples — Wat Phra Kaew, Wat Pho, Grand Palace require shoulders and knees covered. Carry a sarong or scarf in your bag.", "Patpong / Soi Cowboy / Nana stretches in Sukhumvit are red-light zones — fine to walk through but don''t engage with touts and don''t enter clubs offering ''shows'' (overcharge scams).", "Female Thai massage parlours are legitimate and excellent — Health Land, Let''s Relax, Wat Pho School are women-only on request, AED 350–800 for 90 mins."]'::jsonb,
  transport = '[{"mode": "BTS Skytrain + MRT Subway", "tip": "Both have ladies-first carriages signposted at peak hours (7–9am, 5–7pm) — not enforced as strictly as Tokyo but used. AC throughout, cheap, English signage. Buy a Rabbit card for BTS, MRT card separately.", "approxCost": "฿16–62 per ride (~₹40–150)"}, {"mode": "Grab (Thai version of Uber)", "tip": "Default ride app. ''GrabCar'' is private cars — safer than taxi for solo women, in-app tracking, fixed price. Avoid ''GrabBike'' (scooter taxi) at night.", "approxCost": "฿80–250 across central Bangkok (~₹190–600)"}, {"mode": "Boat ferry (Chao Phraya)", "tip": "Tourist ferry from Sathorn pier connects all the riverside temples — ฿15 per stop or ฿180 day pass. Safe, women-comfortable, and the views beat any taxi window.", "approxCost": "฿15–50 per stop | ฿180 day pass (~₹35–430)"}]'::jsonb,
  pre_book_checklist = '["Get a Thai SIM at the airport (AIS or True) — ฿200–400 for 8 days, essential for Grab", "Book hostel/hotel in Asok, Phrom Phong, or Silom for first trip — BTS-connected, walkable, safest after dark", "Save Tourist Police: 1155 (24/7 English) — they handle tourist-specific issues separately from regular police", "Pack a sarong or scarf — needed for every temple visit, no exceptions", "Download Grab app and link a card before landing — works at airport for ฿250 fixed-price ride to Sukhumvit"]'::jsonb,
  dos_and_donts = '{"do": ["Use BTS or Grab for all transit — cheap, AC, no negotiation", "Try street food at busy stalls (high turnover = fresh) — Bangkok street food is some of the safest in Asia", "Smile and wai (slight bow with hands together) when greeting — opens every door", "Carry small bills (฿20s, ฿100s) — many street vendors and tuk-tuks ''don''t have change'' for ฿1,000s"], "dont": ["Touch a monk if you''re female — even accidentally. Step aside on the footpath when they pass", "Disrespect the King or royal family in any conversation — lese-majesty is a real prison sentence", "Take a ''tour'' from a tuk-tuk driver to a ''special temple'' — it''s a gem-shop overcharge trap, every time", "Drink the tap water — bottled only, even for brushing teeth in budget guesthouses"]}'::jsonb
WHERE slug = 'bangkok-thailand';

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Hanoi is the friendliest North Vietnam base for solo women — but the road-crossing skill is real (no traffic lights, scooters everywhere). Walk slowly and steadily, never stop, never run.", "The Old Quarter is the default base — heritage, walkable, lake-centred. Stay within 10 min of Hoan Kiem Lake your first trip.", "Cash is king — Vietnamese dong has lots of zeros (1 USD ≈ 25,000 VND). ATMs everywhere, but BIDV and Vietcombank have the best rates and lowest fees.", "Grab is the default ride app, not Uber. GrabCar (4-wheel) for solo women — avoid GrabBike (scooter taxi) at night.", "Egg coffee, banh mi, and pho are the trinity. Eat them at women-run street stalls — they''re clean, cheap, and natural meet-up spots for other solo female travellers."]'::jsonb,
  transport = '[{"mode": "Grab (GrabCar — avoid GrabBike at night)", "tip": "Default ride app. Use GrabCar (4-wheel) for safety; GrabBike (scooter pillion) is fine in daylight but skip at night. Driver rating system works — only accept 4.7+ stars.", "approxCost": "₫30,000–80,000 across Old Quarter (~₹100–270) | ₫350,000 to airport (~₹1,200)"}, {"mode": "Cyclo (rickshaw)", "tip": "Slow tourist cyclo rides through Old Quarter — agree price before getting in (₫150,000 for 1 hour is fair). Female-passenger-friendly cyclo drivers wear blue shirts and operate from main hotels.", "approxCost": "₫150,000–250,000/hour (~₹500–850)"}, {"mode": "SE3 Reunification Express train (overnight to Hue/Da Nang)", "tip": "Book a soft sleeper, 4-berth cabin — request all-female cabin via 12go.asia or Baolau. Far safer than night bus. Berths 1-2 (lower) are best for solo women — easier escape if needed.", "approxCost": "$45–80 soft sleeper Hanoi → Hue (~₹3,800–6,800)"}]'::jsonb,
  pre_book_checklist = '["Get a Vietnamese SIM at Noi Bai airport (Viettel or Vinaphone) — $5 for 7 days, essential for Grab and Maps", "Book accommodation in Old Quarter (Hoan Kiem) for first trip — walkable, women-friendly, safest after dark", "Save Tourist Police: 1800-1145 (English) — they specifically handle visitor scam complaints", "Download offline Google Maps for Hanoi + Halong Bay area — signal drops in the karsts", "Practice crossing the road on a quiet street first — keep eye contact with scooter drivers, walk slow and steady, they will go around you"]'::jsonb,
  dos_and_donts = '{"do": ["Take Grab for any ride longer than 10 min — cheaper than tourist haggling, in-app tracking", "Eat at busy street stalls with low plastic stools — they''re the safest food in Hanoi", "Cross roads slowly and steadily, never run or stop — scooters predict your path and flow around you", "Carry small dong notes (₫10,000, ₫20,000) — vendors rarely have change for ₫500,000"], "dont": ["Hire a ''tour'' that comes to you in your hotel lobby — book Halong Bay only via reputable agencies (Lily''s Travel, Indochina Junk)", "Take photos of Vietnamese military or police checkpoints — instant detention", "Drink the tap water — bottled only, including for brushing teeth", "Ride a scooter yourself if you''ve never done it — Hanoi traffic is not the place to learn"]}'::jsonb
WHERE slug = 'hanoi-vietnam';

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Seoul is one of the safest cities for solo women in the world — the subway runs till midnight, 24-hour cafés are everywhere, and women walking alone at 2am is normal.", "Get a T-Money card on day 1 — works on subway, bus, taxi, convenience stores. Tap and go, no Korean needed.", "Use KakaoT app instead of Uber — it''s the local default, English-supported, and offers ''Female Driver'' option at slight surcharge.", "Jjimjilbang (Korean bathhouse) culture is excellent for solo women — strict gender-separated floors, women''s floor is enormous and 24/7 in major chains.", "Eating alone in Korea was historically odd but has shifted — solo Korean barbecue restaurants and ramen counters are now mainstream."]'::jsonb,
  transport = '[{"mode": "Seoul Subway (T-Money card)", "tip": "9 lines, English signage, runs 5:30am–midnight. Buy T-Money at any convenience store, recharge at subway machines. Some lines have women-only carriages during peak hours (line 9, certain hours).", "approxCost": "₩1,400 base fare | ₩2,000–3,000 typical ride (~₹85–180)"}, {"mode": "KakaoT (with Female Driver option)", "tip": "Korean ride app, supports English. Premium tier offers ''Female Driver'' — slight surcharge but female-driven taxi within 10 min, far safer for late-night rides.", "approxCost": "₩4,800 starting fare | ₩8,000–18,000 typical (~₹290–1,100)"}, {"mode": "Airport Express (AREX)", "tip": "Direct express from Incheon to Seoul Station in 43 min, ₩9,500. Far better than the bus or regular all-stop train. Women-and-children-quiet zones in some carriages.", "approxCost": "₩9,500 one-way (~₹575)"}]'::jsonb,
  pre_book_checklist = '["Order a T-Money card or download it to your phone via Apple Pay/Samsung Pay before landing", "Book hostel/hotel in Myeongdong, Hongdae, or Itaewon for first trip — all major subway lines connect here", "Save Tourist Police: 1330 (24/7, English-speaking) — different number from regular police, faster English support", "Download Naver Maps and Papago translator (Google Maps doesn''t work well in Korea due to mapping restrictions)", "Pack one warm layer year-round — even summer evenings cool to 18°C, winters drop below 0°C"]'::jsonb,
  dos_and_donts = '{"do": ["Stay overnight in a 24-hour jjimjilbang if you miss the last subway — women''s floor is safer and cheaper (₩15,000) than a taxi ride home", "Use KakaoT ''Female Driver'' option for any ride after 10pm — it''s why the option exists", "Carry your hotel name in Korean (한글) — write it down or have it in Naver Maps", "Bow slightly when greeting elders — the depth of the bow signals respect, even if you don''t speak Korean"], "dont": ["Pour your own drink at meals with Koreans — wait for someone else to pour, then pour theirs in return", "Stick chopsticks upright in rice — same funeral symbolism as Japan, considered very rude", "Refuse to drink soju with elders if offered — it''s a bonding ritual, sip and accept", "Tip in restaurants or taxis — service is always included, tipping confuses staff"]}'::jsonb
WHERE slug = 'seoul-south-korea';

UPDATE intel_cards SET
  audience = 'both',
  tldr = '["Paris is generally safe for solo women but pickpocketing is the constant low-grade risk — keep your bag closed, your phone in your pocket, and wear it crossbody.", "The Métro is fast and extensive but Line 13 has the worst reputation (groping, pickpockets at peak hours) — use Lines 1, 4, or 6 when possible. Avoid Châtelet Les Halles after 11pm alone.", "Walking the Seine is one of the safest things you can do at any hour — well-lit, well-policed, always foot traffic from Pont Neuf to Pont Alexandre III.", "Restaurants always include service compris (15%) — tipping more is a kind gesture but never expected. Round up the bill or leave €1–2.", "The 18th and 19th arrondissements have areas that are less safe at night — stay in Marais, Saint-Germain, or 6th/7th for first solo trip."]'::jsonb,
  transport = '[{"mode": "Métro (Navigo Easy card)", "tip": "Buy Navigo Easy card at any station — €2 for the card, then load with €1.69 single tickets or €8.45 day pass. Avoid Line 13 if possible — it''s the most groping-reported line. Use Lines 1, 4, 6, 14 instead.", "approxCost": "€1.69 single ride | €8.45 day pass (~₹150–760)"}, {"mode": "G7 Taxi or Uber (with female driver option)", "tip": "G7 is the largest official Paris taxi company — has a ''Femmes au volant'' (women drivers) option. Uber has ''Uber Women Drivers'' in Paris. Both reliable and worth the slight surcharge for late-night rides.", "approxCost": "€7 starting fare | €15–35 across central Paris (~₹630–3,150)"}, {"mode": "Vélib'' bike share", "tip": "15,000+ rental bikes across Paris, dedicated bike lanes on most major streets. €5/day pass, €0.50 first 30 min after that. The fastest way across central Paris in good weather.", "approxCost": "€5 day pass | €0.50–2/30min (~₹450 day)"}]'::jsonb,
  pre_book_checklist = '["Order Navigo Easy or Paris Visite pass before landing — saves 15 min queueing at CDG", "Book accommodation in Marais (3rd/4th), Saint-Germain (6th), or Latin Quarter (5th) for first solo trip", "Save SOS Médecins (24/7 doctor): 3624 — and Police: 17 — both English-supported", "Download offline Google Maps for Paris central + Métro PDF map (Citymapper Paris is excellent)", "Activate roaming or buy a French Orange/Free SIM at the airport — €10–20 for 5GB, essential for rideshare apps"]'::jsonb,
  dos_and_donts = '{"do": ["Wear your bag crossbody with the opening against your body — every Métro pickpocket targets dangling shoulder bags", "Walk the Seine after dark — well-lit, well-policed, beautiful, completely safe", "Say ''Bonjour madame/monsieur'' when entering a shop — skipping it is rude and you''ll get worse service", "Eat lunch alone at a café counter — solo dining is normal, no one stares"], "dont": ["Use Line 13 after 9pm if you can avoid it — switch to Lines 1 or 6 for parallel routes", "Engage with anyone offering a ''free bracelet'' near Sacré-Coeur — they tie it on then demand €20", "Sign petitions from anyone on the street near tourist sites — pickpocket distraction tactic", "Wave a metro map open or stare at your phone at major stations like Châtelet — same reason"]}'::jsonb
WHERE slug = 'paris-france';


-- ---- 021_seed_international_cards.sql ----
-- 013: Seed 6 international intel cards (Tokyo, Bangkok, Hanoi, Dubai, Seoul, Paris)
-- These were added to mock-data/intel-cards.json after 002_seed.sql was generated.
-- ON CONFLICT DO NOTHING makes this safe to re-run.

INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('tokyo-japan','Tokyo','Japan','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/tokyo-japan.jpg','{"summary": "One of the safest cities on Earth for solo women. Real risks are nightlife touts in Roppongi/Kabukicho and train groping at rush hour. Cash economy — carry yen always.", "safetyRating": "moderate", "topTip": "NEVER follow anyone soliciting on the street to a bar. Use only places you researched on Google Maps or Tabelog with rev"}','[]','[{"title": "Kabukicho / Roppongi tout ''free drink''", "severity": "critical", "where": "Shinjuku Kabukicho, Roppongi, parts of Shibuya", "what": "Friendly tout offers ''cheap all-you-can-drink'' or ''first drink free''; bar bill = 50,000-300,000 JPY ($300-2,000); intimidation if refused; sometimes drink-spiked", "avoid": "NEVER follow anyone soliciting on the street to a bar. Use only places you researched on Google Maps or Tabelog with reviews. Cash for nightlife (limit damage)."}, {"title": "Drink spiking (Roppongi)", "severity": "critical", "where": "Roppongi gaijin bars + Kabukicho", "what": "GHB or rohypnol; victim wakes up missing money/cards/phone or assault", "avoid": "Avoid Roppongi gaijin bars solo. Order bottled drinks. Watch bartender pour. Never accept drinks from strangers."}, {"title": "Marc/Alex ''lost wallet'' scam", "severity": "medium", "where": "Tokyo/Osaka trains, especially targeting solo women", "what": "Foreign man (often called ''Marc'' or ''Alex'') in black clothes approaches solo travelers showing phone message saying ''help, lost wallet, need to get to airport''", "avoid": "Recognize the pattern (black hat, mask, persistent). Ignore him. Real travelers don''t beg from strangers in Japan — embassies help."}, {"title": "Fake ''monk'' donation", "severity": "medium", "where": "Near temples — Asakusa Sensoji, Ueno, sometimes Kyoto", "what": "Person dressed as Buddhist monk hands you bracelet/card and demands donation", "avoid": "Real monks don''t beg on the street. Ignore + walk past. Don''t accept anything offered."}, {"title": "Model-scout scam", "severity": "high", "where": "Shibuya, Harajuku, Shinjuku — targets young women", "what": "''Talent agent'' approaches solo woman, offers contract, takes to office where pressured to sign/pay ''training fees'' or worse", "avoid": "Real Japanese model agencies don''t street-scout foreigners. Politely decline + walk away. Never go to a private office."}, {"title": "''Charity'' donation (laminated photos)", "severity": "medium", "where": "Shinjuku, Shibuya, tourist areas", "what": "Person with binder/laminated photos showing other ''donors'' pressures you for large donation", "avoid": "Laminated props = scam. Real charities never solicit cash from tourists on streets."}, {"title": "Counterfeit fashion (Harajuku/Shinjuku)", "severity": "medium", "where": "Tourist-heavy shopping areas", "what": "''Authentic'' designer items at low prices = fakes; or fake-marketing pseudo-luxury", "avoid": "Department stores (Isetan, Mitsukoshi, Takashimaya) only for designer. Vintage/2nd-hand: Komehyo or RagTag are reputable."}, {"title": "ATM withdrawal denial / DCC", "severity": "medium", "where": "All Japan ATMs", "what": "DCC offer (''pay in your home currency'') = 5-8% worse rate", "avoid": "ALWAYS pay in JPY, not your home currency. Use 7-Eleven (Seven Bank) or Japan Post Bank ATMs (lowest fees)."}, {"title": "Taxi long-route", "severity": "medium", "where": "Tokyo airports, less common in metered Tokyo taxis", "what": "Driver takes 30-min detour through unfamiliar area, you can''t tell", "avoid": "Use Google Maps live tracking. Or use Go Taxi/JapanTaxi app for transparent metered fares."}, {"title": "Tax-free purchase confusion", "severity": "medium", "where": "Department stores; some smaller shops", "what": "Foreigners qualify for tax-free shopping (>5,000 JPY purchase, passport required); some small stores claim no tax-free even when they should offer it", "avoid": "Bring passport. Look for ''Tax Free'' sticker. At Bic Camera/Don Quijote/large stores: ask ''tax-free counter''."}]','[]','[]','[]','{}','{"currency": "USD", "backpacker": 60, "midRange": 130, "comfortable": 280}','{"Police": "110", "Ambulance": "119", "Tourist Helpline": "03-3201-3331", "JNTO Hotline": "050-3816-2787"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('bangkok-thailand','Bangkok','Thailand','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/bangkok-thailand.jpg','{"summary": "High-energy city with a well-worn tourist trail. Tuk-tuk gem scams and Grand Palace closure lies are a daily ritual. Ride Grab, not taxis. Dress modestly at temples.", "safetyRating": "moderate", "topTip": "Verify at official entrance only. Major Bangkok temples NEVER close for random ceremonies. Walk away from anyone offerin"}','[]','[{"title": "Temple closed scam", "severity": "medium", "where": "Bangkok — Wat Pho, Grand Palace, near Khaosan Road", "what": "''Friendly'' local says temple is closed for ceremony; offers cheap tuk-tuk tour to gem shops where you''re pressured to buy fake/overpriced jewelry", "avoid": "Verify at official entrance only. Major Bangkok temples NEVER close for random ceremonies. Walk away from anyone offering tours nearby."}, {"title": "Gem/jewelry shop scam", "severity": "critical", "where": "Bangkok, sometimes Phuket and Chiang Mai", "what": "Tourist taken to ''tax-free government gem store''; pressured to buy ''investment sapphires'' for $1,000s that are worth $50", "avoid": "Never buy gems/jewelry from tuk-tuk recommendations. Real gem dealers in Thailand don''t approach tourists in the street."}, {"title": "Tuk-tuk no meter overcharging", "severity": "high", "where": "Bangkok especially; Chiang Mai, beach towns", "what": "Tuk-tuks have no meters. Driver quotes 200 THB for 50 THB ride; refuses change for larger bills", "avoid": "Use Grab or Bolt apps. If tuk-tuk: negotiate fare BEFORE getting in. Have exact change ready."}, {"title": "Taxi ''meter broken''", "severity": "high", "where": "Bangkok especially Suvarnabhumi/Don Mueang airports", "what": "Driver says meter broken, quotes 800 THB for 200 THB ride. Or runs meter at 5x speed.", "avoid": "Insist on meter or get out. Use Grab. From airport: official taxi queue downstairs (not solicitations upstairs)."}, {"title": "Scooter rental damage scam", "severity": "critical", "where": "Phuket, Koh Samui, Koh Phangan, Pattaya", "what": "Rental shop demands passport as deposit; on return, claims you damaged scooter (pre-existing scratches), refuses to release passport unless you pay $200-2,000", "avoid": "NEVER leave passport — copy + cash deposit only. Photograph/video bike from all angles BEFORE leaving rental shop. Use shops recommended by your hotel."}, {"title": "Drink spiking (Patpong/Nana/Soi Cowboy)", "severity": "critical", "where": "Bangkok red-light zones, Phuket Bangla Road, Pattaya Walking Street", "what": "GHB/rohypnol in drinks → robbery or sexual assault. Sometimes by ''friendly'' locals/tourists", "avoid": "Avoid these areas entirely if solo. Order bottled drinks, watch the bartender pour. Never accept drinks from strangers."}, {"title": "Jet ski damage scam", "severity": "critical", "where": "Phuket Patong Beach, Pattaya", "what": "Rent jet ski; on return, owner claims you damaged it; demands $500-3,000. Often involves intimidating men appearing ''on cue''", "avoid": "Don''t rent jet skis in Thailand — well-documented scam. Stick to hotel-organized water sports."}, {"title": "Ping pong show / bar scams", "severity": "high", "where": "Patpong, Bangkok", "what": "''Free'' show entry; bill arrives 5,000+ THB ($150) for one beer. Bouncers prevent leaving until paid.", "avoid": "Don''t enter Patpong shows. Period. The whole industry is built on this."}, {"title": "Wrong change scam", "severity": "medium", "where": "Tuk-tuks, taxis, street vendors near tourist areas", "what": "You give 1,000 THB note, driver gives change for 100 THB note, claims you only paid 100", "avoid": "State note value out loud when handing over: ''one thousand baht''. Have exact change when possible."}, {"title": "Bird poop / mustard distraction", "severity": "medium", "where": "Bangkok tourist areas, Chiang Mai night bazaar", "what": "''Bird droppings'' (or sauce) lands on you; ''helpful'' stranger offers to clean you up while accomplice picks pocket", "avoid": "Politely refuse help. Move away from the area. Clean up at a café or hotel."}]','[]','[]','[]','{}','{"currency": "USD", "backpacker": 25, "midRange": 60, "comfortable": 150}','{"Police": "191", "Ambulance": "1669", "Tourist Police": "1155", "Bangkok Helpline": "02-356-0700"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('hanoi-vietnam','Hanoi','Vietnam','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/hanoi-vietnam.jpg','{"summary": "Chaotic and wonderful. Street food scams and motorbike grab-thefts are the main risks. Carry bags on your left (away from traffic). Negotiate fares before getting in anything.", "safetyRating": "moderate", "topTip": "Don''t accept any ''free taste'' from street vendors. Get banh mi instead — better food, fixed prices."}','[]','[{"title": "Donut scam (Hanoi Old Quarter)", "severity": "medium", "where": "Hanoi Old Quarter; women balancing donut baskets on shoulders", "what": "Vendor offers free taste, then loads bag with donuts and charges 200,000+ VND ($8) for inedible product fried in old oil", "avoid": "Don''t accept any ''free taste'' from street vendors. Get banh mi instead — better food, fixed prices."}, {"title": "Taxi meter manipulation", "severity": "high", "where": "All major cities — Hanoi, HCMC, Da Nang, airports especially", "what": "Unmetered taxi or rigged meter that runs 5x normal speed. Common with airport taxis charging 800,000 VND ($32) for a $4 ride", "avoid": "ONLY use Grab app. If you must use a taxi, only Mai Linh (green) or Vinasun (white). Confirm meter on at start."}, {"title": "Motorbike bag-snatching", "severity": "critical", "where": "HCMC District 1 streets, Hanoi roadside walking", "what": "Two riders pass quickly, the passenger grabs phone/bag from your hand or shoulder. Can drag tourists who hold on", "avoid": "Cross-body bag on the side AWAY from road. Don''t use phone while walking near street. Don''t fight back if grabbed — let go."}, {"title": "Cyclo (rickshaw) hidden fees", "severity": "medium", "where": "Hanoi Old Quarter, Hue tourist areas", "what": "Driver agrees on 100,000 VND fare, then adds ''waiting fee'' 500,000 VND/hr or doubles destination distance", "avoid": "Book cyclo tour through reputable agency, or use phone GPS to verify route. Pay only the agreed-upon amount."}, {"title": "Methanol fake alcohol", "severity": "critical", "where": "Cheap bars across SE Asia, especially backpacker areas (Bui Vien HCMC, Old Quarter Hanoi)", "what": "Bootleg spirits laced with methanol — can blind or kill. Most dangerous in ''free shots'' or unknown brand bottles", "avoid": "Stick to beer (Saigon, Tiger, 333) or sealed branded spirits. Never accept free shots. Methanol = ''fishy'' or solvent smell."}, {"title": "SIM card scam at airport", "severity": "medium", "where": "HCMC Tan Son Nhat, Hanoi Noi Bai airports", "what": "Vendor sells $20 SIM card with 1GB; legitimate 30GB Viettel/Vinaphone SIM costs 100,000-150,000 VND ($4-6)", "avoid": "Pre-buy eSIM via Holafly or Airalo before arrival, OR walk past airport vendors to official Viettel/Vinaphone counters."}, {"title": "Multiple businesses with same name", "severity": "medium", "where": "Hanoi, HCMC tour agencies", "what": "Famous tour company ''Mekong Tours'' has 5+ copycats with names like ''Mekong Tour'' or ''Mekong Touring'' — bait-and-switch tours", "avoid": "Always book via official website or use platforms like GetYourGuide, Klook with reviews."}, {"title": "Restaurant menu without prices", "severity": "high", "where": "Tourist areas — especially Old Quarter Hanoi, Pham Ngu Lao HCMC", "what": "No prices listed; bill arrives 5x normal. Gets worse for foreigners with dual-pricing menus", "avoid": "NEVER sit down without seeing prices. Ask ''bao nhieu?'' (how much?) before ordering. Check Google Maps reviews first."}, {"title": "ATM skimming", "severity": "high", "where": "Standalone ATMs near tourist sites (not in banks)", "what": "Skimming device on card reader + camera capturing PIN. Drained accounts within 24h", "avoid": "Use ATMs INSIDE bank branches only (Vietcombank, Techcombank, BIDV). Cover PIN entry."}, {"title": "Sapa trekking ''private guide'' scam", "severity": "medium", "where": "Sapa, Ha Giang trekking areas", "what": "Independent ''guide'' offers private trek 50% cheaper than agency, no insurance, gets lost or demands more", "avoid": "Book through Sapa Sisters (women-owned, well-reviewed) or Ethos Spirit. Verify insurance coverage."}]','[]','[]','[]','{}','{"currency": "USD", "backpacker": 25, "midRange": 60, "comfortable": 120}','{"Police": "113", "Ambulance": "115", "Fire": "114", "Tourist Helpline": "1800-599-920"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('dubai-uae','Dubai','UAE','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/dubai-uae.jpg','{"summary": "Extremely safe for solo women but strict laws apply. Dress modestly outside resorts. Public displays of affection are illegal. Only licensed taxis/Careem — never unofficial cabs.", "safetyRating": "moderate", "topTip": "ONLY use RTA taxis (cream + red roof), or Careem/Uber app. Pink taxis (female driver) available via Careem."}','[]','[{"title": "Unmarked taxi overcharge", "severity": "high", "where": "Dubai Airport, Marina, Downtown", "what": "Unofficial taxi (white car not RTA cream/red) charges 200 AED for 50 AED ride; no receipt", "avoid": "ONLY use RTA taxis (cream + red roof), or Careem/Uber app. Pink taxis (female driver) available via Careem."}, {"title": "Gold/jewelry shop overcharge (Deira/Gold Souk)", "severity": "high", "where": "Gold Souk Deira, some Old Dubai shops", "what": "Massive markups for foreign tourists; aggressive bargaining required. ''Free'' chai while you decide.", "avoid": "Know spot gold price before entering (goldprice.org). Quote: ''Spot + 10% making charge max.'' Walk away from anyone aggressive."}, {"title": "Souvenir ''fake antique'' scam", "severity": "medium", "where": "Gold Souk, Spice Souk, Madinat Jumeirah souk", "what": "Mass-produced trinkets sold as ''antique Bedouin artifacts'' for 500-2,000 AED", "avoid": "Check Madinat Jumeirah souvenir prices first (transparent). Real antiques only at certified dealers."}, {"title": "Online booking fraud (apartment/villa)", "severity": "critical", "where": "Marina, JBR, Downtown short-term rentals", "what": "Fake Airbnb/Booking.com listings, often via WhatsApp inquiry redirect; deposit lost", "avoid": "Book ONLY through Booking.com, Airbnb''s official app. Never wire-transfer. Pay with credit card for chargeback ability."}, {"title": "Pickpocketing in malls", "severity": "high", "where": "Dubai Mall, Mall of the Emirates, Global Village", "what": "Crowded areas, escalators, food courts. Phone snatching from café tables.", "avoid": "Crossbody bag in front. Don''t leave phone on café table. Especially careful at Global Village (highest-risk crowded venue)."}, {"title": "Charity / petition scam", "severity": "medium", "where": "Marina Walk, Downtown Burj area, near tourist hotels", "what": "''Refugee''/charity worker asks for cash donation; sob story; no receipt", "avoid": "All real UAE charity is regulated; never street-collected. Politely decline. Don''t give cash."}, {"title": "ATM skimming", "severity": "high", "where": "Standalone ATMs especially Deira, Naif, near souks", "what": "Skimmer + camera for PIN. Account drained in hours.", "avoid": "Use ATMs INSIDE major bank branches (Emirates NBD, ENBD, ADCB, Mashreq) only. Not those in shops/streets."}, {"title": "Desert safari low-cost trap", "severity": "medium", "where": "Internet-booked cheap desert safaris", "what": "$30 ''all-inclusive'' safari = battered 4x4, no insurance, mediocre BBQ. Some accidents reported.", "avoid": "Book reputable: Platinum Heritage, Arabian Adventures, OceanAir Travels. Expect 250-400 AED ($70-110)."}, {"title": "Speeding fine surprise (rentals)", "severity": "high", "where": "Highway driving anywhere", "what": "Speed cameras EVERYWHERE; fines 600-3,000 AED + black points; rental company charges admin fee", "avoid": "Stay under speed limit (120 km/h max highway). Check rental car return for fines settled before leaving."}, {"title": "Photo of locals", "severity": "high", "where": "Anywhere — beach, mall, restaurants", "what": "NOT a scam but a legal issue — photographing Emirati women without consent = criminal offense; some pretend offense for cash", "avoid": "NEVER photograph people without explicit permission. No selfies with strangers in background. Especially women."}]','[]','[]','[]','{}','{"currency": "USD", "backpacker": 60, "midRange": 150, "comfortable": 350}','{"Police": "999", "Ambulance": "998", "Dubai Tourism": "800-9999", "Women''s Helpline": "800-HOPE (4673)"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('seoul-south-korea','Seoul','South Korea','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/seoul-south-korea.jpg','{"summary": "Very safe with world-class transit. Watch for bar overcharging in Itaewon/Hongdae after midnight. T-money card for everything. Download Kakao T for taxis.", "safetyRating": "high", "topTip": "Use Kakao T app (NOT Uber, weak in Korea). Wait at official taxi stands. Real taxis: silver/orange/black with TAXI roof "}','[]','[{"title": "Unlicensed taxi (illegal callvan)", "severity": "high", "where": "Hongdae, Itaewon, Gangnam after midnight when subway closes", "what": "Black ''callvan'' or unmarked car charges 3-4x metered taxi for ride. Especially at popular nightlife exits.", "avoid": "Use Kakao T app (NOT Uber, weak in Korea). Wait at official taxi stands. Real taxis: silver/orange/black with TAXI roof sign + meter."}, {"title": "Christian cult recruitment", "severity": "medium", "where": "Hongdae, Sinchon, Gangnam streets — targets foreigners", "what": "Friendly Korean approaches asking for directions, then invites to ''free Korean lesson'' or ''cultural exchange''. Leads to multi-hour cult sessions, attempts at conversion + payment.", "avoid": "Polite decline + walk on. Recognize patterns: clipboard, English skills mismatch, scripted questions about religion."}, {"title": "Tourist-area restaurant overcharging", "severity": "medium", "where": "Myeongdong, Insadong, near Gyeongbokgung Palace", "what": "Korean BBQ/seafood/ginseng chicken at 2-3x normal price; English menu has higher prices than Korean menu", "avoid": "Use Naver Maps (Korean Yelp) reviews. Eat where Koreans eat — packed locals = good price + quality. Ask for Korean menu if available."}, {"title": "Fashion district counterfeit", "severity": "medium", "where": "Dongdaemun Market, Myeongdong, Itaewon", "what": "Fake designer goods marketed as ''authentic'', or knockoff K-beauty brands at inflated prices", "avoid": "Designer = department stores (Lotte, Shinsegae, Hyundai). K-beauty: Olive Young (legit chain), Innisfree, Etude House official stores."}, {"title": "ATM skimming + DCC", "severity": "high", "where": "Standalone ATMs especially Itaewon/Hongdae", "what": "Skimming + DCC trap (offer ''pay in your currency'' — 5% worse rate)", "avoid": "Use ATMs at major banks (KB, Shinhan, Woori) inside branches. Always select ''KRW'' not USD on screen."}, {"title": "Cosmetic surgery / clinic upselling", "severity": "medium", "where": "Gangnam, Apgujeong (cosmetic surgery streets)", "what": "$50 ''consultation'' becomes hard-sell pressure; deposit required for procedures pricier than promised", "avoid": "Research clinics via Korea Tourism Org partner list. Get all prices in writing before deposit. Don''t go in solo if cult-vulnerable."}, {"title": "Aggressive selling in Insadong", "severity": "medium", "where": "Insadong shopping district", "what": "Vendors quote inflated prices for ''traditional Korean handicrafts'' that are mass-produced", "avoid": "Bargain (uncommon in Korea otherwise but expected here). Compare prices across multiple stalls."}, {"title": "Free Wi-Fi phishing", "severity": "medium", "where": "Tourist areas, airports, cafés", "what": "Fake Wi-Fi (''Korea Free'' / ''Tourist Wi-Fi''); captures bank login data", "avoid": "Use mobile data (eSIM/SIM) for banking. VPN if must use public Wi-Fi (NordVPN, ExpressVPN)."}, {"title": "DMZ tour bait-switch", "severity": "medium", "where": "Booked DMZ (North Korean border) tours", "what": "Cheap online listing turns out to be ''DMZ overview'' from far away, no JSA visit", "avoid": "Book via Koridoor, VIP Travel, or Klook with reviews. Confirm whether JSA (Joint Security Area) is included before paying."}, {"title": "Karaoke (noraebang) overcharging", "severity": "medium", "where": "Hongdae, Gangnam late-night", "what": "Some ''karaoke'' venues are room-salons with hostesses; charge $200-500 for drinks", "avoid": "Use coin noraebang chains (multi-bang places) — fixed pricing. Or noraebang inside reputable buildings (not hidden alleys)."}]','[]','[]','[]','{}','{"currency": "USD", "backpacker": 50, "midRange": 120, "comfortable": 250}','{"Police": "112", "Ambulance": "119", "Foreign Helpline": "1330", "Seoul Hotline": "02-120"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('paris-france','Paris','France','foreign-women','ananya-mumbai','2026-04-28',5,'/images/intel/paris-france.jpg','{"summary": "Beautiful and pickpocket-heavy. 70% of Paris pickpocket victims are women. Metro Line 1 and tourist sites are highest risk. Crossbody bag in front, phone in zipped pocket, always.", "safetyRating": "moderate", "topTip": "Hands in pockets in tourist areas. Walk past, don''t make eye contact. If tied: take it off, drop it, walk away."}','[]','[{"title": "Friendship bracelet / rose scam", "severity": "medium", "where": "Paris (Sacré-Cœur, Eiffel), Rome (Spanish Steps), Barcelona (Las Ramblas)", "what": "Stranger ties bracelet on wrist or thrusts rose into hand, then aggressively demands €5-50 + scenes if you refuse", "avoid": "Hands in pockets in tourist areas. Walk past, don''t make eye contact. If tied: take it off, drop it, walk away."}, {"title": "Petition scam (deaf-mute clipboard)", "severity": "high", "where": "Paris (Eiffel, Louvre, Trocadéro), Rome, Berlin Brandenburg, Barcelona", "what": "Group of ''deaf-mute'' women/children with clipboard distract you for petition signature; accomplice picks pocket", "avoid": "Hands on bag/pockets when approached. ''Non!'' / ''No!'' firmly. Move away. Real charities don''t street-collect."}, {"title": "Gold ring ''find''", "severity": "medium", "where": "Paris, Rome, Barcelona near tourist sites", "what": "Person ''finds'' gold ring, offers to sell it cheap (€20). Ring is brass.", "avoid": "If ''found'' near you, walk away. Don''t engage."}, {"title": "Bird poop / mustard / spilled drink", "severity": "medium", "where": "Rome, Barcelona, Paris, London tourist hubs", "what": "Substance lands on you; helpful stranger offers to clean while accomplice picks pocket", "avoid": "Politely refuse help. Move to a café/store before cleaning. Don''t put bag down."}, {"title": "Metro pickpocketing (organized gang)", "severity": "critical", "where": "Paris Métro Line 1+4 (CDG-Châtelet); Rome Metro Line A (Termini-Vatican); Barcelona L3 + L4", "what": "Children + adult teams crowd you at door, jostle, lift wallet/phone. Highest rate at Eiffel, Colosseum, Sagrada Familia stops.", "avoid": "Crossbody bag IN FRONT, hand on it. Phone in zipped pocket NEVER back pocket. Stay aware near doors at stops."}, {"title": "Fake police ''wallet check''", "severity": "high", "where": "Madrid, Rome, Berlin, Prague", "what": "Plainclothes ''police'' demand passport/wallet for ''counterfeit money check''. Take cash + cards.", "avoid": "Real police NEVER ask for wallet on the street. Demand to walk to nearest police station. Walk away if they don''t agree."}, {"title": "Restaurant menu-swap / no-prices", "severity": "high", "where": "Rome (Trastevere, near Trevi), Paris (near Notre-Dame, Champs-Élysées)", "what": "Verbal ''fish of day'' or untranslated menu = €100+ shock bill. ''Coperto'' (cover charge) added with stiff tip", "avoid": "Read menu prices before sitting. Ask ''how much?'' for any verbal special. Avoid restaurants without prices on menu."}, {"title": "Gladiator photo scam (Rome)", "severity": "medium", "where": "Rome — Colosseum, Roman Forum", "what": "Costumed ''gladiators'' pose for photo; demand €20-50 after", "avoid": "Don''t pose with them. If they appear in your shot, walk on without paying."}, {"title": "Taxi airport overcharge", "severity": "high", "where": "All major airports — Rome FCO, Paris CDG, Madrid Barajas, Barcelona BCN, Berlin BER", "what": "Driver claims ''flat rate'' or no meter; €100+ for €40 ride", "avoid": "Use Uber/Bolt/FreeNow apps. OR insist on metered taxi from official taxi rank only. Rome + Paris have fixed flat-fares posted online (Rome FCO €50)."}, {"title": "ATM skimming (multiple countries)", "severity": "high", "where": "Standalone ATMs in tourist areas — especially Italy, Spain, Berlin", "what": "Skimming device + camera; account drained within hours", "avoid": "Use ATMs INSIDE bank branches. Cover PIN entry. Use credit not debit (better fraud protection)."}]','[]','[]','[]','{}','{"currency": "EUR", "backpacker": 70, "midRange": 150, "comfortable": 300}','{"Police": "17", "Ambulance": "15", "Fire": "18", "EU Emergency": "112", "Tourist Police Paris": "+33-1-53-71-53-71"}',false,NULL,'{}') ON CONFLICT (slug) DO NOTHING;

