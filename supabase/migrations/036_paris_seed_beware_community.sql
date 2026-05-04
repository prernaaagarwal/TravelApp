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
