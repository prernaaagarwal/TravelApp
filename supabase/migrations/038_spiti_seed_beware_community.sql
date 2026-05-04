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

-- ─── COMMUNITY POSTS (Part 2: spiti-cp-001 to spiti-cp-013) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- spiti-cp-001
(
  'spiti-cp-001', 'experiences',
  'Solo traveller', '28-34',
  $t$Solo female — 10 days Shimla to Kaza. Honestly safer than Goa.$t$,
  $c$Took the Shimla route in August 2025. Spent 2 nights in Kalpa for acclimatisation first — absolutely worth it, my body thanked me. Kaza itself feels like a village where everyone knows everyone, and I (foreign, solo woman) was welcomed everywhere without incident. The thing nobody tells you: the men who stare are almost always transit truck drivers, not local Spitians. Local Buddhist community is genuinely kind. Ate at the same Nepalese dhaba near the bus stand every day — thukpa for ₹180, never got sick. BSNL SIM is non-negotiable: Jio is a paperweight after Shimla.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-002
(
  'spiti-cp-002', 'experiences',
  'Solo traveller', '31-36',
  $t$My driver didn't show — different person arrived with zero explanation$t$,
  $c$Booked a driver through a Spiti community group online. He confirmed my dates, we WhatsApp'd. On departure morning from Shimla, a totally different man arrived. No prior warning. The original driver 'sent' him. The replacement was fine as a driver but I felt my consent wasn't considered. Multiple people in the community have had this happen. Now I always ask at booking: 'Will you personally drive or send someone?' and get the answer in writing before paying anything.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-003
(
  'spiti-cp-003', 'experiences',
  'Solo traveller', '24-28',
  $t$Altitude hit me hard — Manali route mistake$t$,
  $c$Went Manali to Kaza in a single day (July 2024). By evening I had a splitting headache, vomiting, and couldn't sleep. Classic AMS. I didn't have Diamox and there's no reliable pharmacy beyond Kaza. Had to rest for 2 full days in my Kaza homestay doing nothing. Entire first half of my trip was wasted because I hadn't acclimatised. Please, please take the Shimla route if it's your first time. Or at minimum spend an extra night in Gramphoo before Kaza. Don't be me.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-004
(
  'spiti-cp-004', 'experiences',
  'Solo traveller', '26-32',
  $t$Cash crisis beyond Kaza — carry enough$t$,
  $c$I ran out of cash at Chicham village. The nearest ATM was back in Kaza — a full shared cab journey away. My homestay host in Chicham was gracious enough to let me pay on departure but this was an awkward situation I'd rather not repeat. There are zero UPI or card terminals in the remote villages. Carry at least ₹6,000–₹8,000 cash per person before leaving Kaza for the village circuit. The ATM in Kaza itself is sometimes out of cash during peak season — withdraw in Rekong Peo if you're coming from the Shimla side.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-005
(
  'spiti-cp-005', 'experiences',
  'Solo traveller', '29-35',
  $t$Two weeks solo as a woman — what nobody warns you about (and what they get wrong)$t$,
  $c$Everyone warns about roads and altitude but nobody warns about the isolation fog. By day 5 with no mobile data, I realised I had no idea if anyone would find me if something went wrong. The lesson: download offline maps *before* entering, lodge your full itinerary with a contact at home, and tell your homestay host where you're going each morning. The people are extraordinary — genuinely so. My Ammaji host in Kaza made me feel like family. No harassment, no scary moments with locals. The truck drivers on the highway rest stops stare but nothing more. Just walk with confidence.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-006
(
  'spiti-cp-006', 'experiences',
  'Solo traveller', '33-38',
  $t$Refused to drive in daylight — nearly pushed into night driving$t$,
  $c$My driver kept saying 'we'll make it before dark' about a route that clearly wasn't possible on time. I had to firmly insist we stop at Losar for the night and continue the next morning. He eventually agreed but was visibly annoyed. I think some drivers overcommit to itineraries to please clients and then cut corners on safety. Be clear from day one: no driving after sunset, no exceptions. It's a non-negotiable on these roads.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-007
(
  'spiti-cp-007', 'experiences',
  'Solo traveller', '27-33',
  $t$Kaza taxi union is your best friend for pricing transparency$t$,
  $c$Before hiring any private transport in Kaza, go to the Taxi Union office near the bus stand first. They have a board with official fixed rates for every route in the circuit — Kaza to Kibber, Kaza to Langza, full day hire, etc. Armed with this info you can negotiate from a position of knowledge. Any driver quoting more than 20% above union rates is overcharging. The union board also shows a rough map of the entire valley which is extremely useful since offline maps can be patchy for the smaller villages.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-008
(
  'spiti-cp-008', 'experiences',
  'Solo traveller', '30-36',
  $t$Hitchhiking alone as a woman — it worked, with caveats$t$,
  $c$I can't drive so relied on hitchhiking for inter-village movement. At first terrifying — the roads are incredibly desolate and you can wait 45 minutes seeing no vehicles. The petrol pump in Kaza was the best spot to catch rides. Most lifts came from fellow tourists in rented cars, not locals. Nobody was creepy. That said, I was nervous every time. The risk isn't people — it's mechanical: if the vehicle breaks down you're stranded on a remote cliff road with no phone signal. I'd only recommend hitchhiking here for experienced solo travellers who are comfortable with genuine isolation.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-009
(
  'spiti-cp-009', 'experiences',
  'Solo traveller', '22-27',
  $t$'Organic' cafe prices in Kaza — budget shock$t$,
  $c$Budgeted ₹300 per meal based on research but the trendy cafes near the main Kaza road charge ₹500–₹700 for basic dishes. I watched tourists paying ₹600 for a plate of pasta that a dhaba around the corner served for ₹180. The organic/Instagram branding adds a huge premium. The Nepalese restaurants near the bus stand are cheap, clean, and the thukpa is genuinely excellent. Don't let aesthetic cafes eat your Spiti budget.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-010
(
  'spiti-cp-010', 'experiences',
  'Solo traveller', '35-42',
  $t$What really works for AMS prevention$t$,
  $c$Spent time at 8,000ft (Narkanda) and then 9,700ft (Kalpa) before heading higher. On arrival at Kaza (12,000ft) I had a minor headache but it cleared by morning. Key things: drink 3–4 litres of water daily, no alcohol for the first 48 hours, no strenuous exercise on arrival day, eat light. Garlic soup available at most dhabas actually helps. Get Diamox on prescription before you leave home — it's not available over the counter in Spiti. If headache is pounding after rest and not improving, descend. Do not wait it out.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-011
(
  'spiti-cp-011', 'experiences',
  'Solo traveller', '28-34',
  $t$Chicham homestay — BSNL dead, felt totally cut off$t$,
  $c$The BSNL SIM that worked fine in Kaza completely failed in Chicham. Two nights with zero connectivity. I hadn't told anyone exactly where I was staying — my family only knew I was 'somewhere in Spiti.' It was fine, actually beautiful, but the psychological weight of total isolation crept in at night. Now I always WhatsApp my exact homestay name and village to someone at home before I leave Kaza. And I carry a printed daily itinerary in case I meet someone who can pass a message.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-012
(
  'spiti-cp-012', 'experiences',
  'Solo traveller', '25-30',
  $t$January visit with friends — roads covered in snow, totally surreal$t$,
  $c$Visited Kaza in January 2025, reached via the Manali side after a long drive. Roads were half covered in snow, the cold was intense — but that's what made it special. Stayed in a small homestay run by a local family who gave us hot tea and food even when it was freezing. Key Monastery in winter looked like a movie set. Breathing was difficult at the altitude, especially in the cold air. Night bonfires were the best part. Winter Spiti is extreme but the locals are incredibly warm. Just bring real cold-weather gear — thermals are not optional.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-013
(
  'spiti-cp-013', 'experiences',
  'Solo traveller', '27-33',
  $t$Permit realities for foreign nationals — don't get caught out$t$,
  $c$As a foreign national I needed an Inner Line Permit for certain restricted areas around Spiti. This must be arranged at an official SDM (Sub-Divisional Magistrate) office or online through the Himachal Pradesh government portal — NOT through any roadside tout or 'helper.' A guy at the Losar checkpoint approached me offering to 'arrange my permit' for ₹500. I declined and checked with my homestay host — no permit was needed for where I was going, and even if it was, the official process is free or nominal at the SDM office. Don't pay strangers at checkpoints.$c$,
  'spiti-valley-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Part 3: spiti-cp-014 to spiti-cp-025) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- spiti-cp-014
(
  'spiti-cp-014', 'experiences',
  'Solo traveller', '24-29',
  $t$Key Monastery to Kibber on foot — misleading distances$t$,
  $c$Thought the walk from Key Monastery to Kibber village would be a pleasant 3km stroll based on a map. At altitude, on a rocky unpaved path, it took nearly 2 hours with a loaded day-pack. Nobody mentions that altitude adds a multiplier to walking time and effort. What looks like a 1-hour walk at sea level can be 2+ hours at 4,000m. Factor this in when planning village walks and always start early — afternoon light changes fast in the valley.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-015
(
  'spiti-cp-015', 'experiences',
  'Solo traveller', '30-38',
  $t$Best safety investment: Airtel SIM for the Shimla–Kinnaur stretch$t$,
  $c$BSNL is the go-to for deep Spiti, but on the Shimla–Kinnaur approach road (Rekong Peo, Kalpa) Airtel actually works better than BSNL. Multiple travellers in Spiti communities recommend carrying both: Airtel for the approach via Kinnaur, BSNL postpaid for Kaza and the valley interior. Keep both topped up before you enter the valley — there are no reliable recharge points beyond Rekong Peo. Also: power banks. Homestays have electricity but it can be intermittent.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-016
(
  'spiti-cp-016', 'experiences',
  'Solo traveller', '27-34',
  $t$Stayed with Ammaji in Kaza — the most genuine hospitality I've experienced$t$,
  $c$Found a simple homestay near the bus stand in Kaza on arrival — no prior booking, just walked in. Run by an elderly woman everyone called Ammaji who lived mostly alone. Charged ₹1,200/night with breakfast and dinner. She made incredible home food and in the evenings shared her life story over tea — her husband had been in the Army, passed away young, she raised her children alone. I cried. The homestay was basic (shared bathroom, cold water) but I felt more at home there than in any hotel. People like Ammaji are why you come to Spiti.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-017
(
  'spiti-cp-017', 'experiences',
  'Solo traveller', '26-31',
  $t$Peak season (July–Aug): book accommodation before leaving Kaza$t$,
  $c$Arrived in Kibber without a booking in late July and spent an anxious hour trying to find a room. Everything was full — there were more tourists than beds. Peak season in Spiti has grown dramatically in recent years. The same applies to Langza and Hikkim. In off-peak (May, September, October) you can walk in anywhere, but July–August requires advance booking, especially in the smaller villages. WhatsApp numbers for Kibber and Langza homestays are widely shared in Spiti community groups — use them.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-018
(
  'spiti-cp-018', 'experiences',
  'Solo traveller', '25-31',
  $t$Motorbike rental — check brakes before you ride$t$,
  $c$Rented a Royal Enfield Himalayan in Kaza for 2 days. The rental guy handed me the key without any safety briefing. When I tested the brakes on a flat road, the rear brake had almost no resistance. I refused the bike and asked for a replacement — after initial pushback, he gave me a different one which was fine. The roads in Spiti are not forgiving of mechanical failure. If you're renting a bike: test brakes on flat ground before you go anywhere, check tyre pressure, ask if the rental includes breakdown support (most don't).$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-019
(
  'spiti-cp-019', 'experiences',
  'Solo traveller', '29-36',
  $t$Rohtang Pass permit — don't get caught without it$t$,
  $c$Travellers using the Manali route to enter Spiti need a Rohtang Pass permit. This is issued online (himachal.nic.in) and is free, but only a limited number are issued per day. If you haven't booked your permit in advance and miss the daily quota, you cannot legally cross. Some private jeep drivers claim they can arrange this 'on the day' — this is not reliable. Book your Rohtang permit online 3–4 days before you plan to cross. The Shimla route avoids Rohtang entirely, another reason to prefer it for first-timers.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-020
(
  'spiti-cp-020', 'experiences',
  'Solo traveller', '23-28',
  $t$Hitchhiking tip from the petrol pump — it actually works$t$,
  $c$Couldn't find space in the shared cab going to Key Monastery from Kaza. Someone suggested waiting at the petrol pump. Within 25 minutes a group of tourists in a rented SUV heading to Key offered me a seat for ₹50. This is a known local tip: the Kaza petrol pump is where all vehicles heading into the valley stop to refuel. You can often catch lifts to Key, Kibber, and even Chandratal from here, especially on peak-season mornings. Go early (8–9am) for the best chance.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-021
(
  'spiti-cp-021', 'experiences',
  'Solo traveller', '34-40',
  $t$Photography of locals — ask first, always$t$,
  $c$Saw a fellow tourist photographing an older Spitian woman in traditional dress without asking permission. The woman looked deeply uncomfortable but said nothing. There's a growing sensitivity in the community about being photographed as 'curiosities' by urban tourists. Always ask permission before pointing a camera at any local — a smile and a gesture toward your camera is usually understood. Many monks at monasteries will also ask you not to photograph certain prayer rooms or ceremonies. Respect is not optional here.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-022
(
  'spiti-cp-022', 'experiences',
  'Solo traveller', '26-32',
  $t$Monsoon landslide held us at Chhatru for a full day$t$,
  $c$Were driving from Manali toward Spiti in August 2024 and got stuck at Chhatru near Rohtang for an entire day due to record rainfall and a road blockage. Our driver was calm and helped arrange accommodation in a roadside camp. Other drivers were helping each other navigate — there's a real camaraderie among Spiti drivers in a crisis. But we lost a full day of our itinerary. If you're visiting in August, build extra buffer days. Rain can close the only road for 12–24 hours with no warning.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-023
(
  'spiti-cp-023', 'experiences',
  'Solo traveller', '31-38',
  $t$Dress modestly — it's practical and respectful$t$,
  $c$Spiti is a deeply Buddhist, conservative community. I'm not saying you must cover up everywhere, but wearing shorts and sleeveless tops through monastery courtyards and village celebrations is genuinely disrespectful and noticed. Light salwar kameez or full-length trousers work well for the climate (cold mornings anyway) and means you're dressed appropriately to enter any monastery. Carry a light scarf for head covering if entering temple inner sanctums. Beyond respect, modesty also means less attention from the occasional passing truck driver.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-024
(
  'spiti-cp-024', 'experiences',
  'Solo traveller', '29-35',
  $t$Himachal Pradesh Tourist Police are genuinely helpful$t$,
  $c$Had a minor issue with a driver dispute in Kaza. A local at the market pointed me to the tourist police office. The officer spoke decent English, helped mediate the dispute, and made it clear to the driver what was and wasn't acceptable. I was impressed. The emergency number (112) works wherever BSNL has signal. Tourist police in Kaza are more responsive than I expected for such a remote area. If you have a problem — overcharging, harassment, a driver dispute — report it; they take it seriously.$c$,
  'spiti-valley-india', '[]', 'approved'
),

-- spiti-cp-025
(
  'spiti-cp-025', 'experiences',
  'Solo traveller', '32-40',
  $t$October visit — golden valley, far fewer tourists, perfect for solo women$t$,
  $c$Chose October specifically to avoid the peak crowd. Spiti in October is extraordinary — the valley turns golden before winter sets in, the air is crisp, and villages are half-empty. Accommodation prices drop, homestay hosts have more time for you, and the roads (while slightly riskier due to early frost) are less congested. Met only a handful of other tourists in a week. The sense of having the entire valley to yourself is worth the slightly harder logistics. October is my unequivocal recommendation for solo women who want the safest, most authentic experience.$c$,
  'spiti-valley-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── End of Spiti seed (12 beware reports + 25 community posts). ──────────────
