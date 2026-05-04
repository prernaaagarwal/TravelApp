-- 013_jaipur_tripadvisor_beware.sql
-- Seeds 15 Jaipur beware reports from TripAdvisor + travel-safety community research.
-- All inserted with status='approved' and GPS coordinates so they appear on the map immediately.
-- reported_by_id is NULL (community-sourced, not user-submitted).
-- Run this in Supabase SQL Editor.

INSERT INTO beware_reports
  (destination_slug, city, category, title, severity, description, reported_by_name, location, photo_urls, gps_lat, gps_lng, status)
VALUES

-- jaipur-ta-001: Gem & jewellery export scam (the big one)
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Jaipur gem & jewellery export scam — tourists convinced to "export" stones for profit, gems turn out to be worthless fakes$t$,
  'high',
  $d$Jaipur's most financially damaging and well-documented scam. A network of touts, auto drivers, and fake "friendly locals" befriend tourists near City Palace, Amber Fort, and Johari Bazaar, then convince them they can buy gems at wholesale or duty-free prices and resell them for large profit back home. The gems are fake — often glass, synthetic, or silver with gold polish — but come with convincing fake certificates of authenticity printed in the back of the shop. One documented case involved a US tourist defrauded of ₹6 crore for jewellery worth ₹300. The scammers vanished after the sale and police had to intervene via the US Embassy. According to a 2023 survey by India's Gem & Jewellery Export Promotion Council, nearly 1 in 4 tourists buying loose stones in Rajasthan were sold treated or imitation gems at genuine prices. Never buy gems, jewellery or stones based on a recommendation from a driver, guide, or stranger. Only buy from BIS hallmark-certified stores and always request an independent lab certificate from IGI or GIA — not one provided by the shop itself.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar / City Palace area / Amber Fort Road / across Old City',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-002: "Closed hotel/monument" redirect scam
(
  'jaipur-india', 'Jaipur', 'Transport',
  $t$Auto and taxi drivers claiming your hotel or monument is "closed" — to redirect you to commission shops$t$,
  'high',
  $d$One of Jaipur's most persistent and widespread scams, documented consistently across Tripadvisor forums, travel safety guides, and solo female travel accounts through 2025-2026. Auto rickshaw and taxi drivers — particularly near Amber Fort, Hawa Mahal, City Palace, and Jaipur Junction railway station — tell tourists their booked hotel is "full" or "closed", or that a monument is "shut for a government ceremony today". They then redirect tourists to a shop, guesthouse, or "tour operator" that pays them commission. One traveller reported being taken to a travel agent who charged 50% on top of the train fare, claiming the booking would otherwise not be confirmed. Always verify monument opening times directly via official websites before travel. Call your hotel directly if a driver claims it is closed. Use Uber or Ola for transparent GPS-tracked transport and avoid negotiating with drivers who approach you proactively near tourist sites.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Hawa Mahal / City Palace / Jaipur Junction railway station',
  '[]', 26.9197, 75.7878, 'approved'
),

-- jaipur-ta-003: Hawa Mahal photo / shop scam
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Hawa Mahal photo scam — "friendly" man lures tourists to rooftop for photos, turns aggressive when you won't buy from his shop$t$,
  'high',
  $d$A well-practiced individual operator outside Hawa Mahal approaches tourists and offers them access to the building opposite for better photos of the monument. Once tourists have taken their photos and realise they are inside the man's shop, he applies heavy pressure to buy goods. Multiple Tripadvisor reports describe the person becoming "quite nasty and abusive" if refused. This is not a random interaction — it is a rehearsed routine. He knows when tourists arrive, what to say, and how to escalate. Do not follow any stranger offering "special" access or photo opportunities near Hawa Mahal. The best photos of Hawa Mahal are taken from street level opposite the monument, which is free and requires no assistance.$d$,
  'Tripadvisor Community Research',
  'Opposite Hawa Mahal, Old City',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-004: Fake gem factory tours near Amber Fort
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Fake gem factory tours near Amber Fort — "artisans" cutting gems are staged, stones are glass$t$,
  'high',
  $d$Auto rickshaw drivers and unofficial guides routinely take tourists to "gem cutting factories" near Amber Fort Road under the guise of a free cultural experience. The "artisans" appearing to cut and polish stones are performing — the raw materials are absent and the finished stones on display are glass or plastic. One tourist who insisted on examining a tin of "rubies" the artisan was working with found them to be made of glass. Once inside, high-pressure sales tactics are applied. Certificates of authenticity are offered but are either fabricated or issued by non-existent labs. If you are taken to any gem factory by a driver or guide who suggested it — leave immediately. You did not choose to go there; they took you there to earn commission.$d$,
  'Tripadvisor Community Research',
  'Amber Fort Road / Ramgarh Mode area — commission-based gem shops',
  '[]', 26.9787, 75.8423, 'approved'
),

-- jaipur-ta-005: Auto rickshaw overcharging
(
  'jaipur-india', 'Jaipur', 'Transport',
  $t$Auto rickshaw overcharging — meters refused, tourist prices 5-10x local rate, no accountability$t$,
  'high',
  $d$Auto rickshaw drivers in Jaipur routinely quote prices 5-10 times the local rate to foreign tourists and refuse to use meters, claiming they are broken. Because there is no fixed metered system enforced, tourists have no basis for negotiation and drivers face no penalties. This is documented across every Jaipur travel safety guide for 2025-2026. The problem is worst near Amber Fort, Hawa Mahal, City Palace, and Jaipur Junction. Uber and Ola both operate widely in Jaipur with GPS tracking, fixed upfront pricing, and driver identification — use these for all journeys where possible. If you must use an auto rickshaw, agree on the exact fare before getting in, research approximate local fares in advance, and do not get in if the driver refuses to commit to a price.$d$,
  'Tripadvisor Community Research',
  'City-wide — worst near Amber Fort, Hawa Mahal, Jaipur Junction railway station',
  '[]', 26.9124, 75.7873, 'approved'
),

-- jaipur-ta-006: Fake government tourist offices
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Fake government tourist offices near Jaipur Junction and City Palace — overpriced tours, fake tickets, bogus packages$t$,
  'high',
  $d$Fraudulent "government tourist offices" operate near major transport hubs and tourist sites across Jaipur. They appear official — sometimes with signage suggesting government affiliation — but are private operators selling overpriced tour packages, fake entry tickets, and unnecessary services. They mislead tourists into believing official transport or accommodation is unavailable and that their package is the only option. This scam is well-documented in Jaipur, Delhi, and Agra along the Golden Triangle circuit. The actual government tourism body is ITDC (India Tourism Development Corporation). Never book tours or tickets from anyone who approaches you on the street or outside a station. Book directly through official monument websites, your accommodation, or verified platforms.$d$,
  'Tripadvisor Community Research',
  'Near Jaipur Junction railway station / City Palace / Hawa Mahal',
  '[]', 26.9197, 75.7878, 'approved'
),

-- jaipur-ta-007: Pickpocketing in markets
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Pickpocketing in Johari Bazaar and Bapu Bazaar — distraction theft in peak crowds, crossbody bags and phones targeted$t$,
  'high',
  $d$Johari Bazaar and Bapu Bazaar are Jaipur's most visited and most crowded markets, particularly during peak tourist season (October-March) and evenings when the markets are at their busiest. Pickpockets operate in the dense crowds using distraction techniques — someone engages you in conversation or blocks your path while an accomplice takes your phone, wallet, or camera. Multiple travel safety sources and Tripadvisor reviews for 2025-2026 specifically flag these markets as pickpocket risk zones. Do not carry your phone in your back pocket or an open bag. Use a crossbody bag worn in front of your body. Keep cash split across multiple locations. Weekday mornings (10am-12pm) are significantly less crowded and safer for shopping.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar / Bapu Bazaar / Old City market area',
  '[]', 26.9224, 75.8237, 'approved'
),

-- jaipur-ta-008: Unsolicited guides
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Unsolicited "guides" at Amber Fort and City Palace — unlicensed, pushy, commission-driven$t$,
  'medium',
  $d$Unlicensed individuals position themselves at the entrances to Amber Fort and City Palace and approach solo tourists — particularly solo women — who appear uncertain. They offer guided tours, claim to be official guides, and are extremely persistent. Once inside, they pressure tourists to visit affiliated shops and push for large cash tips. Licensed official guides wear government-issued ID badges and are booked through the Archaeological Survey of India counter at monument entrances. Anyone who approaches you before you reach the official counter is unlicensed. Politely refuse, say you have a guide arranged, and walk directly to the official booking counter. Solo women are specifically targeted as they are perceived as less likely to push back firmly.$d$,
  'Tripadvisor Community Research',
  'Amber Fort entrance / City Palace entrance',
  '[]', 26.9855, 75.8513, 'approved'
),

-- jaipur-ta-009: Fake ticket sellers
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Fake ticket sellers at monument entrances — outside Amber Fort, City Palace, Hawa Mahal$t$,
  'medium',
  $d$Individuals sell "entry tickets" outside Amber Fort, Hawa Mahal, and City Palace that are either fake or significantly overpriced compared to the official rate. They position themselves before the official ticket counters and approach tourists who are not yet sure where to buy. Official ticket counters are clearly marked inside the monument approach area — walk past anyone offering tickets on the street before you reach the official counter. For Amber Fort specifically, tickets can also be pre-booked online at the official Rajasthan tourism website. Current official entry prices for Amber Fort are ₹100 for Indian nationals and ₹500 for foreign tourists — anything above this from an unofficial seller is a scam.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Hawa Mahal / City Palace — outside official ticket counters',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-010: Bapu Bazaar duplicate goods
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Bapu Bazaar duplicate goods — fabrics, textiles and block prints sold as authentic Rajasthani craft are mass-produced fakes$t$,
  'medium',
  $d$Bapu Bazaar is marketed as a destination for authentic Rajasthani textiles, block-printed fabrics, and leather goods. However, multiple Tripadvisor reviewers and community sources flag that a significant portion of goods are duplicate items with chemical dyes, not natural block prints, and cheap synthetic fabrics sold as cotton. One Tripadvisor review specifically states "all clothes duplicate item fake item and chemical colours." Vendors quote tourist prices that can be 5-10x what a local would pay. Bargaining is essential — start at 30-40% of the quoted price. For genuinely authentic block prints, visit Sanganer (a short auto ride from Jaipur) where you can see the actual printing process and buy directly from artisan workshops.$d$,
  'Tripadvisor Community Research',
  'Bapu Bazaar / Tripolia Bazaar',
  '[]', 26.9224, 75.8211, 'approved'
),

-- jaipur-ta-011: Solo women at night in Old City
(
  'jaipur-india', 'Jaipur', 'Other',
  $t$Jaipur solo women at night — isolated Old City streets after 9pm are a genuine risk, not just a precaution$t$,
  'high',
  $d$Jaipur's NARI 2025 safety score was 59% — below the national average of 65% — reflecting a real and documented gap in women's sense of safety in the city. While the tourist zones around C-Scheme, MI Road, and Civil Lines are well-lit and considered safe into the night, the Old City areas around City Palace, Johari Bazaar, Bapu Bazaar, and Chandpole become significantly less safe for solo women after shops close (around 9-10pm). Streets become empty quickly, transport becomes irregular, and the area loses the protective cover of crowds. Do not walk alone through the Old City after dark. Book Uber or Ola for the return journey before you need it, not after you are already in an empty street. The Jaipur Metro runs only until 9:30pm and does not serve Amber Fort or the Old City market area.$d$,
  'Tripadvisor Community Research',
  'Old City — Johari Bazaar, Bapu Bazaar, Chandpole, City Palace area after 9pm',
  '[]', 26.9239, 75.8267, 'approved'
),

-- jaipur-ta-012: Summer heat / heatstroke (CRITICAL)
(
  'jaipur-india', 'Jaipur', 'Other',
  $t$Summer heat danger — tourists collapsing from heatstroke, Amber Fort sightseeing between 11am-3pm is a medical risk$t$,
  'critical',
  $d$Jaipur's summer temperatures (April-June) regularly reach 42-45°C. Tourists underestimate how quickly heat exhaustion develops when climbing exposed stone monuments like Amber Fort and Nahargarh Fort without shade. Multiple sources including Jaipur Insider's 2026 local tips guide explicitly warn against all outdoor sightseeing between 12pm-3pm during summer months. Heatstroke can develop within 30 minutes of exposure at these temperatures for visitors unacclimatised to dry heat. Visit Amber Fort between 6am-8am only in summer months. Carry a minimum of 2 litres of water per person. Wear a hat and light cotton that covers your arms. Symptoms of heatstroke (confusion, no sweating, very high temperature) require immediate emergency response — call 108.$d$,
  'Tripadvisor Community Research',
  'Amber Fort / Nahargarh Fort / Jaigarh Fort — all exposed hilltop monuments',
  '[]', 26.9855, 75.8513, 'approved'
),

-- jaipur-ta-013: Aggressive monkeys at Galta Ji
(
  'jaipur-india', 'Jaipur', 'Temple / attraction',
  $t$Aggressive monkeys at Galta Ji (Monkey Temple) — snatching food, bags, and glasses from tourists$t$,
  'medium',
  $d$Galta Ji, also known as the Monkey Temple, is home to large groups of rhesus macaques that have become bold and aggressive due to years of tourist feeding. Monkeys at this site have been documented snatching food, open bags, glasses, phones, and water bottles directly from tourists. They can scratch or bite if they feel threatened or cornered. The World Travel Index's 2026 Jaipur safety guide specifically flags monkeys at temple sites as a safety concern requiring active caution. Do not carry any visible food near Galta Ji. Keep bags zipped and held close to your body. Do not make eye contact with or attempt to touch the monkeys. Do not feed them under any circumstances — feeding attracts more animals and increases aggression. If bitten or scratched, seek medical attention immediately as monkey bites carry infection risk.$d$,
  'Tripadvisor Community Research',
  'Galta Ji (Monkey Temple) — east of Jaipur city',
  '[]', 26.9170, 75.8530, 'approved'
),

-- jaipur-ta-014: Carpet & textile shop pressure tactics
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Carpet and textile shop pressure tactics — invited for "tea", subjected to hours of high-pressure selling$t$,
  'high',
  $d$A well-documented Jaipur scam operating near City Palace and through auto rickshaw drivers: tourists are invited into a carpet or textile shop for tea with no purchase obligation. Once inside, a rotating team of salespeople begins a structured high-pressure selling session that can last 2-3 hours. Items are presented as "handmade", "export quality", and "government certified". Prices begin very high and drop dramatically to create the impression of a deal. Shipping promises are made for items too large to carry. The carpets, textiles, and gems are typically not as described, certificates are not verifiable, and the promised shipping often fails to materialise. The moment you say yes to "just tea, no buying", you have entered the process. Politely refuse any invitation to enter shops suggested by your driver or a stranger on the street.$d$,
  'Tripadvisor Community Research',
  'Near City Palace / commission shops across Old City',
  '[]', 26.9258, 75.8237, 'approved'
),

-- jaipur-ta-015: Instagram-based jewellery fraud
(
  'jaipur-india', 'Jaipur', 'Street / market',
  $t$Instagram-based jewellery fraud — Jaipur sellers connecting with tourists online before arrival$t$,
  'high',
  $d$A newer and increasingly documented version of Jaipur's jewellery scam operates via Instagram and social media. Jaipur-based sellers connect with tourists planning trips to India through travel hashtags, DMs, and comment sections, building rapport before the tourist arrives. They present as small artisan businesses with beautiful product photos. Tourists then visit in person, purchase large quantities of "handmade" jewellery at agreed prices, and discover on return home that the goods are fake, silver-plated as gold, or significantly lower quality than photographed. The documented case of US tourist Cherish — defrauded of ₹6 crore over two years via Instagram contact with a Jaipur jeweller — resulted in a police case and US Embassy involvement. The sellers involved had used fake certificates throughout. Never make large jewellery purchases based on social media contact before or during travel. Insist on independent third-party certification for any purchase above ₹5,000.$d$,
  'Tripadvisor Community Research',
  'Johari Bazaar area / online-to-in-person scam originating in Jaipur',
  '[]', 26.9239, 75.8267, 'approved'
);
