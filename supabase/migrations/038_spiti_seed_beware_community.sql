-- 038_spiti_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Spiti Valley, Himachal Pradesh, India.
-- 12 beware reports + 25 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS (Part 1: all 12 entries) ──────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- spiti-bw-001: Driver substitution without notice
(
  'spiti-valley-india', 'Kaza', 'Transport',
  $t$Driver Substitution Without Notice$t$,
  'medium',
  $d$A documented pattern reported by multiple travellers: you book a taxi with a specific named driver, confirm dates, then a different driver shows up on departure day — sometimes without any advance warning. This has been flagged repeatedly in community travel databases for Spiti as recently as 2024. Always ask explicitly at booking: 'Will you personally drive, or will you send someone else?' Get confirmation in writing via WhatsApp if possible.$d$,
  'Web research',
  'Kaza taxi stand and private bookings across the circuit',
  '[]', 'approved'
),

-- spiti-bw-002: Overpriced package tours bundling commission stops
(
  'spiti-valley-india', 'Kaza', 'Tours & Guides',
  $t$Overpriced 'Package' Tours Bundling Unnecessary Stops$t$,
  'medium',
  $d$Local operators occasionally bundle sightseeing stops at shops or establishments that pay commissions into 'fixed itinerary' packages. Tourists are not told these stops are commission-based. Always check with the Taxi Union near the bus stand in Kaza for standard rates and officially suggested itineraries before booking a private package.$d$,
  'Web research',
  'Kaza main market, private travel operators',
  '[]', 'approved'
),

-- spiti-bw-003: ATM shortage in remote villages
(
  'spiti-valley-india', 'Spiti Valley (all villages beyond Kaza)', 'Finance',
  $t$ATM Shortage — Cash Scarcity in Remote Villages$t$,
  'high',
  $d$ATM infrastructure is extremely limited throughout Spiti. Outside Kaza town, there are virtually no functioning ATMs. Travellers who underestimate cash needs have been left unable to pay homestays or emergency transport. Budget ₹5,000–₹8,000 in cash per person beyond Kaza for a 5–7 day circuit. Do not count on card payments being accepted at villages.$d$,
  'Web research',
  'All villages beyond Kaza: Kibber, Langza, Hikkim, Komic, Chicham',
  '[]', 'approved'
),

-- spiti-bw-004: Peak season homestay overcharging
(
  'spiti-valley-india', 'Kaza / Kibber', 'Accommodation',
  $t$Peak Season Homestay Overcharging$t$,
  'medium',
  $d$During July–August peak season, some homestays charge tourists (especially foreign nationals) rates significantly above the standard ₹800–₹1,500/night bracket without upfront disclosure. Always confirm the nightly rate inclusive of meals before check-in, and get it confirmed verbally in front of a witness. Budget homestays outside Kaza generally remain honest but Kaza town accommodation near the bus stand has seen price creep.$d$,
  'Web research',
  'Kaza town accommodation zone',
  '[]', 'approved'
),

-- spiti-bw-005: Fake Inner Line Permit scam
(
  'spiti-valley-india', 'Entry checkpoints, Rekong Peo / Losar', 'Documents',
  $t$Fake 'Inner Line Permit' Requirement Scam (Foreign Nationals)$t$,
  'high',
  $d$Some unofficial 'helpers' at checkpoints approach foreign nationals claiming they need a special permit or 'stamp' that only they can arrange — for a fee. Foreign nationals do require an Inner Line Permit (ILP) for certain restricted zones, but this must be arranged in advance at official SDM offices or online. No middleman is authorised to collect fees at checkpoints. Reject any unofficial 'permit assistance' at roadside stops.$d$,
  'Web research',
  'Losar checkpoint, Rekong Peo SDM office area',
  '[]', 'approved'
),

-- spiti-bw-006: Zero network coverage emergency risk
(
  'spiti-valley-india', 'All villages beyond Kaza', 'Safety / Connectivity',
  $t$Zero Network Coverage — Emergency Unpreparedness Risk$t$,
  'high',
  $d$Only BSNL postpaid SIM cards have any network coverage in remote Spiti. Jio and Airtel are unreliable beyond Kaza town and completely absent in most villages. Tourists who rely on smartphone navigation, digital payments, or emergency calls have found themselves stranded. Download full offline Google Maps before entering the valley. Carry a printed emergency contact list and lodge your detailed itinerary with someone at home.$d$,
  'Web research',
  'Chicham, Hikkim, Komic, Demul, Langza, Chandratal area',
  '[]', 'approved'
),

-- spiti-bw-007: Night driving on mountain roads
(
  'spiti-valley-india', 'All road sections', 'Transport / Safety',
  $t$Night Driving on Mountain Roads — Life Risk$t$,
  'high',
  $d$Driving at night on Spiti roads is genuinely dangerous and strongly discouraged by every safety source covering the region. Roads are unlit, have no guardrails on cliff-edge stretches, and emergency rescue can be hours away. Some private drivers, under pressure from tourist schedules, accept night driving requests. Always insist on reaching your destination before dark regardless of itinerary pressure. Build 1–2 buffer days into your trip.$d$,
  'Web research',
  'All major road sections: Kaza–Chandratal, Kaza–Kibber, Kunzum Pass approach',
  '[]', 'approved'
),

-- spiti-bw-008: Altitude sickness underestimation
(
  'spiti-valley-india', 'Kaza and beyond (3,680m+)', 'Health',
  $t$Altitude Sickness Underestimation — Medical Risk$t$,
  'high',
  $d$Acute Mountain Sickness (AMS) affects travellers regardless of fitness level, especially those flying into Chandigarh/Delhi and road-tripping directly via Manali. The Manali route involves a sudden gain to 4,900m (Rohtang/Baralacha) within 24 hours, triggering AMS in many. Symptoms: persistent headache, nausea, breathlessness at rest. Diamox (acetazolamide) requires a prescription — get it before travel. Take the Shimla route for gradual acclimatisation. Never ascend further if symptoms worsen at rest.$d$,
  'Web research',
  'Kaza (3,680m), Chandratal (4,250m), Kunzum Pass (4,590m), Hikkim (4,440m)',
  '[]', 'approved'
),

-- spiti-bw-009: Landslide road closures
(
  'spiti-valley-india', 'All road approaches', 'Transport / Safety',
  $t$Landslide Road Closures — Stranded Travellers$t$,
  'high',
  $d$Landslides can block the only road access routes for hours or days, particularly in July–August monsoon season and after heavy rain. The Manali–Spiti road (via Rohtang and Kunzum) and the Shimla–Spiti road (via Kinnaur) are both affected. Travellers with tight return schedules — especially those with flights booked — have been seriously inconvenienced. Always build a minimum 2 buffer days into your circuit.$d$,
  'Web research',
  'Kunzum Pass approach, Rohtang Pass, Kinnaur gorge road sections',
  '[]', 'approved'
),

-- spiti-bw-010: Staring and unwanted photo requests (women)
(
  'spiti-valley-india', 'Kaza, petrol pumps, village entry points', 'Harassment',
  $t$Staring and Unwanted Photo Requests (Women Travellers)$t$,
  'low',
  $d$The region is overwhelmingly safe socially, with Buddhist community values. However, solo women travellers have noted prolonged staring — particularly at petrol pumps and roadside rest stops — from male workers and long-distance truck/transport drivers transiting the valley (not locals). This is generally not threatening but can feel uncomfortable. Walking with purpose and confidence is the most effective response. The local Spitian community is described as genuinely respectful.$d$,
  'Web research',
  'Kaza petrol pump, roadside dhabas on the Manali–Kaza route',
  '[]', 'approved'
),

-- spiti-bw-011: Misleading organic café pricing in Kaza
(
  'spiti-valley-india', 'Kaza', 'Food & Drink',
  $t$Misleading 'Organic' Cafe Pricing in Kaza$t$,
  'low',
  $d$Kaza has seen a rise in cosmopolitan 'organic' cafes catering to tourist demand, sometimes charging Delhi-level prices (₹500–₹800 per meal) for food that standard local dhabas serve for ₹150–₹250. Not a scam, but a price awareness gap that catches budget travellers off guard. The Nepalese dhabas near the bus stand consistently offer honest prices and excellent thukpa/momos.$d$,
  'Web research',
  'Kaza main road, café cluster near the monastery',
  '[]', 'approved'
),

-- spiti-bw-012: Rental bike mechanical failure risk
(
  'spiti-valley-india', 'Kaza', 'Transport',
  $t$Rental Bike / Scooter Mechanical Failure Risk$t$,
  'medium',
  $d$Motorbike rentals are available in Kaza but quality varies significantly. Some rental bikes have poorly maintained brakes, worn tyres, and no insurance documentation. On Spiti's unpaved, cliff-edge roads, mechanical failure is a serious risk. If renting, inspect brakes thoroughly, check tyre tread, ask specifically about spare parts carried, and confirm the bike has a high enough ground clearance for rocky passes.$d$,
  'Web research',
  'Kaza rental shops',
  '[]', 'approved'
);

-- ── Part 1 of 10 complete (all 12 Spiti beware reports). ─────────────────────
-- ── Spiti community posts (parts 2–3) append below. ──────────────────────────
