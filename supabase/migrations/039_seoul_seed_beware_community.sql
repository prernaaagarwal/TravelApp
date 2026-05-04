-- 039_seoul_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Seoul, South Korea.
-- 12 beware reports + 25 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS (Part 4: all 12 entries) ──────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- seoul-bw-001: Spiritual ceremony cult recruitment scam
(
  'seoul-south-korea', 'Seoul', 'Scam',
  $t$Spiritual Ceremony Scam (Cult Recruitment Tactic)$t$,
  'high',
  $d$The most widely reported tourist scam in Seoul. An old woman (sometimes with a 'daughter', or a friendly young couple) approaches you in tourist areas — especially Hongdae and Suwon — asking if you've lost a relative recently. If you say yes, they claim the deceased's soul is restless and invite you to a traditional ceremony where you'll be pressured into a 'donation' calculated as 1,000 times your age in Korean won (e.g. age 30 = 30,000 KRW = ~$23, but it can escalate). A variant involves friendly strangers inviting you to a 'cultural tea ceremony' or 'dinner with friends' which are fronts for high-pressure cult/religious recruitment. Key signal: Koreans very rarely approach strangers on the street. Any unsolicited street approach in a tourist district should be treated with caution.$d$,
  'Web research',
  'Hongdae, Myeongdong, Insadong, Suwon Hwaseong Fortress area',
  '[]', 'approved'
),

-- seoul-bw-002: Taxi overcharging and route inflation
(
  'seoul-south-korea', 'Seoul', 'Transport',
  $t$Taxi Overcharging and Route Inflation$t$,
  'medium',
  $d$Most Seoul taxi drivers are honest and the industry is strictly regulated. However, tourists — especially those picked up late at night near bar districts — occasionally encounter drivers who take longer routes or refuse to use the meter, quoting flat rates instead. Always confirm the meter is running at the start of the ride. Use KakaoT app for ride-hailing to eliminate the issue entirely (fare shown upfront, route tracked). If you believe you were overcharged, get a receipt and report to 120 (Dasan Call Centre) — taxi companies are obligated to investigate and refund.$d$,
  'Web research',
  'Itaewon bar district pickups, late-night Hongdae taxi ranks',
  '[]', 'approved'
),

-- seoul-bw-003: Molka hidden cameras
(
  'seoul-south-korea', 'Seoul', 'Privacy / Safety',
  $t$Molka (Hidden Cameras) in Public Restrooms and Accommodation$t$,
  'high',
  $d$South Korea has a documented and serious problem with illegally installed miniature spy cameras ('molka') in public restrooms, hotel rooms, changing rooms, and guesthouses. The cameras are hidden in everyday objects — coat hooks, air fresheners, smoke detectors, phone charger housings, ceiling tiles. Victims are predominantly women. The footage is sold online. In 2021, police reported over 16,800 digital sex crime cases. Seoul Palace (Changgyeonggung) installed permanent detection equipment in 2025. Before using any public restroom or undressing in unfamiliar accommodation: scan for small holes, unusual items, or anything that looks recently added to a wall or fixture. Report any suspicious device to police (112) immediately.$d$,
  'Web research',
  'Public restrooms city-wide, tourist accommodation, changing rooms',
  '[]', 'approved'
),

-- seoul-bw-004: Fake art student / charity seller
(
  'seoul-south-korea', 'Seoul', 'Scam',
  $t$Fake Art Student / Charity Seller Approach$t$,
  'low',
  $d$Tourists near Myeongdong and Insadong occasionally encounter someone claiming to be an 'art student' showing sketches or paintings and asking for a 'donation' or purchase. These are pressure-selling tactics. Politely decline and walk away — Korean bystanders will often intervene if you look uncomfortable. The same tactic is seen with 'charity workers' with clipboards at major landmarks.$d$,
  'Web research',
  'Myeongdong, Insadong, Gyeongbokgung Palace entrance',
  '[]', 'approved'
),

-- seoul-bw-005: Drink spiking in Itaewon/Hongdae
(
  'seoul-south-korea', 'Seoul', 'Safety / Nightlife',
  $t$Drink Spiking in Itaewon and Hongdae Nightlife$t$,
  'high',
  $d$The Australian Government's official travel advisory explicitly lists drink spiking and sexual assault as risks in Seoul's nightlife areas, particularly Itaewon and Hongdae. A high-profile date rape case involving a K-pop group brought significant public attention to this issue. Never leave your drink unattended. Never accept drinks from strangers. Travel in groups or pairs in bar districts late at night. If you feel suddenly disoriented after a drink, alert staff immediately and call 112 or 119. Women-only floors in guesthouses in these areas provide a safer return option than walking dark alleyways alone.$d$,
  'Web research',
  'Itaewon bar street, Hongdae club district',
  '[]', 'approved'
),

-- seoul-bw-006: Counterfeit cosmetics and branded goods
(
  'seoul-south-korea', 'Seoul', 'Shopping',
  $t$Counterfeit Cosmetics and Fake Branded Goods$t$,
  'low',
  $d$Myeongdong and Dongdaemun are full of legitimate K-beauty and branded goods, but street-level and underground market sellers occasionally push counterfeit cosmetics and designer items. Fake cosmetics can cause skin reactions. Some underground market stalls have been noted to allow only foreign tourists to purchase fakes — presumably because locals can identify them. Always buy skincare products from official brand stores or major department stores. If a price is dramatically below what you'd expect, it's likely fake.$d$,
  'Web research',
  'Dongdaemun underground market, some Myeongdong street stalls',
  '[]', 'approved'
),

-- seoul-bw-007: Unlicensed tour guides + commission shopping
(
  'seoul-south-korea', 'Seoul', 'Tours & Guides',
  $t$Unlicensed Tour Guides Offering Unofficial Packages$t$,
  'medium',
  $d$The Seoul Metropolitan Government established a Tourist Issue Assistance Center specifically to handle complaints about unofficial tour operators who attract tourists with low-priced packages, then recover costs through forced commission shopping stops at partner stores — significantly reducing itinerary satisfaction. Always book tours through operators listed on the official Korea Tourism Organization (KTO) website. If a tour includes unexpected shopping stops not in your itinerary, you can report it to the Tourism Complaint Centre.$d$,
  'Web research',
  'Myeongdong tour operator stalls, Itaewon, major landmark approaches',
  '[]', 'approved'
),

-- seoul-bw-008: Subway rush-hour groping
(
  'seoul-south-korea', 'Seoul', 'Harassment',
  $t$Subway Rush-Hour Groping$t$,
  'medium',
  $d$While Seoul's subway is one of the world's safest transit systems, sexual harassment (groping) during peak rush hours has been reported, particularly on busy lines during morning (7:30–9:30am) and evening (5:30–8pm) commutes. The subway operates dedicated women-only cars during late-night hours on certain lines — identified by pink signage on the platform. During rush hour, standing near the door or in designated priority areas (which are often less packed) can help. Report incidents immediately to the station office or call 112.$d$,
  'Web research',
  'Seoul Metro busy commuter lines, rush hour',
  '[]', 'approved'
),

-- seoul-bw-009: Drunken harassment in entertainment districts
(
  'seoul-south-korea', 'Seoul', 'Harassment',
  $t$Drunken Harassment in Entertainment Districts After Midnight$t$,
  'medium',
  $d$Generally non-violent but reported as intimidating by several solo female travellers. After midnight in Hongdae, Itaewon, and Apgujeong, heavily intoxicated individuals (a mix of locals and foreign tourists/military) can become verbally aggressive or follow women walking alone. This is not representative of typical Korean public behaviour — the culture is generally restrained in public. Stick to main roads after midnight, walk purposefully, and use KakaoT for a taxi rather than walking dark alleys between entertainment areas.$d$,
  'Web research',
  'Hongdae club area, Itaewon bar street, Apgujeong Rodeo',
  '[]', 'approved'
),

-- seoul-bw-010: Pickpocketing in Myeongdong / markets
(
  'seoul-south-korea', 'Seoul', 'Theft',
  $t$Pickpocketing in Myeongdong and Crowded Markets$t$,
  'low',
  $d$Pickpocketing is far rarer in Seoul than in comparable European or Southeast Asian cities — locals routinely leave laptops and wallets unattended in cafes. However, several tourists have reported phone and wallet theft specifically in the crush of Myeongdong's main pedestrian strip, Namdaemun Market, and during large street festivals. The typical method is distraction in a crowd (someone handing you a flyer while an accomplice acts). Use a front-facing crossbody bag in Myeongdong peak hours.$d$,
  'Web research',
  'Myeongdong main pedestrian strip, Namdaemun Market, Dongdaemun',
  '[]', 'approved'
),

-- seoul-bw-011: DVD/study room cultural context
(
  'seoul-south-korea', 'Seoul', 'Cultural Awareness',
  $t$'DVD Room' / 'Study Room' Invitations — Know What They Are$t$,
  'low',
  $d$Not a scam per se, but a cultural context that can catch unsuspecting foreign women off guard: 'DVD rooms,' 'study rooms,' and 'drinking rooms' in Korea are often private rental spaces where couples go for intimacy (many young Koreans live with family). If a new Korean acquaintance invites you to a 'DVD room,' understand the likely social subtext. These spaces are not inherently dangerous but the implicit expectations may differ significantly from what a foreign visitor assumes.$d$,
  'Web research',
  'Hongdae, Sinchon, university district areas',
  '[]', 'approved'
),

-- seoul-bw-012: Deepfake non-consensual image threat
(
  'seoul-south-korea', 'Seoul', 'Digital Safety',
  $t$Deepfake Non-Consensual Image Threat — Social Media Oversharing Risk$t$,
  'medium',
  $d$In 2024, South Korea was rocked by revelations that ~220,000 Telegram users were involved in creating deepfake pornographic content, primarily targeting Korean women and girls. The images were sourced from public social media posts. While this affects locals more than tourists, female visitors who post high-volume public social media content (face + location tags together) face a small but non-zero risk. Consider limiting real-time location sharing on public social media accounts while in Korea.$d$,
  'Web research',
  'Digital / Online',
  '[]', 'approved'
);

-- ─── COMMUNITY POSTS (Part 5: seoul-cp-001 to seoul-cp-007) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- seoul-cp-001
(
  'seoul-cp-001', 'experiences',
  'Solo traveller', '27-33',
  $t$10 days solo in Seoul — felt safer than walking home in London$t$,
  $c$I was genuinely shocked. Seoul at 2am is brighter, safer feeling, and more populated than London at 10pm. The 75,000+ CCTV cameras everywhere are both reassuring and slightly Orwellian. Street food stalls open at midnight, convenience stores at every corner, people everywhere. I walked from Hongdae to Mapo at 1am and felt completely fine. The only moment of discomfort: a very drunk Western tourist in Itaewon who got too close. Not a Korean issue — it was someone from my own country. Download KakaoMap before you arrive — Google Maps is basically useless here.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-002
(
  'seoul-cp-002', 'experiences',
  'Solo traveller', '28-34',
  $t$The cult scam — I almost fell for it in Hongdae$t$,
  $c$A cheerful couple in their 20s approached me asking about a clothing store in Hongdae (which is weird — Koreans almost never approach strangers). They eventually steered the conversation to wanting to introduce me to a 'traditional Korean spiritual ceremony' and said it was free, just a local cultural experience. Something felt off. I excused myself. I later read extensively about this — it's a known religious cult recruitment tactic and the 'ceremony' involves intense pressure for donations. The giveaway: Koreans genuinely don't approach strangers on the street. Any unprompted street approach in a tourist area is your cue to politely disengage and keep walking.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-003
(
  'seoul-cp-003', 'experiences',
  'Solo traveller', '30-36',
  $t$Molka check every single time — my protocol$t$,
  $c$After reading about the spy camera problem before my trip, I developed a routine: in any public restroom I check under the toilet rim, behind the coat hook (common hiding spot), around the door gap. A flashlight on your phone helps — camera lenses reflect light differently. At my hotel on the first night I found a coat hook that looked slightly newer than the others — pulled it and it was just a spare hook, not a camera, but the fact that I was checking felt necessary and sad. Changgyeonggung Palace now has permanent detection devices in their bathrooms (installed April 2025), which is progress. Don't be paranoid, but do be aware.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-004
(
  'seoul-cp-004', 'experiences',
  'Solo traveller', '24-30',
  $t$Solo in Seoul for 2 weeks — highlights and the one night I felt uneasy$t$,
  $c$Seoul was overwhelmingly positive. Everyone I asked for directions helped without any agenda. Subway is clean, efficient, English-signposted. Honbap culture (eating alone) is completely normal — no awkward solo diner stares. The one uncomfortable moment: 1:30am leaving a club in Hongdae, a group of drunk men (again, not Korean) outside was loud and blocking the pavement. I ducked into a 7-Eleven — the CU and 7-Eleven convenience stores are brilliant emergency safe spaces, open 24h, always staffed. Within 10 minutes the group had moved on and I KakaoT'd home.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-005
(
  'seoul-cp-005', 'experiences',
  'Solo traveller', '26-32',
  $t$Apps every solo woman needs before landing in Seoul$t$,
  $c$KakaoMap (better than Google Maps for Korea, with exact subway car info), KakaoT (ride-hailing, fare shown upfront, no meter games), Papago (translation — better than Google Translate for Korean), Naver (local search). Save 112 (police), 119 (medical), and 1330 (tourist helpline in English, 24h) in your phone before you arrive. The 1330 helpline is genuinely excellent — they'll translate for you in a police situation, recommend hospitals, and help navigate any emergency.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-006
(
  'seoul-cp-006', 'experiences',
  'Solo traveller', '29-35',
  $t$Taxi tried to quote me a flat rate from Itaewon at midnight$t$,
  $c$After a night out in Itaewon, a taxi driver at the rank quoted me a flat rate (₩15,000) for a journey that KakaoT was showing as ₩7,500–₩9,000 metered. When I said I'd use the app instead, he suddenly offered to use the meter. I walked 2 minutes away from the rank and called a KakaoT — no issues. Lesson: taxi touts at late-night bar district ranks are the only really scammy part of Seoul transport. Use the app from day one, or at minimum check the KakaoT price estimate before agreeing to any flat rate.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-007
(
  'seoul-cp-007', 'experiences',
  'Solo traveller', '23-28',
  $t$Subway groping during morning rush — use women-only cars$t$,
  $c$Was groped on Line 2 during rush hour between Hongdae and Gangnam. It happened in a packed carriage and I couldn't identify who did it. I reported it at the next station and the officer was professional but said without CCTV confirmation it was hard to act on. Women-only subway cars are marked with pink signage on platforms — these operate on certain lines during late-night hours. During rush hour, they're not always available, but positioning yourself near the door of a car rather than the middle reduces proximity to others. I now always use KakaoT during rush hour.$c$,
  'seoul-south-korea', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── Part 5 of 10 complete (community posts seoul-cp-001 to 007). ─────────────
-- ── Parts 6–8 (seoul-cp-008 to 025) append below. ────────────────────────────
