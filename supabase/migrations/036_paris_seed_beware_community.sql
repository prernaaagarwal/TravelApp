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

-- ── Sub-part 1 of 4 for Paris beware reports complete (entries 1–16). ────────
-- ── Remaining entries (17–32) and community posts append below. ──────────────
