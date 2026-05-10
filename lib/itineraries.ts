export interface DayPlan {
  day: number
  title: string
  morning: string
  afternoon: string
  evening: string
  stay: string
  daily_cost: number
  safety_tip: string
  womens_tip: string
}

export interface Itinerary {
  id: string
  destination: string
  duration_days: number
  budget_min: number
  budget_max: number
  best_months: string[]
  estimated_total_cost: number
  safety_score: number
  best_neighbourhoods: string[]
  avoid: string[]
  transport_from: Record<string, string>
  packing_notes: string
  scam_alerts: string[]
  days: DayPlan[]
}

export const ITINERARIES: Itinerary[] = [
  {
    id: "goa-5d-budget",
    destination: "Goa",
    duration_days: 5,
    budget_min: 12000,
    budget_max: 18000,
    best_months: ["November","December","January","February","March"],
    estimated_total_cost: 15000,
    safety_score: 4.0,
    best_neighbourhoods: ["Aldona","Assagao","Panjim","Anjuna"],
    avoid: ["Calangute after dark","Baga beach at night"],
    transport_from: {
      "Mumbai": "Take Mandovi Express or Konkan Railway — 9 hrs, ₹400-800. Book 3 weeks ahead.",
      "Bangalore": "KSRTC overnight bus — 8 hrs, ₹600-900. Or IndiGo flight 1hr ₹2500+.",
      "Delhi": "Fly — no good train option. Budget ₹3000-5000 return.",
      "default": "Check Konkan Railway from nearest major city. Flights via Dabolim or Mopa airport."
    },
    packing_notes: "Reef-safe sunscreen. Light cotton only. One sarong doubles as beach cover + temple wrap. Waterproof bag for water sports.",
    scam_alerts: [
      "Taxi union blocks Uber/Ola — use GoaMiles app for fixed fares",
      "Feni shots offered free at shacks = overpriced bill follows",
      "Fake 'government approved' tour operators near Calangute beach",
      "Motorbike rental shops charging for pre-existing scratches — photograph bike before riding"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + settle in North Goa",
        morning: "Land/arrive. Head straight to Assagao or Aldona — skip Calangute entirely. Check into your stay, freshen up.",
        afternoon: "Walk Assagao village. Eat at Villa Blanche Bistro (women-run, excellent salads). Get your bearings slowly.",
        evening: "Sunset at Vagator beach — less crowded than Baga. Back by 8pm. Dinner at local thaali place near your stay.",
        stay: "Zostel Goa (Anjuna) or any guesthouse in Assagao — ₹800-1500/night",
        daily_cost: 2500,
        safety_tip: "Don't accept drinks from strangers on night one. You don't know the area yet.",
        womens_tip: "Aldona and Assagao feel like a different country from Calangute. The extra ₹500/night is 100% worth it."
      },
      {
        day: 2,
        title: "Beaches + Old Goa",
        morning: "Rent a scooter from a trusted shop (ask your host). Drive to Chapora Fort — early before heat hits.",
        afternoon: "Old Goa churches — Basilica of Bom Jesus. Quiet, beautiful, free. Dress modestly here.",
        evening: "Anjuna flea market if Wednesday. Otherwise Panjim waterfront for dinner.",
        stay: "Same as Day 1",
        daily_cost: 3000,
        safety_tip: "On scooter — stick to main roads. Potholed side roads after dark are injury risk.",
        womens_tip: "GoaMiles for anything after 9pm. Don't scooter back alone late at night."
      },
      {
        day: 3,
        title: "South Goa day trip",
        morning: "Drive or bus to Palolem beach — 1.5 hrs south. Completely different vibe. Calm, crescent shaped, stunning.",
        afternoon: "Swim, read, exist. Kayak rental ₹300/hr. Dolphin trips available but skip them — not ethical.",
        evening: "Head back north by 6pm. Dinner in Panjim — Viva Panjim restaurant on 31st January Street.",
        stay: "Same base",
        daily_cost: 2800,
        safety_tip: "Palolem is calmer and safer than north Goa beaches. Still don't beach alone after dark.",
        womens_tip: "Palolem is where you actually relax. North Goa is where you explore. Do both."
      },
      {
        day: 4,
        title: "Slow day — markets + local life",
        morning: "Mapusa Friday market if timing works. Best local produce, spices, cheap cashews.",
        afternoon: "Fontainhas Latin Quarter in Panjim — tiny colourful Portuguese neighbourhood. Very photogenic, very safe.",
        evening: "Sundowner at Antares restaurant (watch the sunset, don't need to eat there). Then cheap xacuti curry at a local joint.",
        stay: "Same base",
        daily_cost: 2200,
        safety_tip: "Fontainhas is one of Goa's safest neighbourhoods. Comfortable to walk alone at dusk.",
        womens_tip: "Skip the touristy beach clubs. The real Goa is in Panjim's side streets."
      },
      {
        day: 5,
        title: "Last morning + depart",
        morning: "One last beach sunrise. Pack up. GoaMiles to station/airport.",
        afternoon: "Depart.",
        evening: "Home.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Book return transport the day before. Don't rely on finding last-minute taxis.",
        womens_tip: "You'll want to come back. Everyone does."
      }
    ]
  },
  {
    id: "rishikesh-4d-budget",
    destination: "Rishikesh",
    duration_days: 4,
    budget_min: 9000,
    budget_max: 15000,
    best_months: ["February","March","September","October","November"],
    estimated_total_cost: 12000,
    safety_score: 4.2,
    best_neighbourhoods: ["Tapovan","Swarg Ashram","Ram Jhula area"],
    avoid: ["Lakshman Jhula after 9pm","isolated ghats at night"],
    transport_from: {
      "Delhi": "Volvo bus from ISBT Kashmere Gate — 6 hrs, ₹500-700. Or train to Haridwar then shared taxi.",
      "Mumbai": "Fly to Dehradun, then taxi to Rishikesh 1hr ₹800.",
      "default": "Train to Haridwar then shared cab ₹150 to Rishikesh."
    },
    packing_notes: "Modest clothing mandatory — shoulders and knees covered near ashrams and ghats. Yoga mat if you plan classes. Good walking sandals.",
    scam_alerts: [
      "Fake yoga teacher certificates — check Google reviews before booking",
      "Baba offering blessings then demanding money",
      "Overpriced rafting packages near bus stand — book through your hostel",
      "Auto drivers taking long routes — agree fare before getting in"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + settle + Ganga aarti",
        morning: "Arrive. Head to Ram Jhula area. Check in. Walk slowly — altitude adjustment.",
        afternoon: "Explore Swarg Ashram market. Light lunch at Chotiwala (touristy but fun). Browse the tiny shops.",
        evening: "Triveni Ghat aarti at 6pm — sit on steps, watch, absorb. One of India's most moving rituals.",
        stay: "Zostel Rishikesh or Bunk Hostel — ₹600-900/night",
        daily_cost: 2500,
        safety_tip: "Use Ram Jhula bridge, not Lakshman Jhula side after dark.",
        womens_tip: "The aarti on your first evening sets the whole tone. Don't skip it."
      },
      {
        day: 2,
        title: "Rafting + Beatles Ashram",
        morning: "White water rafting — book through hostel, not street touts. Grade 3-4 rapids. ₹600-800 for 16km stretch.",
        afternoon: "Beatles Ashram (Chaurasi Kutia) — ₹600 entry, worth every rupee. Surreal graffiti-covered ruins in the forest.",
        evening: "Yoga nidra class at any reputable ashram. ₹200-400. Sleep deeply after.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Wear life jacket properly during rafting. Don't let guides skip safety briefing.",
        womens_tip: "Beatles Ashram in the afternoon light is one of those India moments. Go slow inside."
      },
      {
        day: 3,
        title: "Hike + waterfall + sunset",
        morning: "Neer Garh waterfall hike — 3km from town, easy trail, stunning payoff. Start by 7am before heat.",
        afternoon: "Kunjapuri Devi temple if energy allows — 1hr drive + short climb. Himalayan views.",
        evening: "Roof cafe dinner with Ganga view. Many good options in Tapovan.",
        stay: "Same",
        daily_cost: 2000,
        safety_tip: "Hike in the morning only. Don't hike alone on unfamiliar trails after 3pm.",
        womens_tip: "The waterfall is busier on weekends. Go weekday morning and you might have it to yourself."
      },
      {
        day: 4,
        title: "Yoga morning + depart",
        morning: "Sunrise yoga class 6am — every ashram offers one. ₹200-500. Non-negotiable experience.",
        afternoon: "Pack up. Café breakfast. Share cab to Haridwar or Dehradun.",
        evening: "Depart.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Pre-book return transport. Shared cabs fill up fast on weekends.",
        womens_tip: "Even two hours of real yoga here hits differently than anywhere else."
      }
    ]
  },
  {
    id: "jaipur-3d-budget",
    destination: "Jaipur",
    duration_days: 3,
    budget_min: 7000,
    budget_max: 13000,
    best_months: ["October","November","December","January","February"],
    estimated_total_cost: 10000,
    safety_score: 3.8,
    best_neighbourhoods: ["Civil Lines","Bani Park","Old City (daytime only)"],
    avoid: ["Old City lanes alone after 7pm","anywhere near Hawa Mahal by foot — use Uber only"],
    transport_from: {
      "Delhi": "Shatabdi Express — 4.5 hrs, ₹700. Or Volvo bus 5 hrs ₹400.",
      "Mumbai": "Overnight train — 18 hrs or fly 1.5 hrs.",
      "default": "Train preferred. Jaipur Junction is central."
    },
    packing_notes: "Dupatta or scarf mandatory for temples. Comfortable closed shoes for forts. Light layers — cold at night Oct-Feb.",
    scam_alerts: [
      "Every auto near Hawa Mahal goes to commission shops — Uber/Ola only",
      "Gem factory tours — you will be pressured to buy overpriced stones",
      "Fake students offering to practice English then leading to shops",
      "Carpet shop 'cultural demonstrations' — just shops"
    ],
    days: [
      {
        day: 1,
        title: "Amber Fort + old city",
        morning: "Amber Fort — book entry online ₹500. Go before 10am. Elephant rides are cruel — skip them.",
        afternoon: "Jantar Mantar observatory — fascinating, underrated. City Palace entry ₹700.",
        evening: "Chokhi Dhani for dinner if you want the full Rajasthani experience (touristy but fun). Or rooftop dinner at Hawa Mahal area restaurants.",
        stay: "Hotel Pearl Palace or similar heritage guesthouse — ₹1200-2000/night",
        daily_cost: 3500,
        safety_tip: "Uber everywhere. Autos near tourist spots are commission traps.",
        womens_tip: "Pearl Palace has women-friendly staff and excellent rooftop. Worth the slightly higher price."
      },
      {
        day: 2,
        title: "Hawa Mahal + bazaars + Nahargarh",
        morning: "Hawa Mahal exterior photo from the café across the street (free view). Interior entry ₹50.",
        afternoon: "Johari Bazaar for silver jewellery — bargain hard, start at 40% of asking price. Bapu Bazaar for textiles.",
        evening: "Nahargarh Fort sunset — Uber up, walk down with group. City lights view is spectacular.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Stay in bazaars until 6pm max. Leave before dark.",
        womens_tip: "The silver in Johari Bazaar is real. The gems being sold as 'bargains' anywhere are not."
      },
      {
        day: 3,
        title: "Stepwells + depart",
        morning: "Panna Meena Ka Kund stepwell — hidden gem, almost no tourists, stunning geometry. Then Abhaneri if time.",
        afternoon: "Lassi at Lassiwala on MI Road (iconic). Pack up. Head to station.",
        evening: "Depart.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Stepwells are slippery — wear grip shoes.",
        womens_tip: "Panna Meena stepwell at 8am with no crowds is one of the most peaceful places in Rajasthan."
      }
    ]
  },
  {
    id: "udaipur-4d-budget",
    destination: "Udaipur",
    duration_days: 4,
    budget_min: 10000,
    budget_max: 18000,
    best_months: ["October","November","December","January","February","March"],
    estimated_total_cost: 14000,
    safety_score: 4.3,
    best_neighbourhoods: ["Old City lakeside","Fateh Sagar area","Hanuman Ghat"],
    avoid: ["Isolated lake paths after 9pm"],
    transport_from: {
      "Delhi": "Chetak Express overnight train — 12 hrs ₹500-800. Or fly 1.5 hrs.",
      "Mumbai": "Train 10-12 hrs or fly 1.5 hrs.",
      "Jaipur": "Bus 5 hrs ₹300 or train.",
      "default": "Train to Udaipur City station, then auto to lake area."
    },
    packing_notes: "One slightly nicer outfit — Udaipur has rooftop restaurants worth dressing for. Comfortable walking shoes for marble palace floors.",
    scam_alerts: [
      "Boat ride touts at Gangaur Ghat — fixed price is ₹400/hr, not ₹1200",
      "Miniature painting 'schools' are mostly shops",
      "Fake guides at City Palace — official guides wear ID cards"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + lake walk",
        morning: "Arrive. Check in near Hanuman Ghat or Lal Ghat area. Drop bags.",
        afternoon: "Walk the lakeside slowly. Gangaur Ghat is the most beautiful. Sit, watch, don't rush.",
        evening: "Dinner at Upre by 1559 AD — rooftop, Lake Pichola view, ₹800-1200/person. Book ahead.",
        stay: "Moustache Hostel Udaipur or Zostel — ₹700-1000/night",
        daily_cost: 3000,
        safety_tip: "Udaipur old city is India's most walkable tourist area. Genuinely safe to explore at dusk.",
        womens_tip: "Hanuman Ghat at golden hour. No boats, no noise. Just sit there."
      },
      {
        day: 2,
        title: "City Palace + lake boat",
        morning: "City Palace — open 9:30am. Budget 3 hours. Audio guide worth it ₹150.",
        afternoon: "Official boat ride on Lake Pichola — Jag Mandir island stop included ₹700. Book at official RTDC counter only.",
        evening: "Bagore Ki Haveli cultural show at 7pm — ₹90 entry, genuinely good folk performances.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Only RTDC counter for boats. The touts charge 3x and boats are unsafe.",
        womens_tip: "The Jag Mandir island stop feels unreal. One of those India-is-actually-magic moments."
      },
      {
        day: 3,
        title: "Kumbhalgarh day trip",
        morning: "Hire driver for Kumbhalgarh Fort day trip — ₹1500-2000 for full day car. Leave by 8am.",
        afternoon: "Kumbhalgarh — world's second longest wall, almost no tourists. Return via Ranakpur Jain temples if time.",
        evening: "Back by 7pm. Light dinner near Lal Ghat.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Go with a driver your hotel recommends. Don't take random street drivers for day trips.",
        womens_tip: "Kumbhalgarh has almost no foreign tourists. You'll have the fort largely to yourself."
      },
      {
        day: 4,
        title: "Morning market + depart",
        morning: "Hathi Pol bazaar for local shopping — not touristy, real Udaipur life. Best silver and textile prices.",
        afternoon: "Depart.",
        evening: "Home.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Auto to station — agree fare upfront ₹100-150 from old city.",
        womens_tip: "Udaipur is the one city in Rajasthan where solo women consistently feel safe and comfortable. Come back."
      }
    ]
  },
  {
    id: "kochi-6d-budget",
    destination: "Kochi",
    duration_days: 6,
    budget_min: 10000,
    budget_max: 18000,
    best_months: ["October","November","December","January","February","March"],
    estimated_total_cost: 14000,
    safety_score: 4.4,
    best_neighbourhoods: ["Fort Kochi","Mattancherry","Ernakulam main"],
    avoid: ["Isolated backwater paths after dark"],
    transport_from: {
      "Mumbai": "Fly 1.5 hrs ₹2500-4000. Or train 24 hrs.",
      "Bangalore": "Train 8-10 hrs ₹400-700. Or fly 1 hr.",
      "Delhi": "Fly — 3 hrs with connection.",
      "default": "Cochin International Airport or Ernakulam Junction station."
    },
    packing_notes: "Light cotton. One modest outfit for temples. Good walking shoes — Fort Kochi is best explored on foot.",
    scam_alerts: [
      "Autorickshaw meter rigging near airport",
      "Kathakali show touts selling overpriced 'premium' tickets — government shows are ₹200-350",
      "Fake 'backwater tour' operators — book through Kerala Tourism only"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + Fort Kochi walk",
        morning: "Arrive. Ferry from Ernakulam to Fort Kochi — ₹4, 25 minutes, unmissable.",
        afternoon: "Walk Fort Kochi. Chinese fishing nets, St Francis Church, Vasco da Gama burial site. Slow pace.",
        evening: "Dinner at Kashi Art Cafe — women-friendly, artistic, excellent food.",
        stay: "Zostel Fort Kochi or any heritage guesthouse — ₹800-1500/night",
        daily_cost: 2000,
        safety_tip: "Fort Kochi is one of India's most comfortable neighbourhoods for solo women. Genuinely walkable at dusk.",
        womens_tip: "The ₹4 government ferry is the best value in India. Take it at sunset."
      },
      {
        day: 2,
        title: "Mattancherry + spice market",
        morning: "Mattancherry Dutch Palace — ₹5 entry, extraordinary Kerala murals. Jewish Quarter and Paradesi Synagogue.",
        afternoon: "Spice market walk — buy cardamom, pepper, turmeric direct from wholesale shops.",
        evening: "Kathakali performance — Kerala Kathakali Centre Fort Kochi, ₹350. Arrive 45 mins early for makeup demo.",
        stay: "Same",
        daily_cost: 2500,
        safety_tip: "Mattancherry is safe and walkable. Stick to main Jew Town Road.",
        womens_tip: "The Kathakali makeup process is half the show. Don't miss it by arriving late."
      },
      {
        day: 3,
        title: "Backwaters day trip",
        morning: "Government DTPC houseboat day cruise — Alleppey backwaters, ₹400-600. Book at tourist desk only.",
        afternoon: "On the water. Lunch served onboard. Village life on either bank.",
        evening: "Back to Kochi by 6pm. Seafood dinner near Ernakulam.",
        stay: "Same base",
        daily_cost: 2800,
        safety_tip: "Only government-registered boats. Private touts overcharge and boats are sometimes unsafe.",
        womens_tip: "The backwaters are everything the photos promise. One of India's genuinely magical experiences."
      },
      {
        day: 4,
        title: "Munnar day trip",
        morning: "Hire car to Munnar — 3.5 hrs, ₹2500 return for private car. Tea plantations from 1000m altitude.",
        afternoon: "Tea museum ₹200. Walk through Eravikulam National Park if open. Nilgiri tahr spotting.",
        evening: "Return to Kochi. Tired but fed.",
        stay: "Same base",
        daily_cost: 3500,
        safety_tip: "Book car through your hotel. Mountain roads — ask driver to slow down, it's your right.",
        womens_tip: "Munnar tea in the actual plantation hits completely different. Buy 250g to take home."
      },
      {
        day: 5,
        title: "Slow Kochi day",
        morning: "Street art walk — Fort Kochi has some of India's best public murals. Self-guided, free.",
        afternoon: "Cooking class — several women-run options in Fort Kochi. Kerala fish curry + appam. ₹1500-2000.",
        evening: "Rooftop dinner. Watch the fishing nets at sunset from the promenade.",
        stay: "Same",
        daily_cost: 2500,
        safety_tip: "Comfortable evening out — Fort Kochi promenade is well-lit and populated.",
        womens_tip: "The cooking class pays for itself — you'll make Kerala curry at home forever after."
      },
      {
        day: 6,
        title: "Final morning + depart",
        morning: "One last ferry crossing. Coffee at a Mattancherry café.",
        afternoon: "Depart.",
        evening: "Home.",
        stay: "Check out",
        daily_cost: 700,
        safety_tip: "Prepaid taxi from Fort Kochi to airport — ₹800-1000. Book night before.",
        womens_tip: "Kochi is the one city every solo woman I know says felt immediately safe. Trust that instinct."
      }
    ]
  },
  {
    id: "hampi-4d-budget",
    destination: "Hampi",
    duration_days: 4,
    budget_min: 7000,
    budget_max: 13000,
    best_months: ["October","November","December","January","February"],
    estimated_total_cost: 10000,
    safety_score: 4.1,
    best_neighbourhoods: ["Hampi Bazaar","Virupapur Gaddi (island side)"],
    avoid: ["Boulder fields alone after dark","isolated temple paths at night"],
    transport_from: {
      "Bangalore": "Overnight bus 8 hrs ₹400-700. Or train to Hospet then auto 13km.",
      "Goa": "Bus via Hubli 7 hrs ₹400.",
      "default": "Nearest railhead is Hospet Junction — then auto or bus to Hampi."
    },
    packing_notes: "Sturdy shoes mandatory — uneven boulder terrain everywhere. Sun protection critical. Torch for early morning ruins.",
    scam_alerts: [
      "Coracle (round boat) operators charge ₹30 official, touts charge ₹200",
      "Guide fees are negotiable — ₹500-700 for half day is fair",
      "Fake 'closed for ceremony' temple scam redirecting to shops"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + Hampi Bazaar ruins",
        morning: "Arrive Hospet, auto to Hampi. Check in. Walk the main bazaar ruins.",
        afternoon: "Virupaksha Temple — oldest functioning temple in Hampi. Watch Lakshmi the elephant.",
        evening: "Sunset from Hemakuta Hill — 10 min climb, 360 degree ruins view.",
        stay: "Goan Corner or Mowgli Guesthouse — ₹600-1000/night",
        daily_cost: 2000,
        safety_tip: "Hemakuta Hill has a few other tourists at sunset. Don't go to isolated boulders alone.",
        womens_tip: "Hampi is one of those places that doesn't feel real. Give yourself time to absorb it."
      },
      {
        day: 2,
        title: "Royal Centre + Vittala Temple",
        morning: "Vittala Temple — book entry ₹600. Stone chariot and musical pillars. Go early, closes by noon for peak experience.",
        afternoon: "Royal Enclosure — Queens Bath, Mahanavami Dibba, Lotus Mahal. Hire bicycle ₹100/day.",
        evening: "Coracle ride across river to Virupapur Gaddi island side. Quieter, hippie cafes, sunset views.",
        stay: "Same or switch to island side",
        daily_cost: 2500,
        safety_tip: "Official coracle ghat only. Last coracle back is before dark — check timing.",
        womens_tip: "Bicycle is the best way to see Hampi. The scale only makes sense on two wheels."
      },
      {
        day: 3,
        title: "Boulder sunrise + hidden temples",
        morning: "Matanga Hill sunrise — 30 min climb, best view in Hampi. Start at 5:30am with head torch.",
        afternoon: "Sule Bazaar and Achyutaraya Temple — almost no tourists. Wander freely.",
        evening: "Rooftop dinner in Hampi Bazaar. Watch fruit bats emerge at dusk.",
        stay: "Same",
        daily_cost: 1500,
        safety_tip: "Matanga Hill — go with other hostel guests. Ask hostel to organise group sunrise.",
        womens_tip: "Matanga Hill sunrise is the Hampi experience. Everything else is bonus."
      },
      {
        day: 4,
        title: "Morning ruins + depart",
        morning: "One last wander. Elephant stables if not seen. Buy local stone carvings from temple street.",
        afternoon: "Auto to Hospet. Train or bus out.",
        evening: "Depart.",
        stay: "Check out",
        daily_cost: 1000,
        safety_tip: "Pre-book return transport night before. Options thin out fast.",
        womens_tip: "You will feel the ruins for days after. Hampi stays with you."
      }
    ]
  },
  {
    id: "varanasi-3d-budget",
    destination: "Varanasi",
    duration_days: 3,
    budget_min: 6000,
    budget_max: 12000,
    best_months: ["October","November","December","January","February","March"],
    estimated_total_cost: 9000,
    safety_score: 3.6,
    best_neighbourhoods: ["Assi Ghat area","Godowlia (daytime)"],
    avoid: ["Narrow lanes of old city alone after 8pm","accepting chai from strangers near ghats"],
    transport_from: {
      "Delhi": "Kashi Vishwanath Express — 12 hrs ₹400-700.",
      "Mumbai": "Train 24 hrs or fly via Delhi.",
      "default": "Train to Varanasi Junction. Pre-paid auto to ghat area."
    },
    packing_notes: "Old clothes for ghat walks — you will get ash/water on them. Modest dress mandatory. Flip flops for ghat steps.",
    scam_alerts: [
      "Boat ride touts quote ₹500-1000 — official rate is ₹100-200 per person",
      "'Special puja' offers near burning ghats — always paid",
      "Silk shop tours disguised as temple visits",
      "Fake priests offering ghat blessings then demanding money"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + evening aarti",
        morning: "Arrive. Check in near Assi Ghat — safer, less chaotic than Dashashwamedh area.",
        afternoon: "Walk Assi Ghat slowly. Watch daily life. Don't rush.",
        evening: "Dashashwamedh Ghat Ganga aarti — arrive by 6pm for spot. 7pm ceremony. One of India's most powerful rituals.",
        stay: "Stops at Assi or Moustache Hostel Varanasi — ₹700-1000",
        daily_cost: 2500,
        safety_tip: "Aarti crowds are dense. Keep bag in front, hand on phone.",
        womens_tip: "Sit on the steps, not the boats. You see more and spend less."
      },
      {
        day: 2,
        title: "Dawn boat ride + old city",
        morning: "5am boat ride — ₹150-200 per person if you book through hostel. Cremation ghats at dawn. Profound and confronting.",
        afternoon: "Old city lanes — go with a group from hostel. Kashi Vishwanath temple if willing to queue. Lassi at Blue Lassi shop.",
        evening: "Rooftop cafe overlooking ghats. Watch the river change colour.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Old city lanes — only daytime, ideally with others. Easy to get disoriented.",
        womens_tip: "Blue Lassi has a 3-generation family recipe. The queue is worth it."
      },
      {
        day: 3,
        title: "Sarnath + depart",
        morning: "Sarnath — 13km from Varanasi, where Buddha gave first sermon. Dhamek Stupa, museum ₹30. Deeply peaceful contrast to Varanasi chaos.",
        afternoon: "Back to Varanasi. Pack up. Depart.",
        evening: "Train/flight out.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Pre-paid auto to Sarnath — ₹200-250 return. Don't negotiate on the street.",
        womens_tip: "Sarnath after Varanasi is the reset you didn't know you needed."
      }
    ]
  },
  {
    id: "kasol-5d-budget",
    destination: "Kasol",
    duration_days: 5,
    budget_min: 8000,
    budget_max: 16000,
    best_months: ["April","May","June","September","October"],
    estimated_total_cost: 12000,
    safety_score: 3.7,
    best_neighbourhoods: ["Kasol main village","Chalal (short walk)"],
    avoid: ["Solo night treks","accepting substances from strangers","isolated river paths after dark"],
    transport_from: {
      "Delhi": "Volvo to Bhuntar 12 hrs ₹700-1000, then local bus to Kasol 1hr ₹50.",
      "default": "Bus to Bhuntar then local transport."
    },
    packing_notes: "Warm layers even in summer — nights cold at altitude. Rain jacket May-June. Good trekking shoes. Powerbank.",
    scam_alerts: [
      "Drug culture is very real — know what you're walking into",
      "Trek guides without credentials — ask for ID",
      "Israeli restaurant menus — check prices before ordering, inflated for tourists"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + village walk",
        morning: "Long bus journey. Arrive afternoon. Check in. Recover.",
        afternoon: "Walk Kasol village. Parvati River. Sit and breathe mountain air.",
        evening: "Dinner at a café. Early night.",
        stay: "Nature's Abode or Alpine Guest House — ₹600-1000",
        daily_cost: 2000,
        safety_tip: "Kasol has a drug scene. Know your surroundings and who you're with.",
        womens_tip: "The river sounds help you sleep better than anywhere. Let yourself crash on night one."
      },
      {
        day: 2,
        title: "Kheerganga trek",
        morning: "Kheerganga trek — 12km one way, 6-7 hrs. Start by 7am. Hot spring at summit.",
        afternoon: "Reach summit. Hot spring soak. Worth every step.",
        evening: "Camp at top or return same day. Return reaches Kasol by 8pm.",
        stay: "Camp at Kheerganga ₹300 or return to base",
        daily_cost: 2500,
        safety_tip: "Trek with other hostel guests. Don't solo trek. Tell your guesthouse your plan.",
        womens_tip: "The hot spring at 3050m after a 12km trek is one of those experiences you describe for years."
      },
      {
        day: 3,
        title: "Rest + Chalal village",
        morning: "Rest day. Your legs need it.",
        afternoon: "Short walk to Chalal — 20 mins across river bridge. Quieter than Kasol, more local feel.",
        evening: "Riverside café dinner. Watch stars.",
        stay: "Same base",
        daily_cost: 1500,
        safety_tip: "Chalal bridge is narrow and wooden. Cross in daylight only.",
        womens_tip: "Chalal feels like the Kasol of 10 years ago. Go before it also gets discovered."
      },
      {
        day: 4,
        title: "Manikaran + hot springs",
        morning: "Manikaran — 4km from Kasol. Sikh Gurudwara with natural hot spring pools. Langar (free community meal) at Gurudwara.",
        afternoon: "Soak in natural hot spring. Free entry, donations welcome.",
        evening: "Back to Kasol. Last evening by the river.",
        stay: "Same",
        daily_cost: 1500,
        safety_tip: "Manikaran is very safe — Gurudwara environment.",
        womens_tip: "Eating langar at the Gurudwara is one of the most humbling and beautiful experiences in India."
      },
      {
        day: 5,
        title: "Morning + depart",
        morning: "Last river walk. Buy local honey — Parvati Valley honey is exceptional.",
        afternoon: "Bus to Bhuntar, then onward.",
        evening: "Overnight bus back to Delhi.",
        stay: "Check out",
        daily_cost: 1500,
        safety_tip: "Night bus — keep bag locked underneath.",
        womens_tip: "You'll understand why people stay in Kasol for weeks. Set a hard end date before you go."
      }
    ]
  },
  {
    id: "manali-6d-budget",
    destination: "Manali",
    duration_days: 6,
    budget_min: 12000,
    budget_max: 24000,
    best_months: ["May","June","September","October"],
    estimated_total_cost: 18000,
    safety_score: 4.0,
    best_neighbourhoods: ["Old Manali","Vashisht village","Mall Road area"],
    avoid: ["Rohtang Pass in bad weather","solo treks without guide","Old Manali lanes after midnight"],
    transport_from: {
      "Delhi": "Volvo overnight bus 14 hrs ₹800-1200. Or fly to Kullu-Manali airport.",
      "default": "Bus from Delhi ISBT Kashmere Gate."
    },
    packing_notes: "Warm jacket mandatory even in summer. Sunscreen SPF 50+. AMS medication if altitude-sensitive. Cash — ATMs unreliable.",
    scam_alerts: [
      "Rohtang Pass permit touts — book online yourself",
      "Fake trekking agencies without safety equipment",
      "Overpriced bikes near Mall Road — check GoaMiles equivalent apps"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + acclimatise",
        morning: "Arrive after overnight bus. Rest. Don't trek on day one.",
        afternoon: "Old Manali walk — cafes, mountain views, slow pace. Altitude: 2050m.",
        evening: "Early dinner. Sleep early. Acclimatisation is real.",
        stay: "Zostel Manali or Drifters Inn — ₹700-1200",
        daily_cost: 2000,
        safety_tip: "Altitude sickness hits differently person to person. Headache and fatigue are normal. Breathlessness is not — descend.",
        womens_tip: "Old Manali has the best café culture in Himachal. But rest first, explore tomorrow."
      },
      {
        day: 2,
        title: "Solang Valley + snow",
        morning: "Solang Valley — 14km from Manali. Snow activities: zorbing, skiing (winter), paragliding.",
        afternoon: "Return to Manali. Vashisht hot springs and temple.",
        evening: "Dinner at Johnson's Café — Manali institution, good continental food.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Paragliding only with certified operators. Check AAAI certification.",
        womens_tip: "Vashisht hot spring after cold mountain air is genuinely therapeutic."
      },
      {
        day: 3,
        title: "Rohtang Pass (seasonal)",
        morning: "Rohtang Pass — book permit online, ₹500. 3978m altitude. Snow year-round. Leave by 6am.",
        afternoon: "Return by 2pm — weather changes fast after noon.",
        evening: "Rest. The altitude takes energy.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Return by 2pm mandatory. Afternoon weather on Rohtang is dangerous and unpredictable.",
        womens_tip: "Rohtang is genuinely spectacular and genuinely exhausting. Pace yourself."
      },
      {
        day: 4,
        title: "Naggar + Kullu valley",
        morning: "Naggar Castle — 22km from Manali. Medieval castle turned heritage hotel. Nicholas Roerich Art Gallery next door.",
        afternoon: "Kullu Shawl factory visit — genuine local product, buy direct.",
        evening: "Back to Manali. Night market on Mall Road.",
        stay: "Same",
        daily_cost: 2500,
        safety_tip: "Hire a private car for this day — ₹1500-2000. Mountain roads need experienced drivers.",
        womens_tip: "Roerich's paintings of the Himalayas in his actual studio home are extraordinary."
      },
      {
        day: 5,
        title: "Hampta Pass trek or rest",
        morning: "Day trek toward Hampta Pass with guide — don't go alone. 10km round trip. ₹800-1200 for guide.",
        afternoon: "Return by 3pm.",
        evening: "Celebration dinner. You earned it.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Hire guide from registered trekking agency only. Always.",
        womens_tip: "The Hampta Pass view makes you understand why people dedicate their lives to mountains."
      },
      {
        day: 6,
        title: "Last morning + depart",
        morning: "Old Manali cafés. Buy apricot jam — local specialty, exceptional.",
        afternoon: "Board overnight bus to Delhi.",
        evening: "In transit.",
        stay: "Check out",
        daily_cost: 2000,
        safety_tip: "Overnight bus — window seat locks from inside. Keep valuables in front bag.",
        womens_tip: "Buy the apricot jam. And the Kullu shawl. You will use both forever."
      }
    ]
  },
  {
    id: "bangalore-2d-budget",
    destination: "Bangalore",
    duration_days: 2,
    budget_min: 5000,
    budget_max: 11000,
    best_months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
    estimated_total_cost: 8000,
    safety_score: 4.3,
    best_neighbourhoods: ["Indiranagar","Koramangala","Jayanagar","HSR Layout"],
    avoid: ["MG Road after 2am","isolated areas near old bus stand"],
    transport_from: {
      "Mumbai": "Fly 1.5 hrs ₹2000-3500. Or overnight train 24 hrs.",
      "Chennai": "Train 5-6 hrs ₹300-500.",
      "default": "Kempegowda International Airport — Metro direct to city now operational."
    },
    packing_notes: "Light layers — Bangalore is 900m altitude, evenings cool year-round. Smart casual if you want to do Indiranagar restaurants.",
    scam_alerts: [
      "Airport taxis overcharge — use Uber/Ola from pickup zone",
      "Fake tech job recruiters target young women in cafés"
    ],
    days: [
      {
        day: 1,
        title: "Indiranagar + cafés + culture",
        morning: "Breakfast at Brahmin's Coffee Bar — filter coffee and idli done right. ₹50.",
        afternoon: "Indiranagar 100 Feet Road — bookshops, cafés, boutiques. ATTA Galatta bookstore is exceptional.",
        evening: "Lahe Lahe on Saturday morning (if timing works) — women-only writing circle. Or rooftop bar in Indiranagar for sundowner.",
        stay: "Zostel Bangalore or any Koramangala guesthouse — ₹800-1500",
        daily_cost: 3500,
        safety_tip: "Bangalore Metro is safe and efficient. Women-only coach available.",
        womens_tip: "Indiranagar at 8am with filter coffee in hand is one of India's great urban pleasures."
      },
      {
        day: 2,
        title: "Lalbagh + Cubbon + depart",
        morning: "Lalbagh Botanical Gardens — 240 acres, colonial glass house, free before 6am. ₹20 after.",
        afternoon: "Cubbon Park walk. National Gallery of Modern Art if interested. UB City mall for AC break.",
        evening: "Depart or flight home.",
        stay: "Check out",
        daily_cost: 2500,
        safety_tip: "Cubbon Park is safe during day. Don't stay past 7pm.",
        womens_tip: "Bangalore rewards slow mornings. Don't fill every hour."
      }
    ]
  },
  {
    id: "delhi-4d-budget",
    destination: "Delhi",
    duration_days: 4,
    budget_min: 10000,
    budget_max: 18000,
    best_months: ["October","November","December","January","February","March"],
    estimated_total_cost: 14000,
    safety_score: 3.5,
    best_neighbourhoods: ["Hauz Khas","Lodi Colony","Connaught Place","Shahpur Jat"],
    avoid: ["Old Delhi lanes alone after dark","isolated Metro stations late night","Paharganj"],
    transport_from: {
      "Mumbai": "Rajdhani Express 16 hrs ₹800-1500. Or fly 2 hrs.",
      "Bangalore": "Fly 2.5 hrs.",
      "default": "IGI Airport — Metro Blue Line to city. Women-only coach."
    },
    packing_notes: "Air pollution mask October-February. Layers — cold at night in winter. Modest dress for Old Delhi and mosques.",
    scam_alerts: [
      "Taxi touts at airport — only prepaid booth or Metro",
      "Fake tourist offices near Connaught Place",
      "Auto refusing meter — use Uber/Ola exclusively",
      "Gem export scam — do not participate regardless of how legitimate it sounds"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + South Delhi",
        morning: "Arrive. Metro to South Delhi. Check in Hauz Khas or Lodi area.",
        afternoon: "Lodhi Art District — free, outdoor street art, safe, walkable. Lodi Garden adjacent.",
        evening: "Hauz Khas Village for dinner — rooftop restaurants, lake view.",
        stay: "Zostel Delhi or Moustache Hostel — ₹800-1200",
        daily_cost: 3000,
        safety_tip: "Delhi Metro is safe. Women-only coach. Use Uber/Ola only — no autos.",
        womens_tip: "Hauz Khas Village is where Delhi actually feels liveable. Start here."
      },
      {
        day: 2,
        title: "Old Delhi — with eyes open",
        morning: "Jama Masjid — one of Asia's largest mosques. Modest dress, head covered. Free.",
        afternoon: "Old Delhi lanes — Chandni Chowk, spice market, Karim's for lunch (iconic). Stay on main streets.",
        evening: "Back to South Delhi by 6pm. Dinner at Sunder Nagar market.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Old Delhi — main streets only, group preferred, leave before dark. The lanes are real harassment territory for solo women.",
        womens_tip: "Karim's mutton korma since 1913. You eat history. Worth the chaos to get there."
      },
      {
        day: 3,
        title: "Monuments day",
        morning: "Humayun's Tomb — Mughal garden tomb, less crowded than Taj, equally beautiful. ₹600.",
        afternoon: "Qutub Minar complex ₹600. Then Mehrauli Archaeological Park adjacent — free, almost no tourists.",
        evening: "Khan Market for dinner — Delhi's most comfortable shopping+dining area.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Mehrauli Park is safe in daylight. Don't linger after 5pm.",
        womens_tip: "Humayun's Tomb has better gardens, less crowd, and equal beauty to the Taj. Nobody tells you this."
      },
      {
        day: 4,
        title: "Markets + depart",
        morning: "Shahpur Jat — independent designer boutiques, not touristy. Best fashion shopping in Delhi.",
        afternoon: "Depart.",
        evening: "Train or flight.",
        stay: "Check out",
        daily_cost: 2500,
        safety_tip: "Metro to airport — Blue Line. Don't take cabs from outside terminal.",
        womens_tip: "Delhi is hard and rewarding in equal measure. The monuments justify the chaos."
      }
    ]
  },
  {
    id: "mumbai-3d-budget",
    destination: "Mumbai",
    duration_days: 3,
    budget_min: 10000,
    budget_max: 20000,
    best_months: ["October","November","December","January","February","March"],
    estimated_total_cost: 15000,
    safety_score: 4.2,
    best_neighbourhoods: ["Bandra West","Colaba","Fort","Juhu"],
    avoid: ["Dharavi without guided tour","station areas at 2am"],
    transport_from: {
      "Delhi": "Rajdhani 16 hrs or fly 2 hrs.",
      "Bangalore": "Fly 1.5 hrs or train 24 hrs.",
      "default": "CST or Lokmanya Tilak Terminus. Chhatrapati Shivaji Maharaj International Airport."
    },
    packing_notes: "Light cotton. Comfortable walking shoes. Rain jacket June-September. Modest dress for Siddhivinayak temple.",
    scam_alerts: [
      "Airport taxi scam — prepaid booth only",
      "Black market tickets near Gateway — always official",
      "Fake Bollywood set tours"
    ],
    days: [
      {
        day: 1,
        title: "South Mumbai — the grand old city",
        morning: "Gateway of India at 7am — before tour groups arrive. Ferry to Elephanta Caves ₹200 return.",
        afternoon: "Colaba Causeway market. Leopold Café for lunch (history in every booth). CST station architecture.",
        evening: "Marine Drive sunset walk. Nariman Point bench. Best free thing in Mumbai.",
        stay: "Zostel Colaba or Backpacker Panda — ₹900-1500",
        daily_cost: 4000,
        safety_tip: "Mumbai local trains — women-only coach. Safe city overall. Trust your instincts.",
        womens_tip: "Marine Drive at sunset is the Mumbai everyone talks about. It actually delivers."
      },
      {
        day: 2,
        title: "Bandra + Dharavi + street food",
        morning: "Dharavi reality tour — book through Reality Tours only ₹700. No photography. Humbling.",
        afternoon: "Bandra West — Carter Road promenade, Pali Hill, independent cafés. Mumbai's coolest neighbourhood.",
        evening: "Street food dinner: Juhu Beach bhel puri, pani puri, sev puri. ₹100 for a feast.",
        stay: "Same",
        daily_cost: 4000,
        safety_tip: "Dharavi only with Reality Tours. Never wander in alone.",
        womens_tip: "Bandra feels like a European neighbourhood that also happens to be in India. Walk slowly."
      },
      {
        day: 3,
        title: "Dhobi Ghat + depart",
        morning: "Dhobi Ghat — the world's largest open-air laundry. View from bridge is free. 8am is best light.",
        afternoon: "Siddhivinayak Temple if inclined. Breach Candy for last coffee. Depart.",
        evening: "Flight or train.",
        stay: "Check out",
        daily_cost: 3000,
        safety_tip: "Traffic is brutal. Add 90 mins to airport time. Always.",
        womens_tip: "Mumbai rewards people who love cities. If that's you, 3 days won't feel like enough."
      }
    ]
  },
  {
    id: "goa-9d-budget",
    destination: "Goa",
    duration_days: 9,
    budget_min: 22000,
    budget_max: 33000,
    best_months: ["November","December","January","February","March"],
    estimated_total_cost: 27000,
    safety_score: 4.0,
    best_neighbourhoods: ["Assagao","Aldona","Panjim","Palolem"],
    avoid: ["Calangute after dark","Baga beach clubs alone at night"],
    transport_from: {
      "Mumbai": "Mandovi Express or Konkan Railway 9 hrs ₹400-800.",
      "Bangalore": "Overnight bus 8 hrs ₹600-900.",
      "Delhi": "Fly — budget ₹3000-5000 return.",
      "default": "Konkan Railway to Madgaon or Karmali station."
    },
    packing_notes: "9 days needs: reef-safe sunscreen, one nicer outfit for beach clubs, rain layer for evenings, scooter helmet (own one if possible).",
    scam_alerts: [
      "GoaMiles only for taxis — no tourist taxis from beach",
      "Feni free shots at shacks = overpriced bill",
      "Motorbike scratch scam — photograph before renting",
      "Fake 'government tourism' desks in North Goa"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + settle North Goa",
        morning: "Arrive. Head directly to Assagao or Aldona. Check in.",
        afternoon: "Walk the village. Find your local café. Decompress.",
        evening: "Early dinner near stay. Sleep.",
        stay: "Zostel Goa Anjuna or Assagao guesthouse ₹800-1500",
        daily_cost: 2500,
        safety_tip: "Night one — don't explore alone. Get the lay first.",
        womens_tip: "The first evening in Goa is for arriving, not doing. Resist the urge to immediately beach."
      },
      {
        day: 2,
        title: "North beaches + Chapora Fort",
        morning: "Scooter rental from trusted shop (ask host). Chapora Fort at 8am — empty, dramatic cliff views.",
        afternoon: "Vagator and Ozran beaches. Less crowded than Baga.",
        evening: "Anjuna market (Wednesday only). Or cliff café for sunset.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Scooter — helmet always. GoaMiles after 9pm.",
        womens_tip: "Vagator is where Goa still has some soul. Baga lost it."
      },
      {
        day: 3,
        title: "Old Goa + Panjim",
        morning: "Old Goa churches — Basilica of Bom Jesus, Se Cathedral. Quiet, extraordinary.",
        afternoon: "Panjim — Fontainhas Latin Quarter walk. Portuguese tiles, bakeries, colour.",
        evening: "Viva Panjim restaurant on 31st January Street. Book ahead.",
        stay: "Same",
        daily_cost: 2800,
        safety_tip: "Fontainhas is Goa's safest neighbourhood. Walk freely.",
        womens_tip: "Fontainhas in the morning before tourists arrive. That's the shot and the feeling."
      },
      {
        day: 4,
        title: "South Goa — Palolem",
        morning: "Drive south to Palolem beach — 1.5 hrs. Completely different Goa.",
        afternoon: "Swim. Kayak ₹300/hr. Exist on a crescent beach.",
        evening: "Stay overnight in Palolem — worth the base change.",
        stay: "Palolem beach hut ₹1000-2000",
        daily_cost: 3500,
        safety_tip: "Palolem is calmer and safer than North Goa. Excellent solo destination.",
        womens_tip: "Palolem is what people think all of Goa is. It's only here."
      },
      {
        day: 5,
        title: "Cotigao Wildlife + Agonda",
        morning: "Cotigao Wildlife Sanctuary — 30km from Palolem. Quiet forest, hornbills, crocodiles.",
        afternoon: "Agonda beach — even quieter than Palolem. Turtles nest here.",
        evening: "Back to Palolem for sunset.",
        stay: "Same Palolem hut",
        daily_cost: 2800,
        safety_tip: "Wildlife sanctuary — go with a guide. Don't wander unmarked trails.",
        womens_tip: "Agonda is Goa with the volume turned all the way down. If that's what you need, stay there."
      },
      {
        day: 6,
        title: "Return north + Mapusa market",
        morning: "Drive back north. Stop at Mapusa Friday market.",
        afternoon: "Local spices, cashews, textiles at local prices. Stock up.",
        evening: "Back to Assagao base. Long dinner.",
        stay: "Return to North Goa stay",
        daily_cost: 3000,
        safety_tip: "Long drive back — don't scooter it if tired. Hire GoaMiles car.",
        womens_tip: "Mapusa market locals vs tourist market prices: roughly half. Know the difference."
      },
      {
        day: 7,
        title: "Water sports day",
        morning: "Book through your hotel: parasailing, jet ski, banana boat. Sinquerim beach has best operators.",
        afternoon: "Candolim beach — calmer, less crowded, cleaner than Calangute.",
        evening: "Sundowner at Antares. Don't need to eat — just watch.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Only hotel-recommended water sports operators. Check life jackets before entering water.",
        womens_tip: "Parasailing over the Arabian Sea at 8am. Nothing fixes a bad month like this."
      },
      {
        day: 8,
        title: "Slow day — finally",
        morning: "Nothing. Coffee. Book. Hammock.",
        afternoon: "One last beach. Divar Island if curious — tiny, rural, quiet, 5-min ferry.",
        evening: "Best dinner of the trip. Budget ₹1500 for a proper meal. You've earned it.",
        stay: "Same",
        daily_cost: 2500,
        safety_tip: "Divar Island ferry is safe, runs regularly. Last ferry back is early evening — check timing.",
        womens_tip: "By day 8 you'll know which part of Goa is yours. Go back to it."
      },
      {
        day: 9,
        title: "Last morning + depart",
        morning: "Sunrise beach. Last coconut water. GoaMiles to station.",
        afternoon: "Depart.",
        evening: "Home.",
        stay: "Check out",
        daily_cost: 1400,
        safety_tip: "Book return transport day before. Don't wing it on departure day.",
        womens_tip: "9 days in Goa and you'll still feel you missed things. That's how you know it worked."
      }
    ]
  },
  {
    id: "rishikesh-7d-budget",
    destination: "Rishikesh",
    duration_days: 7,
    budget_min: 15000,
    budget_max: 25000,
    best_months: ["February","March","September","October","November"],
    estimated_total_cost: 20000,
    safety_score: 4.2,
    best_neighbourhoods: ["Tapovan","Swarg Ashram","Ram Jhula area"],
    avoid: ["Lakshman Jhula after 9pm","isolated ghats at night"],
    transport_from: {
      "Delhi": "Volvo bus ISBT Kashmere Gate 6 hrs ₹500-700.",
      "Mumbai": "Fly to Dehradun, taxi 1hr.",
      "default": "Train to Haridwar then shared cab ₹150."
    },
    packing_notes: "Modest clothing near ghats/ashrams. Yoga mat. Journal. Good walking sandals. Warmer layer for evenings Sept-Feb.",
    scam_alerts: [
      "Uncertified yoga teachers — check reviews",
      "Baba blessing scam",
      "Rafting touts — book through hostel only",
      "Overpriced Ayurvedic massage parlours near Ram Jhula"
    ],
    days: [
      {
        day: 1,
        title: "Arrive + Ganga aarti",
        morning: "Arrive. Check in Ram Jhula side.",
        afternoon: "Slow explore. Swarg Ashram market.",
        evening: "Triveni Ghat aarti 6pm.",
        stay: "Zostel or Bunk Hostel ₹600-900",
        daily_cost: 2500,
        safety_tip: "Ram Jhula side only after dark.",
        womens_tip: "Aarti on arrival evening. Always."
      },
      {
        day: 2,
        title: "Rafting + Beatles Ashram",
        morning: "White water rafting through hostel ₹600-800.",
        afternoon: "Beatles Ashram ₹600 entry.",
        evening: "Yoga nidra class ₹200-400.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Life jacket properly fitted. Non-negotiable.",
        womens_tip: "Beatles Ashram is the kind of beautiful that makes you quiet."
      },
      {
        day: 3,
        title: "Yoga immersion day",
        morning: "6am pranayama class at Parmarth Niketan — free, open to all.",
        afternoon: "Hatha yoga class ₹300. Rest.",
        evening: "Parmarth Niketan evening aarti — the best in Rishikesh.",
        stay: "Same",
        daily_cost: 1500,
        safety_tip: "Parmarth Niketan is a legitimate ashram. Safe, women-friendly.",
        womens_tip: "A full day of yoga at altitude in the Himalayas resets something fundamental."
      },
      {
        day: 4,
        title: "Neer Garh waterfall hike",
        morning: "7am start. Neer Garh waterfall 3km trail.",
        afternoon: "Back by noon. Lunch and rest.",
        evening: "Rooftop café. Ganga view.",
        stay: "Same",
        daily_cost: 2000,
        safety_tip: "Hike with hostel group. Don't go solo.",
        womens_tip: "Waterfall swim after the hike. Cold and perfect."
      },
      {
        day: 5,
        title: "Kunjapuri temple sunrise",
        morning: "4:30am start. Hire car to Kunjapuri ₹800. 20-min climb. Himalayan panorama at dawn.",
        afternoon: "Rest. Long lunch. Ayurvedic massage ₹800-1200.",
        evening: "Market browsing. Rudraksha beads, local honey.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Only hotel-recommended driver for 4am trips.",
        womens_tip: "Kunjapuri at sunrise is the thing you come to Rishikesh for even if you didn't know it."
      },
      {
        day: 6,
        title: "Haridwar day trip",
        morning: "Shared taxi to Haridwar 30 mins ₹50. Har Ki Pauri ghat.",
        afternoon: "Mansa Devi temple cable car ₹100. Enormous religious complex.",
        evening: "Har Ki Pauri Ganga aarti at 6pm — bigger and more theatrical than Rishikesh. Return to Rishikesh.",
        stay: "Same",
        daily_cost: 2000,
        safety_tip: "Haridwar ghats are extremely crowded. Keep bag in front. Phone secured.",
        womens_tip: "Haridwar aarti vs Rishikesh aarti: Haridwar is spectacle, Rishikesh is feeling. You need both."
      },
      {
        day: 7,
        title: "Last yoga + depart",
        morning: "Final sunrise yoga.",
        afternoon: "Pack up. Shared cab to bus stand.",
        evening: "Overnight bus to Delhi.",
        stay: "Check out",
        daily_cost: 2000,
        safety_tip: "Book bus night before.",
        womens_tip: "Seven days in Rishikesh changes something. You'll know what when you're back home."
      }
    ]
  },
  {
    id: "jaipur-5d-budget",
    destination: "Jaipur",
    duration_days: 5,
    budget_min: 13000,
    budget_max: 23000,
    best_months: ["October","November","December","January","February"],
    estimated_total_cost: 18000,
    safety_score: 3.8,
    best_neighbourhoods: ["Civil Lines","Bani Park","C-Scheme"],
    avoid: ["Old City lanes alone after 7pm","street autos near Hawa Mahal"],
    transport_from: {
      "Delhi": "Shatabdi 4.5 hrs ₹700.",
      "Mumbai": "Train 18 hrs or fly.",
      "default": "Jaipur Junction station."
    },
    packing_notes: "Dupatta mandatory for temples. Sunscreen. Comfortable shoes for forts. Cold evenings Oct-Feb.",
    scam_alerts: [
      "Hawa Mahal autos = commission shops",
      "Gem export scam — never",
      "Fake students + carpet demos",
      "Puppet show 'invitations' that end in purchase pressure"
    ],
    days: [
      {
        day: 1,
        title: "Amber Fort + Jaigarh",
        morning: "Amber Fort before 10am. Book online. 3 hours minimum.",
        afternoon: "Jaigarh Fort — connected by walkway from Amber. Enormous cannon, city views.",
        evening: "Hotel rooftop dinner. Recover.",
        stay: "Pearl Palace Hotel or Bani Park guesthouse ₹1200-2000",
        daily_cost: 3500,
        safety_tip: "Uber between all forts. No autos.",
        womens_tip: "Amber Fort at 8am in winter light is one of Rajasthan's finest hours."
      },
      {
        day: 2,
        title: "City Palace + Jantar Mantar + stepwells",
        morning: "City Palace ₹700 + Jantar Mantar ₹200. Combine them — 5-minute walk apart.",
        afternoon: "Panna Meena Ka Kund stepwell — hidden, beautiful, peaceful.",
        evening: "Chokhi Dhani for full Rajasthani dinner experience ₹800. Book ahead.",
        stay: "Same",
        daily_cost: 3500,
        safety_tip: "Stepwell is slippery — wear grip shoes.",
        womens_tip: "Jantar Mantar is one of the most mind-bending places in India. Don't rush through it."
      },
      {
        day: 3,
        title: "Bazaars + Nahargarh",
        morning: "Johari Bazaar — silver jewellery. Start at 40% of asking price.",
        afternoon: "Bapu Bazaar — textiles, block print fabric.",
        evening: "Nahargarh Fort sunset — Uber up, cityscape, street food stalls on the way down.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Bazaars until 5:30pm. Then Nahargarh. Back by 8pm.",
        womens_tip: "Block print fabric from Bapu Bazaar: ₹150/metre. The same stuff is ₹1200 in Delhi boutiques."
      },
      {
        day: 4,
        title: "Samode + countryside",
        morning: "Hire car to Samode Palace — 45 mins from Jaipur. Stunning heritage hotel, open for day visits.",
        afternoon: "Abhaneri stepwell on return route — one of India's most geometric structures.",
        evening: "Back to Jaipur. MI Road for Lassiwala and dinner.",
        stay: "Same",
        daily_cost: 3000,
        safety_tip: "Private car only for day trips. ₹1500-2000.",
        womens_tip: "Abhaneri stepwell at midday — light angles are extraordinary."
      },
      {
        day: 5,
        title: "Hawa Mahal morning + depart",
        morning: "Hawa Mahal interior ₹50 — go early. Café across street for the iconic shot.",
        afternoon: "Depart.",
        evening: "Train or bus.",
        stay: "Check out",
        daily_cost: 2000,
        safety_tip: "Pre-book Uber to station. Street taxis outside Hawa Mahal overcharge.",
        womens_tip: "5 days in Jaipur and you've done it properly. Don't let anyone rush you through forts."
      }
    ]
  }
]
