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
