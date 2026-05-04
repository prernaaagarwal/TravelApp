
-- =====================================================================
-- IDEMPOTENT BUNDLE -- safe to re-paste on a partially-applied database.
-- Every CREATE TABLE / POLICY / TRIGGER below is preceded by a DROP guard
-- (or uses IF NOT EXISTS) so duplicate-name errors never fire.
-- INSERTs in this bundle either use ON CONFLICT DO NOTHING or are pure
-- seed data -- duplicate-key errors on those are safe to ignore.
-- =====================================================================

-- ======================================================================
-- Wander Women migration bundle: 01-schema-base
-- Run this in Supabase SQL Editor (project: vykbvnkpfqfmcilovzsw)
-- Generated 2026-05-04 09:04 UTC
-- ======================================================================


-- ---- 001_init.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- Wander Women — initial schema
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- profiles (one row per auth.users entry)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  membership_tier text not null default 'free',
  membership_expiry timestamptz,
  segment jsonb,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
drop policy if exists "Users read own profile" on profiles;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
drop policy if exists "Users update own profile" on profiles;
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- intel_cards
create table if not exists intel_cards (
  slug text primary key,
  destination text not null,
  country text not null,
  audience text not null default 'both',
  contributor_slug text,
  last_updated date,
  verified_by_count int not null default 0,
  hero_image_url text,
  tldr jsonb not null default '[]',
  neighborhoods jsonb not null default '[]',
  scams jsonb not null default '[]',
  transport jsonb not null default '[]',
  hidden_gems jsonb not null default '[]',
  pre_book_checklist jsonb not null default '[]',
  dos_and_donts jsonb not null default '{"do":[],"dont":[]}',
  estimated_daily_budget jsonb not null default '{}',
  emergency_numbers jsonb not null default '[]',
  is_premium boolean not null default false,
  premium_preview text,
  affiliate_links jsonb not null default '{}',
  created_at timestamptz not null default now()
);
alter table intel_cards enable row level security;
drop policy if exists "Anyone reads intel cards" on intel_cards;
create policy "Anyone reads intel cards" on intel_cards
  for select using (true);

-- contributors
create table if not exists contributors (
  slug text primary key,
  name text,
  full_name text,
  home_city text,
  age_range text,
  trip_count int not null default 0,
  tagline text,
  bio text,
  photo_url text,
  badges jsonb not null default '[]',
  destinations_contributed jsonb not null default '[]',
  joined_date date,
  earnings_this_month int not null default 0,
  total_contributions int not null default 0,
  answers_in_community int not null default 0,
  instagram text,
  created_at timestamptz not null default now()
);
alter table contributors enable row level security;
drop policy if exists "Anyone reads contributors" on contributors;
create policy "Anyone reads contributors" on contributors
  for select using (true);

-- community_posts
create table if not exists community_posts (
  id text primary key,
  tab text not null,
  author_id uuid references auth.users on delete set null,
  author_name text,
  author_age_range text,
  home_city text,
  content text not null,
  destination text,
  image_urls jsonb not null default '[]',
  status text not null default 'pending',
  reply_count int not null default 0,
  like_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table community_posts enable row level security;
drop policy if exists "Anyone reads approved posts" on community_posts;
create policy "Anyone reads approved posts" on community_posts
  for select using (status = 'approved');
drop policy if exists "Users insert own posts" on community_posts;
create policy "Users insert own posts" on community_posts
  for insert with check (auth.uid() = author_id);

-- beware_reports
create table if not exists beware_reports (
  id uuid primary key default gen_random_uuid(),
  destination_slug text,
  city text,
  category text,
  title text not null,
  severity text,
  description text not null,
  reported_by_id uuid references auth.users on delete set null,
  reported_by_name text,
  location text,
  photo_urls jsonb not null default '[]',
  gps_lat float,
  gps_lng float,
  exif_data jsonb,
  status text not null default 'pending',
  helpful_count int not null default 0,
  created_at timestamptz not null default now()
);
alter table beware_reports enable row level security;
drop policy if exists "Anyone reads approved reports" on beware_reports;
create policy "Anyone reads approved reports" on beware_reports
  for select using (status = 'approved');
drop policy if exists "Users insert reports" on beware_reports;
create policy "Users insert reports" on beware_reports
  for insert with check (auth.uid() = reported_by_id);

-- buddy_matches
create table if not exists buddy_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  first_name text,
  age_range text,
  home_city text,
  destination_slug text,
  travel_start date,
  travel_end date,
  budget_range text,
  travel_style jsonb not null default '[]',
  style_tags jsonb not null default '[]',
  instagram_verified boolean not null default false,
  photo_url text,
  created_at timestamptz not null default now()
);
alter table buddy_matches enable row level security;
drop policy if exists "Anyone reads buddy matches" on buddy_matches;
create policy "Anyone reads buddy matches" on buddy_matches
  for select using (true);
drop policy if exists "Users insert own match" on buddy_matches;
create policy "Users insert own match" on buddy_matches
  for insert with check (auth.uid() = user_id);

-- buddy_connections
create table if not exists buddy_connections (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid references auth.users on delete cascade,
  to_match_id uuid references buddy_matches on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (from_user_id, to_match_id)
);
alter table buddy_connections enable row level security;
drop policy if exists "Users read own connections" on buddy_connections;
create policy "Users read own connections" on buddy_connections
  for select using (auth.uid() = from_user_id);
drop policy if exists "Users insert connections" on buddy_connections;
create policy "Users insert connections" on buddy_connections
  for insert with check (auth.uid() = from_user_id);

-- founding_membership_waitlist
create table if not exists founding_membership_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text,
  city text,
  instagram text,
  created_at timestamptz not null default now()
);
alter table founding_membership_waitlist enable row level security;
drop policy if exists "Anyone inserts waitlist" on founding_membership_waitlist;
create policy "Anyone inserts waitlist" on founding_membership_waitlist
  for insert with check (true);

-- safety_products
create table if not exists safety_products (
  id text primary key,
  name text,
  category text,
  why_it_matters text,
  price_range text,
  image_url text,
  amazon_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table safety_products enable row level security;
drop policy if exists "Anyone reads products" on safety_products;
create policy "Anyone reads products" on safety_products
  for select using (true);

-- affiliate_clicks
create table if not exists affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id text references safety_products on delete set null,
  user_id uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);
alter table affiliate_clicks enable row level security;
drop policy if exists "Anyone inserts clicks" on affiliate_clicks;
create policy "Anyone inserts clicks" on affiliate_clicks
  for insert with check (true);


-- ---- 002_seed.sql ----
-- Wander Women seed data
-- Run in Supabase SQL Editor after 001_init.sql

-- intel_cards
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('goa-india','Goa','India','both','ananya-mumbai','2026-04-10',12,'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80','["Goa taxi union blocks Uber/Ola in most areas — use GoaMiles app (govt-backed, fixed fares).", "Drug possession setups on beaches are not myths; NDPS Act means 1+ year jail, no bail.", "Never give your passport as scooter-rental collateral — photograph every scratch before you ride.", "North Goa for energy and nightlife; South Goa (Palolem, Agonda) for quiet and yoga.", "Book accommodation 3+ months ahead for Dec 20 – Jan 10; prices triple without notice."]','[{"name": "Assagao", "safetyRating": 5, "vibe": "Boutique cafés, female-founder stays, quiet lanes", "stayHere": true, "notes": "The Project Café is here. Safer than Anjuna, walkable to Vagator. Best first base."}, {"name": "Anjuna / Vagator", "safetyRating": 3, "vibe": "Party beach, flea market, lively nights", "stayHere": false, "notes": "Highest drug-offer and overcharge density. Great energy; go with a group after dark."}, {"name": "Palolem, South Goa", "safetyRating": 4, "vibe": "Backpacker beach, yoga, sunset shacks", "stayHere": true, "notes": "Cleanest solo-female-friendly beach. Silent Noise Club on Saturdays is unmissable."}]','[{"title": "Fake hotel/villa booking", "severity": "critical", "where": "Online — Instagram, WhatsApp", "what": "AI-generated photos, fake booking sites. You pay ₹20K–₹2L and arrive to nothing. Raised in Rajya Sabha 2025.", "avoid": "Book only via Booking.com, MakeMyTrip, or direct hotel website. Call hotel to confirm before paying."}, {"title": "Drug possession setup", "severity": "critical", "where": "Anjuna, Vagator, Baga beaches", "what": "Stranger offers drugs; ''plainclothes cop'' appears immediately demanding bribe. Minimum 1-year jail under NDPS Act.", "avoid": "Zero tolerance. Walk away from all unsolicited beach offers. Never accept cigarettes from strangers."}, {"title": "Scooter rental damage claim", "severity": "high", "where": "All rental shops", "what": "Pre-existing scratches ''discovered'' on return; deposit or passport held hostage for ''repair'' costs.", "avoid": "Photograph every centimetre of the bike before riding. Never surrender your passport. Use Royal Brothers app."}, {"title": "GoaMiles impersonation", "severity": "high", "where": "Dabolim and Mopa airports", "what": "Unofficial drivers hold GoaMiles-style cards and quote fixed rates that are 2–3× the real app price.", "avoid": "Only book through the actual GoaMiles app. Ignore anyone approaching you in the arrivals hall."}]','[{"mode": "GoaMiles app", "tip": "Govt-backed fixed-fare taxi. Book before landing. Only reliable pre-paid option.", "approxCost": "₹800–1,200 airport → North Goa"}, {"mode": "Scooter (Royal Brothers / Onn Bikes app)", "tip": "App-based rental with GPS insurance. Saves ₹1,500+/day vs taxis.", "approxCost": "₹350–500/day"}, {"mode": "Kadamba state bus", "tip": "Safe, AC inter-city routes. Panaji ↔ Margao ↔ Mapusa.", "approxCost": "₹15–60"}]','[{"name": "The Project Café, Aldona", "type": "Boutique stay + café", "angle": "Female-founded", "why": "All-women team, 130-year Portuguese mansion. Pool, art books, design-forward interiors. The insider solo-women pick.", "approxCost": "Stay ₹6,000–15,000/night; café open to non-guests"}, {"name": "Sappadu, Assagao", "type": "Restaurant", "angle": "Female-owned", "why": "Women-run South Indian veg restaurant. Homely thalis, no tourist markup. Featured Tweak India 2025.", "approxCost": "Meal ₹350–700"}, {"name": "Mapusa Friday Market", "type": "Market", "angle": "Authentic Goan", "why": "Real Goan market without the Anjuna hawker scrum. Arrive 8am for fish section, leave before 11am heat.", "approxCost": "Free entry; budget ₹500–2,000"}]','["Book accommodation via Booking.com and call hotel to confirm reservation", "Download GoaMiles app before your flight lands", "Save Goa Police helpline in phone: 0832-2423400", "Buy travel insurance (World Nomads covers scooter accidents in India)", "Check NGT/pollution odd-even days if visiting in peak season"]','{"do": ["Use only GoaMiles or pre-agreed fixed taxi fares — no street negotiations", "Photograph scooter 360° before and after every rental", "Carry a door-stop alarm for hostel/guesthouse rooms", "Stick to South Goa beaches if it''s your first solo India trip"], "dont": ["Hand over your passport as collateral for any rental or deposit", "Accept anything from strangers on beaches — not even fruit", "Trust anyone claiming to be an off-duty police officer demanding documentation", "Book Goa villas or party packages through Instagram DMs"]}','{"backpacker": 2500, "midRange": 5500, "comfortable": 12000, "currency": "INR"}','[{"label": "Goa Police Control", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Panaji", "number": "0832-2423400"}, {"label": "Ambulance", "number": "108"}]',true,'Premium covers: the 3 hostels that actively vet solo female guests, full GoaMiles booking walkthrough with screenshots, a complete Palolem vs Agonda vs Patnem comparison, and the November shoulder-season hack that cuts mid-range accommodation costs by 40%.','{"booking": "https://www.booking.com/searchresults.html?ss=Goa&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('jaipur-india','Jaipur','India','both','neha-jaipur','2026-04-10',14,'https://images.unsplash.com/photo-1477013144938-7c68caa9f76a?w=800&q=80','["Every auto near Hawa Mahal will try to take you to a commission shop — use Uber/Ola only.", "Old City is best at dawn (7–9am) before heat and touts both hit peak intensity.", "No real ''government gem emporium'' exists at tourist spots — every one of them is commission-based.", "Nahargarh Fort after 4pm is dramatically less crowded and the light is better.", "Heritage havelis in Bani Park give you proximity to sights without the Old City chaos."]','[{"name": "Bani Park", "safetyRating": 4, "vibe": "Residential, heritage hotels, quiet streets", "stayHere": true, "notes": "15 min from all major sights, none of the Old City noise. Most solo female travelers prefer staying here."}, {"name": "Old City (Pink City)", "safetyRating": 3, "vibe": "Heritage architecture, dense markets", "stayHere": false, "notes": "Beautiful but exhausting solo. Go with a plan, use app taxis, leave before dusk."}, {"name": "C-Scheme / MI Road", "safetyRating": 4, "vibe": "Modern area, cafés, safe evenings", "stayHere": true, "notes": "For evenings out — Tapri, Curious Life Coffee, Maa restaurant. Feels like any Indian metro."}]','[{"title": "Gem/stone shop commission", "severity": "high", "where": "Near all major monuments", "what": "Auto/guide takes you to ''government emporium''; pressure sale of overpriced stones. Driver earns 30–50% cut.", "avoid": "Book rides on Uber/Ola only. Any shop described as ''government approved'' near a tourist site is not."}, {"title": "Carpet / textile commission loop", "severity": "high", "where": "Near Amber Fort, City Palace", "what": "Multi-person tag-team sales with fake ''export price'' discounts and manufactured urgency.", "avoid": "Shop independently in Johri Bazaar or Bapu Bazaar. Leave any shop you were taken to by a driver."}, {"title": "Fake entry tickets", "severity": "medium", "where": "Amber Fort queue", "what": "Touts sell ''skip-the-line'' tickets outside the gate. Tickets are counterfeit; you pay twice.", "avoid": "Buy tickets only at official ASI counters or on the ASI India website. No legitimate queue-skip exists."}, {"title": "Elephant ride ''tip'' demand", "severity": "medium", "where": "Amber Fort approach road", "what": "Ride priced at ₹500; aggressive tip and animal feed demands post-ride with crowd pressure.", "avoid": "Skip elephant rides entirely (ethical + overpriced). Amber Fort jeep taxi ₹200 is faster and cheaper."}]','[{"mode": "Uber / Ola", "tip": "Both work reliably in Jaipur. Always preferred over street autos.", "approxCost": "₹80–250 within city"}, {"mode": "Auto-rickshaw (metered)", "tip": "Insist on meter. Hawa Mahal → City Palace benchmark: ₹40–60.", "approxCost": "₹30–150"}, {"mode": "Day-hire car + driver", "tip": "Best for Amber + Nahargarh + Jal Mahal loop. Ask hotel to arrange.", "approxCost": "₹1,500–2,500/day"}]','[{"name": "Nahargarh Fort at sunset", "type": "Fort / viewpoint", "angle": "Crowd-free after 4pm", "why": "Best views of Jaipur''s pink skyline. Rooftop café open till 9pm. Army presence makes it safe.", "approxCost": "₹200 entry; café ₹200–500"}, {"name": "Galta Ji Monkey Temple", "type": "Temple complex", "angle": "Off tourist trail", "why": "Ancient temple in a gorge — monkeys, pilgrims, zero commission touts. Best 7–9am.", "approxCost": "₹50 entry"}, {"name": "Rajasthali Government Emporium, MI Road", "type": "Shopping", "angle": "Genuine fixed price", "why": "Actual state craft store. Fixed prices, no commission, quality Blue Pottery and block prints.", "approxCost": "Blue Pottery ₹500–3,000"}]','["Book heritage hotel in Bani Park or Civil Lines, not the Old City", "Download Uber/Ola before arrival — don''t negotiate with autos from monuments", "Buy Amber Fort tickets on ASI India website to skip the queue", "Check Jaipur Literature Festival dates if visiting in January", "Carry ₹500–1,000 in small bills for bazaar shopping"]','{"do": ["Browse Johri Bazaar and Bapu Bazaar independently — no guide needed", "Visit Amber Fort at 8am opening to beat both heat and crowds", "Use Rajasthali on MI Road for authentic fixed-price Rajasthani crafts", "Ask your hotel staff (not auto drivers) for restaurant recommendations"], "dont": ["Accept auto rides to ''government-approved'' gem or carpet shops", "Engage with any ''export wholesale'' fabric pitch near tourist sites", "Share your hotel name or onward plans with persistent strangers", "Ride elephants at Amber Fort — choose jeep or walking instead"]}','{"backpacker": 1800, "midRange": 4000, "comfortable": 9000, "currency": "INR"}','[{"label": "Jaipur Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Jaipur", "number": "0141-5110595"}, {"label": "Ambulance", "number": "108"}]',true,'Premium covers: exact Hawa Mahal early-access hack (saves 90 min queuing), two heritage hotels with women-only floors, 8-day Rajasthan circuit itinerary (Jaipur → Jodhpur → Udaipur), and female artisan workshop visits where the money goes directly to the maker.','{"booking": "https://www.booking.com/searchresults.html?ss=Jaipur&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('varanasi-india','Varanasi','India','both','ananya-mumbai','2026-04-10',9,'https://images.unsplash.com/photo-1561361513-2d8ab5bad3f4?w=800&q=80','["Allow 3 full days minimum — Varanasi cannot be rushed and rushing makes you a better scam target.", "Morning boat ride on the Ganges at sunrise is the single non-negotiable experience; book night before.", "Never accept ''free'' blessings, sindoor, or marigolds at ghats — a donation demand follows instantly.", "Bhang lassi is legal here and widely served — know exactly what you''re ordering before you drink.", "Assi Ghat area is calmer and safer for solo women than the main Dashashwamedh Ghat strip."]','[{"name": "Assi Ghat", "safetyRating": 4, "vibe": "Quieter south end, guesthouses, yoga, cafés", "stayHere": true, "notes": "Best solo-female base. Morning yoga on the ghats, safe café culture. 20 min walk from main ghats."}, {"name": "Godaulia / Dashashwamedh", "safetyRating": 3, "vibe": "Dense, intense, highest foot traffic", "stayHere": false, "notes": "Stay only if you want the full immersion. Overwhelming for first-timers. Touts are constant."}, {"name": "Cantonment / Sigra", "safetyRating": 4, "vibe": "Modern, hotels, away from ghat chaos", "stayHere": true, "notes": "Budget mid-range hotels with working AC. Good if you want to retreat from the intensity."}]','[{"title": "Ghat tout to silk shop", "severity": "high", "where": "All major ghats", "what": "Friendly ''student'' or ''priest'' offers to show you a lesser-known temple, ends at family silk shop.", "avoid": "Decline all unsolicited guiding. Hire a licensed guide through your guesthouse only."}, {"title": "Boat ride overcharge", "severity": "high", "where": "All ghat boat launch points", "what": "₹200 sunrise ride quoted; ₹2,000 demanded on return claiming ''per person, not per boat''.", "avoid": "Fix total price and occupancy in writing (phone note, photo) before boarding. Confirm: this is total price."}, {"title": "Fake Ganga Aarti ''donation''", "severity": "medium", "where": "Dashashwamedh Ghat", "what": "Man with collection box claims proceeds go to the Aarti organisation. Not affiliated.", "avoid": "Ganga Aarti is free to watch. No official donation collection exists. Ignore all collection boxes."}, {"title": "Bhang-spiked food or drink", "severity": "high", "where": "Lassi shops, street stalls", "what": "Bhang (cannabis) added to food without disclosure. Disorientation leads to theft or worse.", "avoid": "Only order from clearly labelled bhang shops. Never accept food/drinks from strangers near ghats."}]','[{"mode": "Cycle rickshaw", "tip": "Best for narrow gali (lane) navigation. Agree price before riding.", "approxCost": "₹30–100 within ghat area"}, {"mode": "Auto-rickshaw", "tip": "For Cantonment ↔ ghats. Insist on meter or fixed price.", "approxCost": "₹50–150"}, {"mode": "Pre-paid taxi (station/airport)", "tip": "Book at official pre-paid counter only — ignore touts outside.", "approxCost": "₹300–500 from Varanasi Junction"}]','[{"name": "Manikarnika Ghat at dawn", "type": "Sacred ghat", "angle": "Off the tourist script", "why": "The burning ghat is visited by many but understood by few. Go at 6am with a licensed local guide who explains context respectfully.", "approxCost": "Guide ₹500–800"}, {"name": "Blue Lassi Shop, Godaulia", "type": "Café", "angle": "Legendary solo stop", "why": "75-year-old family-run lassi stall. The original. Cash only, arrive before 11am before the line forms.", "approxCost": "₹80–150"}, {"name": "Ramnagar Fort", "type": "Fort / museum", "angle": "Away from ghat crowds", "why": "Across the river, no touts, old royal collection. Takes half a day. Best combined with sunset river crossing.", "approxCost": "₹25 entry"}]','["Book sunrise boat ride through your guesthouse the evening before", "Carry a scarf to cover shoulders and head at all temple and ghat sites", "Download offline Varanasi map (Maps.me) — alleys have no signal", "Confirm train onward to next destination — Varanasi Junction gets very crowded", "Keep ₹100–200 in exact change for boat rides, rickshaws, and temple donations"]','{"do": ["Hire only licensed guides through your guesthouse, not ghat touts", "Agree total boat ride price and passenger count before boarding", "Stay in Assi Ghat area for calmer mornings and safer evenings", "Attend Ganga Aarti at Dashashwamedh Ghat — arrive 30 min early for a standing spot"], "dont": ["Accept free marigolds, sindoor, or blessings from anyone at the ghats", "Drink or eat anything offered by a stranger near any ghat", "Follow anyone offering to show you a ''lesser-known temple'' or ''secret ceremony''", "Photograph burning ghats without explicit permission from the family present"]}','{"backpacker": 1500, "midRange": 3500, "comfortable": 8000, "currency": "INR"}','[{"label": "Varanasi Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Varanasi", "number": "0542-2502020"}, {"label": "Ambulance", "number": "108"}]',true,'Premium covers: the 4 guesthouses with women-only floors on Assi Ghat, exact guide to navigating Manikarnika ethically, a Varanasi → Sarnath day-trip itinerary with female-led guide contact, and the Benares Hindu University campus walk (secretly one of the safest and most beautiful morning walks in the city).','{"booking": "https://www.booking.com/searchresults.html?ss=Varanasi&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('manali-india','Manali','India','indian','ananya-mumbai','2026-04-10',8,'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80','["Old Manali is for backpackers and café culture; New Manali has ATMs, pharmacies, and reliable transport.", "Rohtang Pass requires an NGT online permit — book minimum 2 days in advance, slots fill fast.", "July–August is peak monsoon; landslides close the Manali–Leh highway with zero warning.", "Altitude sickness starts around 2,050m — acclimatise for a full day before trekking anywhere.", "Solo after 10pm in New Manali: stay in. Old Manali lanes are fine until sunset, not after."]','[{"name": "Old Manali", "safetyRating": 4, "vibe": "Backpacker cafés, Israeli vibe, chill lanes", "stayHere": true, "notes": "Best solo-female atmosphere. Dragon Café, Café 1947, Dylan''s Toasted & Roasted. Quiet by 10pm."}, {"name": "New Manali (Mall Road)", "safetyRating": 3, "vibe": "Busy, ATMs, transport, shops", "stayHere": false, "notes": "Practical for logistics; avoid budget hotels here — they face the noisy bus stand."}, {"name": "Vashisht village", "safetyRating": 4, "vibe": "Hot springs, guesthouses, temple, calm", "stayHere": true, "notes": "15 min from Mall Road. Female-friendly guesthouses, sulphur hot springs, Vashisht Temple."}]','[{"title": "Rohtang Pass fake permit service", "severity": "high", "where": "Near bus stands and travel agents", "what": "Touts sell ''guaranteed permits'' for ₹1,500–2,000. NGT permits are free and online only.", "avoid": "Book only at https://rohtangpermits.nic.in — free, government website. No middleman needed."}, {"title": "Solang Valley overcharge", "severity": "medium", "where": "Solang Valley activity stalls", "what": "Snow activity prices quoted per-person but charged per-item post-activity with add-ons.", "avoid": "Agree full itemised price in writing before any activity. Walk away if price changes."}, {"title": "Fake trek guide", "severity": "medium", "where": "Old Manali cafés and guesthouses", "what": "Self-described guides with no certification take inexperienced trekkers on dangerous routes.", "avoid": "Hire only ITBP-certified guides through registered trek agencies. Ask for licence number."}]','[{"mode": "HRTC Volvo bus (Delhi → Manali)", "tip": "Overnight AC sleeper. Most reliable option; book on HRTC website.", "approxCost": "₹700–1,400 Delhi → Manali"}, {"mode": "Shared taxi / cab", "tip": "For Solang Valley, Rohtang, Naggar. Pre-book via guesthouse.", "approxCost": "₹300–800/day shared"}, {"mode": "Local auto-rickshaw", "tip": "Within New Manali and between Vashisht and Mall Road.", "approxCost": "₹30–80"}]','[{"name": "Naggar Castle", "type": "Heritage fort / café", "angle": "Crowd-free heritage", "why": "15th-century stone castle with Roerich Art Gallery and valley views. Almost no tourists on weekdays.", "approxCost": "₹100 entry"}, {"name": "Café 1947, Old Manali", "type": "Café", "angle": "Solo-women favourite", "why": "The original Old Manali café. Israeli breakfast, good filter coffee, safe for solo mornings.", "approxCost": "Meal ₹250–500"}, {"name": "Hamta Pass day trek base", "type": "Trek", "angle": "Gateway to high-altitude", "why": "Hamta Pass (4,270m) trek starts near Jobra. Day-hike to Chika meadow is doable solo.", "approxCost": "Guide ₹800–1,500/day"}]','["Book Rohtang Pass NGT permit at rohtangpermits.nic.in (free, 2 days ahead)", "Carry altitude sickness tablets (Diamox) from a pharmacy before ascending", "Download offline HRTC bus schedule — connectivity drops above Kullu", "Pack a down jacket regardless of season — nights drop to 5°C even in July", "Check Manali–Leh highway status on HP Traffic Police Twitter before Leh plans"]','{"do": ["Acclimatise for one full day in Manali before any high-altitude activity", "Stay in Old Manali or Vashisht for the best solo-female guesthouse culture", "Book treks only through registered agencies with ITBP-certified guides", "Carry ₹5,000+ in cash — ATMs in Lahaul-Spiti area frequently run out"], "dont": ["Trek alone above 3,000m without an acclimatisation day and a registered guide", "Ignore the ''road closed'' signs on the Rohtang approach during monsoon", "Pay any middleman for Rohtang permits — they are free and online-only", "Drive rented bikes above Rohtang without proper gear and experience"]}','{"backpacker": 2000, "midRange": 4500, "comfortable": 10000, "currency": "INR"}','[{"label": "Manali Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Kullu–Manali Hospital", "number": "01902-252779"}, {"label": "ITBP Emergency", "number": "01902-252533"}]',true,'Premium covers: the 5 guesthouses in Old Manali rated safest by solo female travellers, exact Spiti Valley extension itinerary (Manali → Kaza → Chandratal, 7 days), monsoon-season alternatives when Rohtang is closed, and winter (Dec–Feb) Manali survival guide.','{"booking": "https://www.booking.com/searchresults.html?ss=Manali&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('rishikesh-india','Rishikesh','India','both','priya-kochi','2026-04-10',11,'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800&q=80','["Rishikesh is the global yoga capital — but 30% of ''ashrams'' are unregulated and target foreign women.", "Laxman Jhula bridge is the beating heart of the backpacker belt; stay within 1km of it.", "Bungee jumping and white-water rafting are legitimate and world-class here — use only registered operators.", "Most of the town is alcohol and meat free; this is a genuine religious city, not a performance.", "Monsoon (Jul–Sep): Ganges floods, rafting closed, ghats underwater — plan around this."]','[{"name": "Laxman Jhula", "safetyRating": 4, "vibe": "Backpacker belt, cafés, yoga studios, shopping", "stayHere": true, "notes": "Best solo-female base. Walkable to most activities. German Bakery, Little Buddha Café."}, {"name": "Ram Jhula / Swarg Ashram", "safetyRating": 3, "vibe": "Ashram-dense, religious, intense", "stayHere": false, "notes": "Beautiful but requires constant polite boundary-setting. Better as day visit from Laxman Jhula."}, {"name": "Tapovan", "safetyRating": 4, "vibe": "Upscale yoga retreats, calm, riverside resorts", "stayHere": true, "notes": "For mid-range to premium stays. Quieter than Laxman Jhula. 5-min auto ride."}]','[{"title": "Predatory yoga ashram / guru", "severity": "critical", "where": "Ram Jhula area and online listings", "what": "Unregistered ''guru'' targets foreign women for extended retreat. Isolation, manipulation, financial drain.", "avoid": "Research on forums (TripAdvisor, Lonely Planet Thorntree) before booking any retreat. Never pay more than 2 weeks upfront."}, {"title": "Rafting overcharge and fake safety", "severity": "high", "where": "Marine Drive rafting operators", "what": "Unlicensed operator quotes ₹400 ''discount'' rafting; no safety briefing, no life jacket inspection.", "avoid": "Use only TURA (Uttarakhand Rafting Association) registered operators. Ask for licence number. Min age/weight rules exist for safety."}, {"title": "''Blessing'' donation trap", "severity": "medium", "where": "Ghats and temple entrances", "what": "Priest offers forehead tilak or sacred thread; donation of ₹1,000–5,000 demanded before you can leave.", "avoid": "Decline politely and firmly. No temple in Rishikesh charges for entry or mandates donations."}]','[{"mode": "Shared auto (Haridwar ↔ Rishikesh)", "tip": "Cheapest and most used. Runs constantly.", "approxCost": "₹40–80"}, {"mode": "Cycle rickshaw (within town)", "tip": "Best for navigating the narrow lanes of the ashram belt.", "approxCost": "₹30–80"}, {"mode": "AC bus (Delhi → Rishikesh)", "tip": "UPSRTC or private Volvo. 6–7 hours, comfortable.", "approxCost": "₹400–700"}]','[{"name": "Beatles Ashram (Chaurasi Kutia)", "type": "Abandoned ashram / street art", "angle": "Instagram but actually worth it", "why": "Where the Beatles studied TM in 1968. Now an open ruin with excellent graffiti. Fee is worth it for the quiet.", "approxCost": "₹150 entry (foreigners ₹600)"}, {"name": "Neer Garh Waterfall", "type": "Waterfall trek", "angle": "45-min hike from Laxman Jhula", "why": "Short jungle trek to a multi-tiered waterfall. Best on weekday mornings. Safe for solo.", "approxCost": "₹50 entry"}, {"name": "Chotiwala restaurant (original)", "type": "Legendary restaurant", "angle": "Split-location story", "why": "The original 1958 restaurant has a rival next door with the same name. This one has the original costumed doorman on the left.", "approxCost": "Thali ₹180–300"}]','["Research any yoga retreat or ashram on TripAdvisor and Lonely Planet Thorntree forums before booking", "Book white-water rafting with a TURA-registered operator (ask for licence number)", "Carry a scarf for temples and ashrams — exposed shoulders aren''t welcome", "Pack mosquito repellent — riverside location means evening bites", "Check Ganges flood status if visiting June–September"]','{"do": ["Stay in Laxman Jhula area for the best balance of safety and social vibe", "Book yoga classes at established studios (Sivananda, Parmarth Niketan) not street-tout pop-ups", "Attend the Parmarth Ganga Aarti at sunset — free, spectacular, and genuinely moving", "Use TURA-registered rafting operators even if they cost ₹200 more"], "dont": ["Pay more than 2 weeks upfront for any ashram or retreat programme", "Accept invitations to private ''meditation sessions'' with individual gurus", "Raft with any operator who skips the safety briefing or life-jacket check", "Swim in the Ganges during or after monsoon — current is dangerous"]}','{"backpacker": 1500, "midRange": 3500, "comfortable": 7500, "currency": "INR"}','[{"label": "Rishikesh Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "AIIMS Rishikesh", "number": "0135-2462941"}, {"label": "Ambulance", "number": "108"}]',true,'Premium covers: vetted list of 6 yoga retreats safe for solo foreign women (with red flags to watch for), the Rishikesh–Chopta–Tungnath trek guide (3 days, beginner-friendly), best riverside guesthouses with women-only floors, and a Haridwar day-trip add-on guide.','{"booking": "https://www.booking.com/searchresults.html?ss=Rishikesh&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('delhi-india','Delhi','India','both','leila-delhi','2026-04-10',15,'https://images.unsplash.com/photo-1587474135619-672929a8af76?w=800&q=80','["Delhi Metro is your best friend — safe, AC, women-only coaches on every train.", "Old Delhi (Chandni Chowk) is overwhelming and scam-dense; go with a plan and leave by 6pm.", "Prepaid taxi booth inside IGI Airport arrivals is the only safe airport exit — ignore everyone else.", "Connaught Place touts will claim the tourist office is closed/moved; it is not — walk in yourself.", "South Delhi (Hauz Khas, Saket, Lodi Colony) is a different city — modern, safe, great food."]','[{"name": "Hauz Khas / South Delhi", "safetyRating": 5, "vibe": "Cafés, boutiques, safe nights, metro access", "stayHere": true, "notes": "Best base for solo women. Hauz Khas Village has rooftop bars; Lodi Colony has street art and Green''s Café."}, {"name": "Paharganj", "safetyRating": 2, "vibe": "Budget hotel strip, backpacker chaos, near New Delhi station", "stayHere": false, "notes": "Cheap but high harassment and scam density. Only stay if you''re catching an early train and need proximity."}, {"name": "Connaught Place / CP", "safetyRating": 3, "vibe": "Commercial centre, heritage architecture, central", "stayHere": true, "notes": "Good for day visits. Underground metro-connected. High tout density; walk confidently and ignore everyone."}]','[{"title": "Tourist office ''closed/moved'' scam", "severity": "critical", "where": "Connaught Place, New Delhi station", "what": "Tout or friendly stranger claims India Tourism office is closed and offers to take you to a ''government-approved'' travel agent.", "avoid": "India Tourism Delhi office (88 Janpath) is open Mon–Fri 9am–6pm. Walk in yourself. Never follow strangers."}, {"title": "Airport taxi tout", "severity": "high", "where": "IGI Airport arrivals hall", "what": "Aggressive men claim your pre-booked cab cancelled and offer cash rides. Overcharge ₹2,000–5,000.", "avoid": "Use only the official Prepaid Taxi booth inside arrivals, or book Uber/Ola before landing and walk to the app-taxi pick-up zone."}, {"title": "Gem export investment scam", "severity": "high", "where": "Paharganj, Connaught Place", "what": "Long con: ''businessman'' offers you commission to carry gems as exports. Fake gems, real customs trouble.", "avoid": "Never agree to carry anything for anyone. No legitimate gem exporter needs a tourist as a courier."}, {"title": "Cycle rickshaw price switch", "severity": "medium", "where": "Old Delhi, Paharganj", "what": "Price agreed; demand doubles on arrival citing ''per person'' or ''per bag'' surcharges.", "avoid": "State destination and total price before boarding. Confirm: ''This is the total, for both of us, for all bags.''"}]','[{"mode": "Delhi Metro", "tip": "Safest and fastest. Women-only coach (first coach, marked pink) on every line.", "approxCost": "₹10–60 per journey"}, {"mode": "Uber / Ola", "tip": "Both fully operational in Delhi. Preferred for night journeys.", "approxCost": "₹80–300 within city"}, {"mode": "Prepaid taxi (IGI Airport)", "tip": "Official booth inside T2/T3 arrivals. Fixed fares, no negotiation.", "approxCost": "₹400–700 to central Delhi"}]','[{"name": "Lodi Garden at sunrise", "type": "Heritage park", "angle": "Secret morning Delhi", "why": "Mughal-era tombs inside a manicured park. At 7am: joggers, silence, photogenic mist. Zero touts.", "approxCost": "Free entry"}, {"name": "Hauz Khas Complex (village end)", "type": "Ruins + lake", "angle": "Medieval deer park", "why": "14th-century madrasa and tomb above a deer park lake. End of Hauz Khas Village — walk through the boutiques to reach it.", "approxCost": "Free"}, {"name": "Paranthe Wali Gali, Chandni Chowk", "type": "Street food lane", "angle": "The only tourist trap worth it", "why": "145-year-old lane of stuffed paratha shops. Genuinely delicious. Agree price before sitting down.", "approxCost": "₹80–150 per paratha"}]','["Download Delhi Metro app and top up a Metro Smart Card on arrival", "Book airport transfer via Uber/Ola app before landing — prepaid taxi as backup", "Save India Tourism Delhi helpline: 1800-111-363 (free, English)", "Check air quality index (AQI Delhi) before travel — Nov–Jan can be severe", "Book Agra day-trip train (Gatimaan Express or Shatabdi) on IRCTC app in advance"]','{"do": ["Use the metro women-only coach for every journey — it is safe and enforced", "Walk into India Tourism office on Janpath yourself; ignore all claims it is closed", "Explore Lodi Colony street art and Lodi Garden as a morning pair", "Eat at Karim''s in Old Delhi for lunch — old establishment, table service, safe"], "dont": ["Follow any stranger who claims to be a ''student'' wanting to practice English", "Accept auto or taxi rides from touts inside the airport arrivals hall", "Walk Paharganj lanes alone after dark", "Agree to carry any package or parcel for anyone, however friendly they seem"]}','{"backpacker": 1800, "midRange": 4000, "comfortable": 9000, "currency": "INR"}','[{"label": "Delhi Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "India Tourism Delhi", "number": "1800-111-363"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Delhi&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER", "airalo": "https://www.airalo.com/india-esim?ref=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('agra-india','Agra','India','both','sara-berlin','2026-04-10',10,'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80','["Taj Mahal at sunrise (gates open 6am) means 90 minutes of soft light before bus tours arrive.", "Agra Fort and Fatehpur Sikri are world-class and almost always skipped — don''t skip them.", "Agra is a 2-night city maximum; most people do it as a Golden Triangle stop, not a base.", "The area around Taj Mahal''s south gate is the highest scam-density zone in India.", "Book Taj Mahal tickets on the ASI India website the night before — gate tickets sell out."]','[{"name": "Taj Ganj (south gate area)", "safetyRating": 2, "vibe": "Closest to Taj, maximum tout density", "stayHere": false, "notes": "Budget hotels here but you''ll run a gaunt of scams every time you step outside. Stay in Sadar Bazaar instead."}, {"name": "Sadar Bazaar", "safetyRating": 4, "vibe": "Lively market area, better hotels, 10 min to Taj", "stayHere": true, "notes": "Best balance of convenience and calm. Dasaprakash for South Indian food; Pind Balluchi for North Indian."}]','[{"title": "Fake Taj Mahal ticket office", "severity": "critical", "where": "South gate approach road", "what": "Official-looking ''ticket office'' sells counterfeit tickets. You pay twice at the real gate.", "avoid": "Buy only at official ASI booth at the gate, or online at asi.payumoney.com the night before."}, {"title": "Marble inlay ''factory'' commission", "severity": "high", "where": "Agra-wide, tout-assisted", "what": "Rickshaw takes you to ''government marble workshop''. Overpriced souvenirs with heavy sales pressure.", "avoid": "Genuine marble inlay artisans sell in Sadar Bazaar at half the price with no commission markup."}, {"title": "Auto-rickshaw price flip", "severity": "medium", "where": "Outside Taj gates", "what": "₹100 agreed for return ride; ₹500 demanded on return citing ''waiting time''.", "avoid": "Agree total return price including waiting before departing. Use Uber/Ola if available."}]','[{"mode": "Tonga (horse carriage) or e-rickshaw", "tip": "Mandatory for Taj Mahal approach — no petrol vehicles within 500m.", "approxCost": "₹50–150"}, {"mode": "Uber / Ola", "tip": "Available in Agra. Best for Agra Fort ↔ Taj ↔ Fatehpur Sikri day-loop.", "approxCost": "₹100–400"}, {"mode": "Gatimaan Express (Delhi → Agra)", "tip": "Fastest train, 1h35m. Book on IRCTC 60 days ahead.", "approxCost": "₹750 (AC chair car)"}]','[{"name": "Taj Mahal at sunrise, west gate", "type": "UNESCO monument", "angle": "Fewer crowds than south gate", "why": "West gate (Shilpgram entrance) has shorter queues than south gate. Book west-gate tickets.", "approxCost": "₹1,100 (foreigners); ₹50 (Indian)"}, {"name": "Mehtab Bagh at sunset", "type": "Mughal garden", "angle": "Taj reflection view", "why": "Garden directly north of Taj across the river. Perfect Taj reflection in the water tank at sunset. Almost no crowds.", "approxCost": "₹300 entry"}, {"name": "Agra Fort inner zenana", "type": "Fort", "angle": "Often missed by day-trippers", "why": "The women''s quarters (zenana) inside Agra Fort have the best Taj view in existence — from Shah Jahan''s prison cell.", "approxCost": "₹650 (foreigners); ₹40 (Indian)"}]','["Book Taj Mahal tickets online at asi.payumoney.com the evening before", "Set alarm for 5:30am — Taj gates open 6am and sunrise light is 6:30–8am", "Book Gatimaan Express or Shatabdi on IRCTC app well in advance", "Carry exact change for e-rickshaw to Taj south gate (₹50–100)", "Pack sunscreen and a hat — Agra has zero shade between sites"]','{"do": ["Enter via west gate for shorter queues, same monument", "Visit Agra Fort the afternoon of arrival — it is genuinely spectacular and always uncrowded", "Buy marble souvenirs from Sadar Bazaar artisans, not commission shops", "Do Mehtab Bagh at sunset as your last activity — it is free of touts"], "dont": ["Buy Taj tickets from any booth on the approach road — official only", "Accept free marigold garlands or ''blessings'' outside the Taj gates", "Agree to an auto return price that isn''t fixed before you depart", "Skip Fatehpur Sikri — it is 40km away and completely worth the detour"]}','{"backpacker": 1500, "midRange": 3500, "comfortable": 8000, "currency": "INR"}','[{"label": "Agra Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Agra", "number": "0562-2421204"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Agra&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('mumbai-india','Mumbai','India','both','ananya-mumbai','2026-04-10',13,'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&q=80','["Mumbai local trains have women-only coaches — use them; the general coaches during peak hour are not safe.", "Mumbai is India''s safest major city for solo women at night, but marine drive after midnight is still solo-avoid.", "Taxis (black-and-yellow) are metered and honest here; Uber/Ola also fully operational.", "Colaba Causeway is pick-pocket central — use a crossbody bag with the clasp facing inward.", "Dharavi is a thriving urban township, not a tragedy — the Reality Tours guided visit is genuinely excellent."]','[{"name": "Bandra West", "safetyRating": 5, "vibe": "Trendy, safe, restaurants, nightlife, sea link views", "stayHere": true, "notes": "Best solo-female base in Mumbai. Carter Road, Hill Road, Linking Road. Metro and local train access."}, {"name": "Colaba", "safetyRating": 4, "vibe": "Heritage, Taj hotel, cafés, tourist belt", "stayHere": true, "notes": "Gateway of India, Leopold Café, Mondegar. Tourist-dense but safe. Pick-pocket aware at Causeway market."}, {"name": "Juhu / Andheri West", "safetyRating": 4, "vibe": "Airport-close, Bollywood adjacent, beach", "stayHere": true, "notes": "Good for transit stays near airport. Juhu Beach at sunset is pleasant; skip after 9pm."}]','[{"title": "Colaba Causeway pick-pockets", "severity": "medium", "where": "Colaba Causeway market", "what": "Deliberate jostling in the narrow market lanes; wallet or phone lifted in the crowd.", "avoid": "Crossbody bag, clasp facing your body. Phone in front pocket. Don''t pull out wallet in the market."}, {"title": "Taxi meter ''broken'' scam", "severity": "medium", "where": "Airport exits, Colaba", "what": "Driver claims meter is broken and quotes fixed (inflated) fare.", "avoid": "All Mumbai black-and-yellow taxis must use meters. If it''s ''broken'', take another cab or use Uber."}, {"title": "Gateway of India boat ''tour''", "severity": "medium", "where": "Gateway of India pier", "what": "Unlicensed boat operators quote ₹200 for Elephanta ferry; takes you on an unscheduled ''tour'' instead.", "avoid": "Buy Elephanta Island ferry tickets only at the MTDC booth on the pier — orange, official signage."}]','[{"mode": "Mumbai local train (women''s coach)", "tip": "First coach from Western Line; marked with a ''W''. Safe, fast, ₹5–20.", "approxCost": "₹5–20"}, {"mode": "Uber / Ola", "tip": "Fully operational. Better than autos for cross-city journeys.", "approxCost": "₹100–400"}, {"mode": "Black-and-yellow taxi", "tip": "Metered, reliable, iconic. Insist on meter — drivers almost always comply.", "approxCost": "₹30–200"}]','[{"name": "Dhobi Ghat viewing platform", "type": "Urban landmark", "angle": "Best at 8am", "why": "The world''s largest open-air laundry. Watch from the bridge on Dr E Moses Road. Zero touts, surprisingly meditative.", "approxCost": "Free"}, {"name": "Dharavi township tour (Reality Tours)", "type": "Guided urban experience", "angle": "Ethical and eye-opening", "why": "80% of profits go to Dharavi community projects. The best urban sociology experience in India. Book in advance.", "approxCost": "₹700–1,200"}, {"name": "Worli Sea Face at sunset", "type": "Promenade", "angle": "Local Mumbai, not tourist", "why": "Less crowded than Marine Drive. Sea Link views. Locals jog here; safe, pleasant, real Mumbai.", "approxCost": "Free"}]','["Download Mumbai local train map offline — Western, Central, and Harbour lines", "Book Elephanta Island ferry at MTDC pier booth, not from touts", "Save Mumbai Police helpline: 100 and Women''s helpline: 103", "Check monsoon dates — July–August, Mumbai floods badly and local trains halt", "Carry a small crossbody bag for Colaba Causeway shopping"]','{"do": ["Use the women''s coach on all local train journeys — it is safe and air-conditioned on newer trains", "Eat at Britannia & Co in Ballard Estate — 100-year-old Irani café, unmissable berry pulao", "Walk Marine Drive at sunrise for the best crowd-free Gateway view", "Take the Reality Tours Dharavi visit — context changes everything"], "dont": ["Travel in general coach of local trains during 8–10am or 5–8pm peak hours", "Buy Elephanta ferry tickets from anyone other than the official MTDC booth", "Leave valuables in your hotel room — use the safe or carry them", "Dismiss Dharavi as unsafe — it is a working township and the tour is genuinely safe"]}','{"backpacker": 2500, "midRange": 5000, "comfortable": 12000, "currency": "INR"}','[{"label": "Mumbai Police", "number": "100"}, {"label": "Women''s Helpline", "number": "103"}, {"label": "Tourist Helpline", "number": "1800-22-1363"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Mumbai&aid=PLACEHOLDER", "worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('bangalore-india','Bangalore','India','both','riya-bangalore','2026-04-10',10,'https://images.unsplash.com/photo-1596176530799-ede15e49ada9?w=800&q=80','["Bangalore is India''s most liveable city for solo women — the tech culture genuinely shifts the baseline.", "Namma Metro (Purple + Green lines) is excellent; women-only coach in every train.", "MG Road and Brigade Road are the tourist belts; Indiranagar and Koramangala are where locals actually go.", "Traffic is brutal — build 2× the expected travel time into any schedule.", "The microbrewery scene here is world-class and solo-female-comfortable; Arbor is the benchmark."]','[{"name": "Indiranagar", "safetyRating": 5, "vibe": "Cafés, craft beer, boutiques, young crowd, metro-connected", "stayHere": true, "notes": "The solo-female ideal base. 100 Feet Road for food and nightlife; safe auto culture."}, {"name": "Koramangala", "safetyRating": 5, "vibe": "Startup district, restaurants, 24-hour cafés", "stayHere": true, "notes": "Great food at all price points. Social is the best microbrewery. Well-lit streets, Uber always available."}, {"name": "MG Road / Brigade Road", "safetyRating": 3, "vibe": "Commercial, hotel strip, tourist-adjacent", "stayHere": false, "notes": "Fine for transit; hotels here are expensive and the neighbourhood is more chaotic than Indiranagar."}]','[{"title": "Airport taxi overcharge", "severity": "medium", "where": "KIA Airport exits", "what": "Touts quote ₹1,500–2,500 for city-centre rides; KIAS pre-paid is ₹700–900.", "avoid": "Use KIAS pre-paid taxi counter inside arrivals, or book Uber/Ola before landing."}, {"title": "MG Road gem store", "severity": "medium", "where": "MG Road / Commercial Street", "what": "Same gem commission chain as Jaipur but less common. Friendly stranger leads to ''export store''.", "avoid": "Ignore unsolicited guided shopping from strangers. Shop independently in Chickpete wholesale market."}]','[{"mode": "Namma Metro", "tip": "Purple and Green lines cover most tourist areas. Women-only coach, first in train.", "approxCost": "₹10–55"}, {"mode": "Uber / Ola / Rapido", "tip": "All three fully operational. Rapido bike-taxi cheapest for short hops.", "approxCost": "₹50–250"}, {"mode": "BMTC Volvo AC bus", "tip": "Covers routes metro doesn''t. Route 500-series covers airport.", "approxCost": "₹5–50"}]','[{"name": "Arbor Brewing Company, Indiranagar", "type": "Microbrewery", "angle": "Benchmark Bangalore craft beer", "why": "The craft beer that started the Bangalore microbrewery scene. Solo-female comfortable, excellent food.", "approxCost": "Beer ₹400–600; meal ₹600–1,200"}, {"name": "ISKCON Temple, Rajajinagar", "type": "Temple complex", "angle": "Spectacular Hare Krishna campus", "why": "Massive, calm, beautifully maintained temple complex. Free entry, no touts, good prasadam meals.", "approxCost": "Free entry; meal ₹50–100"}, {"name": "Cubbon Park morning walk", "type": "Urban park", "angle": "Local Bangalore morning ritual", "why": "150-year-old park in the city centre. 8am: joggers, dogs, families. Safe for solo women at all daylight hours.", "approxCost": "Free"}]','["Download Namma Metro app and top up a Bangalore Metro smart card", "Book hotel in Indiranagar or Koramangala, not MG Road corridor", "Save Bangalore Women''s Helpline: 1091 and Police: 100", "Allow extra travel time — Bangalore traffic is genuinely bad at 9am and 6pm", "Book Coorg or Chikmagalur day trip through a registered tour operator if extending trip"]','{"do": ["Base yourself in Indiranagar for the best solo-female food and café culture", "Use Namma Metro for all metro-connected journeys — faster than road always", "Visit ISKCON Temple at 7am for the morning aarti — peaceful and crowd-free", "Eat at MTR (Mavalli Tiffin Room) in Lalbagh for the authentic Bangalore breakfast experience"], "dont": ["Accept cab rides from touts at KIA Airport — use the pre-paid counter or app", "Plan more than 3 sights in a day — traffic will defeat you", "Miss the microbrewery belt in Indiranagar/Koramangala for at least one evening", "Ignore the day-trip options — Coorg, Chikmagalur, and Hampi are all reachable"]}','{"backpacker": 2000, "midRange": 4500, "comfortable": 10000, "currency": "INR"}','[{"label": "Bangalore Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Namma Metro helpline", "number": "080-22969999"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Bangalore&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('kolkata-india','Kolkata','India','both','leila-delhi','2026-04-10',8,'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80','["Kolkata is one of India''s safest cities for solo women — the street culture is genuinely different.", "The Metro is clean, safe, and has women-only coaches; yellow taxis are metered and reliable.", "Park Street is the nightlife and café spine; Ballygunge and Lake Road are the best residential bases.", "Howrah Bridge at dawn (6–7am) is one of the most photogenic 20 minutes in India — and there are almost no touts.", "Budget ₹3–4 days: Kumartuli potters'' quarter and New Market are completely off most tourist itineraries."]','[{"name": "Ballygunge / Lake Road", "safetyRating": 5, "vibe": "Residential, safe, cafés, easy Metro access", "stayHere": true, "notes": "Best solo-female base. Quiet tree-lined streets, excellent food at all price points, feels like old Calcutta."}, {"name": "Park Street", "safetyRating": 4, "vibe": "Restaurants, cafés, colonial architecture, nightlife", "stayHere": true, "notes": "Flurys for breakfast, Peter Cat for dinner. Well-lit evenings. Safe for solo dining and walking."}, {"name": "Sudder Street (backpacker belt)", "safetyRating": 3, "vibe": "Budget hotels, tourist-adjacent, central", "stayHere": false, "notes": "Functional and cheap but scruffier than Ballygunge. Fine as a base; just less pleasant to walk around."}]','[{"title": "Howrah station taxi overcharge", "severity": "medium", "where": "Howrah and Sealdah stations", "what": "Unofficial taxis cluster at exits; quote 3× meter rates to confused arrivals.", "avoid": "Walk to the prepaid taxi booth inside both stations. Kolkata yellow taxis outside also use meters — insist."}, {"title": "New Market ''closed today'' redirect", "severity": "medium", "where": "New Market entrance, Esplanade", "what": "Tout claims New Market is closed for a holiday and offers to take you to a ''better'' market (his commission shop).", "avoid": "New Market is almost never closed. Walk past the tout and enter yourself."}, {"title": "Fake donation for Mother Teresa''s home", "severity": "medium", "where": "Near Kalighat", "what": "Man with official-looking clipboard solicits ''donations'' for Missionaries of Charity.", "avoid": "Missionaries of Charity does not collect street donations. Donate only on their official website."}]','[{"mode": "Kolkata Metro", "tip": "Blue Line covers Park Street to Howrah. Women-only coach, first in train.", "approxCost": "₹5–30"}, {"mode": "Yellow Ambassador taxi (metered)", "tip": "Iconic and honest. Insist on meter — drivers comply.", "approxCost": "₹30–150"}, {"mode": "Uber / Ola", "tip": "Available; useful for areas not on Metro. App fares are fair.", "approxCost": "₹80–250"}]','[{"name": "Kumartuli potters'' quarter", "type": "Artisan neighbourhood", "angle": "Off tourist radar", "why": "Where all of Kolkata''s Durga Puja idols are made year-round. Clay sculptors working in tiny workshops. No touts, no entry fee.", "approxCost": "Free"}, {"name": "Flurys, Park Street", "type": "Heritage café", "angle": "1927 institution", "why": "Tea room open since 1927. Solo breakfast with pastries and filter coffee. Safe, civilised, excellent.", "approxCost": "Breakfast ₹400–700"}, {"name": "Princep Ghat at sunset", "type": "Colonial ghat", "angle": "Quiet riverside", "why": "Victorian memorial arch on the Hooghly. Locals come for evening walks. Boats for hire. Almost no tourists.", "approxCost": "Free; boat ₹100–200"}]','["Book hotel in Ballygunge or near Park Street, not Sudder Street if budget allows", "Download Kolkata Metro app and buy a Metro smart card at any station", "Check Durga Puja dates (October) — if visiting during festival, book months ahead", "Carry ₹500 in small change for yellow taxi meters and street food", "Save Kolkata Police helpline: 100 and Women''s helpline: 1091"]','{"do": ["Eat at Kewpie''s in Elgin for authentic Bengali home cooking — book ahead", "Walk Howrah Bridge from the Kolkata side at 6am for zero crowds and best light", "Visit Kumartuli on a weekday morning — sculptors are at work and welcoming", "Use yellow Ambassador taxis — they are metered, honest, and a Kolkata experience"], "dont": ["Accept rides from anyone approaching you at Howrah or Sealdah station exits", "Give money to anyone collecting for Missionaries of Charity on the street", "Miss the Sunday morning book market on College Street — largest second-hand book market in the world", "Rush Kolkata — it rewards slow travel more than almost any Indian city"]}','{"backpacker": 1500, "midRange": 3500, "comfortable": 8000, "currency": "INR"}','[{"label": "Kolkata Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Kolkata", "number": "033-22143004"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Kolkata&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('chennai-india','Chennai','India','both','kavya-chennai','2026-04-10',9,'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80','["Chennai has the best South Indian food in the world — if you leave without eating a proper tiffin breakfast, you have failed.", "Marina Beach is the world''s second-longest urban beach; it is safe at sunrise, avoid after sunset.", "Auto-rickshaws here notoriously refuse meters — use Uber/Ola or negotiate firmly before boarding.", "The MRTS and Chennai Metro together cover most tourist areas; women-only coach on Metro.", "Mylapore is the cultural and religious heart of the city — older, calmer, and more authentic than T Nagar."]','[{"name": "Mylapore", "safetyRating": 5, "vibe": "Temple culture, old Madras, filter coffee, silk sarees", "stayHere": true, "notes": "Best solo-female base. Kapaleeshwarar Temple, Luz Church, cycle-rickshaw lanes. Morning filter coffee ritual."}, {"name": "Nungambakkam / Egmore", "safetyRating": 4, "vibe": "Hotels, Metro access, restaurants, central", "stayHere": true, "notes": "Practical base with good mid-range hotels. Saravana Bhavan HQ is here — eat there."}, {"name": "T Nagar", "safetyRating": 3, "vibe": "Shopping, silk, crowds, congested", "stayHere": false, "notes": "Great for silk and jewellery shopping but extremely crowded. Stay only if that''s your primary purpose."}]','[{"title": "Auto meter refusal", "severity": "high", "where": "City-wide", "what": "Autos quote 2–3× Uber rates and refuse to use meters, especially from airport and Central Station.", "avoid": "Use Uber or Ola exclusively in Chennai. If you must use auto, get Ola Auto — it''s app-metered."}, {"title": "Silk ''wholesale'' store redirect", "severity": "medium", "where": "T Nagar and tourist areas", "what": "Friendly local offers to show you the ''real'' silk shop where ''only locals go''. Commission-based.", "avoid": "Buy silk independently at Co-optex (government textile store, fixed prices) on Anna Salai."}, {"title": "Marina Beach photography harassment", "severity": "medium", "where": "Marina Beach", "what": "Groups of young men photograph women without consent; camera pointed at face/body.", "avoid": "Sunrise hours (6–8am) are peaceful. Avoid evenings. If photographed without consent, confront directly or walk to nearest police booth."}]','[{"mode": "Chennai Metro", "tip": "Green and Blue lines. Women-only coach. Covers airport to central.", "approxCost": "₹10–60"}, {"mode": "Uber / Ola", "tip": "Essential in Chennai — auto meters are unreliable. Use app-based always.", "approxCost": "₹80–300"}, {"mode": "MRTS (suburban rail)", "tip": "Covers coastal corridor from Beach to Velachery. Cheap and fast.", "approxCost": "₹5–20"}]','[{"name": "Murugan Idli Shop, Mylapore", "type": "Tiffin restaurant", "angle": "The Chennai breakfast benchmark", "why": "Open since 1969. Idli, sambar, chutney. The standard against which all South Indian breakfast is measured. Queue moves fast.", "approxCost": "Breakfast ₹80–150"}, {"name": "Kapaleeshwarar Temple at dawn", "type": "Temple complex", "angle": "600-year-old Dravidian architecture", "why": "The best Dravidian gopuram in Tamil Nadu accessible without a day trip. 6am: priests, flowers, no tourists.", "approxCost": "Free for Hindus; non-Hindus welcome in outer courtyard"}, {"name": "Cholamandal Artists'' Village", "type": "Artist colony", "angle": "Largest in Asia", "why": "Living artist community 20km south of Chennai. Galleries, studios, sculpture garden. Completely overlooked by tourists.", "approxCost": "Free entry; gallery ₹50"}]','["Book hotel in Mylapore or Nungambakkam — not T Nagar unless shopping is the focus", "Download Uber/Ola before arrival — auto meter situation makes apps essential", "Visit Murugan Idli Shop before 9am on your first morning", "Check Pongal festival dates (January) if visiting in winter — major and beautiful", "Carry a dupatta for temple visits — shoulders must be covered"]','{"do": ["Eat tiffin breakfast (idli/vada/dosa) at a proper Mylapore restaurant on day one", "Visit Kapaleeshwarar Temple at dawn — the 6am rituals are stunning", "Use Uber/Ola for all transport — saves the daily auto negotiation frustration", "Go to Cholamandal Artists'' Village if you have a half-day to spare"], "dont": ["Negotiate with autos outside Central Station or the airport — use app always", "Visit Marina Beach alone after 7pm", "Buy silk from any shop you were taken to by an auto driver or ''friendly local''", "Skip the filter coffee — it is a defining Chennai experience and costs ₹20"]}','{"backpacker": 1800, "midRange": 4000, "comfortable": 9000, "currency": "INR"}','[{"label": "Chennai Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Helpline Tamil Nadu", "number": "1800-425-4747"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Chennai&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('udaipur-india','Udaipur','India','both','sara-berlin','2026-04-10',11,'https://images.unsplash.com/photo-1588083949709-a82cad48aed7?w=800&q=80','["Udaipur is Rajasthan''s most romantic and solo-female-comfortable city — the pace is slower, the touts fewer.", "Lake Pichola at sunset from a rooftop café is one of India''s iconic experiences — and it is free.", "Book heritage havelis in the old city for the view; book modern hotels in New City for the amenities.", "The boat ride to Jag Mandir (not Lake Palace, which is hotel-only) is worth every rupee.", "Holi in Udaipur (March) is internationally famous; solo women should visit with a group or organised event."]','[{"name": "Old City (Lake Pichola side)", "safetyRating": 4, "vibe": "Heritage havelis, rooftop cafés, lake views", "stayHere": true, "notes": "Best atmosphere. Walk to City Palace, Jagdish Temple. Rooftop restaurants with lake views are everywhere."}, {"name": "Fateh Sagar Lake area", "safetyRating": 4, "vibe": "Local Udaipur, less touristy, evening promenade", "stayHere": true, "notes": "Where locals go in the evenings. Nehru Park island, ice cream stalls, quiet. Good mid-range hotels."}]','[{"title": "Lake Palace boat ticket fraud", "severity": "medium", "where": "Lake Pichola ghats", "what": "Touts sell ''boat tickets to Lake Palace''. Lake Palace is a private Taj hotel — public boats go to Jag Mandir only.", "avoid": "Book RTDC boat tickets at the official booth at Rameshwar Ghat only. Jag Mandir is the correct destination."}, {"title": "Miniature painting ''artist'' commission", "severity": "medium", "where": "Old City lanes", "what": "Artist invites you to watch him paint, then sells at inflated prices with social pressure to buy.", "avoid": "Genuine miniature painting workshops exist (Shilpgram craft village). Browse independently; prices are fixed."}, {"title": "Sunset rooftop ''cover charge''", "severity": "low", "where": "Lake-view restaurants", "what": "Minimum spend of ₹500–1,000 per person imposed only when bill arrives, not when seated.", "avoid": "Ask explicitly about minimum spend before sitting. Most honest places display it on the menu."}]','[{"mode": "Auto-rickshaw", "tip": "Metered in Udaipur; drivers are generally more honest than Jaipur or Chennai.", "approxCost": "₹30–150"}, {"mode": "Uber / Ola", "tip": "Available and reliable. Best for airport and day trips to Haldighati.", "approxCost": "₹100–300"}, {"mode": "Cycle hire", "tip": "Old City is compact and flat enough for cycling. Hire from most guesthouses.", "approxCost": "₹100–200/day"}]','[{"name": "Bagore Ki Haveli museum", "type": "Heritage haveli", "angle": "Best folk art collection in Rajasthan", "why": "18th-century haveli on the lake with 138 rooms of folk costumes, puppets, and daily cultural performances at 7pm.", "approxCost": "₹60 entry; show ₹100"}, {"name": "Shilpgram craft village", "type": "Artisan village", "angle": "Fixed-price genuine crafts", "why": "Rural arts and crafts complex, 3km west of city. No commission touts. Miniature painting, block printing, pottery.", "approxCost": "₹30 entry"}, {"name": "Fateh Sagar at sunset", "type": "Lake promenade", "angle": "Local Udaipur evening", "why": "The lake Udaipuris actually use. Boat rides, island park, kulfi stalls. Completely tourist-free.", "approxCost": "Boat ₹30–100"}]','["Book lake-view haveli in Old City 2–3 months ahead for peak season (Oct–Mar)", "Buy RTDC boat tickets at Rameshwar Ghat booth only — not from touts", "Pack a light cardigan — Udaipur evenings are cool October through February", "Check Holi dates if visiting March — book a structured event for solo travel", "Carry ₹200 exact change for Jagdish Temple boat and Bagore Ki Haveli entry"]','{"do": ["Watch the sunset from Ambrai Ghat — free, no minimum spend, the best lake view", "Visit Bagore Ki Haveli for the 7pm folk performance — it is genuinely excellent", "Explore Shilpgram for honest fixed-price Rajasthani crafts", "Hire a cycle for Old City — it is the best way to discover the lanes"], "dont": ["Buy boat tickets to ''Lake Palace'' from touts — public boats go to Jag Mandir only", "Sit down at a lake-view restaurant without confirming the minimum spend", "Visit Monsoon Palace (Sajjangarh) without checking opening times — it closes early", "Rush out of Udaipur — it is one of the rare Indian cities that rewards an extra day"]}','{"backpacker": 1800, "midRange": 4000, "comfortable": 10000, "currency": "INR"}','[{"label": "Udaipur Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Udaipur", "number": "0294-2411535"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Udaipur&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('kochi-india','Kochi','India','both','priya-kochi','2026-04-10',12,'https://images.unsplash.com/photo-1576186614082-7162e8a1b25d?w=800&q=80','["Fort Kochi is one of India''s most solo-female-comfortable neighbourhoods — slow, walkable, art-filled.", "The Chinese fishing nets at dawn are the classic image but the light is only good 6:30–8am.", "Kathakali and Kalaripayattu performances in Fort Kochi are tourist-facing but genuinely excellent.", "Kerala backwaters day cruise (Alleppey/Alappuzha, 90km south) is the most-recommended solo add-on.", "Monsoon season (June–August) is hot and very wet — but Kochi stays open and is half the price."]','[{"name": "Fort Kochi", "safetyRating": 5, "vibe": "Colonial heritage, cafés, art galleries, Chinese nets", "stayHere": true, "notes": "The entire solo-travel reason to come to Kochi. Princess Street is the spine. Walkable, safe, excellent food."}, {"name": "Mattancherry", "safetyRating": 4, "vibe": "Spice warehouses, Jewish quarter, antique shops", "stayHere": true, "notes": "20-min walk or ₹30 auto from Fort Kochi. Paradesi Synagogue, Dutch Palace, spice market. Very safe."}, {"name": "Ernakulam (mainland)", "safetyRating": 3, "vibe": "Commercial, transport hub, modern", "stayHere": false, "notes": "Where the buses and trains are. Fine for transit; no reason to base yourself here if Fort Kochi has rooms."}]','[{"title": "Kathakali ''donation'' after performance", "severity": "low", "where": "Fort Kochi performance venues", "what": "Performers pass a collection box post-show and create social pressure for large amounts.", "avoid": "Fixed-price ticket covers the performance. Tip generously if moved but ₹100–200 is appropriate — not ₹1,000."}, {"title": "Spice shop overcharge, Mattancherry", "severity": "medium", "where": "Mattancherry spice district", "what": "Shops near the synagogue quote tourist prices 5–10× the real wholesale rate.", "avoid": "Shops 2–3 streets back from the main synagogue lane have honest prices. Compare at 3 shops before buying."}, {"title": "Auto overcharge, Ernakulam", "severity": "medium", "where": "Ernakulam ferry terminal, railway station", "what": "Autos at transport hubs refuse meters and quote flat rates to Fort Kochi ferry.", "avoid": "Take the government ferry from Ernakulam to Fort Kochi (₹5) — faster and infinitely more scenic than any auto."}]','[{"mode": "Government ferry (Ernakulam ↔ Fort Kochi)", "tip": "₹5 and a 15-minute scenic harbour crossing. Best transport in Kochi.", "approxCost": "₹5"}, {"mode": "Auto-rickshaw within Fort Kochi", "tip": "Short distances only. Agree price before; ₹50–100 most rides.", "approxCost": "₹50–120"}, {"mode": "Cycle hire", "tip": "Fort Kochi is flat and compact. Most guesthouses rent bikes.", "approxCost": "₹100–150/day"}]','[{"name": "Kashi Art Café, Fort Kochi", "type": "Art gallery + café", "angle": "The original Fort Kochi institution", "why": "Gallery and café since 1997. Solo breakfast with rotating contemporary art on the walls. The most civilised morning in Kerala.", "approxCost": "Breakfast ₹300–500"}, {"name": "Kerala Folklore Museum, Ernakulam", "type": "Museum", "angle": "Largest in Kerala, almost no tourists", "why": "Three floors of masks, costumes, murals, and ritual objects. Extraordinary collection; entry is never crowded.", "approxCost": "₹300 entry"}, {"name": "Alleppey backwaters day cruise", "type": "Backwaters experience", "angle": "Non-negotiable add-on", "why": "90km south. Government DTPC boat (₹400, half-day) or private houseboat. The single best day trip in South India.", "approxCost": "DTPC cruise ₹400; private houseboat from ₹3,500"}]','["Book Fort Kochi guesthouse on Princess Street or Burgher Street 2+ months ahead in peak season", "Check ferry timings from Ernakulam Boat Jetty — last ferry is around 9:30pm", "Book Alleppey backwaters day cruise through DTPC Kochi or your guesthouse", "Carry a light rain jacket October through May — Kerala gets unexpected showers", "Save Kerala Tourist Police helpline: 1800-425-4747"]','{"do": ["Arrive at Chinese fishing nets by 6:30am for the best light and fewest people", "Take the government ferry between Ernakulam and Fort Kochi — ₹5 and spectacular", "Attend a Kathakali performance at Kerala Kathakali Centre (best in Fort Kochi)", "Walk the full Mattancherry-to-Fort Kochi coastal path in the early morning"], "dont": ["Buy spices from the first shop near the Paradesi Synagogue — walk deeper into the lanes", "Skip Alleppey if you have even one extra day — the backwaters are the whole point of Kerala", "Miss the Kochi–Muziris Biennale if visiting in December–February — one of Asia''s best art events", "Take an auto where the government ferry goes — it is slower, more expensive, and less beautiful"]}','{"backpacker": 1800, "midRange": 4000, "comfortable": 9000, "currency": "INR"}','[{"label": "Kochi Police", "number": "100"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Tourist Police Kerala", "number": "1800-425-4747"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Kochi&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('kasol-india','Kasol','India','indian','ananya-mumbai','2026-04-10',7,'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80','["Kasol is a tiny Parvati Valley village — the trek culture is real but the drug culture is equally real; know what you''re walking into.", "The Kheerganga hot spring trek (13km one way) is the single reason most people come — start at 6am.", "Kasol village itself takes 2 hours to walk end to end; the charm is the river, the cafés, and the pine forest.", "Israeli-influenced food scene is excellent — hummus and shakshuka at 2,000m are genuinely good.", "Mobile signal disappears 2km past Kasol; download offline maps and tell someone your itinerary."]','[{"name": "Kasol main village", "safetyRating": 4, "vibe": "Cafés, guesthouses, river views, trailhead", "stayHere": true, "notes": "Everything is within a 10-minute walk. Stay on the main street for the best guesthouse options."}, {"name": "Chalal (15-min walk)", "safetyRating": 4, "vibe": "Quieter, riverside, local feel", "stayHere": true, "notes": "Cross the bridge from Kasol and walk 15 minutes. Fewer tourists, better views, same trail access."}]','[{"title": "Drug-laced food", "severity": "critical", "where": "Cafés and guesthouses", "what": "Cannabis added to food (brownies, lassi, tea) without clear labelling. Disorientation in remote terrain is dangerous.", "avoid": "Order only clearly described items. If a café has a ''special menu'' in whispers, leave. Ask explicitly: does this contain anything?"}, {"title": "Fake trek guide", "severity": "medium", "where": "Kasol village, near trailhead", "what": "Unregistered guides offer Kheerganga treks; take groups off-route or abandon mid-trail.", "avoid": "Hire through your guesthouse or registered trek agencies in Bhuntar. Ask for local ID and previous client contacts."}, {"title": "Overpriced guesthouse at arrival", "severity": "low", "where": "Bus drop point", "what": "Touts at the bus stop claim the ''best'' guesthouses are full and take you to commission properties.", "avoid": "Walk 5 minutes past the drop point independently. Almost no guesthouse is full except Diwali/Holi weekends."}]','[{"mode": "HRTC bus (Bhuntar → Kasol)", "tip": "Last bus around 6pm. From Bhuntar, which is on Delhi–Manali highway.", "approxCost": "₹40–60"}, {"mode": "Shared taxi (Bhuntar → Kasol)", "tip": "Faster than bus. Fills up at Bhuntar bus stand.", "approxCost": "₹80–120/seat"}, {"mode": "Trek (Kasol → Kheerganga)", "tip": "13km one way, 4–5 hours up. No vehicle access beyond Nakthan village.", "approxCost": "Guide ₹800–1,200/day"}]','[{"name": "Kheerganga hot spring", "type": "Trek + natural hot spring", "angle": "The whole point of Kasol", "why": "13km trek through pine and rhododendron forest ends at sulphur hot springs at 2,960m. Camp overnight for the stars.", "approxCost": "Trek free; camping ₹200–400/night"}, {"name": "Chalal riverside walk", "type": "Forest walk", "angle": "20 minutes, zero effort", "why": "Cross the bridge, follow the river. Pine-scented, cold, quiet. Best at 7am before the café crowd wakes.", "approxCost": "Free"}, {"name": "Moon Dance Café, Kasol", "type": "Café", "angle": "Best hummus at altitude", "why": "Israeli-run café with proper shakshuka, hummus, and filter coffee. Solar-powered. Seats 15. Opens 8am.", "approxCost": "Meal ₹250–450"}]','["Download offline Parvati Valley map on Maps.me — no signal past Kasol", "Tell your guesthouse your trek route and expected return time", "Carry water purification tablets — no reliable clean water source on Kheerganga trail", "Pack warm layers — temperature drops to 5°C at night even in July", "Start Kheerganga trek no later than 7am to reach top before clouds close in"]','{"do": ["Start the Kheerganga trek at 6–7am for clear skies and cooler temperatures", "Stay in Chalal for quieter, cheaper, and more scenic guesthouse experience", "Tell someone (guesthouse, family) your exact trek plan before departing", "Carry a portable charger — no charging points on the Kheerganga trail"], "dont": ["Eat anything described as ''special'' without asking explicitly what''s in it", "Trek solo above Nakthan without a guide if it''s your first Himalayan trek", "Leave Kasol after 4pm for Kheerganga — you will not reach before dark", "Assume the trail is marked — it is not consistently marked beyond Nakthan"]}','{"backpacker": 1200, "midRange": 2500, "comfortable": 5000, "currency": "INR"}','[{"label": "Kasol Police Post", "number": "01902-265004"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Kullu District Hospital", "number": "01902-222339"}, {"label": "Mountain Rescue", "number": "112"}]',false,'','{"worldNomads": "https://www.worldnomads.com/travel-insurance?affiliate=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;
INSERT INTO intel_cards (slug,destination,country,audience,contributor_slug,last_updated,verified_by_count,hero_image_url,tldr,neighborhoods,scams,transport,hidden_gems,pre_book_checklist,dos_and_donts,estimated_daily_budget,emergency_numbers,is_premium,premium_preview,affiliate_links) VALUES ('hampi-india','Hampi','India','both','devika-pune','2026-04-10',9,'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80','["Hampi is a UNESCO World Heritage Site spread across 4,100 hectares of boulder landscape — rent a bicycle.", "The main bazaar side and Virupapuragadde (across the river) are two different worlds; most backpackers prefer the island side.", "Sunrise at Matanga Hill (400 steps) is the single best thing to do in Hampi — set your alarm for 5:30am.", "Hampi has no ATMs on the island side — withdraw cash in Hospet (13km) before arriving.", "The boulder landscape at sunset turns amber-gold; the Royal Enclosure at 4pm is completely empty."]','[{"name": "Hampi Bazaar (temple side)", "safetyRating": 4, "vibe": "Near Virupaksha Temple, guesthouses, restaurants", "stayHere": true, "notes": "Best for temple access and sunrise on Matanga Hill. Mango Tree restaurant is here. Safe and walkable."}, {"name": "Virupapuragadde (island side)", "safetyRating": 4, "vibe": "Backpacker vibe, river views, sunsets, quieter", "stayHere": true, "notes": "Cross the coracle (₹20). More relaxed, better sunsets, good cafés. No ATMs — carry all cash."}]','[{"title": "Coracle price inflation", "severity": "low", "where": "River crossing between temple and island sides", "what": "Official coracle fare is ₹20; touts charge ₹100–200 to first-timers.", "avoid": "Fixed government rate is ₹20 per person. Join the queue at the official ghat and pay only ₹20."}, {"title": "Bicycle rental damage claim", "severity": "medium", "where": "Rental shops both sides", "what": "Pre-existing damage cited on return; deposit held.", "avoid": "Photograph the bicycle before riding. Rentals are cheap enough (₹100/day) to not need a deposit — decline shops that demand one."}, {"title": "Guide ''royal tour'' overcharge", "severity": "low", "where": "Near Royal Enclosure, Vijayanagara ruins", "what": "Self-appointed guides approach at major ruins and quote ₹2,000+ for basic walking tour.", "avoid": "ASI-licensed guides are available through the ASI booth near Virupaksha Temple at fixed rates. Or use a good guidebook."}]','[{"mode": "Bicycle hire", "tip": "The only sensible way to see Hampi. Both sides have rentals.", "approxCost": "₹100–150/day"}, {"mode": "Coracle (river crossing)", "tip": "Flat-bottomed boat, ₹20 fixed rate. Runs 6am–6pm approx.", "approxCost": "₹20"}, {"mode": "Auto-rickshaw (Hospet ↔ Hampi)", "tip": "For arriving/departing with luggage. 13km.", "approxCost": "₹150–250"}]','[{"name": "Matanga Hill sunrise", "type": "Viewpoint trek", "angle": "400 steps, unmissable", "why": "Best view in Hampi — the entire UNESCO landscape turns amber at dawn. Arrive by 6am. Safe, well-trodden path.", "approxCost": "Free"}, {"name": "Vittala Temple and Stone Chariot", "type": "UNESCO temple complex", "angle": "Best ruins in Hampi", "why": "Musical pillars and the iconic stone chariot. Go at 8am opening — you''ll have it almost to yourself before 10am bus tours arrive.", "approxCost": "₹600 entry (foreigners); ₹40 (Indian)"}, {"name": "Mango Tree restaurant", "type": "Restaurant", "angle": "30-year Hampi institution", "why": "Platforms over the river, banana leaf thalis, backpacker crowd. The Hampi ritual — lunch here after the morning ruins walk.", "approxCost": "Thali ₹180–300"}]','["Withdraw all cash in Hospet before arriving — no ATMs on island side", "Rent bicycle on arrival — it is the only way to cover the site properly", "Set alarm for 5:30am on at least one morning for Matanga Hill sunrise", "Carry 2L water minimum — Hampi in April–June is extremely hot", "Check KSRTC bus or train times from Hospet to next destination before arriving"]','{"do": ["Cross to the island side (Virupapuragadde) for at least one sunset", "Visit Vittala Temple at 8am opening before the group tours arrive at 10am", "Photograph your bicycle before riding to avoid any damage dispute", "Ask Devika''s Hampi heritage walk recommendation at your guesthouse — local guides make the ruins come alive"], "dont": ["Pay more than ₹20 for the coracle river crossing — it is a fixed government rate", "Arrive in Hampi without cash — the island side has zero ATMs", "Visit the boulder landscape in the middle of the day in summer — heat is dangerous", "Skip the lesser-visited Zenana Enclosure and Elephant Stables — they are empty of tourists and extraordinary"]}','{"backpacker": 1200, "midRange": 2800, "comfortable": 6000, "currency": "INR"}','[{"label": "Hampi Police", "number": "08394-241249"}, {"label": "Women''s Helpline", "number": "1091"}, {"label": "Hospet Government Hospital", "number": "08394-228526"}, {"label": "Ambulance", "number": "108"}]',false,'','{"booking": "https://www.booking.com/searchresults.html?ss=Hampi&aid=PLACEHOLDER"}') ON CONFLICT (slug) DO NOTHING;

-- contributors
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('ananya-mumbai','Ananya','Ananya Iyer','Mumbai','33-40',9,'Spiti Valley Expert · Northeast Pioneer','I quit advertising in 2019 and have spent the last six years living out of two backpacks across India. Spiti is my one true love — three winters there now, two on a Royal Enfield I do not recommend renting. I write because the intel that kept me safe was buried in old TripAdvisor threads and women-only Facebook groups, and that is not a good system.

My specialty is the offbeat Indian itinerary: places where you can be the only woman on the bus and still come home with a story you want to tell. I have opinions about hostels, strong feelings about local SIM cards, and one very firm rule: never accept the first auto-rickshaw quote at a railway station.','https://i.pravatar.cc/400?img=47','["Spiti Valley Expert", "Northeast Pioneer", "Founding 200"]','["goa-india", "manali-india", "varanasi-india", "kasol-india", "rishikesh-india"]','2026-01-12',2400,23,41,'@ananya.offbeat') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('riya-bangalore','Riya','Riya Menon','Bangalore','25-32',6,'Beware Board top reporter · Bangalore local','Product manager by day, Beware Board obsessive by night. I started reporting scams after getting fleeced for ₹3,400 by an auto-wallah outside Jaipur Junction in 2024 — the same one half my friends had been ripped off by. Nobody had logged it anywhere. That felt like a fixable problem.

I travel mid-range, mostly weekend trips from Bangalore, occasionally further. I am not the person to ask about Spiti. I am the person to ask which booking on Booking.com is actually a hostel vs. someone''s living room.','https://i.pravatar.cc/400?img=32','["Beware Board Top Reporter", "Verified Local"]','["bangalore-india", "jaipur-india", "kochi-india"]','2026-02-03',1180,14,33,'@riya.weekendtrips') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('sara-berlin','Sara','Sara Hofmann','Berlin (currently Goa)','25-32',7,'Foreign-in-India guide · Three years on the road','Berliner by birth, Goan by choice for the last three years. I came for two weeks in 2023 and never really left. I write the foreign-women-in-India intel — the cards I wish someone had handed me before my first solo trip to Delhi.

My specialty is the trips foreign women actually take: Delhi → Agra → Jaipur, Mumbai → Goa → Hampi, Kerala backwaters. I write candidly about what is harder for visibly foreign women (everything in Old Delhi after dark) and what is genuinely fine (most of South India, most of the time).','https://i.pravatar.cc/400?img=44','["Foreign-in-India Guide", "Verified Local", "20+ Cities"]','["delhi-india", "agra-india", "jaipur-india", "udaipur-india"]','2026-01-20',2950,18,27,'@sara.in.india') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('devika-pune','Devika','Devika Joshi','Pune','25-32',5,'Hampi heritage walks · Karnataka specialist','I run heritage walks in Hampi twice a month and otherwise work remote from cafés in Pune. My intel skews south — Karnataka, Tamil Nadu, the parts of Andhra Pradesh nobody writes about because they are not Instagrammable.

Ask me about ruins, dosas, and which guesthouses actually have working WiFi. I am not a hostel person and I will tell you that directly.','https://i.pravatar.cc/400?img=38','["Karnataka Specialist", "Founding 200"]','["hampi-india", "bangalore-india", "chennai-india"]','2026-02-18',1640,11,19,'@devika.heritage') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('leila-delhi','Leila','Leila Khan','New Delhi','33-40',11,'North India loops · Founding 200','Delhi-born, Delhi-stuck, Delhi-proud. I have done every iteration of the North India loop a tourist tries — Golden Triangle, Rajasthan circuit, Himalayan summer escape — usually solo, usually budget, always opinionated.

My strongest skill is matching destinations to people. Tell me what you do for fun in your city and I can usually tell you whether you should go to Rishikesh or Pushkar first. Bad at: anything south of Bangalore.','https://i.pravatar.cc/400?img=49','["20+ Cities", "Founding 200", "Verified Local"]','["delhi-india", "agra-india", "udaipur-india", "rishikesh-india"]','2026-01-08',2120,19,38,'@leila.northbound') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('kavya-chennai','Kavya','Kavya Subramanian','Chennai','18-24',4,'Solo at 19 · South India backpacker','Took my first solo trip at 19 (Pondicherry, three days, told my parents I was at a friend''s hostel) and have not stopped since. I write for the women who are scared their parents will never let them go — because mine were, and they did, and it changed my life.

I travel cheap, mostly south, mostly hostels. I will be the first to tell you that solo travel is not always magical and that some days you will sit in a hostel common room and miss your mother. That is also fine.','https://i.pravatar.cc/400?img=24','["Solo at 19"]','["chennai-india", "kochi-india", "hampi-india"]','2026-03-02',820,8,22,'@kavya.south') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('neha-jaipur','Neha','Neha Chauhan','Jaipur','33-40',8,'Rajasthan native · Anti-tout in chief','Born and raised in Jaipur, which means I have spent twenty years watching tourists get the same six scams pulled on them at the Hawa Mahal. The Pink City is a wonderful place. It is also a city where every shop owner near the City Palace will tell you he is friends with your guide.

I write Rajasthan intel and one Udaipur card. I do not write outside Rajasthan. There are people more qualified for that.','https://i.pravatar.cc/400?img=45','["Verified Local", "Founding 200"]','["jaipur-india", "udaipur-india"]','2026-01-25',1740,12,29,'@neha.rajasthan') ON CONFLICT (slug) DO NOTHING;
INSERT INTO contributors (slug,name,full_name,home_city,age_range,trip_count,tagline,bio,photo_url,badges,destinations_contributed,joined_date,earnings_this_month,total_contributions,answers_in_community,instagram) VALUES ('priya-kochi','Priya','Priya Nair','Kochi','25-32',6,'Kerala backwaters · Yoga teacher','I teach yoga in Fort Kochi and travel during the off-season. My intel is heavy on Kerala and the kind of slow-travel destinations you do not so much visit as stay in for two weeks.

If you are looking for a yoga retreat in India that is not predatory, ask me. If you are looking for a hostel in Goa, ask Ananya. We have a system.','https://i.pravatar.cc/400?img=36','["Yoga Teacher", "Verified Local"]','["kochi-india", "rishikesh-india"]','2026-02-10',1320,9,24,'@priya.kochi') ON CONFLICT (slug) DO NOTHING;

-- community_posts
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-001','ask','Rhea','25-32','Delhi','Heading to Goa solo for the first time in May — North or South Goa? I''ve read conflicting things. I want beaches, good food, and I don''t want to be hassled constantly. Budget is mid-range.','goa-india','approved',14,28,'2026-04-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-002','ask','Simran','18-24','Chandigarh','Has anyone done the Kasol → Kheerganga trek solo? I''m comfortable with day hikes but this would be my first overnight trek. Any advice on guides, gear, and whether it''s safe for a solo woman?','kasol-india','approved',19,41,'2026-04-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-003','ask','Maya','25-32','Bangalore','What''s the realistic budget for 7 days in Rajasthan (Jaipur → Jodhpur → Udaipur)? I keep seeing wildly different numbers online. I''m happy with mid-range hotels, not hostels, not heritage luxury.',NULL,'approved',11,22,'2026-04-07') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-004','ask','Farah','33-40','Mumbai','Is it actually safe to do a sunrise boat ride on the Ganges in Varanasi alone? I''m travelling solo in January and this is the one thing I really want to do, but everything I read makes it sound terrifying.','varanasi-india','approved',23,47,'2026-04-06') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-005','ask','Tanya','25-32','Hyderabad','Which yoga retreat in Rishikesh is actually legitimate and safe for solo women? Not looking for TTC, just a 5–7 day retreat. Budget is ₹20,000–35,000 all-in. I''ve heard some horror stories.','rishikesh-india','approved',31,68,'2026-04-05') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-006','ask','Prerna','18-24','Pune','How early should I book Taj Mahal tickets? Going in February and I''ve heard the online tickets sell out. Also — is the western gate really less crowded or is that a myth?','agra-india','approved',8,16,'2026-04-04') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-007','ask','Neelam','33-40','Chennai','Can I do a Kerala backwaters trip (Alleppey) as a solo day trip from Kochi? Or do I need to stay overnight? I only have one extra day.','kochi-india','approved',17,29,'2026-04-03') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-008','ask','Ishita','25-32','Kolkata','First solo trip and I''m going to Delhi. My parents are extremely worried. What do I actually need to know vs. what is just generic fear-mongering? I want facts, not reassurance.','delhi-india','approved',38,84,'2026-04-02') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-009','ask','Divya','25-32','Bangalore','Is the Hampi island side (Virupapuragadde) safe for solo women? I keep reading it''s very chill but also that coracle times are unpredictable. Thinking of 3 nights.','hampi-india','approved',12,24,'2026-04-01') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-010','ask','Zara','25-32','London','Foreign woman here — planning my first solo India trip. Two weeks, arriving Mumbai, leaving Delhi. The Golden Triangle feels too obvious but I also don''t want to get in over my head. Suggestions?',NULL,'approved',42,91,'2026-03-30') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-011','sister','Ananya','33-40','Mumbai','Any local sisters in Spiti Valley right now? I''m doing my third winter there and have intel on which homestays are actually warm (literally and figuratively) in April. Happy to share over DM.',NULL,'approved',6,19,'2026-04-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-012','sister','Riya','25-32','Bangalore','Jaipur local here. If anyone is visiting and needs honest advice on which autos to avoid, which bazaars are genuine, or where to eat that isn''t a commission trap — ask me. I grew up here.','jaipur-india','approved',21,55,'2026-04-09') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-013','sister','Priya','25-32','Kochi','Kerala sister here. If you''re planning a yoga retreat and want someone to help you vet it before paying — DM me. I teach yoga in Fort Kochi and know most of the legitimate operations. Free advice, no agenda.','kochi-india','approved',14,47,'2026-04-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-014','sister','Devika','25-32','Pune','Hampi local (sort of — I run heritage walks there twice a month). If you want the archaeology to actually make sense rather than just being ''old rocks'', reach out. I can connect you with my guide network.','hampi-india','approved',9,31,'2026-04-07') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-015','sister','Leila','33-40','Delhi','Born-and-raised Delhi sister here. The fear about Delhi is partly warranted and partly exaggerated. Happy to give anyone a realistic breakdown by neighbourhood, time of day, and what kind of traveller you are. Ask me anything.','delhi-india','approved',29,72,'2026-04-06') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-016','sister','Meera','33-40','Bangalore','Just finished 3 weeks in Goa and Hampi. Staying in Bangalore for 2 more weeks. If anyone is passing through and needs a chai + honest debrief of either destination — I''m in Indiranagar.',NULL,'approved',5,18,'2026-04-05') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-017','sister','Sara','25-32','Goa','German expat living in Goa for 3 years. If you''re a foreign woman planning your first India trip and want brutally honest advice from someone who''s made most of the mistakes — I''m here. Ask in the thread or DM.',NULL,'approved',33,78,'2026-04-04') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-018','sister','Kavya','18-24','Chennai','Chennai and South India specialist. I travel cheap, mostly hostels, mostly solo. If you''re 18–24 and your parents don''t believe solo travel is possible — I have evidence to the contrary. DM me.',NULL,'approved',17,52,'2026-04-03') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-019','sister','Neha','33-40','Jaipur','Rajasthan native. I have strong opinions about which parts of Rajasthan are worth the hype (Udaipur: yes. Pushkar during normal season: yes. Jodhpur: criminally underrated). Ask me what to skip.',NULL,'approved',24,61,'2026-04-02') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-020','sister','Aanya','25-32','Mumbai','Currently in Rishikesh doing my 200-hour TTC. The yoga school vetting process here is genuinely confusing. Happy to share what questions to ask and which certifications are worth paying for.','rishikesh-india','approved',11,38,'2026-04-01') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-021','rant','Sunita','25-32','Delhi','Spent 20 minutes at Jaipur station arguing with an auto driver about the meter. He eventually conceded but the entire negotiation felt like I was being punished for knowing what the fare should be. This is why I have anxiety before every journey in a new city. We should not have to fight for a fair fare every single time.','jaipur-india','approved',28,94,'2026-04-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-022','rant','Rhea','18-24','Mumbai','Told my family I was going to Kasol solo. My mother cried. My father said ''you''ll be kidnapped''. I''m 23, I have a job, I''ve done 4 solo trips. The assumption that I''m perpetually in danger because I''m a woman makes me furious. I went. It was fine. They still think I was reckless.',NULL,'approved',44,127,'2026-04-09') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-023','rant','Tara','33-40','Hyderabad','Hotel receptionist in Varanasi asked if my husband was joining me. When I said I was solo, he immediately downgraded my room ''for availability reasons''. Same room type was showing available on Booking.com on my phone. Complained, got the original room. Please complain. Every time.','varanasi-india','approved',19,73,'2026-04-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-024','rant','Meghna','25-32','Pune','The number of travel articles that say ''India is safe for solo women IF you dress modestly / cover up / don''t go out at night / don''t make eye contact / travel with a friend'' — basically, IF you erase yourself — is exhausting. The problem is not my clothes.',NULL,'approved',56,182,'2026-04-07') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-025','rant','Fiona','25-32','London','Every time I mention I''m solo-travelling India as a white woman I get one of two reactions: ''Oh you''re so brave'' or ''Oh that''s so dangerous''. I''m neither brave nor stupid. I''m just a person who bought a plane ticket. The constant gendering of travel risk makes me tired.',NULL,'approved',37,109,'2026-04-06') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-026','rant','Ankita','25-32','Bangalore','Goa taxi mafia situation is genuinely out of hand. GoaMiles is great but coverage is patchy in South Goa. Three times I ended up stranded because the app showed ''no drivers available'' within 8km. Infrastructure gap + no Uber = women stuck. This is a policy problem.','goa-india','approved',22,67,'2026-04-05') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-027','rant','Priya','33-40','Kochi','The yoga retreat industry in Rishikesh operates with almost zero regulation. I know two women who lost ₹40,000+ each to retreats that were essentially fraud. There is no certification body with real enforcement power. We need this community to be the enforcement.','rishikesh-india','approved',31,88,'2026-04-04') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-028','rant','Deepa','18-24','Kolkata','Took an overnight train for the first time solo. Spent the entire journey pretending to be on a phone call to avoid talking to the man in the next berth who kept leaning over to ''see my screen''. It was a 9-hour train. I was exhausted. I should not have to perform busyness to be left alone.',NULL,'approved',48,141,'2026-04-03') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-029','rant','Natasha','25-32','Delhi','Every hostel that says ''female-friendly'' in its listing should be required to define what that means. Does it mean a female dorm? A female staff member? Functioning door locks? A policy against men entering the dorm? Right now it means nothing. It''s marketing.',NULL,'approved',25,79,'2026-04-02') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-030','rant','Zoya','25-32','Mumbai','Got told by a travel agent that I should ''reconsider Varanasi alone'' and maybe do Agra and Jaipur instead because they''re ''more suitable for women''. Varanasi is extraordinary. I went. The only person who bothered me was the travel agent.','varanasi-india','approved',16,58,'2026-04-01') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-031','beware','Kaveri','33-40','Bangalore','⚠️ DELHI — Connaught Place fake tourism office. Lost ₹12,000. Man near Janpath said India Tourism was closed, walked me to a ''government travel desk''. Booked a fake Rajasthan tour. Real India Tourism (88 Janpath) was open the whole time. File cybercrime complaint if this happens: cybercrime.gov.in','delhi-india','approved',12,34,'2026-04-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-032','beware','Shreya','18-24','Hyderabad','⚠️ GOA — GoaMiles impersonator at Mopa Airport. Card looked identical to real GoaMiles branding. Quoted ₹2,800 for a ₹900 ride, claimed ''the app doesn''t cover Mopa yet''. It does. Only book through the actual GoaMiles app. Do not hand money to anyone holding a card outside arrivals.','goa-india','approved',8,21,'2026-04-09') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-033','beware','Chloe','25-32','London','⚠️ AGRA — Counterfeit Taj Mahal tickets outside south gate. ₹1,200 for a ticket that failed at the gate. The printing quality is very good — QR code even scanned on his phone. Buy ONLY at ASI window at the gate or online at asi.payumoney.com the night before. No legitimate seller exists outside the gates.','agra-india','approved',15,42,'2026-04-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-034','beware','Preethi','25-32','Chennai','⚠️ VARANASI — Suspected bhang in unlabelled lassi near Manikarnika Ghat. Ordered a plain lassi, within 45 min had severe disorientation. Was with a friend who got me back safely. If you want bhang, buy only from clearly labelled licensed shops. Symptoms: time distortion, confusion, heart racing — find a safe place and stay with someone.','varanasi-india','approved',23,67,'2026-04-07') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-035','beware','Sophie','33-40','Berlin','⚠️ RISHIKESH — Fake women-only yoga retreat. Paid ₹45,000 for a 2-week TTC that matched zero of its description. No certified instructor, no women-only environment. Could not get a refund. Before paying for ANY retreat: check TripAdvisor, Lonely Planet Thorntree, and the Yoga Alliance directory. Pay max 1 week upfront.','rishikesh-india','approved',31,89,'2026-04-06') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-036','beware','Divya','18-24','Jaipur','⚠️ JAIPUR — Elephant ride trap at Amber Fort. Agreed ₹500 for the ride. At the top, mahout refused to let me dismount until I paid ₹3,500 in ''tips and feed''. A crowd formed. Skip elephant rides entirely — jeep taxis to Amber Fort are ₹200, faster, and don''t involve an animal being overworked.','jaipur-india','approved',9,27,'2026-04-05') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-037','beware','Ishita','25-32','Mumbai','⚠️ MUMBAI — Colaba Causeway pickpocket. Phone lifted from front jeans pocket while walking through the market. Felt nothing — professional technique using shoulder jostling. Always use a crossbody bag with clasp facing inward. Never phone in pocket in a crowded market. File FIR at Colaba Police Station if it happens.','mumbai-india','approved',6,18,'2026-04-04') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-038','beware','Ritu','25-32','Delhi','⚠️ GOA — Drug setup at Vagator. Man offered hash, I declined. He returned 10 min later near a different area, a ''plainclothes cop'' appeared immediately. I walked into the nearest crowded shack and called my guesthouse. The script: offer → decline → cop appears → bribe demand. Walk into a crowd. Do not engage.','goa-india','approved',18,53,'2026-04-03') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-039','beware','Ananya','33-40','Mumbai','⚠️ VARANASI — Boat ride ₹200 agreed, ₹2,400 demanded mid-river. Boatman anchored mid-Ganges until I paid. Fix total price before boarding, write it in your phone Notes app and show the boatman, then photograph your screen. The photo with timestamp creates a paper trail. Eventually paid ₹400 total.','varanasi-india','approved',14,39,'2026-04-02') ON CONFLICT (id) DO NOTHING;
INSERT INTO community_posts (id,tab,author_name,author_age_range,home_city,content,destination,status,reply_count,like_count,created_at) VALUES ('post-040','beware','Tara','33-40','Hyderabad','⚠️ DELHI — Gem export scam, Paharganj. Well-dressed man at hotel breakfast offered £200 to carry gems to London as ''personal luggage''. This is illegal smuggling — you would be the one arrested at customs. Declined and told hotel staff. They recognised the description and said it happens weekly. Never agree to carry anything for anyone.','delhi-india','approved',11,34,'2026-04-01') ON CONFLICT (id) DO NOTHING;

-- beware_reports
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-001','goa-india','Goa','Accommodation fraud','Fake villa booking via Instagram — lost ₹45,000','critical','Found a gorgeous villa on Instagram, paid via UPI to a personal number after a ''soft launch'' discount. Arrived to find the address was a real house belonging to a confused family who''d never listed it. Lost ₹45,000 with zero recourse. File a cybercrime complaint at cybercrime.gov.in immediately if this happens to you.','Priya','Calangute, North Goa',94,'approved','2026-03-18') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-002','goa-india','Goa','Scooter rental','Royal Enfield ''hidden damage'' held my deposit for 4 days','high','Rented from a shop near Anjuna flea market. Photographed the bike beforehand but missed a small scratch on the underside of the mudguard. Owner refused to return ₹5,000 deposit claiming I caused it. Eventually resolved after showing timestamp photos to a police post. Always photograph undersides and wheel arches.','Shreya','Anjuna, North Goa',67,'approved','2026-02-24') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-003','goa-india','Goa','Drug setup','Man approached me twice at Vagator — second approach had a ''cop'' nearby','critical','A man offered hash at Vagator beach, I declined and walked away. He approached again 10 minutes later near a different area, and within seconds a man claiming to be a plainclothes officer appeared demanding I come with him for ''questioning''. I walked directly into the nearest crowded shack and called my guesthouse. Do not stop walking.','Ritu','Vagator Beach, North Goa',112,'approved','2026-01-30') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-004','goa-india','Goa','Transport','GoaMiles impersonator at Mopa airport — quoted ₹2,800 for ₹900 ride','high','Man outside Mopa arrivals was holding a card that looked exactly like the GoaMiles logo. Quoted ₹2,800 to Assagao. Actual GoaMiles app shows ₹920 for the same route. He said the ''app doesn''t cover Mopa yet'' — it does. Only book through the actual app.','Anushka','Mopa Airport, North Goa',58,'approved','2026-03-05') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-005','jaipur-india','Jaipur','Commission shop','Auto driver took 45-minute detour to gem ''export warehouse''','high','Agreed ₹100 auto to City Palace. Driver said there was a traffic diversion and took me to a ''government gem export centre'' in an industrial area. Multi-person sales team inside. Was there 40 minutes before I managed to leave. No gems bought but shaken. Always use Uber/Ola from monuments.','Meera','Near City Palace, Old City',81,'approved','2026-02-14') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-006','jaipur-india','Jaipur','Ticketing fraud','Paid ₹800 for ''skip-the-line'' Amber Fort ticket — it was fake','high','A smartly-dressed man outside Amber Fort sold me a ₹800 ticket that included ''fast entry and audio guide''. At the gate the QR code failed and the security guard confirmed it was counterfeit. Had to buy a real ₹200 ticket at the counter. Report: fake tickets are printed convincingly. Only buy at ASI counter or online.','Sara','Amber Fort entrance road',73,'approved','2026-01-22') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-007','jaipur-india','Jaipur','Accommodation','Booking.com listing for ''Heritage Haveli'' was someone''s house','medium','The listing had 40 reviews (all 5-star, all posted within 3 weeks). Arrived to find a private home, no reception, no staff. Owner appeared and tried to show me a room — completely unlisted. Got a refund from Booking.com after filing a dispute but lost 2 hours. Check review date patterns before booking.','Neha','Bani Park, Jaipur',45,'approved','2026-03-02') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-008','jaipur-india','Jaipur','Elephant ride','Elephant operator demanded ₹3,500 ''tip + feed'' after ₹500 agreed price','medium','Took an elephant ride up to Amber Fort after agreeing ₹500. At the top, the mahout refused to let me dismount until I paid ₹3,500 for ''feed and tip''. A crowd gathered which increased pressure. Paid ₹500 extra and walked away. Skip elephant rides entirely — jeep taxis to Amber are ₹200 and faster.','Divya','Amber Fort approach road',62,'approved','2026-01-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-009','delhi-india','Delhi','Tourist office scam','Fake India Tourism office near Connaught Place — lost 3 hours and ₹12,000','critical','A man near Janpath told me India Tourism was closed and walked me to a ''government-approved travel desk'' two streets away. Booked a Rajasthan tour for ₹12,000 that included a fake hotel. No tour guide appeared on day 1. The real India Tourism office (88 Janpath) was open the entire time. File complaint at Delhi Police cybercell.','Kaveri','Connaught Place, New Delhi',138,'approved','2026-02-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-010','delhi-india','Delhi','Transport','Pre-paid taxi booth impersonator at IGI Terminal 2','high','Inside T2 arrivals, a man in a vest that read ''PREPAID TAXI'' (not official signage) collected ₹800 for a ''pre-paid slip'' and directed me to an unofficial cab. Driver demanded an additional ₹1,500 mid-route. The real prepaid booth is marked with Delhi Traffic Police signage and is to the left of the exit doors.','Farida','IGI Airport Terminal 2, Delhi',97,'approved','2026-03-15') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-011','delhi-india','Delhi','Gem export scam','''Businessman'' at Paharganj offered commission to carry gems to London','high','Met a well-dressed man at hotel breakfast who said he was an exporter. Offered £200 to carry a small package of gems to London as ''personal luggage to avoid export duty''. This is illegal gem smuggling and a common Delhi long con. Declined and reported to hotel staff. Never agree to carry anything for anyone.','Tara','Paharganj, New Delhi',84,'approved','2026-01-19') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-012','delhi-india','Delhi','Rickshaw','Cycle rickshaw doubled price at destination — refused to move until paid','medium','Agreed ₹80 Connaught Place to Janpath. On arrival driver claimed ₹80 was ''per person'' (I was alone) and demanded ₹160, then grabbed my bag handle. Shouted once, he let go. A police constable was 30m away — point toward police if this happens. Always state: ''total price, for this journey, right now'' before boarding.','Zoya','Connaught Place, New Delhi',51,'approved','2026-02-27') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-013','varanasi-india','Varanasi','Ghat tout','Silk shop ''student'' followed me for 20 minutes from Dashashwamedh Ghat','high','A young man claiming to be a BHU student started a friendly conversation at Dashashwamedh Ghat. Perfectly good English, knowledgeable about the Aarti. Eventually guided me toward a ''family silk shop'' a kilometre away. I realised the route only when I checked Maps. The student script is extremely polished in Varanasi — end the conversation early.','Leila','Dashashwamedh Ghat, Varanasi',76,'approved','2026-02-01') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-014','varanasi-india','Varanasi','Boat ride','Sunrise boat ₹200 agreed — ₹2,400 demanded on return, boat moved from ghat','high','Agreed ₹200 for a 45-minute sunrise boat ride, confirmed verbally twice. On return, the boatman anchored mid-river and demanded ₹2,400 — ₹200 ''per person per ghat'' we''d passed. Refused, he eventually took ₹400. Agree total price and write it on your phone, show the driver, take a photo of the screen. Witnesses help.','Ananya','Assi Ghat, Varanasi',91,'approved','2026-01-14') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-015','varanasi-india','Varanasi','Food','Lassi at unnamed stall caused severe disorientation — suspected bhang without disclosure','critical','Ordered a plain lassi from a small stall near Manikarnika Ghat. Within 45 minutes had severe disorientation and time distortion consistent with cannabis. Was with a travel companion who got me back to the guesthouse safely. Only order from clearly labelled shops. If you want bhang, go to a licensed bhang shop where it is clearly stated.','Preethi','Near Manikarnika Ghat, Varanasi',143,'approved','2026-03-10') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-016','mumbai-india','Mumbai','Pickpocket','Phone lifted from front pocket at Colaba Causeway — felt nothing','medium','Walking through the narrow Colaba Causeway market lane, phone was in my front jeans pocket. Felt nothing. Noticed it missing 10 minutes later. The technique involves deliberate shoulder jostling from one person while another lifts. Use a crossbody bag with the clasp facing your body. Never put your phone in a pocket in a crowded market.','Ishita','Colaba Causeway, Mumbai',69,'approved','2026-02-20') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-017','mumbai-india','Mumbai','Transport','Taxi driver claimed meter was broken — quoted ₹800 for a ₹200 ride','medium','Hailed a black-and-yellow outside CST station. Driver said meter was broken and quoted ₹800 to Bandra. Real metered fare is ₹180–220. Refused and took the next cab whose meter worked fine. All Mumbai taxis are legally required to use meters. ''Broken meter'' is always a lie. Take the next cab.','Rohini','CST Station, Mumbai',44,'approved','2026-01-25') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-018','mumbai-india','Mumbai','Ferry','Fake Elephanta Island ferry sold at Gateway of India — went nowhere near Elephanta','high','Bought what I thought was an Elephanta Island ferry ticket from a man at the Gateway of India pier for ₹350. Boat took me on a 20-minute Harbour cruise and returned. The official MTDC Elephanta ferry ticket is ₹200 and sold only at the orange MTDC booth on the pier. Any other seller is unofficial.','Sonal','Gateway of India pier, Mumbai',88,'approved','2026-03-08') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-019','rishikesh-india','Rishikesh','Yoga retreat','Paid ₹45,000 for a 2-week retreat that matched none of its description','critical','Booked a ''women-only certified yoga teacher training'' for ₹45,000 after a polished Instagram presence. Arrived to find a shared house with no qualified instructor, no women-only environment, and a male ''guru'' I''d never seen in the listings. Unable to get a refund. Always research on TripAdvisor and Lonely Planet forums before paying, and never pay more than one week upfront.','Sophie','Ram Jhula area, Rishikesh',167,'approved','2026-02-12') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-020','rishikesh-india','Rishikesh','Rafting','Rafting operator skipped safety briefing — no life jacket check','high','Booked rafting with an operator who quoted ₹400 versus the ₹650 TURA-registered operators. No safety briefing, life jackets handed out without fit checks, guide had no visible certification. One person in our group fell out at grade 3 rapids. Ended safely but avoidably. Only use TURA-registered operators. Ask: ''Can I see your TURA registration?''','Natasha','Marine Drive rafting stretch, Rishikesh',79,'approved','2026-01-31') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-021','rishikesh-india','Rishikesh','Donation','Temple ''priest'' tied thread on my wrist and demanded ₹2,000 to remove curse','medium','Man in saffron near Ram Jhula tied a thread on my wrist while saying a blessing I didn''t ask for. Demanded ₹2,000 saying the thread must be tied with a proper puja payment or it would bring bad luck. Walked away with the thread on. It did not bring bad luck. No temple in Rishikesh mandates any donation.','Emma','Ram Jhula bridge approach, Rishikesh',55,'approved','2026-02-19') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-022','agra-india','Agra','Ticketing','Paid ₹1,200 for counterfeit Taj Mahal entry ticket','critical','A professionally printed ticket sold by a man 200m before the south gate entrance. The QR code scanned green on his personal phone. At the real gate it failed. Had to buy a second ticket. The counterfeit tickets are very convincing. Buy only at the ASI official window at the gate or at asi.payumoney.com the evening before.','Chloe','South gate approach road, Agra',102,'approved','2026-03-12') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-023','agra-india','Agra','Marble shop','Auto driver insisted on one stop — 90-minute marble shop ordeal','medium','Pre-agreed ₹300 auto to Agra Fort with explicit ''no stops''. Driver still pulled into a marble inlay showroom claiming it was ''on the route''. Multi-person team inside — one blocks the door, one shows samples, one processes payment. Left after 15 minutes without buying anything. Uber/Ola only in Agra.','Priya','Between Taj and Agra Fort',47,'approved','2026-02-03') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-024','kochi-india','Kochi','Spice shopping','Cardamom sold as premium grade was mostly stems and husks','medium','Bought 500g of ''premium Wayanad cardamom'' from a Mattancherry shop for ₹1,800. At home found it was mostly stems and low-grade husks. Genuine cardamom at that price should be full green pods. Buy from shops 2–3 streets back from the main synagogue lane, or from the Kerala government spice store on MG Road, Ernakulam.','Nandita','Jew Town Road, Mattancherry, Kochi',38,'approved','2026-03-22') ON CONFLICT (id) DO NOTHING;
INSERT INTO beware_reports (id,destination_slug,city,category,title,severity,description,reported_by_name,location,helpful_count,status,created_at) VALUES ('beware-025','kochi-india','Kochi','Transport','Auto quoted ₹400 for the ₹5 government ferry route','medium','Asked an auto at Ernakulam ferry terminal for Fort Kochi. Driver quoted ₹400 and said the ferry ''wasn''t running today''. The ferry was running — I could see it from where I was standing. The government ferry from High Court Jetty to Fort Kochi costs ₹5 and runs every 20–30 minutes until about 9:30pm. Never take an auto for this crossing.','Aisha','Ernakulam ferry terminal, Kochi',61,'approved','2026-01-16') ON CONFLICT (id) DO NOTHING;

-- safety_products
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-001','She''s Birdie 130dB Personal Alarm','Personal alarm','Pull-pin keychain siren + LED strobe. Disorients an attacker, alerts everyone in 50 metres.','₹599 – ₹1,799','https://placehold.co/600x600/f5f0e6/c4522a?text=Personal+Alarm','https://www.amazon.in/s?k=she%27s+birdie+personal+alarm&tag=PLACEHOLDER-21',1) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-002','Addalock Portable Door Lock','Door security','Locks any inward-swinging hostel/hotel door from inside even if the front-desk key is duplicated.','₹999 – ₹2,499','https://placehold.co/600x600/f5f0e6/c4522a?text=Door+Lock','https://www.amazon.in/s?k=addalock+portable+door+lock&tag=PLACEHOLDER-21',2) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-003','GE Door Stop Alarm (or eBoot 3-pack)','Door security','Wedge-style stopper with built-in 120dB alarm. Backup if the Addalock fails or you forget it.','₹399 – ₹999','https://placehold.co/600x600/f5f0e6/c4522a?text=Door+Stop+Alarm','https://www.amazon.in/s?k=door+stop+alarm+wedge&tag=PLACEHOLDER-21',3) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-004','Pacsafe Citysafe CX Anti-Theft Crossbody','Anti-theft bag','Slash-resistant body, lockable zippers, RFID-blocking pockets. Pickpocket-proof for crowded markets.','₹4,999 – ₹12,999','https://placehold.co/600x600/f5f0e6/c4522a?text=Anti-Theft+Bag','https://www.amazon.in/s?k=pacsafe+citysafe+cx&tag=PLACEHOLDER-21',4) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-005','Apple AirTag (4-pack) or Samsung SmartTag2','Tracking tag','Drop one in luggage, one in handbag, one in hostel room. Find My / SmartThings tells you where they are.','₹3,499 – ₹10,500','https://placehold.co/600x600/f5f0e6/c4522a?text=AirTag','https://www.amazon.in/s?k=apple+airtag+4+pack&tag=PLACEHOLDER-21',5) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-006','Mi / Anker 10,000 mAh Power Bank','Backup power','Phone dies = stranded with no Uber, no maps, no SOS. 10,000 mAh = 3 phone charges minimum.','₹999 – ₹2,499','https://placehold.co/600x600/f5f0e6/c4522a?text=Power+Bank','https://www.amazon.in/s?k=mi+power+bank+10000mah&tag=PLACEHOLDER-21',6) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-007','Zoppen RFID-Blocking Travel Wallet','Document safety','Holds passport + cards + cash. RFID shielding stops contactless skimming attacks at crowded stations.','₹599 – ₹2,999','https://placehold.co/600x600/f5f0e6/c4522a?text=RFID+Wallet','https://www.amazon.in/s?k=zoppen+rfid+travel+wallet&tag=PLACEHOLDER-21',7) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-008','Eagle Creek Silk Money Belt','Document safety','Worn under clothing for emergency cash, backup card, passport copy. If your main bag goes, you still get home.','₹399 – ₹1,499','https://placehold.co/600x600/f5f0e6/c4522a?text=Money+Belt','https://www.amazon.in/s?k=eagle+creek+money+belt&tag=PLACEHOLDER-21',8) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-009','Airalo eSIM (India tourist plan)','Connectivity','Activate before landing — no airport SIM-counter scams, no ID-swap fraud, no waiting in a queue at 2am.','₹999 – ₹1,999 (28 days, ~2 GB/day)','https://placehold.co/600x600/f5f0e6/c4522a?text=eSIM','https://www.airalo.com/india-esim?ref=PLACEHOLDER',9) ON CONFLICT (id) DO NOTHING;
INSERT INTO safety_products (id,name,category,why_it_matters,price_range,image_url,amazon_url,display_order) VALUES ('product-010','LifeStraw Go Filter Bottle','Health','Built-in filter purifies tap water. Saves ₹50/day on bottled water and eliminates the tampered-bottle risk.','₹2,499 – ₹4,499','https://placehold.co/600x600/f5f0e6/c4522a?text=Filter+Bottle','https://www.amazon.in/s?k=lifestraw+go+filter+bottle&tag=PLACEHOLDER-21',10) ON CONFLICT (id) DO NOTHING;

-- ---- 003_profile_fields.sql ----
alter table profiles
  add column if not exists first_name text,
  add column if not exists home_city text,
  add column if not exists instagram text,
  add column if not exists phone text;


-- ---- 004_community_image_urls.sql ----
alter table community_posts
  add column if not exists image_urls jsonb default '[]'::jsonb;


-- ---- 005_email_captures.sql ----
create table if not exists email_captures (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  source text default 'exit-intent',
  created_at timestamptz default now()
);

alter table email_captures enable row level security;

drop policy if exists "Anyone can insert email captures" on email_captures;
create policy "Anyone can insert email captures" on email_captures
  for insert with check (true);


-- ---- 006_community_v2.sql ----
-- 006: Community v2 — post titles, tab merge (sister→ask), helpful + report tracking

-- 1. Add title column to community_posts
alter table community_posts
  add column if not exists title text;

-- 2. Backfill title for existing posts: first sentence (split on ?, ., !) capped at 60 chars.
update community_posts
set title = case
  when position('?' in content) between 1 and 60 then substring(content from 1 for position('?' in content))
  when position('.' in content) between 1 and 60 then substring(content from 1 for position('.' in content) - 1)
  when position('!' in content) between 1 and 60 then substring(content from 1 for position('!' in content) - 1)
  when char_length(content) <= 60 then content
  else substring(content from 1 for 57) || '...'
end
where title is null;

-- 3. Make title NOT NULL going forward
alter table community_posts
  alter column title set not null;

-- 4. Tab merge: sister → ask
update community_posts set tab = 'ask' where tab = 'sister';

-- 5. Per-user helpful tracking for community posts
create table if not exists community_post_helpful (
  post_id text not null references community_posts(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);
alter table community_post_helpful enable row level security;
drop policy if exists "Users read own helpful marks" on community_post_helpful;
create policy "Users read own helpful marks" on community_post_helpful
  for select using (auth.uid() = user_id);
drop policy if exists "Users insert own helpful" on community_post_helpful;
create policy "Users insert own helpful" on community_post_helpful
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users delete own helpful" on community_post_helpful;
create policy "Users delete own helpful" on community_post_helpful
  for delete using (auth.uid() = user_id);

-- 6. Post reports (moderation queue)
create table if not exists community_post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id text not null references community_posts(id) on delete cascade,
  reporter_id uuid references auth.users on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
alter table community_post_reports enable row level security;
drop policy if exists "Users insert reports" on community_post_reports;
create policy "Users insert reports" on community_post_reports
  for insert with check (auth.uid() = reporter_id);

-- 7. Per-user helpful tracking for beware reports
create table if not exists beware_helpful (
  report_id uuid not null references beware_reports(id) on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);
alter table beware_helpful enable row level security;
drop policy if exists "Users read own beware helpful" on beware_helpful;
create policy "Users read own beware helpful" on beware_helpful
  for select using (auth.uid() = user_id);
drop policy if exists "Users insert own beware helpful" on beware_helpful;
create policy "Users insert own beware helpful" on beware_helpful
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users delete own beware helpful" on beware_helpful;
create policy "Users delete own beware helpful" on beware_helpful
  for delete using (auth.uid() = user_id);

-- 8. Beware reports (moderation queue)
create table if not exists beware_report_flags (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references beware_reports(id) on delete cascade,
  reporter_id uuid references auth.users on delete set null,
  reason text,
  created_at timestamptz not null default now()
);
alter table beware_report_flags enable row level security;
drop policy if exists "Users insert beware flags" on beware_report_flags;
create policy "Users insert beware flags" on beware_report_flags
  for insert with check (auth.uid() = reporter_id);


-- ---- 007_profile_v2.sql ----
-- 007: Profile v2 — username, badges, saved destinations, notifications, soft delete

-- 1. Add username + deleted_at to profiles
alter table profiles
  add column if not exists username text unique,
  add column if not exists deleted_at timestamptz;

-- 2. Backfill username from email prefix for existing users (skip collisions)
update profiles
set username = split_part(email, '@', 1)
where username is null
  and email is not null
  and not exists (
    select 1 from profiles p2
    where p2.username = split_part(profiles.email, '@', 1)
      and p2.id != profiles.id
  );

-- 3. Update new-user trigger to also set username
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username)
  values (
    new.id,
    new.email,
    split_part(new.email, '@', 1)
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

-- 4. Contributor badges
-- destination_slug references intel_cards.slug (no separate destinations table)
create table if not exists contributor_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  badge_type text not null,
  -- founding_contributor | intel_writer | beware_reporter | community_helper | local_sister
  destination_slug text references intel_cards(slug) on delete set null,
  awarded_at timestamptz not null default now(),
  unique (user_id, badge_type, destination_slug)
);
alter table contributor_badges enable row level security;
drop policy if exists "Public read badges" on contributor_badges;
create policy "Public read badges" on contributor_badges
  for select using (true);
drop policy if exists "Users read own badges" on contributor_badges;
create policy "Users read own badges" on contributor_badges
  for select using (auth.uid() = user_id);

-- 5. Saved destinations (bookmarks)
create table if not exists saved_destinations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  destination_slug text not null references intel_cards(slug) on delete cascade,
  saved_at timestamptz not null default now(),
  unique (user_id, destination_slug)
);
alter table saved_destinations enable row level security;
drop policy if exists "Users manage own saves" on saved_destinations;
create policy "Users manage own saves" on saved_destinations
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 6. Notification preferences
create table if not exists notification_preferences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade unique,
  new_beware_in_saved_destinations bool not null default true,
  buddy_match_found bool not null default true,
  community_reply_to_my_post bool not null default true,
  platform_updates bool not null default false,
  whatsapp_enabled bool not null default false,
  email_enabled bool not null default true,
  updated_at timestamptz not null default now()
);
alter table notification_preferences enable row level security;
drop policy if exists "Users manage own notifications" on notification_preferences;
create policy "Users manage own notifications" on notification_preferences
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ---- 008_vault_and_triggers.sql ----
-- 008: Vault purchases + badge auto-award triggers

-- Vault purchases (used by /settings to show "Manage" vs "Set up")
create table if not exists vault_purchases (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references profiles(id) on delete cascade,
  trip_label text,
  status text not null default 'active',
  -- 'active' | 'expired' | 'cancelled'
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
alter table vault_purchases enable row level security;
drop policy if exists "Users read own vault" on vault_purchases;
create policy "Users read own vault" on vault_purchases
  for select using (auth.uid() = user_id);
drop policy if exists "Users insert own vault" on vault_purchases;
create policy "Users insert own vault" on vault_purchases
  for insert with check (auth.uid() = user_id);

-- Partial unique index to ensure one platform-wide badge per (user, badge_type) when destination is null
create unique index if not exists idx_contributor_badges_no_dest
  on contributor_badges (user_id, badge_type)
  where destination_slug is null;

-- Auto-award beware_reporter on approved beware reports
create or replace function public.award_beware_reporter_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'approved' and new.reported_by_id is not null then
    insert into public.contributor_badges (user_id, badge_type, destination_slug)
    values (new.reported_by_id, 'beware_reporter', new.destination_slug)
    on conflict (user_id, badge_type, destination_slug) do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_beware_report on beware_reports;
create trigger badge_on_beware_report
  after insert or update of status on beware_reports
  for each row
  execute function public.award_beware_reporter_badge();

-- Auto-award community_helper on approved community posts
create or replace function public.award_community_helper_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if new.status = 'approved' and new.author_id is not null then
    insert into public.contributor_badges (user_id, badge_type)
    values (new.author_id, 'community_helper')
    on conflict (user_id, badge_type) where destination_slug is null do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_community_post on community_posts;
create trigger badge_on_community_post
  after insert or update of status on community_posts
  for each row
  execute function public.award_community_helper_badge();

-- Auto-award intel_writer when an intel card has a contributor_slug matching a profile.username
create or replace function public.award_intel_writer_badge()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  matching_user_id uuid;
begin
  if new.contributor_slug is not null then
    select id into matching_user_id from public.profiles
      where username = new.contributor_slug
      and deleted_at is null
      limit 1;
    if matching_user_id is not null then
      insert into public.contributor_badges (user_id, badge_type, destination_slug)
      values (matching_user_id, 'intel_writer', new.slug)
      on conflict (user_id, badge_type, destination_slug) do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists badge_on_intel_card on intel_cards;
create trigger badge_on_intel_card
  after insert or update of contributor_slug on intel_cards
  for each row
  execute function public.award_intel_writer_badge();

-- Backfill existing approved reports
insert into contributor_badges (user_id, badge_type, destination_slug)
select distinct reported_by_id, 'beware_reporter', destination_slug
from beware_reports
where status = 'approved' and reported_by_id is not null
on conflict (user_id, badge_type, destination_slug) do nothing;

-- Backfill existing approved community posters
insert into contributor_badges (user_id, badge_type)
select distinct author_id, 'community_helper'
from community_posts
where status = 'approved' and author_id is not null
on conflict (user_id, badge_type) where destination_slug is null do nothing;

-- Backfill intel writers
insert into contributor_badges (user_id, badge_type, destination_slug)
select distinct p.id, 'intel_writer', i.slug
from intel_cards i
join profiles p on p.username = i.contributor_slug and p.deleted_at is null
where i.contributor_slug is not null
on conflict (user_id, badge_type, destination_slug) do nothing;


-- ---- 009_vault_signups.sql ----
-- 009: Vault signups — pre-launch interest form for WhatsApp Trip Vault

create table if not exists vault_signups (
  id               uuid default gen_random_uuid() primary key,
  email            text not null,
  phone            text not null,
  trip_destination text not null,
  travel_start     date,
  travel_end       date,
  created_at       timestamptz not null default now()
);

alter table vault_signups enable row level security;

-- No auth required — anyone can sign up for the vault waitlist
drop policy if exists "Anyone can insert vault signup" on vault_signups;
create policy "Anyone can insert vault signup" on vault_signups
  for insert with check (true);


-- ---- 010_moderation_v1.sql ----
-- ─────────────────────────────────────────────────────────────────────────────
-- 010_moderation_v1.sql
-- V1 moderation system: roles, notifications, report audit trail, RLS updates.
-- All changes are ADDITIVE — existing policies and triggers are untouched.
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Role column on profiles ────────────────────────────────────────────────
alter table profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'moderator', 'admin'));

-- ── 2. Audit columns on beware_reports ───────────────────────────────────────
-- status now supports 'pending' | 'approved' | 'rejected'
alter table beware_reports
  add column if not exists reviewed_by      uuid references profiles(id) on delete set null,
  add column if not exists reviewed_at      timestamptz,
  add column if not exists rejection_reason text;

-- ── 3. Notifications table ────────────────────────────────────────────────────
create table if not exists notifications (
  id                uuid        primary key default gen_random_uuid(),
  user_id           uuid        not null references profiles(id) on delete cascade,
  type              text        not null,
  title             text        not null,
  body              text        not null,
  read              bool        not null default false,
  related_report_id uuid        references beware_reports(id) on delete set null,
  created_at        timestamptz not null default now()
);

alter table notifications enable row level security;

drop policy if exists "Users read own notifications" on notifications;
create policy "Users read own notifications" on notifications
  for select using (auth.uid() = user_id);

-- Users can only mark their own notifications as read (update read column)
drop policy if exists "Users update own notifications" on notifications;
create policy "Users update own notifications" on notifications
  for update using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 4. New RLS policies on beware_reports (additive — existing ones stay) ────

-- Moderators and admins can read ALL reports regardless of status
drop policy if exists "Moderators read all reports" on beware_reports;
create policy "Moderators read all reports" on beware_reports
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('moderator', 'admin')
    )
  );

-- Users can always read their OWN reports (pending, approved, rejected)
drop policy if exists "Users read own reports" on beware_reports;
create policy "Users read own reports" on beware_reports
  for select using (auth.uid() = reported_by_id);

-- Moderators and admins can update reports (approve / reject)
drop policy if exists "Moderators update reports" on beware_reports;
create policy "Moderators update reports" on beware_reports
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role in ('moderator', 'admin')
    )
  );

-- ── 5. RLS on profiles — admin can update any profile's role ─────────────────
-- Existing "Users update own profile" policy is unchanged.
-- We add a separate admin-scoped update policy.
drop policy if exists "Admins update user roles" on profiles;
create policy "Admins update user roles" on profiles
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid()
        and role = 'admin'
    )
  );

-- ── 6. Trigger: notify reporter when status changes ───────────────────────────
create or replace function notify_reporter_on_status_change()
returns trigger
language plpgsql
security definer   -- runs as the function owner, bypassing RLS for the insert
set search_path = public
as $$
begin
  -- Only act when status actually changes
  if old.status is not distinct from new.status then
    return new;
  end if;

  if new.status = 'approved' and new.reported_by_id is not null then
    insert into notifications (user_id, type, title, body, related_report_id)
    values (
      new.reported_by_id,
      'report_approved',
      'Your report was approved',
      'Your report "' || new.title || '" is now live on the Beware Board.',
      new.id
    );
  end if;

  if new.status = 'rejected' and new.reported_by_id is not null then
    insert into notifications (user_id, type, title, body, related_report_id)
    values (
      new.reported_by_id,
      'report_rejected',
      'Your report needs revision',
      coalesce(
        new.rejection_reason,
        'Your report "' || new.title || '" was not approved. Edit and resubmit.'
      ),
      new.id
    );
  end if;

  return new;
end $$;

drop trigger if exists notify_on_report_status on beware_reports;
create trigger notify_on_report_status
  after update of status on beware_reports
  for each row execute function notify_reporter_on_status_change();

-- ── 7. Seed founding admin ────────────────────────────────────────────────────
-- Safe: only updates if the user already exists in auth.users.
-- Re-running this migration is idempotent.
update profiles
set role = 'admin'
where id = (
  select id from auth.users
  where email = 'prernatravels2@gmail.com'
  limit 1
);

