#!/usr/bin/env python3
"""
Append 50 general solo-travel community questions to community-posts.json.
6 are tagged to specific destinations (where the post specifically discusses
that city), rest remain general/destination-less.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JSON_PATH = ROOT / "lib/mock-data/community-posts.json"

# (title, body, destination_or_None)
POSTS = [
    ("83% of Gen Z women want to travel solo in 2026 — so why does everyone I know still think I'm crazy for wanting to go alone?",
     "Skyscanner's 2026 Travel Trends report says 83% of Gen Z women are keen on solo travel. Nearly 40% of all women expressed interest in a solo vacation in 2025, up 8% from the year before. And yet when I tell my family I want to go to Tokyo alone for 10 days, I get the full 'are you sure that's safe?' conversation. Has the cultural narrative actually shifted or is it only shifting online while real life stays the same? When did your family stop worrying and start just accepting it?",
     "tokyo-japan"),
    ("Travel insurance for solo women — what does it actually cover that matters and what's just marketing language?",
     "I know I need it. But every policy reads differently and I'm not sure what I'm actually buying. 40% of solo female travellers travel without adequate insurance on their first trip according to Atlys's 2025 survey. Specifically: does standard travel insurance cover harassment-related trip interruptions? Medical evacuation from a remote area? What about 'Cancel for Any Reason' — is it worth the premium? Has anyone actually had to use their policy and what happened?",
     None),
    ("Hostel female-only dorms — genuinely safe and worth it, or a false sense of security?",
     "I keep reading that female-only dorms are the answer for solo women. But I've also read that lockers aren't always provided, that the rooms share bathrooms with mixed-gender areas, and that 'female only' isn't always enforced consistently. 66% of solo female travellers prefer mid-range hotels over hostels according to 2025 survey data. But hostels are where you meet people. What's your honest experience — did a female dorm actually feel safe, or did you switch to private rooms after the first stay?",
     None),
    ("The single supplement — am I really expected to pay up to double just for travelling alone?",
     "78% of women in a JourneyWoman survey view the single supplement as a deterrent to solo travel. I booked a cruise last year and the single supplement added ₹45,000 to my cost. Some operators like Aurora Expeditions are apparently building dedicated single cabins. Are there tour operators or booking platforms that actually waive this or reduce it significantly?",
     None),
    ("Drink spiking as a solo woman abroad — how real is this risk and what do you actually do about it?",
     "It keeps coming up in travel safety guides and I want honest answers. Has this happened to you or someone you know while travelling? Which destinations had the highest risk in your experience? I keep reading 'don't leave your drink unattended' as if that solves it, but spiking can happen in seconds. What practical measures do you actually use — nail polish test strips, only drinking from sealed bottles, never accepting drinks from strangers? I want real protocols, not generic advice.",
     None),
    ("Using Tinder and dating apps while travelling solo — is it worth it, dangerous, or just complicated?",
     "Solo Female Travellers Club's 2026 survey found that dating apps are one of the most common ways solo women meet locals. But also one of the most frequently flagged safety concerns. Tinder and Bumble publish regional safety advisories. Some apps are apparently restricted in certain countries. What's your honest framework for this — what do you do before meeting someone, which apps feel safer in which destinations, and has it ever gone wrong?",
     None),
    ("41% of solo female travellers changed accommodation mid-trip for safety reasons — has this happened to you and what triggered it?",
     "Booking.com's 2024 travel report found that 41% of solo female travellers have switched accommodation because they felt unsafe. What made you realise you needed to leave? Was it the neighbourhood, the staff, the other guests, the building itself? And practically — did you get a refund, where did you go, how did you find somewhere safe quickly?",
     None),
    ("Hotel staff crossing lines with solo women — has anyone experienced this and what did you actually do?",
     "The 2026 Solo Female Travel Trends report specifically flagged this: hotel staff asking for your number, adding you on social media, offering free drinks, showing up to your room. They even noted that most hotel chains don't have policies for how to handle this. I've had a staff member knock on my door 'just to check in' more than once in a trip. Has anyone dealt with this? Did you report it, switch hotels, or just endure it?",
     None),
    ("eSIM vs local SIM card in India — which one actually works better for solo women in 2026?",
     "eSIM is being called the 2026 must-do for solo travellers. Apps like Airalo and Holafly let you set up data before you land. But I've also read that coverage in rural India is patchy regardless of provider. For a trip covering Delhi, Jaipur, Varanasi, and Goa — does eSIM actually give you reliable coverage in all of these, or do I need a physical Airtel or Vodafone SIM? And which network actually works in the smaller towns?",
     None),
    ("Bumble BFF while travelling — has anyone actually made real travel friends this way or is it awkward?",
     "I keep seeing this recommended in solo travel guides as a way to meet women at your destination. One travel blogger said she met some of her closest friends through Bumble BFF while travelling. But it also sounds incredibly awkward — swiping for friends like it's a dating app, potentially meeting a stranger alone in a new city. Has anyone done this while travelling solo? How did you approach the first meetup safely?",
     None),
    ("Managing your period while travelling solo in India — what no travel guide actually tells you",
     "32% of solo female travellers cited lack of access to female doctors and sanitary products as a pain point according to Atlys's 2025 research. I'm going to be in India for 3 weeks and I'm genuinely worried about this. Specifically: are menstrual cups and discs easy to manage in places with limited bathroom facilities? Are tampons widely available in smaller cities like Varanasi or Jaisalmer? And has anyone dealt with period pain or cramps mid-trip in India where getting to a pharmacy was difficult?",
     None),
    ("Getting sick alone abroad — the experience nobody talks about honestly",
     "I got food poisoning in Bangkok last year on my third day. Alone in a hostel dorm, couldn't keep water down, didn't know how to find a doctor, didn't know if my travel insurance covered a clinic visit. It was the most scared I've felt on any trip. How do you prepare for this practically — which travel insurance policies make it easy to find and pay for medical care abroad? What do you carry in a first aid kit that actually helped?",
     "bangkok-thailand"),
    ("Posting your location on social media while travelling — how careful are you really and why?",
     "The 2025 Atlys solo female travel report specifically flagged this: women who post real-time travel updates can unintentionally expose their location, and predatory behaviour sometimes starts online. But I also use Instagram as a travel diary and find it grounding. What's your actual policy? Do you post with a delay, keep location tags vague, use a private account?",
     None),
    ("Solo travel after a big life change — divorce, breakup, job loss. How do you make sure you're going for the right reasons?",
     "A 2025 study found that 59% of solo travelers described their trips as emotionally rewarding after difficult life transitions. But the same research noted that women in a vulnerable state after a breakup can be more susceptible to rushing into situations they'd normally avoid — especially around meeting people abroad. I'm considering a solo trip after ending a long relationship. I want it to be healing, not escapism. How do you tell the difference?",
     None),
    ("Walking tours as a way to meet people on day one — does this actually work or is it hit and miss?",
     "Every solo travel guide says book a walking tour on day one. But I've done three where I was the only solo traveller and the groups were all couples or families, and I came back feeling more alone. Is this destination-dependent? Are there specific types of tours or operators that attract more solo travellers? I've read that food tours and neighbourhood-specific tours tend to attract more interesting solo travellers than the standard 'highlights' tour.",
     None),
    ("How do you actually handle loneliness on a long solo trip — not the Instagram version, the real version?",
     "Solo travel loneliness is real. One traveller I read said when loneliness doesn't leave after a few days, it's her body telling her it's time to go home. That really hit me. I'm planning a 3-week trip and I know days 3-5 are going to be hard. What are your actual rituals for the lonely days — specific things you do, places you go, how you reach out to people without it feeling desperate?",
     None),
    ("Female-run homestays and Airbnbs — how do you find them and does the female host thing actually matter?",
     "Multiple solo travel guides recommend specifically looking for female hosts on Airbnb for safety. One blogger said she always filters for female hosts and it consistently gave her a better experience. But is this actually a meaningful safety measure or is it more of a comfort thing? How do you identify if an Airbnb host is a woman from the listing? And has a female host ever made a specific difference to your experience?",
     None),
    ("The 'I'm meeting friends soon' lie — do you use it and does it actually work?",
     "Multiple solo travel safety guides recommend saying 'I'm meeting friends soon' when asked if you're alone. One guide even suggested recording fake WhatsApp voice notes to yourself to play in taxis. I feel deeply conflicted about this — I don't want to start every interaction with a lie, but I also understand why it exists. Do you use this? Has anyone ever had this backfire or lead to a more uncomfortable situation than just being honest?",
     None),
    ("Women-only group tours — worth it or are you giving up too much independence?",
     "20% of solo female travellers took a women-only group trip in 2025 and 21% plan to again in 2026 according to the Solo Female Travellers Club survey. I've always preferred going fully solo but I'm considering a Jugni or Wander Womaniya trip for my next India circuit because logistics feel overwhelming. For people who've done both — what do you actually give up by going on a group trip and is the safety and social payoff worth it?",
     None),
    ("Japan solo as a woman — is it actually as perfect as everyone says or are there things nobody mentions?",
     "Japan is the number one solo female travel destination according to basically every 2025-2026 ranking I've seen. ABTA and Travelzoo both ranked it top for 2024. And yes, I believe the safety record. But I've also read that it can be profoundly lonely — the language barrier is real, solo dining at izakayas is genuinely great but not every meal, and it can feel like a beautiful country you're watching from behind glass. What did Japan solo actually feel like for you emotionally, not just logistically?",
     "tokyo-japan"),
    ("Portugal as the 'easy' first solo destination — is that reputation still deserved in 2026 or has overtourism changed it?",
     "Lisbon and Porto come up on literally every 'safest first solo trip' list for 2026. SoFe Travel's safest destinations report, SkyWander, everywhere. But I also know Lisbon specifically has gotten massively more expensive, more crowded, and more touristy in the last two years. Is it still as easy and welcoming for a first-time solo woman as everyone says? Or has the influx of digital nomads and tourists changed the day-to-day experience in ways the guides haven't caught up with yet?",
     None),
    ("Thailand solo — Bangkok feels fine but what about the islands? Solo woman, party scene, real safety picture",
     "Everyone talks about Bangkok's safety for solo women fairly confidently. But the islands feel different — Koh Samui, Koh Phangan especially during full moon, Koh Tao. I've read about drink spiking on the islands specifically, aggressive tuk-tuk scams, and a general atmosphere that can shift quickly at night. What's your honest experience on the Thai islands as a solo woman in 2025-2026? Which ones felt genuinely safe to you and which ones did you feel you had to manage more carefully?",
     "bangkok-thailand"),
    ("Overpacking anxiety — how do I actually pack light for 3 weeks in India when every guide says something different?",
     "Every solo travel guide says overpack day one is a rite of passage. One blogger specifically says 'pack your bag, walk around your block, remove 3 things.' I'm going to India for 3 weeks covering Delhi, Rajasthan, Goa. The advice ranges from 'one bag only' to 'bring enough to cover every dress code.' What did you actually pack that you used every day vs what stayed in your bag? And specifically — what did women who did India solo wish they'd packed that they didn't?",
     None),
    ("Kitestring and bSafe — do you actually use check-in safety apps or does it fall apart after day two?",
     "I keep reading about apps like Kitestring (which sends an automated alert to your contacts if you don't check in) and bSafe (fake incoming call feature, GPS tracking). The GRRRLTRAVELER blog recommends finding a check-in buddy even in hostel dorms. But realistically, how many people actually maintain this beyond the first few days? I want to know who genuinely uses a check-in system consistently.",
     None),
    ("Shoulder season travel 2026 — what does it actually mean for safety vs cost and which destinations shift most?",
     "The 2026 solo travel vision board guides are all recommending shoulder season as the smart play — cheaper, less crowded, better experience. But for solo women specifically, does less crowded mean safer or less safe? I'm thinking about Goa in October (just after monsoon) and Rajasthan in March. Both are technically shoulder season. Does the reduced tourist footprint feel like a relief or does it mean fewer people around if something goes wrong?",
     None),
    ("Digital nomad meets solo traveller — how do you stay safe when your accommodation changes every week?",
     "I work remotely and I want to travel slowly through India for 3 months. But every safety tip I read assumes you have a fixed base for the trip. When you're moving every 5-7 days — new neighbourhood, new accommodation, new transport situation — the risk calculus changes constantly. How do you manage safety research at this pace? Do you rely on your accommodation for neighbourhood advice, or have you found a better system?",
     None),
    ("How do you handle immigration alone as a woman — especially when officers ask intrusive questions?",
     "The 2025 Atlys solo female travel report noted that in parts of North Africa and the Middle East, solo women have been questioned at immigration about their marital status, who they're visiting, where their husband is. But this happens elsewhere too — I've been asked at Indian immigration why I'm travelling alone and felt genuinely uncomfortable. What's your script for these situations? Do you prepare a story, stay factual, or push back?",
     None),
    ("Offline Google Maps saved my solo trip — what other offline tools do you swear by?",
     "Every 2026 solo travel guide lists downloading offline Google Maps as non-negotiable. I agree — it's genuinely saved me multiple times. But I'm curious what else you actually use offline. Google Translate offline language packs? Specific apps that work without data in India or Southeast Asia? One guide mentioned downloading boarding passes and hotel confirmations to a local folder, which sounds obvious but I've never actually done it consistently. What's your complete offline toolkit?",
     None),
    ("Anti-theft bags — do they actually work or are they a false sense of security for solo travellers?",
     "The 2026 Solo Female Travel Trends data shows that Boomer solo women use anti-theft bags more than any other age group and also report feeling safer. Multiple safety guides recommend crossbody bags with RFID blocking, locking zippers, and cut-resistant straps. But I've also read that most theft is distraction-based, not bag-slashing, which means a fancy anti-theft bag doesn't actually help. What do you actually carry?",
     None),
    ("First solo trip anxiety — the night before you left, how bad was it really?",
     "I'm booked. I'm going. And I'm having a mild panic attack every few days leading up to it. I keep reading that safety worries drop from 78% on first trips to 59% after 10+ solo trips — so clearly experience changes something. But right now I'm in the pre-trip anxiety zone and it's real. Was your first night before a solo trip genuinely terrifying? What got you on the plane?",
     None),
    ("What's the actual difference between a 'safe' country and a 'solo female friendly' country — are they the same thing?",
     "Iceland is the safest country in the world by Global Peace Index. Japan is top-rated for solo female travel. But Portugal, which is everyone's beginner recommendation, isn't necessarily in the top 10 for either metric. I've started to think 'safe' and 'solo female friendly' are different things entirely — one is about crime rates, the other is about harassment, culture, and infrastructure. How do you personally evaluate a destination before your first visit?",
     None),
    ("Vietnam solo — Hanoi vs Ho Chi Minh City for a first-timer, and is the motorbike street crossing thing actually terrifying?",
     "One affordable destination guide lists Vietnam hostels at around $5/night and food at under $10/day, making it one of the cheapest real solo options in 2026. But I keep hearing from people who went to Hanoi and found it more overwhelming than expected — specifically the traffic, the Old Quarter, and bag snatching on motorbikes. Has anyone done both cities solo recently? Which felt more manageable as a first visit and what do you do about the motorbike street crossing thing?",
     "hanoi-vietnam"),
    ("Morocco solo — the medinas are beautiful but the harassment situation feels confusing from everything I read",
     "Morocco keeps appearing on affordable solo travel lists for 2026. But I've also read consistently that street harassment and men following women is something solo travellers still experience regularly, particularly in Marrakech's medina. Yet places like Chefchaouen and Essaouira are repeatedly described as peaceful. Is this genuinely destination-specific within Morocco or is it about time of day, dress, confidence? I want an honest recent experience from 2024-2026, not blog posts from 2019.",
     None),
    ("Travelling solo at 45+ — do the apps, hostels and solo travel communities actually work for us or are they designed for 25-year-olds?",
     "The 2026 Solo Female Travel Trends survey shows Boomer women are the most prepared solo travellers — buy the most insurance, carry the most safety tools, travel the most confidently. But the hostel scene, the apps, the Facebook groups, the walking tour culture — does any of it actually cater to a solo woman who is 45, 50, or 60? Or do you end up creating your own version of solo travel that looks completely different from what's shown on Instagram?",
     None),
    ("Hotel room safety habits — do you actually use door wedges, portable locks, and room placement requests or does that feel excessive?",
     "Every solo travel safety guide recommends requesting floors 2-6, avoiding stairwell rooms, using door wedge alarms, keeping curtains closed. One guide said not to announce your room number to anyone. Some of this feels genuinely sensible. Some of it feels like anxiety-driven over-preparation. Which of these habits do you actually maintain consistently? Is there a point where all this safety prep starts to undermine the joy of the trip?",
     None),
    ("Slow travel vs fast travel solo — which is actually safer and which is actually better for meeting people?",
     "The 2026 complete solo travel guide recommends spending more time in fewer places to both cut costs and improve the experience. But I've found that staying somewhere for 7-10 days as a solo woman can sometimes mean losing the protective buffer of constant new arrivals at hostels. You also start to become a 'known solo woman' in a neighbourhood, which has its own dynamics. What's your experience — does slowing down feel safer or does moving every few days give you a kind of anonymity that actually helps?",
     None),
    ("Travel credit cards and budget tracking apps for solo travel — what do you actually use and does it help?",
     "I've been travelling solo for 3 years and I still manage my travel money terribly. I either overspend in the first week or underspend out of anxiety and then rush everything at the end. The 2026 Women Travel Abroad survey found the average solo trip budget is $5,300. I want to understand how people actually budget day-to-day — which apps, which cards, how you handle cash vs card in places like India where cash is still essential, and whether you actually track spending mid-trip or just estimate.",
     None),
    ("Asking for photos alone while travelling — do you ask strangers, use a tripod, or just accept that most solo travel photos are selfies?",
     "This is genuinely one of the things nobody talks about honestly. I want photos from my trips that don't look like passport photos taken at arm's length. One travel blogger mentioned that solo travellers naturally exchange photo requests, which works at tourist sites but not everywhere. I've used a gorilla tripod but it's slow and sometimes draws attention. Has anyone found a system that actually works?",
     None),
    ("What do you actually do on evenings alone when you're not in the mood to socialise but also don't want to sit in your room?",
     "Day activities solo are fine. I can fill those. It's the evenings that get hard. Going to a bar alone feels performative. Going back to the hostel common room when I'm exhausted feels forced. Eating alone at a restaurant is fine but not every night. One guide said 'sitting at the bar with a book makes solo dining normal' — and that works sometimes. But what do you genuinely do on the evenings when you want to be out in the world but not 'on' socially?",
     None),
    ("Budget solo trip to India under ₹50,000 for 10 days — is it realistic or just a YouTube thumbnail lie?",
     "I keep seeing videos claiming India is achievable under ₹5,000/day total including accommodation, food, and transport. Zostel data shows 92,000+ solo female bookings in India in 2025, so clearly women are going. But the ₹5,000/day number always seems to exclude airport transport, safety-related upgrades like private rooms over dorms, and the inevitable 'I need to get out of this situation' Uber. What's a genuinely realistic solo India budget for 10 days if you want to be both comfortable and safe?",
     None),
    ("Crossing borders alone as a solo woman — what's the most stressful land border you've done and what do you wish you'd known?",
     "I'm planning an India-Nepal land border crossing at Sunauli and everything I read makes it sound manageable but chaotic. The 2026 GRRRLTRAVELER guide specifically recommends telling someone your exact border crossing plan — entry point, time, which side you're being picked up on. Has anyone done a land border crossing solo in South or Southeast Asia recently? What actually happens at the chaotic ones and is there a time of day or approach that makes it significantly less stressful?",
     None),
    ("Corporate travel as a solo woman — does your company's travel policy actually protect you or just protect the company?",
     "A 2025 GBTA survey found that 74% of corporate travel buyers are women, but only 27% of corporate travel policies specifically address female traveller safety. 62% of travel managers believe female employees face greater risk than men. I travel for work 6-8 times a year and my company's policy says nothing about which neighbourhoods to avoid, how to handle hotel room security, or what to do if something happens. Has anyone pushed for a better corporate travel safety policy?",
     None),
    ("Seoul solo — safe yes, but what about the hidden camera situation in public bathrooms? How real is it in 2026?",
     "South Korea has had documented issues with hidden cameras in public bathrooms, changing rooms, and guesthouses — so documented that the government launched a major inspection programme. I'm going to Seoul for 10 days solo and I want to know the current situation in 2025-2026. Is this still a real and active concern or has the crackdown made a genuine difference? How do you check a bathroom or accommodation for hidden cameras?",
     "seoul-south-korea"),
    ("Wellness retreat vs solo travel — is the retreat model actually better for solo women who want community?",
     "The women-only retreat trend is exploding — Ladies Who Lit, Wild Terrains, women's reading retreats in Morocco, yoga retreats in Rishikesh, spiritual trips in Bali. 20% of solo female travellers took a women-only group trip in 2025. But retreats are expensive and structured in ways that feel constraining to me. If I want community without losing independence — is a retreat the answer or is there a middle way that gives you the social payoff without the full package commitment?",
     None),
    ("Flying solo into a new country at night — how do you make the airport arrival safe?",
     "53% of solo female travellers book direct flights even if more expensive specifically to avoid late-night arrivals according to 2025 data. But sometimes a cheaper late-night flight is genuinely the only realistic option. What's your complete protocol for arriving solo at night in a new country? Pre-booked transfer, specific apps, what you have pre-downloaded, what you avoid doing in the arrival hall, how you get from airport to accommodation without getting into an unmarked taxi.",
     None),
    ("The 'dead zone travel' trend — is solo travel to uncrowded, remote places actually safer or more risky for women?",
     "The 2026 SoFe Travel guide mentions the 'dead-zone travel' trend — places like the Azores, remote Sri Lanka, off-season Iceland. Less crowded sounds appealing. But less crowded also means fewer people around if something goes wrong, less reliable transport, and less developed safety infrastructure. As a solo woman, do you feel safer in genuinely remote places with no crowds or does the crowd itself feel protective?",
     None),
    ("The hushpitality trend — slow, quiet, restorative solo travel. Is this actually what we want or is it just burnout rebranded?",
     "2026 travel trend reports are all talking about 'hushpitality' — fjord villages, silent retreats, slow coastal stays, destinations that offer genuine quiet. Norway, Slovenia, and the Azores keep coming up. I'm deeply attracted to this but I'm also wondering if what I actually need is rest at home, not rest in an expensive foreign country. Has anyone done this kind of intentionally quiet solo trip and did it actually deliver?",
     None),
    ("What's the real cost of travelling safely as a solo woman — the stuff that never appears in budget breakdowns?",
     "Nobody puts the safety tax in their budget posts. But it's real. The extra ₹800 for a private room over a dorm because the dorm felt wrong. The Uber instead of the bus because it was dark. The restaurant that costs twice as much because it's in a safer neighbourhood. The travel insurance premium. The anti-theft bag. The eSIM instead of hunting for a SIM in a new city at 11pm. What does staying safe as a solo woman actually add to your daily travel budget?",
     None),
    ("I've taken 10+ solo trips and I'm finally less scared — what actually changed and when did it shift for you?",
     "Research shows that safety worries drop from 78% on first trips to 59% after 10+ solo trips. I've done 12 now and I can feel the difference — but I can't always articulate what changed. Is it just exposure? Is it specific skills? Is it knowing you've handled hard things before and survived? For women who've crossed that threshold — what actually shifted?",
     None),
    ("Travelling solo as an introvert — does it actually suit us better or are we just as drained by the social performance of solo travel?",
     "I keep reading that solo travel suits introverts because you control the pace. And partly that's true. But solo travel also requires constant social management — navigating touts, asking for help, meeting people at hostels, eating alone in restaurants where staff try to fill the silence. I find this exhausting in a way that being with a travel partner removes. Is there a version of solo travel that actually works for deep introverts?",
     None),
]

# Author rotation — mix of Indian and foreign first names with home cities
AUTHORS = [
    ("Priya", "25-32", "Mumbai"),       ("Sophie", "33-40", "London"),
    ("Anya", "18-24", "Bangalore"),     ("Emma", "25-32", "Berlin"),
    ("Neha", "33-40", "Delhi"),         ("Lena", "25-32", "Amsterdam"),
    ("Riya", "25-32", "Pune"),          ("Mia", "18-24", "Sydney"),
    ("Tara", "33-40", "Hyderabad"),     ("Hannah", "25-32", "Toronto"),
    ("Meera", "40+",  "Chennai"),       ("Chloe", "33-40", "Paris"),
    ("Kavya", "25-32", "Kolkata"),      ("Olivia", "25-32", "San Francisco"),
    ("Anjali", "33-40", "Jaipur"),      ("Rachel", "40+", "Melbourne"),
    ("Divya", "25-32", "Goa"),          ("Lauren", "33-40", "NYC"),
    ("Pooja", "33-40", "Ahmedabad"),    ("Naomi", "25-32", "London"),
    ("Nisha", "18-24", "Kochi"),        ("Linda", "40+", "Berlin"),
    ("Sneha", "25-32", "Mumbai"),       ("Anna", "33-40", "Stockholm"),
    ("Ayesha", "33-40", "Hyderabad"),   ("Lucia", "25-32", "Madrid"),
]

DATES = [
    "2026-04-15", "2026-04-17", "2026-04-19", "2026-04-21", "2026-04-23",
    "2026-04-24", "2026-04-26", "2026-04-27", "2026-04-28", "2026-04-29",
    "2026-04-30", "2026-05-01", "2026-05-02", "2026-05-03",
]

# Engagement levels — anxiety/loneliness/safety questions get higher engagement
def engagement_for(title: str) -> tuple[int, int]:
    high_keywords = ["anxiety", "loneliness", "drink spiking", "hotel staff", "harassment", "spiking", "scared"]
    low_keywords = ["budget", "credit card", "esim", "offline", "anti-theft"]
    t = title.lower()
    if any(k in t for k in high_keywords):
        return (28 + (hash(title) % 25), 65 + (hash(title) % 60))
    if any(k in t for k in low_keywords):
        return (8 + (hash(title) % 12), 18 + (hash(title) % 25))
    return (15 + (hash(title) % 18), 35 + (hash(title) % 35))


posts_existing = json.loads(JSON_PATH.read_text())
start_id = max(int(p["id"].split("-")[1]) for p in posts_existing) + 1

new_posts = []
for i, (title, body, dest) in enumerate(POSTS):
    author, age, city = AUTHORS[i % len(AUTHORS)]
    date = DATES[i % len(DATES)]
    replies, likes = engagement_for(title)
    post = {
        "id": f"post-{start_id + i}",
        "tab": "ask",
        "author": author,
        "authorAgeRange": age,
        "homeCity": city,
        "postedAt": date,
        "content": f"{title}\n\n{body}",
        "replyCount": replies,
        "likeCount": likes,
    }
    if dest:
        post["destination"] = dest
    new_posts.append(post)

all_posts = posts_existing + new_posts
JSON_PATH.write_text(json.dumps(all_posts, indent=2, ensure_ascii=False) + "\n")
print(f"Added {len(new_posts)} posts (post-{start_id} to post-{start_id + len(new_posts) - 1})")
print(f"Total community posts: {len(all_posts)}")
tagged = [p for p in new_posts if "destination" in p]
print(f"Tagged with destination: {len(tagged)}")
for p in tagged:
    print(f"  {p['id']}: {p['destination']}")
