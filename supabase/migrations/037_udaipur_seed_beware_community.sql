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

-- ── Sub-part 3 of 5 complete (community posts udaipur-cp-014 to 026). ────────
-- ── Sub-parts 4–5 (cp-027 to cp-050) append below. ───────────────────────────
