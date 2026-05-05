-- Paywall inversion: safety intel is always free.
--
-- Rewrites the premium_preview text on every premium intel card so it
-- promises ONLY planning + discovery content (itineraries, off-season hacks,
-- day-trip routes, contributor-curated walkthroughs) — NEVER safety content.
--
-- Safety intel (scam reports, neighbourhood ratings, emergency numbers,
-- female-run-stay flags, transit warnings, Don't lists, Beware Board) lives
-- in fields that are always free for everyone:
--   tldr, scams, neighborhoods, transport, dos_and_donts.dont, emergency_numbers
--
-- Same six premium-card rows the JSON seed updates — kept byte-equivalent.

update intel_cards set premium_preview = 'Premium covers: full GoaMiles booking walkthrough with screenshots, a complete Palolem vs Agonda vs Patnem itinerary comparison, the November shoulder-season hack that cuts mid-range accommodation costs by 40%, and a 7-day North + South Goa loop curated by 12 contributors.' where slug = 'goa-india';
update intel_cards set premium_preview = 'Premium covers: the exact Hawa Mahal early-access hack (saves 90 min queuing), an 8-day Rajasthan circuit itinerary (Jaipur → Jodhpur → Udaipur), female artisan workshop visits where the money goes directly to the maker, and the off-monsoon Amer Fort photography route most tour groups miss.' where slug = 'jaipur-india';
update intel_cards set premium_preview = 'Premium covers: the exact ghat-by-ghat morning ritual schedule (5am–7am), a Varanasi → Sarnath day-trip itinerary with female-led guide contact, the Benares Hindu University campus walk most tourists miss, and a 3-day classical music + boat-ride curated route.' where slug = 'varanasi-india';
update intel_cards set premium_preview = 'Premium covers: the exact Spiti Valley extension itinerary (Manali → Kaza → Chandra Taal, 7 days), monsoon-season alternatives when Rohtang Pass is closed, a winter (Dec–Feb) Manali planning guide with snow-day cafés and homestays, and the Hampta Pass trek operator shortlist with current-season prices.' where slug = 'manali-india';
update intel_cards set premium_preview = 'Premium covers: the Rishikesh–Chopta–Tungnath trek itinerary (3 days, beginner-friendly), a Haridwar day-trip add-on with morning Ganga aarti routing, the off-season silent-meditation retreat shortlist with current pricing, and a curated 7-day yoga-and-rafting plan.' where slug = 'rishikesh-india';
update intel_cards set premium_preview = 'Premium covers: a Dubai weekend itinerary (Friday–Sunday) with day-pass pricing for 4 spa + beach clubs, the Indian-passport visa loophole that gets you 30 days instead of 14, modesty-compliant outfit + photography guides for the 3 main mosques, and the off-peak Burj Khalifa booking trick that halves entry queues.' where slug = 'dubai-uae';
