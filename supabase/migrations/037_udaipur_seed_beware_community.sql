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

-- ── Sub-part 1 of 5 complete (all 16 Udaipur beware reports). ────────────────
-- ── Community posts (sub-parts 2–5) append below. ────────────────────────────
