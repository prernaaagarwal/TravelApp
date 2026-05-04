-- 032_varanasi_seed_beware_community.sql
-- Web-research-sourced safety + experience seed for Varanasi.
-- 13 beware reports + 5 community experience posts, all status='approved'.
-- reported_by_id / author_id are NULL (research-sourced, not user-submitted).
-- Source = "Web research" — surfaces with that label on platform.
-- Run in Supabase SQL Editor.

-- ─── BEWARE REPORTS ───────────────────────────────────────────────────────────

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, status)
VALUES

-- vns-bw-001: Boat overcharge at ghats
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Boat overcharge at ghats — quoted ₹500–1,000 for a ₹200 ride$t$,
  'high',
  $d$Boatmen at Dashashwamedh, Manikarnika, and Assi ghats routinely quote ₹500–1,000 for boat rides that cost ₹200–300. Tactics include: quoting per-person rates without disclosing this upfront, adding mid-ride charges for "extra ghats", taking shortened routes and demanding full price, and claiming "special ceremony access" that doesn't exist. No fixed price boards exist at most ghats, making this the single most common financial scam in Varanasi. Shared sunrise boats from locals should cost around ₹50–100 per person.

What to do: Agree on total price, exact route, duration, and whether it's per-person or for the whole boat — before stepping in. Get it confirmed verbally in front of a witness. For sunrise shared boats, ₹50–100 per person is fair. Private boat for 1 hour: ₹300–500. Never board with a boatman who approaches you on the steps — walk to the official ghat booth or use a pre-booked operator. If overcharged mid-ride, calmly note the bank and photograph the boat registration number.

Season note: Year-round. Monsoon (Jul–Aug) — boats may be officially suspended when Ganga rises above danger mark. Any boatman still offering rides during official suspension is operating illegally.$d$,
  'Web research',
  'Dashashwamedh Ghat, Manikarnika Ghat, Assi Ghat — all major ghat steps',
  '[]', 'approved'
),

-- vns-bw-002: Hotel redirect scam
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$"Your hotel is closed / flooded / has given away your room" — driver redirect scam$t$,
  'high',
  $d$One of the most consistent Varanasi scams. Your auto-rickshaw or taxi driver, typically just after you arrive at Varanasi Junction or the airport, volunteers that your pre-booked hotel has "burned down", "been flooded", "is full", or "given away your room." They then helpfully offer to take you to their "brother's hotel" where they collect a commission and you pay inflated rates. This scam is specifically effective on tired, first-time arrivals who don't know the city.

What to do: The moment any driver makes this claim — call your hotel directly from your phone, right in front of the driver. Every legitimate hotel will confirm your booking. Never go to a "suggested alternative" based on a driver's word. If your phone has no data, ask to stop at a shop to use WiFi. Your hotel is not closed.

Season note: Year-round. Peak season (Nov–Feb) especially common — high demand makes the "full hotel" story more believable.$d$,
  'Web research',
  'Varanasi Junction (railway station) exit, Lal Bahadur Shastri Airport arrival, all major approach roads',
  '[]', 'approved'
),

-- vns-bw-003: Silk shop commission scam
(
  'varanasi-india', 'Varanasi', 'Street / market',
  $t$Silk shop commission scam — "friendly guide" takes you to inflated shop$t$,
  'high',
  $d$A driver, unofficial guide (locally called "lapka"), or random friendly stranger offers to show you around free or cheaply — then steers the route toward their "family's silk emporium" or a "government-approved" silk shop. The guide earns 20–40% commission on everything you buy. Prices are inflated 3–5x above fair market rate. Machine-made synthetic fabric is frequently sold as handwoven authentic Banarasi silk. The pressure to buy inside these shops can be intense — shopkeepers and associates use sustained tactics to prevent you leaving without a purchase.

What to do: Never go to any shop recommended by your driver or a stranger who approached you. If you want genuine Banarasi silk, do your own research: Thatheri Bazaar and Vishwanath Gali have independent shops at fair prices. Check prices at minimum 3 shops before buying. Real handwoven Banarasi silk has a distinct weight, texture, and cost — educate yourself before shopping. If a shop feels pressured, simply say "I'm just looking, I'll come back" and leave.$d$,
  'Web research',
  'Tourist areas near Dashashwamedh Ghat, Godowlia Chowk, Varanasi Junction — shops on any route your driver recommends',
  '[]', 'approved'
),

-- vns-bw-004: Fake priest blessing scam
(
  'varanasi-india', 'Varanasi', 'Religious / temple',
  $t$Fake priest "blessing" scam — demands ₹5,000–20,000 after unsolicited ritual$t$,
  'high',
  $d$A man in saffron robes approaches you at ghat entrances, temple steps, or near Kashi Vishwanath — offers to perform a "special puja" for your family, asking for parents' and siblings' names. Once the ritual is underway and you are emotionally engaged, they demand ₹5,000–20,000 claiming a "predetermined donation" you never agreed to. Some use guilt tactics suggesting unpaid donations bring spiritual harm to family members. Genuine temple rituals have fixed, publicly visible rates. Unsolicited puja offers outside official premises are near-universally scams.

What to do: Decline all unsolicited ritual offers near ghats and temple entrances — regardless of how genuine or spiritual the person appears. If you want a puja performed, enter the official temple premises and engage priests inside who are accountable. Never share family members' names with strangers on the street. If cornered, a firm "Nahi chahiye" (I don't want this) and walking away works. Do not argue or negotiate — just leave.

Season note: Higher density during major Hindu festivals when crowds provide cover.$d$,
  'Web research',
  'Kashi Vishwanath Temple surroundings, Dashashwamedh Ghat steps, Manikarnika Ghat entrance',
  '[]', 'approved'
),

-- vns-bw-005: Photography licence scam at Manikarnika
(
  'varanasi-india', 'Varanasi', 'Religious / temple',
  $t$"Photography licence" scam at Manikarnika Ghat$t$,
  'medium',
  $d$At Manikarnika Ghat (the main cremation ghat), a person approaches tourists with cameras or phones and claims they require a paid "photography licence" to photograph the area, threatening to call police or take you to an "office" if you don't comply or pay. No such licence exists. Photography at the cremation ghat is a sensitive cultural matter — not photographing remains is basic respectful behaviour — but no monetary licence is required for general tourist photography on public ghats.

What to do: Do not pay any amount for a photography licence — it does not exist. If approached aggressively, calmly state you don't need one and walk toward the busier part of the ghat where other tourists and genuine guides are present. Note: separately from this scam, there is a genuine cultural request not to photograph cremation ceremonies out of respect for grieving families — please honour this. But that is a matter of respect, not a fee.$d$,
  'Web research',
  'Manikarnika Ghat, Varanasi',
  '[]', 'approved'
),

-- vns-bw-006: Auto-rickshaw overcharge from Junction
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Auto-rickshaw from Varanasi Junction to ghats — metered ₹80–120, tourist quote ₹300–500$t$,
  'medium',
  $d$Standard auto-rickshaw fare from Varanasi Junction to the main ghats area (Dashashwamedh, Godowlia) is ₹80–120. Tourist quotes routinely start at ₹300–500. Drivers frequently refuse to run the meter, claim "meter is broken", or demand a fixed rate 2–4x the real price. This is the first scam most women encounter in Varanasi — arriving tired from a train journey and being immediately overcharged for the first short ride.

What to do: Use the prepaid auto-rickshaw booth outside Varanasi Junction before exiting the station — government-fixed rates, no negotiation needed. Alternatively use Ola or Uber from inside the station (note: driver cancellations are common but worth trying). If negotiating directly: ₹100–120 to Godowlia is a fair counter-offer. Do not accept any rate above ₹150 for this route. Booking the "Auto" category on ride apps is more reliable than car booking in Varanasi.$d$,
  'Web research',
  'Varanasi Junction (Cantonment) — exit and auto stand, all approach routes to ghats',
  '[]', 'approved'
),

-- vns-bw-007: Kashi Vishwanath redirect
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Kashi Vishwanath redirect — driver claims temple is closed, takes you to commission shop$t$,
  'medium',
  $d$When you tell your auto driver to take you to Kashi Vishwanath Temple, a significant number of drivers claim "temple is closed today for puja", "that road is blocked for procession", or "foreign tourists not allowed today." They redirect to a different temple or directly to a silk shop where they earn commission. Kashi Vishwanath Temple is never fully closed. Entry restrictions exist at specific times but the temple is always accessible to visitors.

What to do: Do not accept any closure claim for Kashi Vishwanath. The temple opens at 3am and closes at 11pm daily. Look up current opening times on the official Shri Kashi Vishwanath Mandir website before your visit. If your driver claims it's closed, tell them you'll verify yourself and have them drop you at Godowlia Chowk — walk from there (10-minute walk). Never let a driver decide your itinerary.$d$,
  'Web research',
  'All auto-rickshaw and taxi routes toward Kashi Vishwanath Temple / Vishwanath Gali',
  '[]', 'approved'
),

-- vns-bw-008: Bhang lassi
(
  'varanasi-india', 'Varanasi', 'Food & drink',
  $t$Bhang lassi — significantly stronger than expected, solo consumption is high risk$t$,
  'high',
  $d$Bhang lassi (cannabis-infused yoghurt drink) is legal in Varanasi and sold at government-licensed shops. However, multiple solo women travelers report that the potency is far higher than expected — one traveler described 4 hours of hallucinations after what seemed like a mild serving. Effects can include disorientation, nausea, and significantly impaired judgement for several hours. Multiple reports document bags and money being stolen from solo travelers who tried bhang and became disoriented. Some unlicensed vendors serve laced versions of regular drinks without disclosure.

What to do: If you choose to try bhang lassi, only do so at a government-licensed shop, only when you are with people you know well (not fellow tourists you met that day), and only when you have nowhere important to be for the next 6–8 hours. Do NOT try it alone. Do NOT try it before a train or bus departure. Never accept a drink described as "special lassi" from a vendor who approaches you unsolicited. Symptoms can appear slowly — do not assume a small serving is mild.

Season note: Year-round. Particularly present during Holi, Shivaratri, and major Hindu festivals when consumption is normalized and crowds are larger.$d$,
  'Web research',
  'Street vendors near ghats, cafes near Dashashwamedh and Assi — be particularly cautious of unsolicited offers',
  '[]', 'approved'
),

-- vns-bw-009: Night bus stops
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Night bus "stops" in Varanasi are unmarked roadside points — do not wait alone$t$,
  'high',
  $d$Night buses out of Varanasi do not depart from proper stations. They stop at unmarked points on the roadside — a random stretch of road your tuk-tuk drops you at. Solo women have reported waiting alone at dark roadside points at 11pm–2am with no shelter, no other passengers visible, and no confirmation the bus is actually coming. This creates a high-vulnerability window that is entirely avoidable.

What to do: Ask your auto or tuk-tuk driver to wait with you at the bus point until the bus physically arrives. Most will agree, especially if you explain you're alone — offer ₹100–200 extra for the wait, it is worth it. Confirm with your hostel staff the exact pickup coordinates and expected time before leaving. If the bus is more than 20 minutes late, call the bus company directly. Alternatively, take an overnight train instead of bus from Varanasi — the railway has dedicated women's waiting rooms and is significantly safer for solo women.$d$,
  'Web research',
  'Various unmarked roadside bus departure points across Varanasi — confirm exact location with booking agent',
  '[]', 'approved'
),

-- vns-bw-010: Dashashwamedh lanes after dark
(
  'varanasi-india', 'Varanasi', 'Street / market',
  $t$Dashashwamedh lanes and riverside after dark — narrow alleys, disorienting, avoid alone$t$,
  'high',
  $d$The dense, winding alleyways around Dashashwamedh Ghat and the central ghat area are genuinely confusing at night. Multiple solo women travelers report: losing direction in lanes that all look identical, feeling followed, encountering persistent hawkers offering hash and tours, and the overall atmosphere shifting significantly after 9–10pm. This is not described as violent — the primary risks are getting lost, feeling harassed, and being in an environment where calling for help or finding a main road quickly is difficult.

What to do: During the day — explore freely. Evening Ganga Aarti (typically 7–7:30pm) — go, it's safe and wonderful. After the Aarti ends — return to your accommodation via a direct route. Do not explore the back alleys of Dashashwamedh after 9pm alone. Take a photo of your hotel's lane in daylight and note two landmarks so you can orientate a late return. Stay within the main riverside path between Dashashwamedh and Assi Ghat — this stretch remains populated until late. Assi Ghat area is the safest base for solo women: well-connected to main roads, other travelers present.

Season note: Worse during major festivals (Diwali, Holi, Dev Deepawali) when crowds are extreme.$d$,
  'Web research',
  'Lanes behind Dashashwamedh Ghat, Godowlia Chowk surrounding alleys, central ghat corridors',
  '[]', 'approved'
),

-- vns-bw-011: Ola/Uber cancellations
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Ola/Uber frequent cancellations — book Auto category, not car$t$,
  'medium',
  $d$Ride-hailing apps operate in Varanasi but with significant reliability problems. Drivers accept rides, then call to ask your destination — if it's inconvenient or short, they cancel. Car bookings are particularly unreliable. Multiple travelers note this as a recurring frustration. The practical workaround confirmed by local Reddit users: book the Auto (rickshaw) category, not a car. Auto drivers are more numerous, better suited to short congested trips, and less likely to cancel.

What to do: Always book Auto category in Varanasi apps — not car. If a driver cancels after asking your destination, report the cancellation and rebook immediately. For longer distances (airport, Sarnath), pre-book through your hotel or a verified operator the day before. The electric city bus is a safe and cheap alternative for ghats-area movement — track using the "Chalo" app. Prepaid taxi booth at Varanasi Junction is reliable for airport/long-distance trips.$d$,
  'Web research',
  'City-wide — all Ola/Uber bookings in Varanasi',
  '[]', 'approved'
),

-- vns-bw-012: Monsoon boating ban
(
  'varanasi-india', 'Varanasi', 'Transport',
  $t$Monsoon boating ban — avoid any boatman operating illegally during flood risk$t$,
  'critical',
  $d$During July and August, the Ganga frequently crosses the danger mark and the district administration issues an official, mandatory ban on all boating activities. This is not a suggestion. Despite the ban, some boatmen continue operating illegally — presenting a genuine drowning risk. At the same time, several major ghats including Dashashwamedh and Assi are partially or fully submerged, pushing cremation and ritual activity into the already-crowded back alleys, creating a significantly more intense and difficult-to-navigate environment.

What to do: Check local Varanasi news or ask your hotel about the current boating status if visiting July–August. Do not hire any boatman during an official ban — regardless of how confident they appear or how much you want the experience. If you visit during monsoon, plan around indoor experiences: silk weaving workshops, the BHU campus, Sarnath — which are all unaffected by flooding.

Season note: July–August specifically. Check local conditions daily during this period.$d$,
  'Web research',
  'All ghats on the Ganga — Dashashwamedh, Assi, Manikarnika, Harishchandra',
  '[]', 'approved'
),

-- vns-bw-013: Assi Ghat safe-tip (informational entry)
(
  'varanasi-india', 'Varanasi', 'Accommodation',
  $t$Safe tip — Assi Ghat area is the best base for solo women, especially first visit$t$,
  'medium',
  $d$Multiple experienced solo women travelers and safety guides consistently recommend the Assi Ghat area as the safest and most practical base for first-time solo women in Varanasi. Reasons: well-connected to main roads (taxis can reach you easily even at night), vibrant with other travelers and cafe culture, proximity to the riverside walk but less claustrophobic than central Dashashwamedh, and multiple well-reviewed solo-friendly hostels and guesthouses with female-only dorms.

What to do: Book accommodation in the Assi Ghat, Lanka, or BHU area for your first Varanasi visit. The walk from Assi northward along the ghats toward Dashashwamedh is one of the most spectacular walks in India — do it during the day. The smaller Assi Ghat Aarti at evening is more intimate and less overwhelming than Dashashwamedh. Rooftop cafes in this area are safe and popular with solo travelers.$d$,
  'Web research',
  'Assi Ghat, Lanka, BHU area — South Varanasi',
  '[]', 'approved'
);

-- ─── COMMUNITY POSTS (experiences tab) ───────────────────────────────────────

INSERT INTO community_posts
  (id, tab, author_name, author_age_range, title, content, destination, image_urls, status)
VALUES

-- vns-cp-001
(
  'vns-cp-001', 'experiences',
  'Web research', '25-32',
  $t$Solo in Varanasi — what I expected vs what actually happened$t$,
  $c$I made Varanasi my first stop in India as a solo female traveler. Not the wisest choice — it is genuinely throwing yourself in the deep end. I'm going to be honest rather than reassuring. What I expected: constant harassment, danger, aggression. What actually happened: intense sensory overload, persistent touts, some uncomfortable moments near the ghats after dark — but nothing I'd classify as dangerous. What caught me off guard: the Dashashwamedh lanes at night are genuinely disorienting. They all look identical and after the Aarti ends and the crowd disperses, the vibe changes quickly. My rule became: leave when the crowd thins. The boat scam got me on day 1 — boatman quoted ₹800, I negotiated to ₹600, the actual rate is ₹300. Now I know. What worked well: staying near Assi Ghat (far calmer than central Dashashwamedh area, still beautiful, still on the river). The sunrise boat at Assi with a shared boat at ₹50 per person is magical. The Ganga Aarti from a rooftop cafe rather than the crowded ghat steps — more peaceful, still spectacular. One non-negotiable: do NOT get a bhang lassi and then plan to do anything for the rest of the day. Try it only with a group of people you trust, in the morning, with no obligations.$c$,
  'varanasi-india', '[]', 'approved'
),

-- vns-cp-002
(
  'vns-cp-002', 'experiences',
  'Web research', '25-32',
  $t$3 days solo in Varanasi — honest debrief for Indian women$t$,
  $c$Going as an Indian woman solo to Varanasi felt different from going as a foreigner — people assumed I was there for religious reasons, which actually reduced a lot of the tourist-targeting scams. But I still want to document what happened for other Indian solo women. Day 1 arrival at Varanasi Junction: auto driver immediately told me my hostel had "shifted location." I had the hostel's number saved — called them right there. They confirmed exactly where they were. Driver backed down instantly. Do this for every new city. The ghat walk from Assi to Manikarnika during the day is breathtaking. Do it. The weavers' district near Chowk is genuinely fascinating for silk — go without a guide, price things yourself across multiple small shops. Breakfast at Kashi Cafe at Assi Ghat (the kullad chai is real) was one of my favourite travel meals. For the Ganga Aarti: arrive 30 minutes early and claim a spot on the upper steps or take a boat. The crowd at the bottom is dense and men push. From above or from water, the ceremony is far more peaceful. After the Aarti (finishes around 8–8:30pm): I went back to my accommodation directly. The lanes feel different after 9pm and I didn't want to test it. One more thing for Indian women specifically: Varanasi is conservative. Cover your shoulders and knees at the ghats — this isn't about fear, it's about respect for a place where people are conducting genuine religious ceremonies. You'll also get significantly less unsolicited attention.$c$,
  'varanasi-india', '[]', 'approved'
),

-- vns-cp-003
(
  'vns-cp-003', 'experiences',
  'Web research', '25-32',
  $t$What Varanasi is really like for a solo foreign woman — no filter$t$,
  $c$I spent 3 days in Varanasi mid-solo trip through India. Varanasi is the most intense place I've ever been. Open cremations at Manikarnika, cows everywhere, the labyrinthine lanes, the relentless touts — it is a full sensory and psychological workout. I want to give you the reality, not the Instagram version. Safety wise: I felt more uncomfortable than unsafe. The distinction matters. Uncomfortable = persistent men on the riverside after dark asking where I was from, offering hash, wanting to guide me, following me briefly. Unsafe = I did not experience. The switch happened clearly at around 9–9:30pm near the central ghats. That was my cue to head back. Where I stayed: Moustache Varanasi near Assi Ghat. Excellent — met other solo travelers (including other solo women), could go exploring in groups in the evening when I wanted to, good security, easy to reach by transport. What I'd do differently: I would not arrive late at night. The first hour in Varanasi sets the tone and arriving exhausted at 11pm into the chaos near the ghats was overwhelming. Arrive during the day. Book airport/station transfer directly through your accommodation before you land. The scam I fell for: trusted a man who offered to show me the old city and ended up spending an hour in a silk shop feeling pressured. No money lost but 2 hours wasted. Now I know: if anyone offers to show me "something special" for free, the something special is a commission shop.$c$,
  'varanasi-india', '[]', 'approved'
),

-- vns-cp-004
(
  'vns-cp-004', 'experiences',
  'Web research', '18-24',
  $t$Budget breakdown — solo trip to Varanasi 3 nights$t$,
  $c$Complete cost breakdown for 3 nights solo in Varanasi, including what I paid and what I should have paid. Transport from Varanasi Junction to Assi Ghat area: Prepaid auto booth ₹120 (correct price). Sunrise boat ride: ₹150 shared (correct rate — I negotiated from ₹600 opening quote, settled at ₹150, shared with 3 others). Ganga Aarti by boat: ₹300 per person for private evening ride (slightly high but acceptable, confirmed in advance). Auto around city: ₹100–120 per trip (local rate, insisted on prepaid/agreed price before boarding). Accommodation: Zostel female dorm ₹600/night, total ₹1,800 for 3 nights. Food: ₹400–600 per day (Assi Ghat rooftop cafes, local thaali, Pehelwan Lassi at Lanka). Entry fees: Sarnath museum ₹25, Buddhist site ₹100, everything else free. Kashi Vishwanath Temple: free but the new complex has airport-style security — leave camera and bag at cloak room (₹20) before entry. Total 3 nights: approximately ₹6,500–7,500 all-inclusive at budget level. Avoiding: tourist restaurants near Dashashwamedh (3x marked up), any shop recommended by a driver or guide, guided tours from strangers. Best value: local thaali at any restaurant with Hindi-only signage near BHU, morning chai at any ghat chai stall, cycle-rickshaw for ghat area exploration (₹50–80 per short trip).$c$,
  'varanasi-india', '[]', 'approved'
),

-- vns-cp-005
(
  'vns-cp-005', 'experiences',
  'Web research', '25-32',
  $t$The Varanasi experience nobody prepares you for — the emotional weight$t$,
  $c$I want to talk about something different from safety tips and scam warnings. Varanasi is emotionally heavy in a way I was completely unprepared for. Walking past open cremations at Manikarnika every day, the constant presence of death treated as ordinary — it affects you. By day 2 I had a heaviness I couldn't name. This is normal. Many travelers report it. What helped me: rooftop cafes above the ghats where you can observe from a distance rather than being in the middle of it. The smaller Assi Ghat Aarti in the evening — more intimate, less overwhelming than Dashashwamedh, still profoundly beautiful. Waking up at 5am for the sunrise walk along the ghats before the tourist boats arrive — the city at that hour is completely different, quieter, genuine. Visiting Sarnath (30 minutes from the city) as a palate cleanser — Buddhist, serene, ancient, and completely different energy from the Varanasi ghats. I also found it genuinely hard to be alone with all of this. If you can, find one or two other solo travelers from your hostel to share some evenings with. Not for safety — for processing the experience together. The flip side: Varanasi is also one of the most philosophically alive places I've ever been. The acceptance of death as part of life changes how you think about everything. I left different. Most women I've talked to who've been say the same.$c$,
  'varanasi-india', '[]', 'approved'
);
