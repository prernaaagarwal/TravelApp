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
