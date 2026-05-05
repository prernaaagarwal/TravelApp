-- =====================================================================
-- BUNDLE 04 — NEW CITY SEEDS (Bangkok, Paris, Udaipur, Spiti, Seoul)
-- =====================================================================
-- Concatenates these 5 individual migrations into one paste-once SQL:
--   035_bangkok_seed_beware_community.sql   (51 beware + 30 community)
--   036_paris_seed_beware_community.sql     (32 beware + 30 community)
--   037_udaipur_seed_beware_community.sql   (16 beware + 50 community)
--   038_spiti_seed_beware_community.sql     (12 beware + 25 community)
--   039_seoul_seed_beware_community.sql     (12 beware + 25 community)
--
-- Total: 123 beware reports + 160 community posts.
--
-- IDEMPOTENT — safe to re-paste. Removes any prior web-research-sourced
-- entries for these 5 destinations before re-inserting, so re-running
-- doesn't create duplicates. User-submitted entries (different
-- reported_by_name / author_name) are NOT touched.
--
-- Run in Supabase SQL Editor for the TravelApp project.
-- Then run:  npm run beware:geocode   (locally) to populate gps_lat/lng
-- =====================================================================

-- ── Step 0: idempotent cleanup ───────────────────────────────────────

DELETE FROM beware_reports
  WHERE reported_by_name = 'Web research'
    AND destination_slug IN (
      'bangkok-thailand',
      'paris-france',
      'udaipur-india',
      'spiti-valley-india',
      'seoul-south-korea'
    );

DELETE FROM community_posts
  WHERE id LIKE 'bkk-cp-%'
     OR id LIKE 'par-cp-%'
     OR id LIKE 'udaipur-cp-%'
     OR id LIKE 'spiti-cp-%'
     OR id LIKE 'seoul-cp-%';

-- =====================================================================

-- =====================================================================
-- ─── from 035_bangkok_seed_beware_community.sql
-- =====================================================================
-- 035_bangkok_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Bangkok, Thailand.
-- 51 beware reports + 30 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS (Part 1: entries 1–25) ────────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- bkk-bw-001: Tuk-Tuk Grand Palace closed redirect
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Tuk-Tuk 'Grand Palace Is Closed' Redirect Scam$t$,
  'high',
  $d$A well-dressed stranger near the Grand Palace or Wat Pho approaches and insists the temple is 'closed for a royal ceremony.' They then offer a tuk-tuk that takes you on a commission loop through gem shops, tailor shops, and overpriced restaurants. The Grand Palace and major temples are open daily — this scam has run for decades. Ignore anyone outside the gates claiming it is closed and walk directly to the entrance to verify.$d$,
  'Web research',
  'Grand Palace entrance, Wat Pho, Wat Arun, major temples',
  '[]', 'approved'
),

-- bkk-bw-002: Tuk-Tuk cheap all-day tour shopping loop
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Tuk-Tuk 10–20 THB 'All-Day Tour' Shopping Loop$t$,
  'high',
  $d$Tuk-tuk drivers outside Khao San Road and Siam offer an absurdly cheap multi-stop tour of Bangkok for 10–40 THB. The catch: the 'tour' consists of mandatory stops at gem shops, tailor shops, and souvenir stores where the driver earns per-visit commissions regardless of whether you buy. A genuine 1-hour tour costs nothing close to that. Use Grab app for point-to-point rides; negotiate tuk-tuk fares only for direct destinations.$d$,
  'Web research',
  'Khao San Road, Siam, Rattanakosin area',
  '[]', 'approved'
),

-- bkk-bw-003: Gem/jewelry government tax-free scam
(
  'bangkok-thailand', 'Bangkok', 'Scam / Financial',
  $t$Gem / Jewelry 'Government Tax-Free Sale' Scam$t$,
  'high',
  $d$A friendly 'guide' or tuk-tuk driver tells you about a once-in-a-lifetime government-sponsored tax-free gem sale near the Grand Palace area. You are taken to a convincing-looking shop and pressured to buy gems at 20,000–100,000 THB with promises they can be resold at home for 2–3x the price. In reality they are glass or synthetic materials worth almost nothing. The US Embassy Bangkok has formally warned about this scam — there is no such government sale. If caught, initiate a credit card chargeback immediately and file a report with Tourist Police (1155).$d$,
  'Web research',
  'Grand Palace area, Siam, anywhere tuk-tuk drivers take you',
  '[]', 'approved'
),

-- bkk-bw-004: Taxi meter refusal at airports
(
  'bangkok-thailand', 'Bangkok', 'Transport',
  $t$Taxi Meter Refusal at Suvarnabhumi Airport$t$,
  'medium',
  $d$Taxi drivers outside Suvarnabhumi and Don Mueang airports frequently refuse to use the meter and quote flat fares of 500–1,000 THB for rides that metered would cost 250–400 THB to central Bangkok. Always insist on the meter or use the official metered taxi queue inside the arrivals hall. Better yet, use Grab or Bolt apps for fully transparent pricing.$d$,
  'Web research',
  'Suvarnabhumi Airport arrivals, Don Mueang Airport',
  '[]', 'approved'
),

-- bkk-bw-005: Patpong bar tab inflation
(
  'bangkok-thailand', 'Bangkok', 'Nightlife / Scam',
  $t$Bar Tab Inflation and Intimidation at Patpong$t$,
  'high',
  $d$Bars in Patpong's upstairs venues lure tourists in with promises of 100 THB per drink and 'no cover charge,' sometimes on a printed laminated menu. Once inside, guests are billed 1,500+ THB for drinks, 'lady drinks' (drinks automatically charged for performers who approach you), and a 'looking fee' of 3,000–9,000 THB. Security may physically block exits. Multiple verified TripAdvisor and traveller reports confirm this pattern from multiple bars. Stick to ground-floor, well-reviewed venues in Silom or Sukhumvit instead.$d$,
  'Web research',
  'Patpong Night Market upstairs bars (Patpong 1 & 2)',
  '[]', 'approved'
),

-- bkk-bw-006: Ping pong show overcharge
(
  'bangkok-thailand', 'Bangkok', 'Nightlife / Scam',
  $t$Ping Pong Show Tout Overcharge$t$,
  'high',
  $d$Touts outside Patpong promise ping pong shows with 'one drink at 100 baht, no cover charge' and present laminated price sheets to appear legitimate. Once seated, guests receive bills of 5,000–9,000+ THB with line items for 'lady drinks,' 'viewing fee per act,' and tips. Staff at the exit demand payment and may block departure. Avoid entirely if unfamiliar; Nana Plaza venues tend to have upfront, posted pricing and are considered lower-risk compared to Patpong's upstairs bars.$d$,
  'Web research',
  'Patpong Night Market, Silom area',
  '[]', 'approved'
),

-- bkk-bw-007: ATM card skimming
(
  'bangkok-thailand', 'Bangkok', 'Financial / Tech',
  $t$ATM Card Skimming at Standalone Machines$t$,
  'high',
  $d$Criminals attach skimming devices to ATM card slots and hidden cameras to capture PINs, particularly at isolated machines near Patpong, Khao San Road, and Pattaya. Your card is cloned and accounts drained. Use only ATMs inside bank branches (Bangkok Bank, Kasikornbank, SCB are most reliable). Always shield your PIN with your hand. Set up real-time transaction alerts on your banking app. Use Wise or Revolut travel cards that can be frozen instantly.$d$,
  'Web research',
  'Standalone ATMs near Patpong, Khao San Road, tourist areas',
  '[]', 'approved'
),

-- bkk-bw-008: Fake plainclothes police on-the-spot fine
(
  'bangkok-thailand', 'Bangkok', 'Crime / Intimidation',
  $t$Fake Plainclothes 'Police Officer' Demand for On-the-Spot Fine$t$,
  'high',
  $d$A person claiming to be a plainclothes police officer stops tourists near markets or temples, accusing them of carrying illegal substances or violating visa rules. They demand to inspect passports and wallets and request an on-the-spot 'fine' of 5,000–20,000 THB or threaten arrest. Real police do not stop random tourists for passport checks or demand street fines. If confronted, calmly state you want to go to the nearest police station — this usually ends the encounter immediately. Call Tourist Police 1155 if the person persists.$d$,
  'Web research',
  'MBK market, Khao San Road, major tourist areas',
  '[]', 'approved'
),

-- bkk-bw-009: Counterfeit goods police sting shakedown
(
  'bangkok-thailand', 'Bangkok', 'Crime / Intimidation',
  $t$Counterfeit Goods 'Police Sting' Shakedown$t$,
  'medium',
  $d$After purchasing a fake designer item at Patpong or Chatuchak market, a person in plain clothes approaches claiming to be a police officer and accuses you of possessing counterfeits. They demand a 'fine' of 5,000–20,000 THB to avoid arrest. The 'officer' is typically not a real cop. Do not buy counterfeit goods; if approached, insist on visiting the nearest police station to verify their credentials.$d$,
  'Web research',
  'Patpong, MBK, Chatuchak Weekend Market',
  '[]', 'approved'
),

-- bkk-bw-010: Motorbike bag snatching
(
  'bangkok-thailand', 'Bangkok', 'Theft / Safety',
  $t$Motorbike Bag-Snatching$t$,
  'high',
  $d$Thieves on motorbikes — sometimes riding past tourists in tuk-tuks — snatch bags, phones, and cameras from the street side. Sling bags across the body away from traffic. Never carry a phone in your outer hand while near a road. The FCDO formally warns against this practice across Thai cities. Keep bags on the inner side when walking on pavements.$d$,
  'Web research',
  'City-wide, particularly near tourist areas and riverside',
  '[]', 'approved'
),

-- bkk-bw-011: Khlong canal boat tour overcharge
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Khlong (Canal) Boat Tour Overcharging and Detours$t$,
  'medium',
  $d$Long-tail boat operators along Bangkok's khlongs claim the regular scenic route is 'closed for maintenance' and redirect tourists to gem stores or overpriced souvenir shops. Operators earn commissions from these stops. Always negotiate the exact route and price before boarding. Ask your hotel for a reputable boat operator. A standard shared canal tour should not exceed 400–600 THB per person.$d$,
  'Web research',
  'Khlong Saen Saep, Khlong Bangkok Noi, main pier areas',
  '[]', 'approved'
),

-- bkk-bw-012: Fake travel agency bus/ferry ticket scam
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Fake Travel Agency Bus/Ferry Ticket Scam on Khao San Road$t$,
  'medium',
  $d$Shopfront 'travel agencies' on Khao San Road sell bus, train, or combo ferry tickets at inflated prices or issue outright fake tickets not honoured by actual operators. Overnight buses from these agencies have been reported to drop passengers in remote locations where 'taxis' appear charging 500+ THB for the last stretch. Book trains directly on the SRT website, buses at official terminals, and use 12GoAsia for verified operators.$d$,
  'Web research',
  'Khao San Road and its side sois',
  '[]', 'approved'
),

-- bkk-bw-013: Currency exchange short-changing
(
  'bangkok-thailand', 'Bangkok', 'Financial',
  $t$Currency Exchange Short-Changing by Unlicensed Vendors$t$,
  'medium',
  $d$Street-level or market currency vendors operate without licences and may use rigged counting methods, swap notes mid-transaction, or use counterfeit bills. Official SuperRich or Vasu exchange booths offer among the best legal rates in Bangkok. Always count your money at the counter before leaving. Never exchange currency with individuals who approach you on the street.$d$,
  'Web research',
  'Tourist markets, Chatuchak, Khao San Road',
  '[]', 'approved'
),

-- bkk-bw-014: Curious currency distraction note-swap
(
  'bangkok-thailand', 'Bangkok', 'Scam / Financial',
  $t$'Curious Currency' Distraction and Note-Swap Scam$t$,
  'medium',
  $d$A friendly stranger approaches after spotting you at an ATM or with visible cash, engages in conversation about your home country, then asks to see what your home currency looks like. After you hand over a note or your wallet for a closer look, a distraction is created and they pocket cash or swap high-denomination notes for low ones. Never show your cash or hand your wallet to a stranger under any circumstances.$d$,
  'Web research',
  'Near ATMs, Chatuchak market, MBK mall',
  '[]', 'approved'
),

-- bkk-bw-015: Drink spiking in nightlife zones
(
  'bangkok-thailand', 'Bangkok', 'Safety / Health',
  $t$Drink Spiking in Nightlife Zones$t$,
  'high',
  $d$Drink spiking has been documented in Patpong, Nana Plaza, and Soi Cowboy nightlife areas, as well as in Khao San Road backpacker bars. Cases include Rohypnol-type substances and, more dangerously, spirits cut with methanol, which can be fatal. Never leave your drink unattended. Stick to bottled beers you see opened in front of you at reputable, well-reviewed venues. Avoid free shots from strangers or bars promoting unbranded spirits. Real Girl Review and multiple 2025 safety guides confirm this as an ongoing documented risk.$d$,
  'Web research',
  'Patpong, Nana Plaza, Soi Cowboy, Khao San Road bars',
  '[]', 'approved'
),

-- bkk-bw-016: Tailor scam fabric bait and switch
(
  'bangkok-thailand', 'Bangkok', 'Scam / Shopping',
  $t$Tailor Scam — Low-Quality Fabric Bait and Switch$t$,
  'medium',
  $d$Tourists taken to tailor shops by tuk-tuk or gem-scam drivers are pressured into purchasing 'custom suits' at prices that seem like deals but use the cheapest synthetic fabrics available. The finished product looks nothing like what was promised. Only use tailors recommended by verified traveller reviews or your hotel. Never visit a tailor a tuk-tuk or stranger directs you to.$d$,
  'Web research',
  'Shops near Grand Palace, Silom, various street-level tailors',
  '[]', 'approved'
),

-- bkk-bw-017: Floating market overpriced boat hire
(
  'bangkok-thailand', 'Bangkok (day trip)', 'Transport / Scam',
  $t$Floating Market Overpriced Boat Hire$t$,
  'medium',
  $d$At Damnoen Saduak and Amphawa floating markets, touts and unofficial boat operators charge 2,000 THB or more per hour for private boat rides. The official rate is 400 THB per person on a shared boat, or 2,000 THB for a full 6-person private boat per hour. Agree on price, duration, and the exact number of passengers before boarding. Floating markets are among Bangkok's biggest tourist traps for inflated pricing.$d$,
  'Web research',
  'Damnoen Saduak Floating Market, Amphawa Floating Market',
  '[]', 'approved'
),

-- bkk-bw-018: Suvarnabhumi customs shoplifting extortion
(
  'bangkok-thailand', 'Bangkok', 'Crime / Intimidation',
  $t$Suvarnabhumi Airport Customs 'Shoplifting' Extortion$t$,
  'high',
  $d$Documented BBC-reported cases describe tourists browsing duty-free shops being falsely accused of shoplifting by airport security, held in cells overnight, and pressured to pay large sums to corrupt individuals posing as legal intermediaries. A separate scam involves customs officers instructing arriving passengers to pack duty-free into checked luggage 'to avoid prosecution,' then flagging the same items for undeclared smuggling with large fines and escorts to ATMs. Know your rights: do not pay any 'fine' without documentation, and insist on contact with your embassy.$d$,
  'Web research',
  'Suvarnabhumi Airport duty-free and customs area',
  '[]', 'approved'
),

-- bkk-bw-019: Tuk-tuk fare inflation on return
(
  'bangkok-thailand', 'Bangkok', 'Transport',
  $t$Tuk-Tuk Fare Inflation on Return Journey$t$,
  'medium',
  $d$Tuk-tuk drivers agree on a fare at the start but demand significantly more upon arrival, claiming 'traffic surcharge,' 'night rate,' or similar invented fees. In some cases they do not give change or claim they have none. Always agree on the exact fare before getting in. A short 10–15 minute tuk-tuk ride in central Bangkok should not exceed 100–150 THB. Use Grab or Bolt as a fare benchmark.$d$,
  'Web research',
  'City-wide, most common near tourist zones',
  '[]', 'approved'
),

-- bkk-bw-020: Similar-sounding destination substitution
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Similar-Sounding Destination Substitution by Taxi Drivers$t$,
  'medium',
  $d$Some taxi and tuk-tuk drivers deliberately take tourists to a different place that sounds similar to their intended destination — e.g., one Wat instead of another — because the substitute location pays them a commission. Having your hotel address saved in Thai script, using GPS navigation, and confirming your destination name in Thai can prevent this. Use Grab for all significant journeys so the route is GPS-logged.$d$,
  'Web research',
  'City-wide',
  '[]', 'approved'
),

-- bkk-bw-021: Pickpocketing at Chatuchak
(
  'bangkok-thailand', 'Bangkok', 'Theft',
  $t$Pickpocketing at Chatuchak Weekend Market$t$,
  'medium',
  $d$Chatuchak Weekend Market draws crowds of 200,000+ visitors making it a prime environment for pickpockets. Common tactics include the deliberate bump and a group surrounding technique where one engages conversation while another reaches into pockets or unzips bags. Keep valuables in front pockets or a money belt. Use a crossbody bag with a zippered main compartment held at the front. Do not carry all your cash in one place.$d$,
  'Web research',
  'Chatuchak Weekend Market, Jatujak',
  '[]', 'approved'
),

-- bkk-bw-022: Children selling cigarettes as pickpocket cover
(
  'bangkok-thailand', 'Bangkok', 'Theft',
  $t$Children Selling Cigarettes / Gum as Pickpocket Cover$t$,
  'medium',
  $d$Groups of children approach tourists in tuk-tuks or on foot selling cigarettes, gum, or small trinkets. While tourists are engaged with the sale, other children or associates pick pockets. This is a well-documented pattern in Bangkok and other Thai tourist cities. If small children gather around you uninvited, keep hands on your pockets and bags.$d$,
  'Web research',
  'Tourist districts, tuk-tuk areas, temple zones',
  '[]', 'approved'
),

-- bkk-bw-023: Fake monk requesting donations
(
  'bangkok-thailand', 'Bangkok', 'Scam',
  $t$Fake Monk Requesting Donations$t$,
  'low',
  $d$Individuals dressed as Buddhist monks approach tourists asking for donations or offering blessed bracelets in exchange for cash. Real monks do not solicit money from strangers on the street. This scam preys on tourists' respect for Thai Buddhism. Politely decline and move on. Genuine monks in Bangkok are almost never seen soliciting tourists on busy streets.$d$,
  'Web research',
  'Near temples, tourist areas, Khao San Road',
  '[]', 'approved'
),

-- bkk-bw-024: Suvarnabhumi taxi queue tout bypass
(
  'bangkok-thailand', 'Bangkok', 'Transport',
  $t$Suvarnabhumi Taxi Queue Tout Bypass$t$,
  'medium',
  $d$Unofficial touts in the arrivals hall at Suvarnabhumi approach new arrivals and offer private taxi services at 800–1,500 THB, bypassing the official metered taxi queue. Official metered taxis to central Bangkok typically cost 250–350 THB plus 50 THB expressway toll. Always use the official taxi queue inside the terminal — dispensers issue queue tickets with driver details. Alternatively, pre-book via the AOT Limousine counter or use Grab from inside the terminal.$d$,
  'Web research',
  'Suvarnabhumi Airport arrivals hall',
  '[]', 'approved'
),

-- bkk-bw-025: Patpong/Nana harassment touting
(
  'bangkok-thailand', 'Bangkok', 'Harassment',
  $t$Harassment and Aggressive Touting in Patpong / Nana Area$t$,
  'medium',
  $d$The nightlife zones of Patpong, Nana Plaza, and Soi Cowboy involve significant volumes of aggressive touting, including touts physically touching tourists or blocking their path. Solo female travellers report feeling pressured and uncomfortable, particularly after 10pm. Multiple 2025 safety guides explicitly list these zones as unsuitable for solo women who are unfamiliar with the area. If you visit, go with a group and stay alert. Leave immediately if you feel unsafe and move to a main road to hail Grab.$d$,
  'Web research',
  'Patpong Night Market, Nana Plaza (Sukhumvit Soi 4), Soi Cowboy (Asok)',
  '[]', 'approved'
);

-- ─── BEWARE REPORTS (Part 2: entries 26–51) ───────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- bkk-bw-026: Khao San overnight bus bag theft
(
  'bangkok-thailand', 'Bangkok', 'Transport / Theft',
  $t$Khao San Road Overpriced Bus Ticketing + Bag Theft on Overnight Journeys$t$,
  'medium',
  $d$Overnight bus journeys booked through Khao San Road agencies have documented cases of bags rifled through while passengers sleep. In some cases, valuables placed in overhead storage or undercarriage compartments are missing on arrival. If you must take an overnight bus, keep your day bag (with passport, money, phone) on your person or under your seat.$d$,
  'Web research',
  'Overnight buses originating from Khao San Road agencies',
  '[]', 'approved'
),

-- bkk-bw-027: Street food over-pricing on tourist roads
(
  'bangkok-thailand', 'Bangkok', 'Scam / Pricing',
  $t$Street Food Vendor Over-Pricing on Main Tourist Roads$t$,
  'low',
  $d$Street food vendors on heavily touristed roads (particularly around Khao San Road and outside major temples) charge 2–4x standard Thai prices — e.g., 150 THB for Pad Thai that costs 40 THB a few blocks away. Eating at stalls popular with local workers or in residential side streets gives accurate local pricing. Do not pay before confirming the price on anything not clearly displayed.$d$,
  'Web research',
  'Khao San Road, temple approach roads, tourist market entrances',
  '[]', 'approved'
),

-- bkk-bw-028: Fake ticketing websites
(
  'bangkok-thailand', 'Bangkok', 'Online Scam',
  $t$Fake Ticketing Websites for Popular Tours and Experiences$t$,
  'medium',
  $d$Fake booking websites mirroring legitimate Bangkok tour operators and attraction ticketing sites collect payment for experiences that do not exist. These are especially common for Grand Palace entry, floating market tours, and luxury Chao Phraya river dinners. Only book through official attraction websites, GetYourGuide, Klook, or verified hotel concierges. Never pay via wire transfer or direct bank transfer.$d$,
  'Web research',
  'Online — affects arrivals across Bangkok',
  '[]', 'approved'
),

-- bkk-bw-029: Inappropriate photography requests at temples
(
  'bangkok-thailand', 'Bangkok', 'Harassment / Cultural',
  $t$Inappropriate Photography Requests at Temples$t$,
  'low',
  $d$Solo female tourists at temples like Wat Pho and the Grand Palace report being approached by men offering to 'take their photo' and then demanding payment, steering them into scam conversations, or becoming increasingly intrusive. This is most common near the main temple entrances. Politely decline and move on. Real temple photography does not require intermediaries.$d$,
  'Web research',
  'Wat Pho, Grand Palace, Wat Arun',
  '[]', 'approved'
),

-- bkk-bw-030: Bird food scam near temples
(
  'bangkok-thailand', 'Bangkok', 'Scam',
  $t$Bird Food Scam Near Temples$t$,
  'low',
  $d$Vendors near temples or parks approach tourists with bird food and encourage them to feed the birds as a 'merit-making' act. Once you accept the food and start feeding, they demand a large payment, sometimes becoming aggressive. Decline any unsolicited items handed to you in public spaces.$d$,
  'Web research',
  'Near Wat Benchamabophit, Lumphini Park, temple areas',
  '[]', 'approved'
),

-- bkk-bw-031: Taxi GPS ignorance inflated fares
(
  'bangkok-thailand', 'Bangkok', 'Transport',
  $t$Taxi Driver GPS Ignorance Causing Inflated Fares$t$,
  'low',
  $d$Many Bangkok taxi drivers do not know shorter routes and will take long, indirect paths — sometimes genuinely, sometimes deliberately. While metered, these rides cost more due to added time and distance. Keep your own Google Maps navigation running during every taxi ride. If a driver is consistently ignoring a shorter route, point it out calmly and firmly. Use Grab where possible for fixed-price routing.$d$,
  'Web research',
  'City-wide',
  '[]', 'approved'
),

-- bkk-bw-032: Unhygienic cooking class scams
(
  'bangkok-thailand', 'Bangkok', 'Scam / Tourism',
  $t$Unhygienic 'Cooking Class' Scams with No Actual Teaching$t$,
  'low',
  $d$Low-cost cooking class bookings made through street-level agencies sometimes deliver a brief, scripted demonstration with minimal hands-on cooking, and then redirect attendees to affiliated shops selling overpriced spice kits. Book cooking classes through operators with verified TripAdvisor reviews and minimum 4.5 star ratings, or through platforms like GetYourGuide.$d$,
  'Web research',
  'Street-level tour operators, especially near Silom',
  '[]', 'approved'
),

-- bkk-bw-033: Nightclub ladies night overcharge
(
  'bangkok-thailand', 'Bangkok', 'Nightlife / Scam',
  $t$Nightclub 'Ladies Night' Overcharge$t$,
  'medium',
  $d$Certain clubs on RCA (Royal City Avenue) and Sukhumvit advertise ladies-night promotions but apply a much higher price tier when the bill arrives — charging per drink at rates different from what was stated at entry. Some clubs also place women's drinks on an 'open tab' that runs without consent. Confirm drink prices explicitly before ordering and avoid handing over a bank card for an open tab.$d$,
  'Web research',
  'RCA (Royal City Avenue), Sukhumvit night venues',
  '[]', 'approved'
),

-- bkk-bw-034: Tuk-tuk driver harassing lone women
(
  'bangkok-thailand', 'Bangkok', 'Safety / Harassment',
  $t$Tuk-Tuk Driver Assaulting / Harassing Lone Women$t$,
  'medium',
  $d$A recurring, documented pattern involves solo female passengers in tuk-tuks — particularly those who sit in the front — reporting verbal harassment from drivers. Long-term Bangkok resident bloggers (e.g. Beach Bum Adventure) note that harassment from taxi and tuk-tuk drivers is among the most common 'unpleasant incidents' experienced by women in the city. Always sit in the back seat of taxis and tuk-tuks. If a driver makes you uncomfortable, do not wait until the destination — exit in a safe, public area and find alternative transport.$d$,
  'Web research',
  'City-wide, most common at night',
  '[]', 'approved'
),

-- bkk-bw-035: Tourist police impersonation
(
  'bangkok-thailand', 'Bangkok', 'Crime / Intimidation',
  $t$Tourist Police Impersonation for Wallet / Passport Inspection$t$,
  'high',
  $d$Documented and confirmed cases (TripAdvisor, Thiefhunters in Paradise) describe individuals claiming to be tourist police asking tourists to show their passports and wallets at tourist sites or near ATMs. Real tourist police do not ask for wallet inspections on the street. If someone requests this, firmly decline and ask for their badge number. Call Tourist Police 1155 from your own phone to verify any claim of authority. Never hand over your passport to anyone except at official checkpoints.$d$,
  'Web research',
  'Grand Palace area, Siam, near ATMs in tourist zones',
  '[]', 'approved'
),

-- bkk-bw-036: Unregistered money exchange Chatuchak
(
  'bangkok-thailand', 'Bangkok', 'Financial',
  $t$Unregistered Money Exchange Short-Change in Chatuchak$t$,
  'medium',
  $d$Market stalls in and around Chatuchak operate informal currency exchange without licences and use sleight-of-hand counting techniques to short-change tourists. Always exchange money at licensed SuperRich, Vasu, or bank counters. Count every note at the counter before stepping away from the window.$d$,
  'Web research',
  'Chatuchak Weekend Market area',
  '[]', 'approved'
),

-- bkk-bw-037: Tainted/counterfeit alcohol nightlife
(
  'bangkok-thailand', 'Bangkok', 'Health / Safety',
  $t$Tainted / Counterfeit Alcohol at Nightlife Districts$t$,
  'high',
  $d$Documented cases exist of alcohol at Bangkok nightlife venues — particularly unbranded spirits and 'bucket' cocktails — being mixed with methanol or dangerous industrial additives, which can cause blindness or death. In 2024, multiple tourist deaths in Thailand were attributed to methanol-tainted alcohol. Order drinks only from bottles opened in front of you at reputable, established venues. Avoid bucket cocktails with unbranded spirits. Real Girl Review (Dec 2025) and multiple safety guides list this as a serious and ongoing risk.$d$,
  'Web research',
  'Patpong bars, Nana Plaza, Soi Cowboy, Khao San Road',
  '[]', 'approved'
),

-- bkk-bw-038: Dress code enforcement scam
(
  'bangkok-thailand', 'Bangkok', 'Scam',
  $t$Dress Code Enforcement as Scam at Temple Entrances$t$,
  'low',
  $d$Near the Grand Palace and Wat Pho, unofficial vendors approach tourists claiming they cannot enter because of dress code violations (shorts, bare shoulders). They offer to 'lend' sarongs and shawls for an entrance fee of 50–200 THB. Temple rentals inside are free or available at minimal cost. Genuine temple dress code checks occur only at the actual entrance gate. Ignore anyone outside trying to sell or rent clothing.$d$,
  'Web research',
  'Grand Palace entrance road, Wat Pho approach',
  '[]', 'approved'
),

-- bkk-bw-039: Street gambling rings
(
  'bangkok-thailand', 'Bangkok', 'Scam / Financial',
  $t$Street Gambling Rings Targeting Curious Tourists$t$,
  'medium',
  $d$Street gambling setups (card games, shell games) on tourist-heavy roads create an illusion of winnable bets using shills posing as tourists winning. The game is rigged — real participants always lose. Once money is bet, operators and surrounding gang members become intimidating. Walk away from any street gambling game without engaging. This is illegal under Thai law and all participants — including tourists — can technically be arrested.$d$,
  'Web research',
  'Khao San Road area, tourist markets',
  '[]', 'approved'
),

-- bkk-bw-040: Inflated SIM card pricing at airport
(
  'bangkok-thailand', 'Bangkok', 'Scam / Pricing',
  $t$Inflated SIM Card Pricing at Airport Tourist Shops$t$,
  'low',
  $d$Tourist-facing shops in Suvarnabhumi arrivals sell tourist SIM cards at 300–600 THB for plans available for 100–200 THB at 7-Eleven or AIS/DTAC stores inside the airport terminal. Check the official carrier counters (AIS, DTAC, True Move) in the arrivals area before purchasing from any other vendor.$d$,
  'Web research',
  'Suvarnabhumi Airport arrivals shops',
  '[]', 'approved'
),

-- bkk-bw-041: Unsolicited photo offer scam
(
  'bangkok-thailand', 'Bangkok', 'Scam',
  $t$Unsolicited 'Photo Offer' Scam at Iconic Landmarks$t$,
  'low',
  $d$Strangers approach solo tourists at landmarks and offer to take their photograph. After taking the photo, they demand payment for the 'service' and may become persistent or aggressive. If you wish someone to photograph you, ask a fellow tourist directly.$d$,
  'Web research',
  'Wat Arun riverfront, Grand Palace, Lumphini Park',
  '[]', 'approved'
),

-- bkk-bw-042: Overpriced Chao Phraya pier boat tickets
(
  'bangkok-thailand', 'Bangkok', 'Transport / Scam',
  $t$Overpriced Boat Tickets at Chao Phraya Tourist Piers$t$,
  'medium',
  $d$At tourist piers along the Chao Phraya (especially Saphan Taksin and Chang Pier), unofficial sellers offer 'tourist boat' tickets at 200–600 THB for journeys easily made on the standard orange-flag express boat for 15–30 THB. Purchase from the official pier ticket booths only. The tourist blue-flag boat is legitimate but priced at 200 THB for an unlimited day pass — verify this price at the official booth.$d$,
  'Web research',
  'Chao Phraya tourist piers, especially Saphan Taksin (BTS Saphan Taksin)',
  '[]', 'approved'
),

-- bkk-bw-043: Tuk-tuk noise and dust
(
  'bangkok-thailand', 'Bangkok', 'Safety',
  $t$Noise and Dust Complaints from Tuk-Tuk Rides$t$,
  'low',
  $d$Tuk-tuks are open vehicles in Bangkok's heavy traffic and extreme heat, exposing passengers to exhaust fumes, street noise, and significant pollution. Not a safety scam but a practical concern: for longer distances in daytime heat, a metered taxi or BTS Skytrain is considerably safer and more comfortable. Tuk-tuks are best for short hops in cooler evening hours.$d$,
  'Web research',
  'City-wide',
  '[]', 'approved'
),

-- bkk-bw-044: Hotel concierge commission steering
(
  'bangkok-thailand', 'Bangkok', 'Scam / Tourism',
  $t$Hotel Concierge Commission-Based Tour Steering$t$,
  'low',
  $d$Some budget hotel front desk staff recommend specific tour operators or taxi services in exchange for referral commissions, sometimes steering guests to substandard or overpriced providers. Research tours independently on TripAdvisor or GetYourGuide. Mid-range and higher hotel concierges in Bangkok generally provide reliable, commission-free referrals.$d$,
  'Web research',
  'Budget guesthouses, Khao San Road accommodation',
  '[]', 'approved'
),

-- bkk-bw-045: Elephant sanctuary fraud
(
  'bangkok-thailand', 'Bangkok / Day Trips', 'Tourism / Ethical',
  $t$Elephant Sanctuary Fraud — Fake Ethical Claims$t$,
  'medium',
  $d$Day trip operators from Bangkok advertise 'ethical elephant sanctuaries' but deliver tourist camps where elephants are ridden, chained, and perform tricks — practices considered abusive. Multiple 2025 travel guides distinguish between genuine sanctuaries (Elephant Nature Park, Boon Lott's) and those using the 'sanctuary' label fraudulently. Research with World Animal Protection's travel animal cruelty guide before booking.$d$,
  'Web research',
  'Day trip agencies throughout Bangkok tourist areas',
  '[]', 'approved'
),

-- bkk-bw-046: Late night walking poorly-lit sois
(
  'bangkok-thailand', 'Bangkok', 'Safety',
  $t$Late Night Walking in Poorly-Lit Residential Sois$t$,
  'medium',
  $d$Sukhumvit's numbered sois (side streets) range from lively to completely deserted after midnight. Solo female travellers walking alone in poorly lit residential sois after midnight report feeling vulnerable and targeted for verbal harassment. Stick to the main Sukhumvit road or well-lit sois like Soi 11, 21 (Asok), and 31. After midnight, use Grab for any journey over 5 minutes on foot.$d$,
  'Web research',
  'Sukhumvit residential side streets, Silom side sois after midnight',
  '[]', 'approved'
),

-- bkk-bw-047: Jet ski damage scam
(
  'bangkok-thailand', 'Bangkok / Pattaya / Phuket', 'Scam / Financial',
  $t$Jet Ski Damage Scam (Day Trips)$t$,
  'high',
  $d$After enjoying a jet ski rental, operators point out minor pre-existing cosmetic damage and demand extortionate 'repair fees' of thousands of Baht. When the situation escalates, a 'police officer' conveniently appears — who is in on the scam. BackpackThailand.com rates this as a high-severity scam. Photograph every cm of the jet ski before riding, and record a video walking around it. Only rent from operators with clearly posted pricing and insurance.$d$,
  'Web research',
  'Pattaya Beach, Phuket, Koh Samui (applies to day trips from Bangkok)',
  '[]', 'approved'
),

-- bkk-bw-048: Unsolicited where are you from approach
(
  'bangkok-thailand', 'Bangkok', 'Scam / Social Engineering',
  $t$Unsolicited Strangers Asking 'Where Are You From?' on Tourist Sois$t$,
  'medium',
  $d$A well-documented pattern across Bangkok's tourist areas: friendly, English-speaking locals open with basic conversation (where are you from, how long are you here) — almost always leading to a tuk-tuk referral, gem shop pitch, or social engineering scam. As itsbetterinthailand.com notes, these cold approaches on busy tourist streets are 'almost definitely a scam.' Be polite but decline all invitations and offers from strangers who initiate contact on the street.$d$,
  'Web research',
  'Khao San Road, near Grand Palace, Siam, Sukhumvit Soi 11',
  '[]', 'approved'
),

-- bkk-bw-049: Aggressive vendor harassment night markets
(
  'bangkok-thailand', 'Bangkok', 'Harassment',
  $t$Aggressive Street Vendor Harassment at Night Markets$t$,
  'low',
  $d$Vendors at Asiatique, Khao San Road, and Chatuchak can become verbally aggressive when tourists decline to purchase, using guilt or mild intimidation. This is particularly reported by solo women browsing alone at night. It is not dangerous but can be distressing. Walk confidently and do not engage with aggressive vendors — eye contact and acknowledgement only encourages continued interaction.$d$,
  'Web research',
  'Asiatique The Riverfront, Chatuchak, Khao San Road night market',
  '[]', 'approved'
),

-- bkk-bw-050: Songthaew overcharging tourists
(
  'bangkok-thailand', 'Bangkok', 'Transport',
  $t$Unregulated Songthaew Overcharging of Tourists$t$,
  'low',
  $d$Songthaew (shared red pickup trucks) drivers in Bangkok's outer areas sometimes treat solo foreign tourists as private hires and demand tuk-tuk-level pricing instead of the shared 10–30 THB rate. Confirm 'shared' (รับ) status and the per-person fare before boarding. In central Bangkok, the BTS/MRT system is preferable for reliability and fixed pricing.$d$,
  'Web research',
  'Bangkok outskirts, On Nut, Bang Na',
  '[]', 'approved'
),

-- bkk-bw-051: Visa-on-arrival queue jump fee scam
(
  'bangkok-thailand', 'Bangkok', 'Scam / Immigration',
  $t$Visa-on-Arrival Queue Jump Fee Scam at Airport$t$,
  'medium',
  $d$Unofficial 'facilitators' at Suvarnabhumi's visa-on-arrival queue offer to help with paperwork for a fee, sometimes charging 500–1,500 THB for assistance that is entirely free at the official counter. The official Visa on Arrival process at Suvarnabhumi is free and straightforward. Never pay anyone who approaches you in the queue offering to 'speed up' the process.$d$,
  'Web research',
  'Suvarnabhumi Airport visa-on-arrival queue',
  '[]', 'approved'
);

-- ─── COMMUNITY POSTS (experiences tab) — 30 entries ──────────────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- bkk-cp-001
(
  'bkk-cp-001', 'experiences',
  'Solo traveller', '26-30',
  $t$Solo female first-timer in Bangkok — what no one warns you about$t$,
  $c$I was 29, solo, first time in Southeast Asia. Bangkok was far safer than I expected from the horror stories — Thai people were genuinely kind. But here's what got me: I fell for the Grand Palace scam on Day 1. A well-dressed man near the gate told me it was closed for a ceremony. I believed him. He put me in a tuk-tuk that spent 3 hours taking me to a tailor, a gem shop, and a 'lucky Buddha temple' I did not ask for. Nothing bad happened and I didn't buy anything, but I wasted half my day. Lesson: the Grand Palace is almost never closed during the day. Walk straight past anyone who says otherwise.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-002
(
  'bkk-cp-002', 'experiences',
  'Solo traveller', '31-35',
  $t$Gem scam nearly cost me $2,000 — here's exactly how it happened$t$,
  $c$I was approached near the Grand Palace by a very well-spoken Thai man who said there was a 'government gem export fair' happening that week only and that tourists could buy certified gems at wholesale prices to resell at home for profit. He had a printed brochure. I was taken to a legitimate-looking shop on Silom. I almost spent 60,000 THB on stones. Something felt wrong and I walked out. The US Embassy confirms: there is NO such government gem sale. There never has been. If anyone mentions a government gem fair, you are being scammed, period. Call Tourist Police 1155.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-003
(
  'bkk-cp-003', 'experiences',
  'Solo traveller', '22-25',
  $t$The tuk-tuk rule that saved my trip$t$,
  $c$After reading all the scam warnings I was nervous about tuk-tuks. Here's what actually works: I only ever used them for direct A-to-B journeys with a price agreed upfront, never for tours or sightseeing. For any distance over 2km I used Grab (like Uber, works great in Bangkok). The tuk-tuks that are scams always start with an offer that seems too cheap — like 20 THB to 'tour the temples.' A real ride to a specific street should cost roughly what Grab quotes. If a driver says any attraction is closed: it's not. He's lying.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-004
(
  'bkk-cp-004', 'experiences',
  'Solo traveller', '26-30',
  $t$Two weeks solo in Bangkok — the real picture for women$t$,
  $c$I stayed in Sukhumvit soi 11 area, mostly Aree and Ari neighbourhood for day walks. The biggest surprise was how little street harassment there was — genuinely less catcalling than most European cities I've been to. Thai culture is non-confrontational and most people leave you alone. The issues I did have: one tuk-tuk driver who got verbally aggressive when I refused his gem detour (I just got out at a red light), and one bar on Sukhumvit that tried to add mystery charges to my bill. I used Grab for everything after 10pm and never felt unsafe. Stay away from the red-light zones if you're solo — Patpong especially.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-005
(
  'bkk-cp-005', 'experiences',
  'Solo traveller', '22-25',
  $t$Drink spiking is REAL on Khao San Road — this happened to my friend$t$,
  $c$My friend ordered a cocktail 'bucket' at a Khao San Road bar in January 2025. She had two drinks. Within 45 minutes she could barely stand — she's a regular drinker and this was not normal intoxication. We got her back to the hostel in a Grab and she recovered, but it was frightening. We reported it but nothing came of it. The advice about sticking to bottled beers you see uncapped in front of you is real, not just internet paranoia. Avoid the cheapest, loudest bars on Khao San. Stick to well-reviewed venues on Phra Athit Road nearby — same vibes, much safer crowd.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-006
(
  'bkk-cp-006', 'experiences',
  'Solo traveller', '31-35',
  $t$The Grab app is non-negotiable in Bangkok$t$,
  $c$I lived in Bangkok for 6 months. Every foreigner I know who got ripped off in a taxi or tuk-tuk had refused to use Grab because they wanted the 'authentic experience.' The authentic experience of being scammed is not worth it. Grab works exactly like Uber — fixed price shown before you confirm, GPS-tracked route, driver's details logged. A taxi from Asok to the airport should be around 250 THB on Grab. If a street taxi quotes 700, you know the score. Use Grab. Every time. It's also safer at night for solo women.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-007
(
  'bkk-cp-007', 'experiences',
  'Solo traveller', '26-30',
  $t$Patpong upstairs bar tried to charge us 9,000 Baht$t$,
  $c$I know, I know. We'd read the warnings. But we were curious and a tout with a laminated sheet showing '100 Baht drinks, no cover charge' seemed legit. After 10 minutes inside we wanted to leave. Bill: 1,500 for drinks, 1,500 for 'lady drinks' we never ordered, 6,000 'looking fee.' We refused to pay the last two items. Fifteen minutes of arguing at the door with a security guard before they agreed to just take the drinks charge. The bars in Patpong are genuine organised scams. Do not go upstairs in that market. Nana Plaza has upfront pricing posted outside — if you're curious that's safer.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-008
(
  'bkk-cp-008', 'experiences',
  'Solo traveller', '31-35',
  $t$My card got skimmed at a standalone ATM in Silom$t$,
  $c$Used a standalone ATM near Patpong in 2024 and didn't notice anything unusual. Two days later my bank called: four transactions in a different part of Thailand totalling 18,000 THB. The bank reversed it (I had fraud protection) but it took weeks to resolve. Now I only use ATMs inside bank branches — Bangkok Bank and Kasikornbank inside 7-Eleven branches are everywhere. Also set up instant transaction alerts on your banking app before you travel. Take 5 seconds to wiggle the card slot before inserting your card.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-009
(
  'bkk-cp-009', 'experiences',
  'Solo traveller', '22-25',
  $t$A stranger claiming to be tourist police asked to check my passport$t$,
  $c$Near Siam Square, a Thai man in plain clothes showed me what looked like a police badge and asked to 'check my documents' citing a recent drug bust in the area. I'd read about this scam so I calmly said I'd prefer to go to the nearest police station. He disappeared within 30 seconds. Real tourist police are identifiable by uniform and do not stop random tourists for passport checks on the street. The Tourist Police number is 1155 — call them if you're ever pressured by someone claiming to be police.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-010
(
  'bkk-cp-010', 'experiences',
  'Solo traveller', '36-40',
  $t$Solo female safety reality check — Bangkok is genuinely manageable$t$,
  $c$I've done Bangkok alone four times, most recently in February 2025. The city ranks 2nd safest in Southeast Asia for tourists. The main risks are scams (which are avoidable once you know them), drink spiking (avoidable with sensible bar choices), and traffic accidents. Street harassment and sexual violence against tourists are genuinely rare. Stay in Sukhumvit or Silom, use Grab, eat at busy street food stalls, and don't let anyone put you in a tuk-tuk for a 'tour.' That's honestly most of it.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-011
(
  'bkk-cp-011', 'experiences',
  'Solo traveller', '26-30',
  $t$Bag snatched from shoulder near Chatuchak — what I'd do differently$t$,
  $c$Walking between the BTS and the market entrance on a Saturday morning, a motorbike came close to the pavement and my tote bag was pulled off my shoulder. I fell and cut my hand. Passport was in the hotel, thankfully. Lost my camera, 3,000 THB cash, and my phone. Police at the nearby station were helpful and gave me a report for the insurance. What I now do: crossbody bag worn with the clasp at the front, phone in a front jeans pocket or inside front of jacket. No camera outside unless I'm ready to use it. Carry only the cash I expect to need that day.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-012
(
  'bkk-cp-012', 'experiences',
  'Solo traveller', '22-25',
  $t$The temple clothing scam caught me before I even got inside$t$,
  $c$Walking towards the Grand Palace, a woman in official-looking clothing stopped me and said my shorts were too short to enter and I'd need to rent a sarong for 150 THB from her. I paid. When I reached the actual entrance gate, free loaner sarongs were available from the official counter inside. That woman had no official role whatsoever. Do not pay for clothing outside the temple gate. All major Bangkok temples have free loaners for visitors at the entrance desk.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-013
(
  'bkk-cp-013', 'experiences',
  'Solo traveller', '31-35',
  $t$Taxi refused meter, then tried to take a 20-minute detour$t$,
  $c$From Suvarnabhumi Airport, the driver refused to turn on the meter and quoted 800 THB. I said 'meter please' twice, then got out and joined the official taxi queue. Metered ride to my Sukhumvit hotel: 290 THB + 50 THB expressway. I now always use the numbered ticket from the official queue inside arrivals or book Grab while still in the terminal. One thing Grab requires: you need Thai mobile data, so buy a SIM card at the AIS or DTAC counter in arrivals before you leave the terminal.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-014
(
  'bkk-cp-014', 'experiences',
  'Solo traveller', '26-30',
  $t$Nice Thai man, long conversation — and then the gem shop appeared$t$,
  $c$Spent 45 minutes chatting with someone who turned out to be one of the most charming people I'd met in Bangkok. Genuinely felt like a local sharing tips. Then, naturally, a tuk-tuk appeared, and naturally the 'government gem fair' came up. I've since read that these individuals are paid a daily salary to do exactly this — build rapport and deliver tourists to commission shops. The warmth is real but the intent is not. In the touristy areas, if a random local initiates contact and asks about your plans: be pleasant and walk on.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-015
(
  'bkk-cp-015', 'experiences',
  'Solo traveller', '22-25',
  $t$Night train Bangkok to Chiang Mai — solo women, it's fine$t$,
  $c$Took the overnight train alone (second class sleeper) in March 2025. Booked top bunk as multiple guides recommend — harder to access from below. The train compartment had other solo travellers and a Thai family. I slept with my day pack (passport, phone, money) at the head of the bunk against the wall. Arrived safely, on time, no issues. Book direct on the State Railway of Thailand website (railway.co.th) — NOT through Khao San Road agencies. Train is genuinely safe and beautiful.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-016
(
  'bkk-cp-016', 'experiences',
  'Solo traveller', '22-25',
  $t$They got into my checked bag on an overnight bus$t$,
  $c$Booked a night bus to Ko Tao through a Khao San Road agency. Arrived to find my camera missing from the main compartment of my checked bag, which had been in the undercarriage hold. The zip had clearly been opened and closed. Filed a police report but nothing came of it. If you take an overnight bus in Thailand: keep your valuables (passport, money, phone, anything electronic worth over $50) in your day bag on your person, not in your checked luggage.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-017
(
  'bkk-cp-017', 'experiences',
  'Solo traveller', '31-35',
  $t$Khlong boat scam — 'closed route' meant gem shop detour$t$,
  $c$Hired a long-tail boat at Chang Pier for a canal tour. After 10 minutes the driver said the main route was 'blocked for repairs' and we'd visit some 'special temples' instead. Two of the three stops were shops — one selling gold jewellery and one selling 'authentic' silk. I didn't buy anything but was gone for 4 hours instead of the agreed 90 minutes. Get the exact route written down before you board. The Chao Phraya Express orange-flag boats are a scam-free, scenic alternative for the main sights.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-018
(
  'bkk-cp-018', 'experiences',
  'Solo traveller', '26-30',
  $t$5 weeks solo female in Bangkok — the honest version$t$,
  $c$I stayed in Ari (best neighbourhood — quiet, local, safe), ate mostly at street stalls on smaller side streets where prices were honest (40–60 THB per dish), used BTS and Grab exclusively after 8pm. I felt safer in Bangkok than in London or Barcelona. My one actual scary moment: walking back from a bar alone past Soi Cowboy at 11pm. The number of aggressive touts physically blocking my path — not dangerous, but genuinely unpleasant and relentless. I walked faster, didn't engage, and was fine. Just give the red-light zones a wide berth if you're alone.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-019
(
  'bkk-cp-019', 'experiences',
  'Solo traveller', '26-30',
  $t$Don't stay directly on Khao San Road — Phra Athit is better$t$,
  $c$First-time Bangkok visitors often stay on Khao San Road for the buzz but it concentrates every type of scam and tourist-trap business. Phra Athit Road is 5 minutes' walk away, significantly quieter, has good local and international restaurants, and the accommodation is cheaper. You can still access Khao San for its night market energy but return to a calmer, safer street. The walkable distance to the Grand Palace and Wat Pho is the same.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-020
(
  'bkk-cp-020', 'experiences',
  'Solo traveller', '22-25',
  $t$Currency scam — asked to 'see' my British pound at an ATM$t$,
  $c$Just withdrawn cash at a Bangkok Bank ATM on Sukhumvit when a man approached and asked where I was from, then asked if he could 'see what a British note looks like.' It seemed so innocent. I'd read about exactly this scam so I said no and walked on. Friends at the same hostel hadn't read the warning — one of them lost several notes in an identical interaction at Chatuchak. Never take out your cash or let strangers handle your money, no matter how genuine the question seems.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-021
(
  'bkk-cp-021', 'experiences',
  'Solo traveller', '22-25',
  $t$Fake tour agency gave me non-existent ferry tickets$t$,
  $c$Bought combo bus + ferry tickets to Koh Phangan from a shopfront on Khao San Road. The bus was fine; at the pier the ferry company had no record of my booking. The shopfront's phone was off and the address no longer matched anything. I had to purchase new tickets on the spot. Always book island-bound transport through 12GoAsia or the official ferry company websites (Seatran, Lomprayah). The few extra minutes of research are worth it.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-022
(
  'bkk-cp-022', 'experiences',
  'Solo traveller', '31-35',
  $t$Sex tourism zones — as a solo female tourist you should know this$t$,
  $c$I didn't come to Bangkok for the red light districts but I passed through Nana and Soi Cowboy for curiosity during an afternoon. In daylight it was manageable and I saw plenty of other female tourists. At night it's a different environment — the touting becomes aggressive, it's difficult to walk through without being grabbed at or followed. I wasn't in danger but I was uncomfortable. None of my Bangkok research prepared me for how intense the harassment from touts (not locals generally, specifically the touts) was. My advice: visit in daylight if curious, avoid solo at night.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-023
(
  'bkk-cp-023', 'experiences',
  'Solo traveller', '36-40',
  $t$What I keep in my bag vs hotel safe in Bangkok$t$,
  $c$Hotel safe: passport (carry phone photo), large amounts of cash, extra credit/debit cards, laptop. On my person daily: one debit card (Wise, easy to freeze), one credit card (different bank, for emergencies), the cash I'll need that day, phone (never in back pocket), travel insurance card. This way if I'm pickpocketed I lose very little and can still access funds. I've done this in Bangkok four times without a single issue.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-024
(
  'bkk-cp-024', 'experiences',
  'Solo traveller', '26-30',
  $t$Man on motorbike snatched phone from my hand near Asiatique$t$,
  $c$I was texting while walking on the pavement near Asiatique river market when a motorbike rode close to the edge and my phone was yanked out of my hand. It happened in less than a second. I had a case with a wrist strap but it wasn't attached. Police were helpful and gave a report for insurance. My phone was wiped remotely via iCloud. What I do now: wrist strap always attached, phone always inside my bag or pocket when not actively in use, walking away from the road edge when using it.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-025
(
  'bkk-cp-025', 'experiences',
  'Solo traveller', '31-35',
  $t$The Floating Market day trip — tourist trap with beautiful moments$t$,
  $c$Damnoen Saduak Floating Market: sold to me as an 'authentic experience' and it's genuinely impressive visually. But the boat costs are a trap. Touts quoted 2,000 THB for a private boat. The official shared rate is 400 THB per person for a 45-minute trip. The market itself is crowded with tourist-priced stalls selling the same goods as every Bangkok market for twice the price. Worth visiting once for the atmosphere but go in knowing it's a heavily commercialised tourist destination, not a local market. Get there early (before 9am) to beat the worst crowds.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-026
(
  'bkk-cp-026', 'experiences',
  'Solo traveller', '22-25',
  $t$Fake monk approached me asking for money$t$,
  $c$Outside Wat Suthat, a monk in full robes approached and asked for a 'donation for the temple' while thrusting a clipboard in my face. Real monks in Thailand don't solicit tourist donations on the street — the practice would go against Buddhist monastic code. I smiled, said no, and walked away. He was persistent. I walked into a busy shop. Never give money to monks who approach you unsolicited on the street in Bangkok.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-027
(
  'bkk-cp-027', 'experiences',
  'Solo traveller', '36-40',
  $t$Save these numbers before you land in Bangkok$t$,
  $c$Tourist Police: 1155 (English-speaking, available 24 hours, genuinely helpful for scam reports and assistance). Emergency: 191. Ambulance: 1669. Your hotel's number. Your country's embassy in Bangkok. I keep these saved in my phone and also written in my travel journal. The Tourist Police responded within 20 minutes when I called after my card was skimmed and helped me file the right paperwork for my bank dispute.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-028
(
  'bkk-cp-028', 'experiences',
  'Solo traveller', '26-30',
  $t$Tuk-tuk harassment — getting out mid-journey worked$t$,
  $c$My tuk-tuk driver started making comments about my appearance and asking if I had a boyfriend. I was clear, said stop, he didn't. At the next red light I handed the agreed fare and stepped off. He called after me but didn't follow. Thai culture's non-confrontational nature works both ways — they're generally less likely to escalate. Trust your gut and exit. You can always hail another Grab. Don't feel obligated to stay in an uncomfortable situation because you agreed on a price.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-029
(
  'bkk-cp-029', 'experiences',
  'Solo traveller', '22-25',
  $t$Bird-feeding scam at Lumphini Park$t$,
  $c$A vendor at Lumphini Park handed me a bag of bird feed saying it was 'free to try.' I tossed a handful to the pigeons. She immediately demanded 200 THB. When I refused she became louder. I handed the bag back and walked away. She did not follow. This is a minor annoyance, not a safety issue, but it happens a lot near parks and temples. The rule is simple: never accept anything handed to you by a stranger.$c$,
  'bangkok-thailand', '[]', 'approved'
),

-- bkk-cp-030
(
  'bkk-cp-030', 'experiences',
  'Solo traveller', '31-35',
  $t$Bangkok airport customs shakedown — this is real and terrifying$t$,
  $c$A friend of mine (not me personally) was pulled aside at Suvarnabhumi customs in 2024 and accused of attempting to smuggle undeclared duty-free alcohol. A 'customs official' had actually told her before baggage collection to put the bottles in her checked bag 'to avoid the queue.' She paid a large 'fine' before realising it was extortion. The BBC documented cases like this. If a customs officer at any point instructs you to put duty-free into your checked bag, refuse and ask for a written instruction. Know your legal right to contact your embassy before paying any fine.$c$,
  'bangkok-thailand', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── End of Bangkok seed (51 beware reports + 30 community posts). ─────────────

-- =====================================================================
-- ─── from 036_paris_seed_beware_community.sql
-- =====================================================================
-- 036_paris_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Paris, France.
-- 32 beware reports + 30 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS (Sub-part 1: entries 1–16) ────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- par-bw-001: Friendship bracelet tie scam at Sacré-Cœur
(
  'paris-france', 'Paris', 'Scam',
  $t$Friendship Bracelet Tie Scam at Sacré-Cœur$t$,
  'medium',
  $d$A person on the Sacré-Cœur steps or Montmartre approaches and ties a 'friendship bracelet' around your wrist before you can object, then demands payment of €5–20. If you try to leave without paying, accomplices surround you and intimidation follows. Do not let anyone touch your wrist. Say 'non' firmly and keep walking without breaking stride. If the bracelet is already on, remove it and return it without engaging. Documented by multiple 2025 solo female travel guides and confirmed by a travel blogger at Curls en Route who was caught by this exact scam.$d$,
  'Web research',
  'Sacré-Cœur steps and approach, Montmartre area',
  '[]', 'approved'
),

-- par-bw-002: Petition clipboard pickpocket distraction
(
  'paris-france', 'Paris', 'Scam / Theft',
  $t$Petition Clipboard Pickpocket Distraction$t$,
  'high',
  $d$Groups — often presenting as women — approach tourists near Notre Dame, the Louvre, the Eiffel Tower, and Montmartre with clipboards asking for a petition signature for a fake charity (disabled children, deaf-mute causes). A local guide in Paris found a petition in a bin showing two different 'donation amount' columns hidden by hand during signing. While you focus on the clipboard, an accomplice picks your pocket or bag. Ignore completely. Say 'non' without stopping and keep walking. Do not engage.$d$,
  'Web research',
  'Eiffel Tower base, Louvre entrance, Notre Dame, Sacré-Cœur, Montmartre',
  '[]', 'approved'
),

-- par-bw-003: Pickpocketing on Metro Line 1
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpocketing on Metro Line 1$t$,
  'high',
  $d$Metro Line 1 is Paris's main tourist line running from CDG connection through all major sights. It is also the highest-density pickpocket environment in the city. During rush hours and at Châtelet and Gare de Lyon stops, organised teams work crowded carriages. Common methods: group surrounds you as you enter, someone bumps from behind while another reaches your bag, someone pretends to help you with luggage. Use a crossbody bag with the clasp at the front. Never put phones or wallets in jacket or back pockets on the Metro.$d$,
  'Web research',
  'Metro Line 1, particularly Châtelet, Gare de Lyon stops',
  '[]', 'approved'
),

-- par-bw-004: Phone snatching at Metro doors
(
  'paris-france', 'Paris', 'Theft',
  $t$Phone Snatching at Metro Doors$t$,
  'high',
  $d$American expat Amanda Rollins, who has lived in Paris for five years, publicly documented losing five mobile phones to a single, well-known method: thieves stand on the platform as the Metro arrives. When you're near the doors holding your phone, they reach in as the doors close, snatch it from your hand, and the doors close before you can react. Never stand at Metro doors using your phone. Keep your phone in your bag or secured with a strong wrist strap. Paris-local.com also reported a 2025 variant targeting phones worn on lanyards around the chest.$d$,
  'Web research',
  'Metro stations city-wide, particularly busy stops',
  '[]', 'approved'
),

-- par-bw-005: Eiffel Tower pickpocket gangs
(
  'paris-france', 'Paris', 'Theft',
  $t$Eiffel Tower Pickpocket Gangs$t$,
  'high',
  $d$The Eiffel Tower base and Champ de Mars have the highest pickpocket density in Paris according to multiple verified safety guides for 2025. The lift queues are particularly targeted — tourists distracted by the view and photography, often with open backpacks. Keep all bags in front of you, zip every compartment, and put your phone in your front pocket or secure bag while standing in any queue near the tower.$d$,
  'Web research',
  'Eiffel Tower base, lift queues, Champ de Mars',
  '[]', 'approved'
),

-- par-bw-006: Found gold ring scam
(
  'paris-france', 'Paris', 'Scam',
  $t$Found 'Gold Ring' Scam$t$,
  'low',
  $d$A scammer 'finds' a gold-coloured ring on the ground near you and asks if it's yours. When you say no, they offer it to you as a 'gift' or claim it brings luck. Within moments they ask for a small donation or the conversation escalates into a distraction for a pickpocket accomplice. If someone near you picks up a ring and shows it to you, walk away immediately. This scam is specifically listed by the Paris Safety Guide 2026 and documented by multiple travel sources.$d$,
  'Web research',
  'Near tourist sites, Seine riverbanks, main boulevards',
  '[]', 'approved'
),

-- par-bw-007: Shell game / thimble game
(
  'paris-france', 'Paris', 'Scam / Financial',
  $t$Shell Game / Thimble Game at Trocadéro and Tourist Steps$t$,
  'medium',
  $d$Street operators run shell games (thimbles and a ball) at Place du Trocadéro and near major tourist stairs. The surrounding 'audience' of people betting and winning are all part of the act. Once a genuine tourist bets real money, sleight of hand ensures they lose every time. The game is illegal and the surrounding group often includes individuals who pickpocket distracted bystanders. Solo traveller blogger asinglewomantraveling.com personally witnessed this at Trocadéro in 2025. Never stop to watch or bet.$d$,
  'Web research',
  'Place du Trocadéro, Sacré-Cœur steps area, tourist areas',
  '[]', 'approved'
),

-- par-bw-008: Pickpocketing on RER B airport train
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpocketing on RER B Airport Train$t$,
  'high',
  $d$The RER B from Charles de Gaulle Airport to central Paris is specifically targeted by organised theft gangs. Arriving passengers with luggage are prime targets. Never put bags in overhead racks on the RER B — keep luggage on your lap or between your feet. The highest-risk points are near Gare du Nord station and on the train toward CDG. Paris Safety Guide 2026 (eurly.com) identifies this as one of Paris's top pickpocket environments. Consider a taxi or Uber from the airport if travelling alone with luggage.$d$,
  'Web research',
  'RER B line between CDG Airport and central Paris',
  '[]', 'approved'
),

-- par-bw-009: Unofficial taxi scam at airports
(
  'paris-france', 'Paris', 'Transport',
  $t$Unofficial Taxi Scam at Airports and Train Stations$t$,
  'high',
  $d$Unlicensed drivers approach tourists at CDG, Orly airports, and Gare du Nord claiming to be taxis at fixed prices. Rides that should cost €50–55 (official CDG to central Paris flat rate) are charged at €100–200. Rigged meters are also reported in some cases. Never accept taxi offers from anyone approaching you inside the terminal. Use only the official 'Taxis Parisiens' stands (vehicles with illuminated roof signs) or book via the G7 app, Uber, or Bolt. Official taxis from CDG to anywhere on the Right or Left Bank have a fixed legal flat rate.$d$,
  'Web research',
  'CDG Airport, Orly Airport, Gare du Nord, major stations',
  '[]', 'approved'
),

-- par-bw-010: Gare du Nord night harassment
(
  'paris-france', 'Paris', 'Harassment / Safety',
  $t$Harassment and Loitering Near Gare du Nord at Night$t$,
  'medium',
  $d$Gare du Nord is consistently flagged in solo female travel guides as uncomfortable to navigate alone at night. Areas immediately outside the station after midnight have concentrated groups of men, drug dealing, and instances of verbal harassment directed at women. Inside the station itself is patrolled and well-lit. For late-night arrivals at Gare du Nord, go directly to a taxi or pre-ordered Uber without lingering outside. Multiple 2025 sources including Love and Paris and eurly.com safety guides specifically advise women to avoid this area late at night.$d$,
  'Web research',
  $l$Streets around Gare du Nord, Gare de l'Est, after midnight$l$,
  '[]', 'approved'
),

-- par-bw-011: Pickpocketing in the Louvre queues
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpocketing in the Louvre Queues$t$,
  'high',
  $d$Both the external queue under the Pyramid and the crush near the Mona Lisa inside the Louvre are prime pickpocket environments. Organised groups exploit the combination of distraction (tourists focused on artwork) and tight physical proximity. Keep bags zipped and in front. Do not reach into a backpack while standing in the Mona Lisa crowd. Book skip-the-line tickets in advance to reduce time standing in the most targeted queue areas.$d$,
  'Web research',
  'Louvre entrance queue, Mona Lisa room interior',
  '[]', 'approved'
),

-- par-bw-012: Street artists demanding payment in Montmartre
(
  'paris-france', 'Paris', 'Harassment / Scam',
  $t$Street Artists Demanding Payment for Unwanted Portraits in Montmartre$t$,
  'medium',
  $d$Street artists near Place du Tertre and the Sacré-Cœur approach tourists and begin drawing or painting their portrait without asking. Once any part of it is done, they aggressively demand payment — amounts ranging from €20 to €100 or more. They may grab your arm or block your path. Do not make eye contact with portrait artists who approach you unsolicited. If a drawing is started without your consent, walk away — you have no legal obligation to pay.$d$,
  'Web research',
  'Place du Tertre, Montmartre, Sacré-Cœur area',
  '[]', 'approved'
),

-- par-bw-013: Pigalle red-light night harassment
(
  'paris-france', 'Paris', 'Harassment',
  $t$Pigalle Red-Light District — Night-Time Verbal Harassment$t$,
  'medium',
  $d$Pigalle is Paris's red-light district near Moulin Rouge. While walkable in daylight with tourists around, after dark it involves sex workers, drug dealers, and groups of men who target women walking alone with persistent verbal approaches. Long-time Paris travel blogger Nancy H. (Travels On Point) notes walking through at night with 'men calling out to me.' Avoid alone after dark or use taxis/Uber through rather than walking. Perfectly safe to visit Moulin Rouge itself with standard precautions.$d$,
  'Web research',
  'Pigalle, 18th arrondissement, around Moulin Rouge after dark',
  '[]', 'approved'
),

-- par-bw-014: Bois de Boulogne after dark
(
  'paris-france', 'Paris', 'Safety',
  $t$Bois de Boulogne After Dark$t$,
  'high',
  $d$Bois de Boulogne is one of Paris's most visited parks during the day but becomes unsafe after dark, with sex workers, drug dealers, and associated criminality. All solo female travel guides including Travels On Point explicitly advise against visiting this park at night. Avoid entirely after sunset.$d$,
  'Web research',
  'Bois de Boulogne park, 16th arrondissement',
  '[]', 'approved'
),

-- par-bw-015: Châtelet-Les Halles after midnight
(
  'paris-france', 'Paris', 'Safety',
  $t$Châtelet-Les Halles Area After Midnight$t$,
  'medium',
  $d$Châtelet-Les Halles is one of the largest Metro interchanges in the world and a major shopping hub — during the day it is busy and manageable. After midnight, the area around the station entrances attracts concentrated groups of people who can make solo women feel uncomfortable, with instances of following and verbal harassment. Paris Safety Guide 2026 lists it explicitly as an area requiring elevated caution after midnight.$d$,
  'Web research',
  'Châtelet-Les Halles station exits, Forum des Halles, after midnight',
  '[]', 'approved'
),

-- par-bw-016: ATM snatching cash grabbed at dispensing
(
  'paris-france', 'Paris', 'Theft',
  $t$ATM Snatching — Cash Grabbed as It Dispenses$t$,
  'medium',
  $d$Paris local guide Vadim Hedonist and Paris-local.com specifically warn about thieves who watch tourists at ATMs and snatch cash the moment it is dispensed. Use ATMs inside bank branches rather than street-facing machines. Shield your PIN with your hand. Be aware of who is nearby when cash appears. Withdraw smaller amounts more frequently rather than large sums at once.$d$,
  'Web research',
  'Street ATMs, particularly near tourist sites',
  '[]', 'approved'
);

-- ─── BEWARE REPORTS (Sub-part 2: entries 17–32) ───────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- par-bw-017: Pickpocketing at Place du Tertre
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpocketing at Place du Tertre$t$,
  'medium',
  $d$Place du Tertre in Montmartre — the famous artists' square — is listed by Paris Safety 2026 as a 'congested tourist area where organised groups work together.' The combination of crowd density, distraction from artists, and the squeeze up the steps from Sacré-Cœur creates excellent conditions for pickpockets. Wear your bag in front, zip everything, and be particularly alert when artists or vendors approach you.$d$,
  'Web research',
  'Place du Tertre, Montmartre, Sacré-Cœur steps',
  '[]', 'approved'
),

-- par-bw-018: Taxi meter rigging and overcharging
(
  'paris-france', 'Paris', 'Transport',
  $t$Taxi Meter Rigging and Overcharging$t$,
  'medium',
  $d$Private (unlicensed) taxis — distinct from official Taxis Parisiens — have documented cases of rigged meters, unnecessarily long routes, and charging tourist 'premiums.' Paris local guide Vadim Hedonist advises never hailing taxis on the street. Use the official G7 app, Uber, or Bolt for transparent pricing. If in a taxi, ensure the meter is running immediately after departure. The legitimate flat rate from CDG to anywhere on the Right Bank is currently around €56 (verify current official rates).$d$,
  'Web research',
  'City-wide, particularly at airports and major stations',
  '[]', 'approved'
),

-- par-bw-019: Pickpockets on crowded buses
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpockets on Crowded Buses$t$,
  'medium',
  $d$Crowded bus routes — particularly those passing through tourist zones — are secondary pickpocket environments. The compression of boarding and alighting provides the same cover as the Metro. The advice to use buses instead of the Metro at night (recommended by some safety guides for being less underground and more visible) does not eliminate pickpocket risk. Apply the same precautions: bag in front, zipped, phone inside bag.$d$,
  'Web research',
  'Major bus lines through tourist areas',
  '[]', 'approved'
),

-- par-bw-020: La Chapelle / Château d'Eau at night
(
  'paris-france', 'Paris', 'Safety / Harassment',
  $t$La Chapelle and Château d'Eau Areas at Night$t$,
  'medium',
  $d$La Chapelle (18th arrondissement) and the area around Château d'Eau Metro station are described by Love and Paris as having 'lower evening foot traffic that attracts more petty thieves' with concentrated groups of men outside the station particularly at night. These are not typical tourist zones but solo female travellers sometimes pass through. Walk confidently and stick to the main Boulevard streets; do not linger.$d$,
  'Web research',
  $l$La Chapelle (18th), Château d'Eau Metro station area$l$,
  '[]', 'approved'
),

-- par-bw-021: Overpriced café/restaurant bills near tourist sites
(
  'paris-france', 'Paris', 'Scam / Pricing',
  $t$Overpriced Café and Restaurant Bills Near Tourist Sites$t$,
  'low',
  $d$Cafés and restaurants directly facing major tourist sites (Eiffel Tower, Notre Dame, Champs-Élysées) consistently charge 2–4x the price of identical items a few streets away. A café crème near the Eiffel Tower may cost €8 vs €2.50 in a local café 200 metres away. This is not illegal, but it is widespread. Walk two blocks away from any major landmark before sitting down. A good rule: if the menu is in English only and displayed at the entrance with photos, prices will be inflated.$d$,
  'Web research',
  'All major tourist landmark areas',
  '[]', 'approved'
),

-- par-bw-022: Street vendor selling counterfeit products
(
  'paris-france', 'Paris', 'Scam / Legal',
  $t$Street Vendor Selling Counterfeit Products$t$,
  'low',
  $d$Vendors near the Eiffel Tower sell miniature Eiffel Tower models and other merchandise at highly inflated prices, often pursuing tourists aggressively. Additionally, counterfeit 'designer' goods sold on street blankets near luxury shopping areas are illegal to purchase in France. Note that vendors will fold up their goods and disappear within seconds when police approach, indicating the illegality of their operation.$d$,
  'Web research',
  'Eiffel Tower Champ de Mars, Champs-Élysées, Marais area',
  '[]', 'approved'
),

-- par-bw-023: Fake charity collection with bucket pressure
(
  'paris-france', 'Paris', 'Scam',
  $t$Fake Charity Collection with Aggressive Donation Pressure$t$,
  'medium',
  $d$Individuals holding plastic buckets approach tourists claiming to collect for charities (cancer research, homelessness). These are not registered charities. Dayin Guided Tours analysed a recovered fake petition and found printed prices on both sides of the clipboard — hidden with the hand — showing different amounts depending on the apparent origin country of the tourist. Ignore any clipboard or bucket collection from strangers near tourist sites.$d$,
  'Web research',
  'Major tourist attractions city-wide',
  '[]', 'approved'
),

-- par-bw-024: North peripheral areas — Porte de la Chapelle / Clichy
(
  'paris-france', 'Paris', 'Safety',
  $t$North Peripheral Areas — Porte de la Chapelle, Porte de Clichy$t$,
  'medium',
  $d$Paris Safety Guide 2026 notes these northern peripheral areas are not tourist zones and require standard big-city caution. They are not areas travellers would normally visit intentionally but can be accidentally accessed via Metro or on foot when arriving from CDG. Avoid wandering in these areas, particularly at night, without a specific destination.$d$,
  'Web research',
  'Porte de la Chapelle, Porte de Clichy, northern peripherique',
  '[]', 'approved'
),

-- par-bw-025: Champs-Élysées 'hug' / friendly approach pickpocket
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpocket 'Hug' or 'Friendly' Approach on Champs-Élysées$t$,
  'medium',
  $d$Thieves on the Champs-Élysées approach tourists with apparent warmth — talking about 'friendship between nations,' offering a handshake or brief embrace — while slipping a hand inside jacket or coat pockets. Paris local guide specifically documents this: 'someone will approach you pretending to be friendly, giving you a hug or talking about friendship between nations, all while slipping your wallet or phone from your inner coat pocket.' Never allow a stranger to embrace you or come into close physical contact.$d$,
  'Web research',
  'Champs-Élysées, Arc de Triomphe area',
  '[]', 'approved'
),

-- par-bw-026: Ketchup / dirt thrown on clothing distraction
(
  'paris-france', 'Paris', 'Scam / Theft',
  $t$Dirt or Ketchup Thrown on Clothing as Distraction$t$,
  'medium',
  $d$A substance (ketchup, bird dropping, paint) is 'accidentally' thrown on your clothing. A 'helpful' stranger offers to clean it for you. While you focus on the stain and the cleaner, an accomplice picks your pockets or bag. This scam operates in groups. If anything is thrown or dropped on you, hold your bag firmly and move quickly to a public area. Decline all help from strangers and check your belongings before doing anything else.$d$,
  'Web research',
  'Near major tourist sites, Metro entrances',
  '[]', 'approved'
),

-- par-bw-027: Overnight street harassment in arrondissements
(
  'paris-france', 'Paris', 'Harassment',
  $t$Overnight Street Harassment in Some Arrondissements$t$,
  'medium',
  $d$Solo female travellers report street harassment — persistent following, unwanted comments, blocking of path — in certain areas at night, primarily Pigalle, La Chapelle, and around some Gare du Nord side streets. Travels On Point and Love and Paris both note that while violent crime against tourists is very rare, verbal harassment occurs in these specific zones after dark. The advice is consistent: walk confidently on main streets, ignore without engaging, enter a café or shop if followed, and use Uber/Grab rather than walking through these areas at night.$d$,
  'Web research',
  'Pigalle (18th), La Chapelle, Gare du Nord side streets at night',
  '[]', 'approved'
),

-- par-bw-028: Pickpockets at markets
(
  'paris-france', 'Paris', 'Theft',
  $t$Pickpockets Targeting Market Crowds$t$,
  'medium',
  $d$Popular open-air markets — Marché d'Aligre, Marché des Enfants Rouges, and street markets in the Marais — attract pickpockets on busy weekend mornings. The combination of crowds, browsing distraction, and open bags makes these ideal conditions. Secure your bag before entering any market and be aware of people who press unusually close while you examine merchandise.$d$,
  'Web research',
  'Major Parisian open-air markets, Marais street markets',
  '[]', 'approved'
),

-- par-bw-029: Fake Eiffel Tower ticket sellers
(
  'paris-france', 'Paris', 'Scam / Financial',
  $t$Fake Eiffel Tower Ticket Sellers$t$,
  'medium',
  $d$Near the Eiffel Tower entrance, unofficial sellers approach tourists offering to 'skip the queue' by selling tickets at inflated prices. Some tickets are fake and unusable at the turnstile. The only official Eiffel Tower tickets are sold through the official website (ticket.toureiffel.paris) or at the official kiosk on site. Always pre-book online for skip-the-line access.$d$,
  'Web research',
  'Eiffel Tower entrance approaches, Trocadéro area',
  '[]', 'approved'
),

-- par-bw-030: Currency exchange hidden fees
(
  'paris-france', 'Paris', 'Financial',
  $t$Currency Exchange Hidden Fees at Tourist Exchange Booths$t$,
  'low',
  $d$Many currency exchange booths near tourist sites advertise zero commission but apply an unfavourable exchange rate, effectively hiding the fee in the spread. The best rates in Paris are obtained from ATMs using a bank card with no foreign transaction fees (e.g. Wise, Revolut, or a fee-free travel card), not from exchange booths. Always check the effective rate, not just whether commission is advertised as zero.$d$,
  'Web research',
  'Currency exchange booths near Champs-Élysées, major tourist zones',
  '[]', 'approved'
),

-- par-bw-031: Fake police ID check near tourist sites
(
  'paris-france', 'Paris', 'Scam / Crime',
  $t$Fake Police ID Check Near Tourist Sites$t$,
  'medium',
  $d$Rare but documented: individuals in plain clothes show a fake police credential and ask tourists to display their passport and wallet for a 'routine check.' Real French police conducting such checks will be in uniform or show official Gendarmerie or Police Nationale ID. If asked, request to see official credentials clearly, state you will contact your embassy, and offer only to walk with them to the nearest police commissariat.$d$,
  'Web research',
  'Near major tourist sites, Louvre area, Eiffel Tower',
  '[]', 'approved'
),

-- par-bw-032: Street music performer pickpocket cover
(
  'paris-france', 'Paris', 'Theft',
  $t$Street Music Performer Pickpocket Cover$t$,
  'medium',
  $d$Gathering crowds around street musicians, particularly in Metro corridors and outside popular sites, provide cover for pickpockets who use the natural compression of audience formation to reach into bags and pockets. Paris local guide Vadim specifically warns: 'pickpockets also work in crowds and busy spots, like when people gather to listen to street musicians.' If stopping to listen to street music, hold your bag at your front and check it before and after.$d$,
  'Web research',
  'Metro corridors, Montmartre street musicians, Champs-Élysées pedestrian areas',
  '[]', 'approved'
);

-- ─── COMMUNITY POSTS (Sub-part 3: par-cp-001 to par-cp-015) ───────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- par-cp-001
(
  'par-cp-001', 'experiences',
  'Solo traveller', '22-25',
  $t$First solo trip to Paris — the bracelet scam caught me at Sacré-Cœur$t$,
  $c$I'd read about the bracelet scam and still fell for it. A man on the steps to Sacré-Cœur grabbed my wrist so quickly I didn't even register it was happening. Bracelet tied in under 5 seconds. He immediately demanded €20. I said I didn't have cash. He said he'd walk me to an ATM. I started getting louder and saying 'please stop, I don't want this' — he backed off. The best advice I can give: protect your wrists like you protect your wallet up there. Walk with your hands in your pockets or holding a bag strap. The moment you stop and look up at the view you're a target.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-002
(
  'par-cp-002', 'experiences',
  'Solo traveller', '26-30',
  $t$My phone was snatched from my hand at a Paris Metro door$t$,
  $c$I'd heard about the Metro door phone snatch but genuinely did not think it would happen to me. I was on line 4, near the door, texting. As the doors opened at Les Halles, a man grabbed my phone and stepped off. Doors closed before I could react. It was 4pm on a Wednesday afternoon. Not at night, not in a sketchy area — in the middle of the day on a tourist line. I've since learned the American expat community in Paris is full of this story. Now: phone in my bag, wrist strap attached, never at the door of the Metro, ever.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-003
(
  'par-cp-003', 'experiences',
  'Solo traveller', '31-35',
  $t$Petition scam at the Louvre entrance almost cost me my wallet$t$,
  $c$A group of about four young women approached me at the Louvre entrance with clipboards, speaking rapid French. One thrust a clipboard at me and pointed at the sign-here line. I was distracted and reaching for my bag to find a pen when I felt a tug — someone's hand in my bag. I jerked away and shouted. They scattered immediately. I still had my wallet because it was in my front crossbody pocket. This is a coordinated team operation. The clipboard person is purely a distraction. Walk away from anyone with a clipboard near any Paris tourist site.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-004
(
  'par-cp-004', 'experiences',
  'Solo traveller', '31-35',
  $t$Two weeks solo in Paris — the honest safety picture$t$,
  $c$I'm a well-travelled woman in my 30s and Paris was genuinely manageable solo. Street harassment was less common than Rome or Barcelona and violent crime against tourists is very rare. The issues are almost entirely scams and pickpockets concentrated at tourist sites. I stayed in the 11th arrondissement (Bastille area) — safe, local feeling, great restaurants, easy Metro access. What worked: crossbody bag always, phone in bag not hand, pre-booked Uber for late nights, avoided Pigalle at night, completely ignored petition clipboards and bracelet sellers. Had a great trip.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-005
(
  'par-cp-005', 'experiences',
  'Solo traveller', '26-30',
  $t$Pickpocketed on the RER B from CDG — what I wish I'd known$t$,
  $c$First hour in Paris and I was pickpocketed on the RER B from Charles de Gaulle. I had my rolling suitcase in the overhead rack and my day bag between my feet. My day bag was unzipped from below while I was distracted looking out the window — passport, phone, and 200 euros gone. A fellow traveller helped me report it at Gare du Nord. Lesson: on the RER B, luggage on your lap or between your legs (not the overhead), bag zipped and held, never the overhead for anything with valuables. Next time I'll pay the €55 for an official taxi from CDG.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-006
(
  'par-cp-006', 'experiences',
  'Solo traveller', '26-30',
  $t$Gare du Nord at midnight — solo female, not my finest hour$t$,
  $c$Arrived by Eurostar from London at 11:30pm. The area immediately outside Gare du Nord at midnight is a different world from the busy daytime station. Groups of men, unsolicited approaches, one man who followed me for half a block before I went into a convenience store. I was not in danger and nothing happened, but I was genuinely uncomfortable. I now always book a Uber from inside the station on arrival rather than walking to the taxi rank. Cost me an extra €5 vs the cab rank but I'm inside a vehicle within 90 seconds of leaving the station.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-007
(
  'par-cp-007', 'experiences',
  'Solo traveller', '36-40',
  $t$Pickpocket got my wallet at the Eiffel Tower lift queue$t$,
  $c$Standing in the queue for the second level lift at the Eiffel Tower. It was packed — typical summer crowd. My crossbody bag was at my side (not in front, my mistake). I felt nothing. Reached for my wallet to pay for something twenty minutes later and it was gone. Reported to police — got a reference number for the insurance claim. The police officer said the Eiffel Tower base accounts for a significant proportion of tourist theft in Paris. The bag needs to be in FRONT, clasp facing forward. Not at your side, not on your back.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-008
(
  'par-cp-008', 'experiences',
  'Solo traveller', '36-40',
  $t$How I did two weeks in Paris without being pickpocketed$t$,
  $c$I've been to Paris 6 times. Pickpocketed once (early 2022, before I got serious about it). Since then: crossbody Pacsafe anti-theft bag (wire mesh inside the strap, lockable zipper, fixed to the seat carabiner at cafés), phone on a wrist strap always, money split between front jeans pocket and bag interior, only €50 cash on my person at any time with the rest locked in the hotel safe. I left my passport in the hotel and carried only a photo of it. I walked past every petition clipboard without making eye contact. Zero incidents in three subsequent trips.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-009
(
  'par-cp-009', 'experiences',
  'Solo traveller', '22-25',
  $t$The gold ring scam — simpler than you'd think$t$,
  $c$Walking near the Trocadéro and a man in front of me 'found' a gold ring on the pavement and turned to me asking if I'd dropped it. When I said no, he examined it and said it looked like real gold and I should take it as I seemed to need luck. I started to take it (I know), then remembered the scam guide I'd read. He wanted a 'small donation' for giving me his lucky find. I handed it back and walked on. He followed for about 20 seconds calling out. Just keep walking and don't accept anything from strangers. It's not a dramatic scam — it's just a petty nuisance.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-010
(
  'par-cp-010', 'experiences',
  'Solo traveller', '31-35',
  $t$Shell game at Trocadéro — watched a tourist lose €50 in 2 minutes$t$,
  $c$I stood back and watched the shell game setup from a distance at Place du Trocadéro. The 'crowd' around the operator were clearly all in on it — they won repeatedly and loudly to draw genuine bystanders in. A tourist couple stepped forward and bet €50. Lost immediately. They bet again, twice, losing each time. The whole setup disappeared when a police officer appeared in the distance — entirely illegal. These are organised criminal groups, not street entertainers. Don't stop, don't watch, and especially don't bet.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-011
(
  'par-cp-011', 'experiences',
  'Solo traveller', '31-35',
  $t$Street artist forced a portrait on me in Montmartre$t$,
  $c$I was looking at the square artists near Place du Tertre when one made eye contact and began sketching my face before I could say anything. Within 30 seconds he had a recognisable likeness and showed it to me demanding €80. When I said I hadn't asked for it and wouldn't pay, he got louder and stepped closer. I firmly said 'no' and walked towards a nearby group of tourists. He didn't follow. You do not have to pay for anything you didn't request. These artists rely on the social pressure of a created obligation. Walk away without engaging.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-012
(
  'par-cp-012', 'experiences',
  'Solo traveller', '41-50',
  $t$Christmas Day pickpocket on the Champs-Élysées$t$,
  $c$Even experienced travellers get caught. I was walking near the Tuileries on a Christmas Day when my wallet disappeared from my inner jacket pocket. The technique was an exceptionally skilled bump-and-extract — I felt nothing. The passport was back at the hotel (always leave it there). Immediately went to the police substation literally across the street from where it happened. The policewoman was efficient, gave me a full police report document in French and English within 30 minutes. Lesson: on the Champs-Élysées and any crowded Paris boulevard, keep nothing of value in any coat pocket — only money belt or front body-facing bag.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-013
(
  'par-cp-013', 'experiences',
  'Solo traveller', '26-30',
  $t$The Metro line you should worry about most in Paris$t$,
  $c$Line 1 and Line 4 are the highest-risk for pickpockets because they serve the most tourist sites. The absolute worst moment is boarding/alighting at Châtelet — one of the world's busiest interchanges and a known hotspot. My tactic: stay near the middle of the carriage away from doors, bag in front always, phone inside bag. If I have to use Châtelet, I wait for a less crowded train rather than squeezing on. The airport RER B is also high risk — overhead rack is never for anything valuable.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-014
(
  'par-cp-014', 'experiences',
  'Solo traveller', '31-35',
  $t$Unlicensed taxi from CDG charged me €180 — how to avoid this$t$,
  $c$First visit to Paris, arrived late, very tired. A man inside CDG arrivals held a sign and offered a taxi. He seemed professional. The ride to my hotel in the 7th arrondissement cost €180 on his 'fixed tourist rate.' The official metered flat rate from CDG to the Right or Left Bank is around €56. I paid 3x the legitimate rate. Now I only use the official Taxis Parisiens rank (vehicles with green/red illuminated roof signs) or I pre-book a G7 cab through the app before landing. Never accept a taxi offered by anyone approaching you inside the terminal.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-015
(
  'par-cp-015', 'experiences',
  'Solo traveller', '26-30',
  $t$The ketchup jacket scam — textbook execution on me near Notre Dame$t$,
  $c$Walking near Notre Dame, a splash of something red landed on my jacket sleeve. A young woman appeared immediately offering to help clean it and pulling out tissues. I started to thank her and take my bag off to find my own tissue — and then stopped because I'd literally just read about this exact scam. I said thank you, I'm fine, and walked away holding my bag. The 'ketchup woman' didn't follow. If anything lands on you in Paris: grip your bag with both hands and move quickly to a public space before doing anything else.$c$,
  'paris-france', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Sub-part 4: par-cp-016 to par-cp-030) ───────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- par-cp-016
(
  'par-cp-016', 'experiences',
  'Solo traveller', '51-60',
  $t$10 days solo Paris as a woman in my 50s — everything was fine$t$,
  $c$I visited Paris seven times over 30 years, most recently in autumn 2025. I've been there in my 20s, 30s, and now 50s. Every time I travelled mostly solo. My experience: the city is safe for women who apply basic common sense. I've never been assaulted, seriously threatened, or truly in danger. I have been catcalled in Pigalle. I have had a pickpocket attempt that failed because my bag was secured. The fear is often worse than reality. Stay in tourist-adjacent residential areas (11th, 6th), blend in with local dress, keep valuables secured, and ignore anyone who approaches you unsolicited. Enjoy the city.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-017
(
  'par-cp-017', 'experiences',
  'Solo traveller', '22-25',
  $t$Fake ticket seller at the Eiffel Tower took €60 from my travel companion$t$,
  $c$My travel companion was approached near the base of the tower by a man offering to sell her two skip-the-queue tickets at €30 each. She paid. The tickets were obvious fakes — wrong font, no QR code. The seller was gone within 60 seconds. All Eiffel Tower tickets are sold online at ticket.toureiffel.paris or at the official cashier booth inside the site perimeter. Anyone selling you tickets on the pavement outside is a scammer. Book online at least a week in advance for popular dates.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-018
(
  'par-cp-018', 'experiences',
  'Solo traveller', '36-40',
  $t$The Paris arrondissement you should stay in as a solo woman$t$,
  $c$After 7 visits to Paris I've stayed everywhere from the 1st to the 20th. My recommendations for solo female travellers: the 6th (Saint-Germain) is safe, beautiful, has 24h cafés and a Metro stop nearby. The 11th (Bastille) is lively, local, genuinely safe at night and cheaper. The 7th is quiet, expensive, but extremely safe. Areas I'd avoid for solo female stays on a first trip: directly in Pigalle/18th near the clubs, and anywhere immediately around Gare du Nord. The 18th higher up (near Montmartre hill and the restaurants on Rue Lepic) is perfectly fine.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-019
(
  'par-cp-019', 'experiences',
  'Solo traveller', '26-30',
  $t$The Metro harassment alarm actually worked$t$,
  $c$Late evening, Metro line 4 returning from a dinner. A man sat next to me despite empty seats and was uncomfortably close and making quiet comments. I stood up, moved to the middle of the carriage, and when he followed I activated the emergency contact button by the door. An announcement came through the speaker and he moved away immediately. The alarms are real and they work. Love and Paris guide specifically mentions these are on both carriage doors and on platforms — marked clearly. Don't be hesitant to use them if you feel unsafe.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-020
(
  'par-cp-020', 'experiences',
  'Solo traveller', '41-50',
  $t$I blended in and had zero problems — here's my approach$t$,
  $c$I'm a frequent solo Paris visitor. My method: I dress like a Parisian woman — a scarf, fitted clothes, no sweatpants or yoga pants, no visible backpacker gear. I carry a small Longchamp tote (common in Paris) rather than a hiking backpack. I don't have a selfie stick. I'm regularly spoken to in French by locals. I have never been pickpocketed or targeted by a scammer in Paris. Am I just lucky? Maybe partly. But fitting in visually and not looking like a distracted tourist genuinely makes you a lower-priority target than the crowd around the Mona Lisa with their phones out and bags swinging.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-021
(
  'par-cp-021', 'experiences',
  'Solo traveller', '31-35',
  $t$The petition scam is more aggressive than you expect$t$,
  $c$The online guides make it sound like you just say no and they leave. That wasn't my experience at Notre Dame. A group of four women with clipboards almost surrounded me and one grabbed my arm to stop me walking. I said 'non' firmly and loud enough to attract glances from other tourists, which caused them to back off. The key point from my experience: if you stop even for a second, they interpret it as engagement and it escalates. Never stop, never look at the clipboard, never acknowledge they exist. Walk at normal pace saying 'non' once without breaking stride.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-022
(
  'par-cp-022', 'experiences',
  'Solo traveller', '26-30',
  $t$Street harassment in Pigalle at night — manageable but not fun$t$,
  $c$I walked through Pigalle at about 11pm on my way back from Moulin Rouge area to my hotel. The catcalling was persistent from men standing outside certain establishments but none of them followed me or escalated when I ignored them completely. I didn't feel unsafe, but I was alert and I walked confidently and didn't look around or make eye contact. The advice to ignore completely and keep walking works in Paris for this kind of harassment — unlike some cities, aggressive engagement is not the norm here. That said, I took an Uber home the second night rather than walk through again.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-023
(
  'par-cp-023', 'experiences',
  'Solo traveller', '22-25',
  $t$Paris is genuinely dirty in parts — adjust expectations$t$,
  $c$One thing that surprised me from real traveller reviews: parts of Paris smell of urine, some areas are visibly grimy, and you will see homeless encampments, particularly near some train stations. This is real and not Instagram's version of Paris. It doesn't make those areas dangerous per se, but it can be unsettling if you're expecting the postcard city. The beautiful arrondissements exist but so does the reality of a large European city. Go in with open eyes and it's still incredible — just not a fairytale everywhere.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-024
(
  'par-cp-024', 'experiences',
  'Solo traveller', '36-40',
  $t$For arrivals: how to get from CDG to Paris safely and cheaply$t$,
  $c$Options from safest to cheapest: 1) Pre-booked Uber or G7 taxi: book before landing, driver meets you in arrivals, fixed price around €55. 2) Official Taxi Parisien from the designated rank (green/red roof light, meter must be running): roughly €56 flat rate to Right/Left Bank. 3) CDG Express train to Gare du Nord (€17, fast, reliable, less crowded than RER B). 4) RER B (cheap but KEEP BAGS SECURED, highest pickpocket risk especially with luggage). Never accept a private taxi offer from anyone approaching you inside the terminal.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-025
(
  'par-cp-025', 'experiences',
  'Solo traveller', '26-30',
  $t$Long solo walk from Marais to Bastille at night — felt fine$t$,
  $c$Walked about 45 minutes alone at night from the Marais through the 11th arrondissement to my hotel near Bastille. Stuck to well-lit main streets, had Google Maps running. Passed plenty of people out at restaurants and bars. Felt completely safe. Paris's central tourist arrondissements (1st, 3rd, 4th, 6th, 7th, 11th) are genuinely fine to walk at night as a woman if you stick to main roads and trust your instincts. It's the specific zones — Pigalle, Gare du Nord side streets, La Chapelle — that require more thought.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-026
(
  'par-cp-026', 'experiences',
  'Solo traveller', '26-30',
  $t$Fake overpriced café near Eiffel Tower — simple lesson$t$,
  $c$Ordered two café crèmes at a café directly across from the Eiffel Tower. €16. I paid without checking because I was tired. Later in the same day, an identical café crème two streets away in the 15th: €2.80. Nothing about the Eiffel Tower-facing café was illegal, but it's a tourist pricing trap that feels like a scam. Look at the menu before sitting. If it's in English, has photos, and faces directly onto a landmark — add 200% to the price you'd pay around the corner.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-027
(
  'par-cp-027', 'experiences',
  'Solo traveller', '22-25',
  $t$Hostel stay in Pigalle — loved the accommodation, cautious outside$t$,
  $c$Stayed at a hostel near Pigalle (good reviews, mixed dorms with lockers, completely safe inside). The hostel itself was great. The area directly outside at night was a different matter — the red light elements and associated harassment on the immediate block. My approach: walked purposefully in and out without lingering, used Uber for getting home after 10pm rather than walking through. The hostel warden was helpful about which streets to use. It was fine — I'd just be aware of what Pigalle is and plan accordingly.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-028
(
  'par-cp-028', 'experiences',
  'Solo traveller', '36-40',
  $t$Emergency info every solo female should have before entering Paris$t$,
  $c$Emergency (police, fire, ambulance): 112. Police (non-emergency): 17. Brigade des Touristes (tourist police in Paris, English speaking): located at 8 Boulevard du Palais, Île de la Cité, 1st arrondissement. For insurance claims after theft: you need a Commissariat de Police report. The nearest commissariat to your location can be found on police.fr. Your embassy is the critical contact if your passport is stolen. For Metro emergencies: red alarm handles are near every carriage door and on platforms.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-029
(
  'par-cp-029', 'experiences',
  'Solo traveller', '31-35',
  $t$Group petition ambush at Sacré-Cœur steps$t$,
  $c$Made the mistake of stopping to look at my map on the Sacré-Cœur steps. Within 10 seconds three women with clipboards were around me. One had a hand on my shoulder 'helpfully' looking at my map while another pushed a clipboard in my face. I felt a tug on my bag zip — caught the hand on it. I shouted 'stop' in English and French and the group scattered. My wallet and phone were still in front pockets (I'd been careful). This was the most direct and frightening scam encounter of my Paris trip. Never stop on those steps to look at your phone or map.$c$,
  'paris-france', '[]', 'approved'
),

-- par-cp-030
(
  'par-cp-030', 'experiences',
  'Solo traveller', '26-30',
  $t$Paris in summer as a solo woman — volume of tourists actually helps$t$,
  $c$Counterintuitive opinion: the extreme summer crowds in Paris (July-August) actually made me feel safer as a solo woman. There were so many people at every tourist site that I was never isolated. The streets around major attractions were busy till late. The flip side is that those same crowds create perfect pickpocket conditions. My approach for summer Paris: go to the big sites first thing in the morning when crowds are manageable and pickpockets haven't deployed yet. Eiffel Tower at 9am is transformed compared to 2pm. You feel safer and it's actually enjoyable.$c$,
  'paris-france', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── End of Paris seed (32 beware reports + 30 community posts). ──────────────

-- =====================================================================
-- ─── from 037_udaipur_seed_beware_community.sql
-- =====================================================================
-- 037_udaipur_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Udaipur, India.
-- 16 beware reports + 50 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS (Sub-part 1: all 16 entries) ──────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- udp-bw-001: Auto/rickshaw broken-meter overcharging
(
  'udaipur-india', 'Udaipur', 'Transport',
  $t$Auto/Rickshaw Broken-Meter Overcharging$t$,
  'high',
  $d$A very widely reported issue. Drivers claim the meter is broken or tampered, then quote flat rates far above actual fare — especially for tourists arriving at Udaipur City Railway Station or Dabok Airport. Drivers may also take deliberately longer routes to run up the charge. Solo women are frequently targeted with inflated quotes. Always agree on a fixed fare before boarding, check the route on Google Maps in real time, or use Ola/Uber for transparent pricing.$d$,
  'Web research',
  'Udaipur City Railway Station, Dabok Airport, city-wide',
  '[]', 'approved'
),

-- udp-bw-002: Fake pashmina/cashmere scam near Lake Pichola
(
  'udaipur-india', 'Udaipur', 'Shopping',
  $t$Fake Pashmina / Cashmere Scam Near Lake Pichola$t$,
  'high',
  $d$A long-running scam documented repeatedly in TripAdvisor forums. A well-dressed, charming young man approaches tourists near the lake — between the City Palace and the footbridge — and strikes up a friendly conversation, often referencing a cultural exhibition in Birmingham, Amsterdam, or another city you happen to be from. He then steers you to a shop to view his 'teacher's' or 'grandmother's' work — shawls and scarves falsely sold as real cashmere/pashmina at luxury prices. The goods are synthetic. Do not follow strangers to shops, no matter how believable the story.$d$,
  'Web research',
  'Lake Pichola lakefront, between City Palace and the footbridge',
  '[]', 'approved'
),

-- udp-bw-003: Fake guide overcharging at City Palace
(
  'udaipur-india', 'Udaipur', 'Tours & Guides',
  $t$Fake Guide Overcharging at City Palace & Major Monuments$t$,
  'high',
  $d$Unlicensed guides position themselves at the entrance of the City Palace, Jagdish Temple, and other high-traffic monuments. They initially sound professional and may quote a reasonable price, but demand significantly more at the end of the tour, or lead visitors to commission-paying souvenir shops. Hire guides only from official ticket counters at the monument — licensed guides are registered and prices are posted.$d$,
  'Web research',
  'City Palace entrance, Jagdish Temple, Sajjangarh Fort',
  '[]', 'approved'
),

-- udp-bw-004: Boat ride overcharging on Lake Pichola
(
  'udaipur-india', 'Udaipur', 'Activities',
  $t$Boat Ride Overcharging & Route Misrepresentation on Lake Pichola$t$,
  'medium',
  $d$Operators on the ghats quote prices multiple times higher than the official RTDC rate, misrepresent the duration of the ride, or claim the route includes the Jag Mandir island when it does not. Solo women are sometimes pressured aggressively. The official RTDC boat service operates from Rameshwar Ghat with fixed government rates displayed on the board. Always use the official counter.$d$,
  'Web research',
  'Lake Pichola ghats, Rameshwar Ghat area',
  '[]', 'approved'
),

-- udp-bw-005: Hotel 'lake view' false advertising + hidden charges
(
  'udaipur-india', 'Udaipur', 'Accommodation',
  $t$Hotel 'Lake View' False Advertising & Hidden Charges$t$,
  'medium',
  $d$Smaller budget guesthouses near Lal Ghat advertise 'lake view' rooms online that, in reality, face a wall or alley. Additionally, some properties add on hidden charges at checkout — described as mandatory cleaning fees, Wi-Fi charges, or 'tourist levies' not mentioned at check-in. Some hotels switch guests to inferior rooms at arrival, citing overbooking. Always confirm the exact room type in writing before paying, check recent reviews, and photograph your room immediately upon arrival.$d$,
  'Web research',
  'Lal Ghat area, budget guesthouses around Gangaur Ghat',
  '[]', 'approved'
),

-- udp-bw-006: Commission-based shop diversion by drivers
(
  'udaipur-india', 'Udaipur', 'Transport / Shopping',
  $t$Commission-Based Shop Diversion by Rickshaw / Taxi Drivers$t$,
  'medium',
  $d$A driver agrees to take you to your destination, then takes a detour claiming the road is closed or under construction, or suggests a 'special government-run emporium' or 'factory sale' on the way. Drivers earn a commission from every tourist they bring in. Politely but firmly decline any detour not on your route. Use Ola/Uber so the route is locked into the app.$d$,
  'Web research',
  'City-wide; commonly on routes between railway station and Lal Ghat',
  '[]', 'approved'
),

-- udp-bw-007: Inflated prices based on tourist appearance
(
  'udaipur-india', 'Udaipur', 'Shopping',
  $t$Inflated Prices Based on Tourist Appearance$t$,
  'medium',
  $d$Vendors in Hathi Pole Bazaar and street stalls near the City Palace adjust their starting price based on perceived tourist wealth — particularly based on clothing. One solo female blogger explicitly documented in Udaipur that quoted prices were roughly double on days she wore a dress versus backpacker clothes. Dress modestly and simply when shopping, ask the price before picking up an item, and always cross-check rates before bargaining.$d$,
  'Web research',
  'Hathi Pole Bazaar, street stalls near City Palace and Jagdish Temple',
  '[]', 'approved'
),

-- udp-bw-008: Temple donation pressure
(
  'udaipur-india', 'Udaipur', 'Religion / Temples',
  $t$Temple Donation Pressure & Religious Scams$t$,
  'medium',
  $d$At Jagdish Temple and smaller shrines, individuals claiming to be priests or temple assistants pressure visitors to pay large sums for special pujas or make donations to 'the temple fund'. The amounts requested can be 10–20x a realistic donation. Authentic pujas at Jagdish Temple have modest, posted costs. Simply decline and walk away — actual priests will not pursue you.$d$,
  'Web research',
  'Jagdish Temple, smaller roadside shrines near the old city',
  '[]', 'approved'
),

-- udp-bw-009: Fake cultural show tickets
(
  'udaipur-india', 'Udaipur', 'Entertainment',
  $t$Fake Cultural Show Tickets Sold by Touts$t$,
  'medium',
  $d$Street touts near Gangaur Ghat and outside Bagore ki Haveli sell tickets to cultural dance performances at inflated prices — sometimes claiming the show is nearly sold out or offering fake VIP upgrades. In some reported cases the show was far shorter and lower quality than advertised. Buy tickets only directly from Bagore ki Haveli's official counter or from your hotel.$d$,
  'Web research',
  'Gangaur Ghat area, outside Bagore ki Haveli',
  '[]', 'approved'
),

-- udp-bw-010: Pickpocketing in crowded markets
(
  'udaipur-india', 'Udaipur', 'Petty Crime',
  $t$Pickpocketing in Crowded Market Areas$t$,
  'medium',
  $d$Pickpocketing is reported at busy market areas and crowded ghats, particularly during peak season (Oct–March) and during festivals like Holi. Avoid carrying all cash in one pocket, use a money belt or inner pocket, and be aware of people who bump into you or ask for directions as a distraction. Keep bags zipped and in front of you.$d$,
  'Web research',
  'Hathi Pole Bazaar, Ghanta Ghar (Clock Tower) market, Lal Ghat ghats',
  '[]', 'approved'
),

-- udp-bw-011: Fake train ticket offices near station
(
  'udaipur-india', 'Udaipur', 'Transport',
  $t$Fake Train Ticket Offices Near Udaipur City Station$t$,
  'high',
  $d$Unofficial travel agents near Udaipur City railway station display official-looking boards offering train booking services. They charge a hefty commission and in some cases issue fake or unconfirmed tickets. Book all train tickets directly through the IRCTC app or website, or at the official reservation counter inside the station (Counter No. 1 is frequently recommended for foreign tourist quota).$d$,
  'Web research',
  'Udaipur City Railway Station surroundings',
  '[]', 'approved'
),

-- udp-bw-012: Currency note-swapping at street stalls
(
  'udaipur-india', 'Udaipur', 'Financial',
  $t$Currency Note-Swapping at Street Stalls$t$,
  'medium',
  $d$When paying with a ₹500 or ₹2000 note at small stalls or auto-rickshaw rides, some vendors quickly swap your note for a torn/fake one and claim you gave it to them. Always pay with smaller denominations, watch the cashier count your change, and take the note back to inspect it before the vendor can switch it.$d$,
  'Web research',
  'Street markets, auto-rickshaw fares, small food stalls city-wide',
  '[]', 'approved'
),

-- udp-bw-013: Charity / baby milk scam near temples
(
  'udaipur-india', 'Udaipur', 'Scam',
  $t$Charity / Baby Milk Scam Near Temples$t$,
  'low',
  $d$Women carrying infants approach tourists near temples and at Jagdish Chowk asking for money to buy baby milk or food. If you agree, they lead you to a specific shop where the item is wildly overpriced — the shop and the woman share the profit and the goods are often returned after you leave. If you want to help, donate to a registered NGO rather than purchasing items this way.$d$,
  'Web research',
  'Jagdish Temple area, Gangaur Ghat, City Palace entrance',
  '[]', 'approved'
),

-- udp-bw-014: Unwanted staring and persistent following by men
(
  'udaipur-india', 'Udaipur', 'Harassment',
  $t$Unwanted Staring and Persistent Following by Men$t$,
  'medium',
  $d$Multiple solo female travellers report intense and prolonged staring, especially in less-touristed alleys and at quieter ghats. Some report men following them at a distance for several minutes. This is more common in narrow old-city lanes after dark. Walk purposefully, avoid eye contact, and head toward busier streets or enter a café/shop. Udaipur is safer than most Indian cities for this issue but it is not entirely absent.$d$,
  'Web research',
  'Old city lanes, quieter ghats, Sajjangarh area at dusk',
  '[]', 'approved'
),

-- udp-bw-015: Unwanted selfie requests escalating to crowding
(
  'udaipur-india', 'Udaipur', 'Harassment',
  $t$Unwanted Selfie Requests Escalating to Crowding$t$,
  'medium',
  $d$Foreign women — particularly those with lighter skin or hair — report being approached for selfie requests repeatedly. Agreeing to one request frequently triggers a crowd of others wanting the same, which can become physically overwhelming. Groups of men, in particular, may use a selfie request as an excuse to get physically close. The recommended approach from experienced solo travellers: politely but firmly decline from the start and keep walking.$d$,
  'Web research',
  'City Palace plaza, Jagdish Temple steps, Saheliyon Ki Bari, Lake Pichola ghats',
  '[]', 'approved'
),

-- udp-bw-016: Racist comments toward Asian-presenting women
(
  'udaipur-india', 'Udaipur', 'Harassment',
  $t$Racist Comments Toward Asian-Presenting Women$t$,
  'low',
  $d$A traveller of Asian appearance reported being called 'Chinese' or 'Korean' without being asked, and encountering mocking imitations. This form of casual racism is documented in Udaipur and across Rajasthan, and while rarely physically threatening, it is distressing and worth being prepared for. Ignoring or giving a brief factual correction and moving on is generally effective.$d$,
  'Web research',
  'City-wide, especially tourist sites and markets',
  '[]', 'approved'
);

-- ─── COMMUNITY POSTS (Sub-part 2: udaipur-cp-001 to udaipur-cp-013) ──────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- udaipur-cp-001
(
  'udaipur-cp-001', 'experiences',
  'Solo traveller', '25-40',
  $t$Solo Holi in Udaipur — genuinely one of the best decisions I made$t$,
  $c$I had been warned off celebrating Holi anywhere in India as a solo woman — Pushkar and Varanasi have reputations for serious groping during the chaos of colours. I chose Udaipur instead after reading around, and I had a very positive experience. The vibe is more family-oriented, less predatory. Stayed in a hostel, met other travellers, joined a group for the lake celebrations. No incidents. Would repeat.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-002
(
  'udaipur-cp-002', 'experiences',
  'Solo traveller', '25-40',
  $t$The 'art exhibition' man near Lake Pichola is a classic scam — still active$t$,
  $c$Near the footbridge between the City Palace and Ambrai Ghat there's a charming, well-dressed man who approaches tourists and starts a friendly conversation. He says he's going to your country for an Indian cultural exhibition — he will name the city you're from — and asks if you'd like to see his elderly teacher's embroidery or pashmina work. We followed him, bought two scarves for a shocking amount. They were synthetic, not cashmere at all. Multiple people on TripAdvisor have reported the exact same setup over several years. The script changes (Birmingham, Amsterdam, Melbourne) but the scam is identical.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-003
(
  'udaipur-cp-003', 'experiences',
  'Solo traveller', '25-40',
  $t$What I wore determined what prices I was quoted — tested in Udaipur$t$,
  $c$On day one in Udaipur I was in torn backpacker elephant trousers and a sweaty t-shirt. On day two I wore a nice dress (last clean item). The prices I was quoted in the market were frequently double on the dress day. It's not a coincidence. Indian vendors adjust their opening price based on how wealthy you appear to be. If you're planning a serious shopping day in Hathi Pole Bazaar, wear your most beaten-up backpacker clothes.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-004
(
  'udaipur-cp-004', 'experiences',
  'Local resident', '25-40',
  $t$7 years living in Udaipur — here's the honest picture for solo women$t$,
  $c$I have lived here for 7 years and driven home alone at 2 am without worrying. There are crimes here, but not the kind that would make me feel unsafe as a woman. The local people of the Mewar region are genuinely helpful and kind. That said, don't be complacent — keep belongings secure, don't flash expensive items in crowded markets, and avoid dark isolated streets late at night. The tourist areas are well lit and police presence is visible.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-005
(
  'udaipur-cp-005', 'experiences',
  'Solo traveller', '25-40',
  $t$Auto meter was 'broken' — and GPS showed we were going the wrong way$t$,
  $c$Took an auto from the railway station to Lal Ghat. Driver said his meter wasn't working and quoted ₹200 for what should have been ₹60–80. When I followed on Google Maps, he was taking a longer route. I've had this multiple times in Udaipur. The fix: always agree the price before you get in, or use Ola. I now ask my guesthouse for a fair fare estimate before every trip so I know what I should be negotiating toward.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-006
(
  'udaipur-cp-006', 'experiences',
  'Solo traveller', '25-40',
  $t$Fake lake view room — what I booked vs what I got$t$,
  $c$Booked a guesthouse near Gangaur Ghat that was marketed online as having a lake view. Arrived to find the 'lake view room' overlooked a narrow alley with a partial sliver of water if you leaned out dangerously. When I complained they said 'all rooms are lake view' and refused any adjustment. At checkout there was an added 'mandatory cleaning charge' not mentioned at check-in. Always confirm the exact room and any additional charges in writing before paying a deposit.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-007
(
  'udaipur-cp-007', 'experiences',
  'Solo traveller', '25-40',
  $t$I stared back — and then I realised most staring is just curiosity$t$,
  $c$I have never been stared at more in my life than I was in India, including in Udaipur. At first it felt overwhelming. Then I realised it wasn't always negative — elderly people, children, families all stared. Once I started smiling or waving, most people smiled back. The intensity of staring that feels hostile in a Western context is often just curiosity. The staring that actually needs addressing is a man lingering near you after you've moved away — that is different and worth trusting your gut about.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-008
(
  'udaipur-cp-008', 'experiences',
  'Solo traveller', '25-40',
  $t$Selfie requests — say no from the start or it snowballs fast$t$,
  $c$As a foreign woman in Udaipur you will be asked for photos. If you agree to one person, it is a signal to everyone around that you're open to it. On a train in India I had a queue form. My approach: politely shake your head and keep walking. For groups of men specifically I always decline — it can become an excuse for physical closeness. If you do stop, keep a tight grip on your bag. The photo itself is usually harmless; the bag-touching that can accompany it sometimes isn't.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-009
(
  'udaipur-cp-009', 'experiences',
  'Solo traveller', '25-40',
  $t$Reached the ghat and felt a strange unease — took 15 minutes to figure out why$t$,
  $c$I stood at Ambrai Ghat and was suddenly hit by a deep unease — almost like a panic attack building. It took about 15 minutes to understand what was wrong: it was the silence. In a country as relentlessly loud as India, stumbling into a stretch where you could hear nothing at all was disorienting. Not unsafe at all — but deeply unfamiliar. Worth knowing: Udaipur has pockets of genuine quiet, especially around the ghats in the early morning, that can feel strange if you're used to Indian city noise.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-010
(
  'udaipur-cp-010', 'experiences',
  'Solo traveller', '25-40',
  $t$Dress code reality check — covering up genuinely changes how your day goes$t$,
  $c$I cover my shoulders and knees in Rajasthan, not because I think the world should work this way, but because it makes my days more comfortable. In India, legs attract significantly more attention than shoulders. As a feminist, I wish this were different. But when I'm solo, I prioritise practical safety over my frustration with the system. Wear loose-fitting kurtas over leggings. Carry a scarf. Reserve your own clothing choices for the rooftop café where you're among other travellers.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-011
(
  'udaipur-cp-011', 'experiences',
  'Solo traveller', '25-40',
  $t$Rickshaw driver wanted to add a passenger mid-journey — I said no$t$,
  $c$I'd read about this before arriving and it still almost caught me off guard. My rickshaw driver asked if he could 'quickly pick up his cousin' on the way. I declined firmly. This is a known tactic where an additional person enters the vehicle, creating a distraction, after which the driver takes a longer route or the fare is inflated. Once you decline, most drivers immediately back down. Saying 'no, go directly please' works.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-012
(
  'udaipur-cp-012', 'experiences',
  'Solo traveller', '25-40',
  $t$Had a safe trip overall — except for the casual racism about my appearance$t$,
  $c$Udaipur was one of my favourite stops in Rajasthan and I felt safe throughout. The one thing I wasn't prepared for was people calling me 'Chinese' or 'Korean' without asking — sometimes mockingly. I'm Southeast Asian. It wasn't threatening, but it was exhausting and happened multiple times daily. Worth being mentally prepared for if you're an Asian-presenting traveller. The city itself is genuinely welcoming and beautiful.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-013
(
  'udaipur-cp-013', 'experiences',
  'Solo traveller', '25-40',
  $t$How I used transport safely as a solo woman in Udaipur$t$,
  $c$I used Ola and Uber for every longer journey in Udaipur. Both apps allow trip-sharing with contacts and have SOS alerts. For short hops where I took an auto, I always asked my guesthouse what a fair fare was before stepping out. I never hailed a vehicle at night — I always booked via app or asked my accommodation to call a trusted driver. The difference in stress levels between app travel and street-hailed autos is enormous.$c$,
  'udaipur-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Sub-part 3: udaipur-cp-014 to udaipur-cp-026) ──────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- udaipur-cp-014
(
  'udaipur-cp-014', 'experiences',
  'Solo traveller', '25-40',
  $t$Official-looking train booking office near the station is NOT official$t$,
  $c$There are several travel agencies near Udaipur City railway station that display government-style signage and claim to be 'authorised IRCTC agents'. One quoted me prices with a ₹500 'processing fee' per ticket. Book only at the actual IRCTC counter inside the station (foreign tourist quota at window 1) or via the IRCTC Rail Connect app. If you genuinely need help from a local agent, get a recommendation from your guesthouse and check Google reviews first.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-015
(
  'udaipur-cp-015', 'experiences',
  'Solo traveller', '25-40',
  $t$Hathi Pole Bazaar shopping — what to know before you go$t$,
  $c$Loved this bazaar for block-printed fabrics and mojris (Rajasthani leather shoes). Key things: start with a very low counter-offer — vendors expect it. Do not show enthusiasm for an item before asking the price. The first price given to a foreign-looking tourist will often be 3–5x what a local pays. Walk away if they don't come down — they usually will. Bought beautiful things for fair prices once I got the rhythm. Also keep your bag zipped; it gets crowded.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-016
(
  'udaipur-cp-016', 'experiences',
  'Solo traveller', '25-40',
  $t$Trust your instinct — if something feels off in Udaipur, act on it$t$,
  $c$The most important piece of advice I can give for Udaipur or anywhere in India: trust your gut completely. If a situation, person, or place feels wrong, leave without explaining yourself. You do not owe anyone your time. The few genuinely uncomfortable moments I had in Udaipur were ones where I ignored an early instinct and stayed too long. The city is mostly safe and people are genuinely kind, but that makes it easier to second-guess your instincts. Don't.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-017
(
  'udaipur-cp-017', 'experiences',
  'Solo traveller', '25-40',
  $t$Bagore Ki Haveli cultural show — buy at the counter, not from touts$t$,
  $c$The evening cultural performance at Bagore ki Haveli is genuinely good — folk dance, puppetry, traditional music. Entry is around ₹90–120 at the official counter. I was approached by two different touts near Gangaur Ghat selling 'exclusive' tickets at ₹400 claiming the show was nearly sold out. Walked to the counter, bought directly, got in fine. There is almost never a sellout situation — the tout's 'urgency' is entirely manufactured.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-018
(
  'udaipur-cp-018', 'experiences',
  'Solo traveller', '25-40',
  $t$Staying near Lal Ghat as a solo woman — honest review$t$,
  $c$The Lal Ghat area is the most popular base for solo travellers and I'd recommend it for exactly that reason — it's busy, well-lit, and full of guesthouses and cafés that are used to solo women. The area around Jagdish Temple a short walk away is extremely busy until around 9pm. After 10pm the narrower lanes do quiet down significantly. I didn't walk alone through the old city lanes after 10pm and felt fine staying in. Dreamyard Hostel came up repeatedly in recommendations from other female travellers.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-019
(
  'udaipur-cp-019', 'experiences',
  'Solo traveller', '25-40',
  $t$Gem and jewellery commission trap — the driver took us there 'for free'$t$,
  $c$Our rickshaw driver offered to show us a 'government gem emporium' on the way back from City Palace, insisting it was on the route. It wasn't. The shop interior was polished and professional-looking with certificates framed on the wall — but everything was wildly overpriced and the 'gemstones' were suspect. The driver gets a commission for every tourist he delivers regardless of whether you buy. Always refuse shop diversions mid-journey, no matter how polished the pitch.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-020
(
  'udaipur-cp-020', 'experiences',
  'Solo traveller', '25-40',
  $t$Get a local SIM on day one — it changes everything for solo safety$t$,
  $c$I cannot overstate how much having a working data SIM improves safety as a solo woman in Udaipur. It lets you track your rickshaw route in real time, call Ola/Uber instead of flagging street vehicles, and quickly verify if a 'closed' attraction is actually open. Airtel has the best coverage in Udaipur. You can get a SIM at the airport in Jaipur or at any authorised Airtel/Jio shop in Udaipur with your passport. Takes about 30 minutes to activate.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-021
(
  'udaipur-cp-021', 'experiences',
  'Solo traveller', '25-40',
  $t$Friendly local 'artist' — sweet, harmless, but clearly commission-based$t$,
  $c$Outside a hostel near Lal Ghat I met a local artist who specialised in Rajasthani folk miniature paintings. He was genuinely lovely and knowledgeable, showed me his collection and explained the history. I bought one small piece I genuinely liked at what seemed a fair price. I later found out the price could have been lower, and that artists near hostels are sometimes part of a soft commission network with accommodation staff. Not a scam — but go in with eyes open. Enjoy the art; negotiate on price.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-022
(
  'udaipur-cp-022', 'experiences',
  'Solo traveller', '25-40',
  $t$Men who insist they have to walk you everywhere — how I handled it$t$,
  $c$A few times in Udaipur, men positioned themselves between me and a monument entrance, or started walking alongside me saying they were 'keeping me safe'. The approach that works: stop completely, face them, say 'Thank you, I'm fine' clearly and firmly, then wait — don't keep walking with them beside you. If they continue, step into a shop or café. These encounters rarely escalate; most men who do this are testing a social boundary rather than posing a genuine threat, but that doesn't mean you have to tolerate it.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-023
(
  'udaipur-cp-023', 'experiences',
  'Solo traveller', '25-40',
  $t$Rajasthan was the friendliest region I visited — Udaipur was a highlight$t$,
  $c$I spent 3 weeks solo in Rajasthan and Udaipur was without question the most relaxed I felt anywhere. The tourist circuit is well-worn, which means people are used to solo women and there's safety in numbers of travellers. Compared to Delhi or Agra, the level of unsolicited approach and aggressive tout behaviour is considerably lower. This is not a 'perfectly safe' destination — no destination is — but it is genuinely one of the better ones in India for solo women.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-024
(
  'udaipur-cp-024', 'experiences',
  'Solo traveller', '25-40',
  $t$Donate smart — skip the baby milk request near Jagdish Temple$t$,
  $c$At Jagdish Temple and on the roads approaching City Palace, women carrying infants regularly approach solo female tourists asking for money to buy milk. If you follow them to buy the milk, the shop charges an extraordinary markup and a portion of the profit goes back to the woman, with the goods returned after you leave. I understand the impulse to help — the babies are real. If you genuinely want to contribute, research NGOs working in Udaipur and donate through them.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-025
(
  'udaipur-cp-025', 'experiences',
  'Solo traveller', '25-40',
  $t$Udaipur is one of the best places in India to meet other solo travellers$t$,
  $c$If you're solo and want to find community, Udaipur consistently delivers. I met other solo women at rooftop cafés overlooking Lake Pichola, at the evening performance at Bagore ki Haveli, and at the hostel common areas. The city attracts a slower-travel crowd — people staying 4–7 days rather than passing through in one — so friendships have time to form. Walking in a loose group of travellers also substantially reduces the frequency of touts and unwanted attention.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-026
(
  'udaipur-cp-026', 'experiences',
  'Solo traveller', '25-40',
  $t$Always check Google Maps during your auto/rickshaw ride$t$,
  $c$This is non-negotiable for me in Udaipur. Not because I feared the driver, but for peace of mind. Twice my driver took a slightly longer route and I was able to point it out and ask them to correct. Most did so without any fuss. The presence of your phone showing a map also signals to the driver that you are aware and paying attention — which on its own often keeps the route honest.$c$,
  'udaipur-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Sub-part 4: udaipur-cp-027 to udaipur-cp-038) ──────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- udaipur-cp-027
(
  'udaipur-cp-027', 'experiences',
  'Solo traveller', '25-40',
  $t$Temple priest demanded ₹2,000 for a puja — the real price is ₹50$t$,
  $c$At a small Shiva temple near Lake Pichola a man dressed in saffron who claimed to be the head priest insisted I participate in a 'special blessing' and then demanded ₹2,000 at the end. The actual cost of a standard puja at this kind of temple is ₹30–100. When I offered ₹100 he became aggressive. I walked out. Authentic priests at well-maintained temples (like Jagdish) do not accost tourists at the entrance.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-028
(
  'udaipur-cp-028', 'experiences',
  'Solo traveller', '25-40',
  $t$Sunrise rooftop tour — genuinely amazing, genuinely safe$t$,
  $c$One of the best things I did in Udaipur was a sunrise rooftop tour arranged through Dreamyard Hostel. Started at 5:30am, walked through the waking old city, watched the sun rise over Lake Pichola. Because it was a small group with a known, hostel-vetted guide, there was zero stress about safety. If you're considering something like this independently, early morning Udaipur is actually very peaceful — chai stalls opening, temple bells, almost no tourist crowd. Just tell someone where you're going.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-029
(
  'udaipur-cp-029', 'experiences',
  'Solo traveller', '25-40',
  $t$Share your daily itinerary — even just with a hostel receptionist$t$,
  $c$Before every solo outing in Udaipur I told the hostel where I was going and roughly when I'd be back. This isn't paranoia — it's a 60-second habit that creates an accountability anchor. Most hostel staff take note genuinely. If you're in a private guesthouse, text your itinerary to someone at home. The city is safe, but that safety is partly maintained by the collective awareness that solo travellers are being looked out for.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-030
(
  'udaipur-cp-030', 'experiences',
  'Solo traveller', '25-40',
  $t$Boat ride on Lake Pichola — insist on the official RTDC counter$t$,
  $c$Three different men approached me within 100m of the ghat, each quoting different prices (₹500, ₹700, ₹800) for the same boat ride and all claiming to be 'official'. The actual government-run RTDC boat service from Rameshwar Ghat has fixed rates posted on a board — ₹400 per person for a shared ride including Jag Mandir landing, last time I went. It's a queue system. The boats are perfectly fine. Ignore all men who approach you on the path to the ghat.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-031
(
  'udaipur-cp-031', 'experiences',
  'Solo traveller', '25-40',
  $t$Use UPI / digital payment wherever possible to avoid note-swap scams$t$,
  $c$Google Pay and PhonePe are accepted at a surprisingly large number of Udaipur's smaller shops and even some street stalls. Using UPI completely eliminates the fake-note-swap and change-shortchanging scams. It also simplifies transactions in places where your language doesn't overlap. Set up an Indian UPI account linked to a forex-capable card, or carry mostly ₹100 notes rather than ₹500s to minimise exposure.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-032
(
  'udaipur-cp-032', 'experiences',
  'Solo traveller', '25-40',
  $t$Went to Sajjangarh Fort solo at dusk — felt uncomfortable on the road back$t$,
  $c$The fort itself is great — 360-degree view of Udaipur at golden hour is extraordinary. But the road back down after 6pm is poorly lit and very quiet, and I was the only tourist on it. Two men on a motorbike slowed down alongside me for about a minute before driving off. Nothing happened, but it was genuinely uncomfortable. Either arrange a return taxi to be waiting, or make sure you leave the fort in enough time to be back on the main road before dark.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-033
(
  'udaipur-cp-033', 'experiences',
  'Solo traveller', '25-40',
  $t$Late evening walk near Ambrai Ghat — fine until it wasn't$t$,
  $c$The stretch from Lal Ghat to Ambrai restaurant is beautiful at night, lit by the glow of the Lake Palace. I've walked it many times. The one time it felt off was at about 10:30pm when it had mostly emptied out and a group of young men were sitting along the wall and called out to me. Nothing escalated. But I walked back via the main road rather than continuing along the lake. The City Palace area is fine until about 9:30pm. The quieter stretches of the lake are best avoided solo after dark.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-034
(
  'udaipur-cp-034', 'experiences',
  'Web research', '25-40',
  $t$Know these emergency numbers before you arrive$t$,
  $c$National emergency: 112. Women's helpline (India): 1091. Tourist police helpline Rajasthan: 1800-180-6127. Udaipur City police: 0294-2527101. Download the Himmat+ app (Delhi Police) or use 112 India app for an SOS button that sends your location to emergency services. Also save your country's Indian embassy number in your phone before you travel.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-035
(
  'udaipur-cp-035', 'experiences',
  'Solo traveller', '25-40',
  $t$Udaipur for Holi — far better than I expected as a solo woman$t$,
  $c$I had been told to avoid Holi in India entirely as a solo female traveller. Pushkar and Varanasi came with particularly bad warnings about groping under the cover of colour powder. Udaipur was recommended as one of the safer options. My experience confirmed this. The celebrations were joyful, family-dominated, and genuinely inclusive. I stayed in a hostel and joined a group of mixed travellers. At no point did I feel targeted. The city's calmer, romantic character seems to carry over even into its Holi energy.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-036
(
  'udaipur-cp-036', 'experiences',
  'Solo traveller', '25-40',
  $t$Hotel added ₹800 of charges at checkout that weren't mentioned at check-in$t$,
  $c$A smaller guesthouse near Gangaur Ghat added a 'mandatory tourism surcharge' and a 'Wi-Fi fee' at checkout — neither mentioned at check-in or on any posted board. Total came to ₹800 extra on a ₹1,200/night room. When I disputed it they produced a laminated sheet of charges I hadn't been shown. I eventually paid half after a standoff. Now I always photograph the checkout bill itemisation and confirm verbally at check-in that the room rate is fully inclusive. Get it in writing if you can.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-037
(
  'udaipur-cp-037', 'experiences',
  'Web research', '25-40',
  $t$Honest safety rating: 3.7/5 — here's what that means in practice$t$,
  $c$TravelLadies.app ranks Udaipur #36 safest for solo female travellers in India with 3.7/5. That feels about right to me. It means: you can walk around comfortably during the day, rooftop dinners feel fine, the locals are genuinely hospitable, and you'll have a great time. It also means: don't walk quiet lanes alone after 10pm, use apps not street-hailed autos at night, and expect a handful of scam attempts and staring in any given day. Calibrate your expectations to that band and you'll leave with wonderful memories.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-038
(
  'udaipur-cp-038', 'experiences',
  'Solo traveller', '25-40',
  $t$Best and worst times to visit for solo women — festival season tips$t$,
  $c$Peak tourist season (October–March) means more tourists, which generally means more safety in numbers but also more scam activity since touts have a larger pool to target. Summer (April–June) is extremely hot but the tourist crowd thins dramatically — some solo women report feeling more exposed without the collective cover of crowds. Avoid visiting during large unstructured festivals if you're solo and new to India. Diwali in Udaipur is safe and beautiful. Holi is manageable with a hostel group.$c$,
  'udaipur-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Sub-part 5: udaipur-cp-039 to udaipur-cp-050) ──────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- udaipur-cp-039
(
  'udaipur-cp-039', 'experiences',
  'Solo traveller', '25-40',
  $t$Food scene is cheap, good, and generally safe — tips on eating safely$t$,
  $c$I ate almost entirely at small local restaurants and street stalls in Udaipur and had no stomach issues. Key: eat where there is high turnover and where food is cooked fresh in front of you. The rooftop cafés near Lal Ghat are tourist-priced but completely safe. The dal baati churma near the clock tower and kachori from morning stalls near Sukhadia Circle are exceptional and cheap. Avoid raw salads. Drink only bottled or filtered water. Most places aimed at tourists are meticulous about water because they know their reviews depend on it.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-040
(
  'udaipur-cp-040', 'experiences',
  'Solo traveller', '25-40',
  $t$How to hire a genuine licensed guide at City Palace$t$,
  $c$Do not accept guide offers from any person who approaches you outside the City Palace entrance — these are unlicensed touts. Once inside the ticket area, there is an official guide booth where licensed guides are registered and the price is fixed. Ask to see a guide's official Tourism Department of Rajasthan ID card before agreeing. A licensed guide for City Palace typically costs ₹300–500 for a 2-hour tour and provides excellent historical depth that unofficial guides simply cannot match.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-041
(
  'udaipur-cp-041', 'experiences',
  'Solo traveller', '25-40',
  $t$First visit, first day — everything felt overwhelming but I found my footing$t$,
  $c$My first hour in Udaipur was chaos — arriving by bus, navigating to my guesthouse with no working SIM, being approached by three different touts before I'd walked 100 metres. I nearly cried. By day two, I had the local rhythm. Start slow: check in, sit somewhere quiet with a chai, observe how things work before venturing further. Udaipur rewards patience. The city is genuinely beautiful and the majority of interactions are kind. That first hour does not represent the place.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-042
(
  'udaipur-cp-042', 'experiences',
  'Solo traveller', '25-40',
  $t$Saheliyon Ki Bari garden — peaceful, safe, recommended for solo women$t$,
  $c$One of my favourite spots in Udaipur and consistently felt very safe. It's a garden, so it's open and visible. Families and local couples visit in large numbers, which creates a protective social environment. Entry is low cost (around ₹50 for foreigners). No touts inside the garden. A genuinely restorative place when the old city starts to feel overwhelming.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-043
(
  'udaipur-cp-043', 'experiences',
  'Solo traveller', '25-40',
  $t$Fake reviews on booking platforms for Udaipur hotels — how to detect them$t$,
  $c$TripAdvisor forum users have noted that fake review manipulation is common across Rajasthan, with hotel owners calling guests to pressure them into deleting negative reviews or writing positive ones. When selecting accommodation, weight recent 1- and 2-star reviews heavily — they are harder to suppress. Look for reviews from solo female travellers specifically, as they flag issues (safety, lighting, room locks) that other reviews skip. Cross-reference on both Booking.com and TripAdvisor rather than relying on one platform.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-044
(
  'udaipur-cp-044', 'experiences',
  'Solo traveller', '25-40',
  $t$The headphone trick for managing unwanted attention$t$,
  $c$Wearing headphones — even without music playing — is a practical way to reduce the frequency of unsolicited conversation and touts. It signals you are unavailable for interaction without being rude. I used this heavily while walking through busy market areas in Udaipur. Combined with a purposeful walking pace and avoiding eye contact with men who are loitering, it significantly reduced the number of approaches I received.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-045
(
  'udaipur-cp-045', 'experiences',
  'Solo traveller', '25-40',
  $t$Night travel in an Ola from dinner back to guesthouse — felt completely safe$t$,
  $c$I ate dinner alone at a rooftop restaurant near City Palace several times at around 9–10pm and took Ola home each time. The app shows the driver's name, photo, and plate number in advance. You can share your trip live with a contact. The walk from my guesthouse to the Ola pickup point (30 seconds on a lit lane) was the only moment I ever felt mildly watchful at night. The actual ride always felt safe. App-based transport at night in Udaipur is a reliable, affordable tool for solo women.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-046
(
  'udaipur-cp-046', 'experiences',
  'Local resident', '25-40',
  $t$As a local woman: what worries me about tourism-driven harassment norms$t$,
  $c$I've lived in Udaipur for years and one thing that concerns me is how the tourism economy has created a class of men who see foreign women purely as transaction targets. Most local men are not like this. But the concentrated tourist areas around Lal Ghat have attracted people whose income depends on tourists, and some of that interaction is uncomfortable. This is not Udaipur's character — it is a small minority operating around a valuable economic zone. The solution is to move even slightly away from the absolute tourist core and the dynamic changes completely.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-047
(
  'udaipur-cp-047', 'experiences',
  'Solo traveller', '25-40',
  $t$Shilpgram artisan fair — genuinely good shopping with less pressure$t$,
  $c$The Shilpgram crafts village on the outskirts of Udaipur, near Lake Badi, is one of the better places to buy textiles, ceramics, and folk crafts. The artisans are genuine — many are government-registered — and while bargaining still happens, the hard-sell pressure of the old city markets is significantly lower. It's a 20-minute Ola from Lal Ghat. Well worth the trip, and a beautiful area to catch sunset from the lake bank afterwards.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-048
(
  'udaipur-cp-048', 'experiences',
  'Solo traveller', '25-40',
  $t$Spiritual side of Udaipur — visiting Ubeshwar Mahadev temple safely$t$,
  $c$Ubeshwar Mahadev on the city's outskirts is one of the most peaceful places I visited in Udaipur — a Shiva temple in the hills with almost no commercial tourism pressure. It's a local pilgrimage site, so the presence of local families creates a respectful, calm atmosphere. I went by Ola in the morning, spent an hour walking, and returned. No touts, no overcharging priests. A welcome contrast to the heavier commercialisation of the old city temples.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-049
(
  'udaipur-cp-049', 'experiences',
  'Web research', '25-40',
  $t$What to do if you're in an uncomfortable situation — a clear action plan$t$,
  $c$Step into any café, restaurant, or shop immediately — these are safe spaces. Ask staff directly: 'Can I wait here for a few minutes?' Most will say yes without question. If followed or surrounded outdoors, speak loudly and clearly in English — 'Please leave me alone' — which draws attention of nearby locals who will intervene. Do not run, as that can escalate. Dial 112 if you feel genuinely threatened. In tourist areas, police patrol is regular. Trust that the majority of bystanders will help if you make it clear you need it.$c$,
  'udaipur-india', '[]', 'approved'
),

-- udaipur-cp-050
(
  'udaipur-cp-050', 'experiences',
  'Solo traveller', '25-40',
  $t$Four days in Udaipur as a solo woman — my complete honest take$t$,
  $c$I arrived nervous and left transformed. Udaipur is absolutely worth visiting as a solo woman and is one of the more manageable Indian cities for a first India trip. The scams are real but mostly financial rather than physical — overpriced autos, pushy vendors, hotel tricks. The harassment exists but is mostly low-level: staring, selfie requests, touts. Violent crime is not a feature of daily tourist life here. What I'll remember: the sunset from a rooftop over Lake Pichola, the folk music echoing across the water at Bagore ki Haveli, the kindness of the family who ran my guesthouse, and the complete absurdity of a man trying to sell me a 'government-certified sapphire' from a plastic bag. Come prepared, come curious, and come with your instincts switched on.$c$,
  'udaipur-india', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── End of Udaipur seed (16 beware reports + 50 community posts). ────────────

-- =====================================================================
-- ─── from 038_spiti_seed_beware_community.sql
-- =====================================================================
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

-- =====================================================================
-- ─── from 039_seoul_seed_beware_community.sql
-- =====================================================================
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

-- ─── COMMUNITY POSTS (Part 6: seoul-cp-008 to seoul-cp-013) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- seoul-cp-008
(
  'seoul-cp-008', 'experiences',
  'Solo traveller', '31-38',
  $t$The 'someone approaching you on the street' rule$t$,
  $c$This is the most useful cultural context for safety in Seoul: Koreans culturally do not approach strangers in the street. It is not done. If a stranger — however friendly, however young and non-threatening looking — approaches you unprompted in a tourist area and starts a conversation, be cautious. This is almost always a scam or a cult recruitment approach. Friendly Korean people absolutely exist, but they're more likely to help you if you approach them (ask for directions, etc.) than to initiate. This rule has saved me from two separate 'ceremony' scam attempts.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-009
(
  'seoul-cp-009', 'experiences',
  'Solo traveller', '26-33',
  $t$Forgot my phone in a public restroom for an hour — it was still there$t$,
  $c$Genuinely left my phone on the sink in a busy Myeongdong cafe bathroom and only noticed an hour later. It was still sitting on the sink. The staffer had set it to the side. In Seoul, lost items are routinely returned. Koreans told me the mindset is: 'Why would I take something that isn't mine?' It's backed by 75,000+ CCTVs everywhere but also genuine cultural values. This is a city where cafe-goers leave MacBooks on tables to hold their seats when they go to the bathroom. Genuinely remarkable safety culture.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-010
(
  'seoul-cp-010', 'experiences',
  'Solo traveller', '22-27',
  $t$My phone was stolen at a Hongdae nightclub — the exception that proves the rule$t$,
  $c$Seoul is safe but NOT scam-proof or theft-proof. I had my phone stolen from my jacket pocket in a packed nightclub in Hongdae. It happened during a particularly crowded moment near the bar. This is unusual for Seoul (even locals were surprised when I told them) but it does happen. Lesson: in nightclubs specifically, keep valuables in a zipped front pocket or leave them at accommodation. The club had CCTV but it wasn't sufficient to identify the thief. Phone insurance and having backup cloud photos saved me.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-011
(
  'seoul-cp-011', 'experiences',
  'Solo traveller', '33-40',
  $t$Old Korean women ('harabeoji' scam) — quick identification$t$,
  $c$The spiritual ceremony scam often starts with an older woman approaching you, asking about deceased relatives. If you say a family member has recently passed, the next line is usually about their soul not being at rest. Do not engage. The respectful but clear response is to shake your head, say '괜찮아요' (gwaenchanhayo = I'm fine / no thank you) and keep walking. They will not chase you. If a second person joins the conversation, leave immediately. The scam relies on emotional vulnerability and social pressure — cut it at the first contact.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-012
(
  'seoul-cp-012', 'experiences',
  'Solo traveller', '25-31',
  $t$Solo female — 3 days, walked everywhere alone, zero issues$t$,
  $c$Arrived nervous after reading forums. Left wanting to move here. Took the AREX express from Incheon airport — clean, fast, cheap. Bought a T-Money card at the station. Ate alone at convenience stores, sat in cafes for hours, wandered through Bukchon at 10pm. Nobody bothered me. Some older Korean men gave slightly disapproving looks when I was eating alone ('honbap') but younger Koreans didn't bat an eye — honbap culture is completely normalised for women here. The subway English signage is genuinely excellent. Best city I've solo-travelled in Asia.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-013
(
  'seoul-cp-013', 'experiences',
  'Solo traveller', '28-35',
  $t$Checking your hotel room for molka — a practical guide$t$,
  $c$Inspect on arrival: (1) Look for any items that seem newer, shinier, or slightly out of place on walls — coat hooks, smoke detectors, air fresheners, clocks. (2) Turn off the room lights and shine your phone torch slowly around the room — camera lenses reflect in a distinctive way. (3) Check the bathroom: behind the door hinge area, coat hook, any fixture above the toilet. (4) Use a free RF signal detector app on your phone (imperfect but useful). If anything seems wrong, ask to change rooms. Report to hotel management and police (112) if you find an actual device. Stay in higher-rated, reputable accommodation — budget guesthouses in less regulated areas carry higher risk.$c$,
  'seoul-south-korea', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Part 7: seoul-cp-014 to seoul-cp-019) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- seoul-cp-014
(
  'seoul-cp-014', 'experiences',
  'Solo traveller', '24-30',
  $t$Myeongdong picked pocket — real experience$t$,
  $c$Was walking the main pedestrian strip in Myeongdong around 7pm, peak tourist hour. Someone handed me a flyer — I automatically reached out to take it. By the time I'd declined and turned back, my crossbody bag zip was open. My wallet was gone. I had roughly ₩50,000 in it plus a travel card. I made a police report at the Myeongdong police box — the officer was efficient and gave me a formal report number for insurance. Seoul's lost item recovery rate is high for items left behind, but pickpocketing cases are hard to resolve without footage. Keep your bag zip facing forward in Myeongdong.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-015
(
  'seoul-cp-015', 'experiences',
  'Solo traveller', '27-33',
  $t$Cover your shoulders at some venues — dress code awareness$t$,
  $c$Seoul fashion leans conservative for tops despite being liberal about skirt length. I got turned away from a rooftop bar in Itaewon because I was wearing a strapless top — they lent me a cover-up to enter. A few traditional restaurants and some hanok guesthouses have similar informal policies. Short skirts are fine everywhere. But bare shoulders or low-cut tops draw stares from older Koreans and may restrict entry at certain venues. A light cardigan in your bag solves this entirely.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-016
(
  'seoul-cp-016', 'experiences',
  'Solo traveller', '29-36',
  $t$The 1330 hotline saved my trip — got sick, didn't speak Korean$t$,
  $c$Had a bad stomach reaction on day 3 and needed to find a pharmacy open at 11pm. Called 1330 (Korea Tourism Hotline). The English-speaking operator found me the nearest 24h pharmacy (two streets from my accommodation), told me what Korean words to show the pharmacist for my symptoms, and stayed on the line while I confirmed the right medication. They can also connect you to 112 or 119 in an emergency with interpretation. Save this number before you fly.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-017
(
  'seoul-cp-017', 'experiences',
  'Solo traveller', '22-28',
  $t$Don't use Google Maps in Seoul — it genuinely doesn't work$t$,
  $c$Spent my first afternoon completely lost because I was relying on Google Maps. South Korean law restricts mapping data sharing with foreign companies, so Google Maps has no detailed routing data for Korea. It showed me streets but couldn't give accurate walking directions or subway routes. Download KakaoMap before you arrive — it gives you exact subway lines, which car to board for the best exit position, and accurate walking times. Game-changer for Seoul navigation.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-018
(
  'seoul-cp-018', 'experiences',
  'Solo traveller', '28-35',
  $t$Itaewon at night — better than I expected, one thing to watch$t$,
  $c$Itaewon has a rougher reputation but I found it fine at 11pm on a Tuesday. The issues are concentrated on weekends past midnight when the bars empty. The thing to watch: unofficial taxis that cluster near the main Itaewon station exit after midnight. They'll call out fares to you — always ignore these and use KakaoT. Also: some international foods and drinks in Itaewon are dramatically overpriced at tourist-focused venues — check prices before ordering.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-019
(
  'seoul-cp-019', 'experiences',
  'Solo traveller', '24-30',
  $t$Women-only dorm hostels in Seoul — genuinely good$t$,
  $c$Stayed at a women-only floor at a Hongdae hostel. Secure keycard access to the floor, lockers in the room, clean shared bathrooms. Met other solo female travellers from Europe, Southeast Asia, and the US — made friends for the rest of my Seoul week. The female-only hostel environment in Seoul is significantly better than equivalent options in South/Southeast Asia. Prices from ₩25,000–₩40,000/night for a dorm bed in a women-only setup. Miss Hongdae Guesthouse and several others specifically offer female-only configurations. Book early — they fill up in spring cherry blossom season.$c$,
  'seoul-south-korea', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ─── COMMUNITY POSTS (Part 8: seoul-cp-020 to seoul-cp-025) ──────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- seoul-cp-020
(
  'seoul-cp-020', 'experiences',
  'Solo traveller', '26-32',
  $t$Koreans asked for a selfie with me — a cultural note$t$,
  $c$As a non-Asian solo female traveller, I was asked for selfies by Korean families at palaces 3–4 times. It's purely curiosity, never threatening, and always done politely with a question gesture. You can smile and say yes or shake your head and they immediately respect it. It's slightly jarring if you're not used to it but genuinely harmless. Actually ended up having lovely brief conversations with families at Gyeongbokgung Palace who spoke some English. Cultural curiosity goes both ways.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-021
(
  'seoul-cp-021', 'experiences',
  'Solo traveller', '32-39',
  $t$Fake tour package — shopping stops not in the itinerary$t$,
  $c$Booked what seemed like a reasonable day tour of Bukchon and Insadong for ₩35,000. Three 'optional shopping stops' were added en route at ginseng, cosmetics, and ceramics stores — none of which were in the description. The guide was under pressure from operators to take us to these commission-earning shops. Spent 40 minutes of a 6-hour tour in shops I didn't want to visit. Book tours through official Korea Tourism Organization-registered operators. Seoul's Tourist Issue Assistance Centre will receive formal complaints about this practice (their number is in the Seoul city government website).$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-022
(
  'seoul-cp-022', 'experiences',
  'Solo traveller', '29-36',
  $t$Six months in Seoul — the molka issue is real and unsettling$t$,
  $c$Lived in Seoul for 6 months (remote work). After the first month I stopped actively checking public bathrooms because it was too psychologically exhausting. But two of my Korean female colleagues described a constant low-level anxiety about being filmed in any private situation. One described the feeling: 'I can never fully relax in a public changing room or toilet.' The government has increased enforcement but the issue persists. For travellers: budget accommodation in less-regulated areas carries higher risk than established hotels. The palace and major tourist site bathrooms now have detection equipment installed.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-023
(
  'seoul-cp-023', 'experiences',
  'Solo traveller', '27-34',
  $t$Emergency safe spaces in Seoul — 24h convenience stores$t$,
  $c$CU, GS25, 7-Eleven, and emart24 convenience stores are on virtually every street in Seoul and are open 24 hours, always staffed. If you feel followed, threatened, or just uneasy at night — walk into one. Staff cannot legally refuse you sanctuary. Korean police response time in central Seoul is fast. You can call 112 from inside the store. This is not a theoretical tip — Korean women themselves use convenience stores as safe spaces late at night. The density of stores in Seoul means you are rarely more than 60 seconds from one.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-024
(
  'seoul-cp-024', 'experiences',
  'Solo traveller', '30-37',
  $t$Insadong and Ikseon-dong at night — best solo walk in the city$t$,
  $c$Spent two evenings just wandering through Insadong and the alleys of Ikseon-dong alone from about 8pm to 11pm. Both areas are filled with quirky decoration, music, cafes, and street performers. Felt completely safe. Ikseon-dong in particular has this incredible feeling of being in a preserved historical alleyway filled with candles and small wine bars. Zero unwanted attention. A 25-minute walk from Jongno 3-ga station. This is the best recommendation I have for solo women wanting a beautiful evening in Seoul without the nightlife pressure of Hongdae.$c$,
  'seoul-south-korea', '[]', 'approved'
),

-- seoul-cp-025
(
  'seoul-cp-025', 'experiences',
  'Solo traveller', '31-38',
  $t$Political demonstrations — avoid but don't panic$t$,
  $c$In late 2024 and early 2025, Seoul saw significant political protests following President Yoon's impeachment. For travellers: most protests are peaceful and concentrated near Gwanghwamun Plaza and the National Assembly. They are not dangerous in the typical sense but can cause major street closures and make transit difficult. If you're visiting during a period of political activity, download the Korean government's Emergency Ready app for alerts, stay informed via The Korea Herald (English), and plan alternate routes around Gwanghwamun on protest days.$c$,
  'seoul-south-korea', '[]', 'approved'
)
ON CONFLICT (id) DO NOTHING;

-- ── End of Seoul seed (12 beware reports + 25 community posts). ──────────────
