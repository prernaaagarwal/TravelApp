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

-- ── Sub-part 2 of 4 for Paris beware reports complete (entries 17–32). ───────
-- ── Community posts (sub-parts 3 & 4) append below. ──────────────────────────
