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

-- ── Part 2 of 3 for Bangkok beware reports complete (entries 26–51). ──────────
-- ── Part 3 (community posts) appends below. ──────────────────────────────────
