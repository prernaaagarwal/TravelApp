import Link from "next/link";
import { VaultSignupForm } from "./VaultSignupForm";

export const metadata = {
  title: "WhatsApp Trip Vault — Wander Women",
  description:
    "Your trip docs, bookings, and emergency contacts — accessible by WhatsApp message. ₹199 per trip.",
};

const messages = [
  { from: "you", text: "vault" },
  {
    from: "bot",
    text: "👋 Hey Priya! Your Goa vault (Feb 12–21):\n\n📋 Booking ref: BKG-77392\n🏠 Stay: Aldona Heritage House\n✈️ Return PNR: 6E2384",
  },
  { from: "you", text: "emergency" },
  {
    from: "bot",
    text: "🆘 Goa emergency contacts:\n\nPolice: 100\nWomen helpline: 1091\nYour stay host: +91-98xxx-xxx12\nMom: +91-99xxx-xxx55\n\nForward this to a friend? Reply 'forward'.",
  },
  { from: "you", text: "insurance" },
  {
    from: "bot",
    text: "🛡️ World Nomads policy WN-87231\nValid till: 2026-02-22\nClaim hotline: 1800-209-0144\n\nI also have your travel insurance PDF. Reply 'pdf insurance' to receive it here.",
  },
];

const useCases = [
  {
    icon: "🛂",
    title: "Lose your passport?",
    desc: "Photo + scan stored — message 'passport' and the bot replies with your scan, embassy number, and the FIR template you'll need.",
  },
  {
    icon: "🚨",
    title: "Need help fast?",
    desc: "Type 'emergency' — get your stay host, local police, embassy, and your nominated contact list in one message you can forward.",
  },
  {
    icon: "📱",
    title: "Phone died, need a booking?",
    desc: "Borrow a stranger's phone, log into WhatsApp Web, type 'bookings' — your full itinerary appears. No app to install, no password to remember.",
  },
];

const faqs = [
  {
    q: "Why WhatsApp and not an app?",
    a: "Because every solo woman traveller already has WhatsApp open. No app downloads, no logins, no battery drain. If your phone dies, log in on someone else's.",
  },
  {
    q: "Is my data safe?",
    a: "End-to-end encrypted on WhatsApp. Files stored on Supabase with row-level security. We never message you first — you initiate every interaction.",
  },
  {
    q: "What if I lose my phone?",
    a: "WhatsApp Web on any borrowed device. Log in with the QR code, type 'all', and your full vault appears.",
  },
  {
    q: "₹199 per trip — what counts as a trip?",
    a: "One trip = one destination, up to 30 days. Going to Goa for 5 days then Hampi for 3 = two trips. Annual unlimited for ₹999.",
  },
];

export default function VaultPage() {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="border-b border-ww-border bg-sand px-6 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-12 md:grid-cols-2">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
              The WhatsApp Trip Vault
            </p>
            <h1 className="mb-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
              Your trip docs,
              <br />
              one WhatsApp away.
            </h1>
            <p className="mb-6 font-mono text-sm leading-relaxed text-ww-muted">
              Bookings, scans, emergency contacts, insurance — all stored in a
              vault you reach by sending a single WhatsApp message. No app, no
              login. ₹199 per trip.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="#setup"
                className="border border-rust bg-rust px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-warm-white hover:bg-rust/90 transition-colors"
              >
                Set up vault →
              </Link>
              <a
                href="#how"
                className="border border-ink bg-transparent px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink hover:bg-ink hover:text-warm-white transition-colors"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* phone mockup */}
          <div className="mx-auto w-full max-w-[280px] sm:max-w-[300px]">
            <div className="rounded-[2rem] border-8 border-ink bg-ink p-2 shadow-2xl">
              <div className="rounded-[1.5rem] bg-[#e5ddd5] p-3 font-mono text-[11px] leading-snug">
                {/* header */}
                <div className="-mx-3 -mt-3 mb-3 flex items-center gap-2 rounded-t-[1.25rem] bg-[#075e54] px-3 py-2 text-warm-white">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warm-white/20 text-xs">
                    WW
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Wander Women Vault</p>
                    <p className="text-[9px] opacity-70">online</p>
                  </div>
                </div>

                {/* messages */}
                <div className="space-y-1.5">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.from === "you" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] whitespace-pre-line rounded-lg px-2.5 py-1.5 ${
                          m.from === "you"
                            ? "bg-[#dcf8c6] text-ink"
                            : "bg-white text-ink"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────── */}
      <section id="how" className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 font-serif text-3xl text-ink">
            What you actually use it for
          </h2>
          <p className="mb-10 font-mono text-xs text-ww-muted">
            Three real scenarios. The vault is built for the bad day, not the
            good one.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((u) => (
              <div
                key={u.title}
                className="border border-ww-border bg-sand p-6"
              >
                <p className="mb-3 text-3xl">{u.icon}</p>
                <h3 className="mb-2 font-serif text-xl text-ink">{u.title}</h3>
                <p className="text-xs leading-relaxed text-ww-muted">
                  {u.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="setup" className="bg-ink px-6 py-16">
        <div className="mx-auto max-w-md">
          <div className="border border-gold bg-gold-light p-8 text-center">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-rust">
              Per-trip pricing
            </p>
            <p className="mb-1 font-serif text-6xl font-light text-ink">
              ₹199
            </p>
            <p className="mb-6 font-mono text-xs text-ww-muted">
              per trip · up to 30 days
            </p>

            <ul className="mb-8 space-y-2 text-left">
              {[
                "Unlimited document storage",
                "Forward-to-friend on demand",
                "WhatsApp Web fallback",
                "Emergency contact broadcast",
                "Cancel anytime",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-xs leading-relaxed text-ink"
                >
                  <span className="text-sage">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <VaultSignupForm />
            <p className="mt-3 font-mono text-[10px] text-ww-muted">
              We&apos;ll WhatsApp you when the vault is live.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 font-serif text-3xl text-ink">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="border border-ww-border bg-sand p-5">
                <h3 className="mb-2 font-mono text-sm font-semibold text-ink">
                  {f.q}
                </h3>
                <p className="text-xs leading-relaxed text-ww-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
