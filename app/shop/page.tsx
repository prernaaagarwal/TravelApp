import Image from "next/image";
import rawProducts from "@/lib/mock-data/shop-products.json";

export const metadata = {
  title: "Solo Female Travel Safety Kit — 15 Products We Actually Pack",
  description:
    "The safety kit every solo woman traveller should pack — door wedges, RFID wallets, personal alarms, eSIMs, plus women's basics. Curated by contributors who actually use them.",
};

type Product = {
  id: string;
  name: string;
  category: string;
  whyItMatters: string;
  priceRange: string;
  imageUrl: string;
  amazonUrl: string;
  displayOrder: number;
};

const CATEGORY_ORDER = [
  "Safety & Security",
  "Tech & Connectivity",
  "Packing & Organisation",
  "Health & Hygiene",
  "Women's Basics",
];

const sorted = [...(rawProducts as Product[])].sort(
  (a, b) => a.displayOrder - b.displayOrder
);

const categories = CATEGORY_ORDER.filter((cat) =>
  sorted.some((p) => p.category === cat)
);

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* header */}
      <div className="mb-10">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-rust">
          <span className="h-2 w-2 rounded-full bg-rust" aria-hidden />
          Solo female travel safety kit · affiliate picks
        </p>
        <h1 className="mb-4 font-serif text-4xl leading-[1.02] tracking-tight text-ink md:text-6xl">
          <span className="font-serif font-medium italic text-gold">The kit</span>{" "}
          our contributors actually carry.
        </h1>
        <p className="mb-5 max-w-xl font-mono text-sm leading-relaxed text-ww-muted">
          Door wedges, RFID wallets, personal alarms, eSIMs. Every link is an
          Amazon affiliate — you pay nothing extra, we earn a small commission
          that funds more intel cards.
        </p>
        <p className="inline-block rounded-full border border-gold/40 bg-gold-light px-3 py-1.5 font-mono text-[10px] text-gold">
          ✦ Wander Women earns a small affiliate commission on qualifying
          purchases. Prices vary.
        </p>
      </div>

      {/* category sections */}
      {categories.map((cat) => {
        const catProducts = sorted.filter((p) => p.category === cat);
        return (
          <section key={cat} className="mb-12">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-ww-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
                {cat}
              </span>
              <div className="h-px flex-1 bg-ww-border" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {catProducts.map((product) => (
                <article
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-ww-border bg-warm-white transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(26,21,16,0.18)]"
                >
                  {/* product image */}
                  <div className="relative h-44 overflow-hidden bg-sand/40">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="mb-1 font-serif text-lg leading-snug text-ink md:text-xl">
                      {product.name}
                    </h2>
                    <p className="mb-4 flex-1 font-mono text-xs leading-relaxed text-ww-muted">
                      {product.whyItMatters}
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-ww-border/60 pt-4">
                      <span className="font-serif text-lg text-ink md:text-xl">
                        {product.priceRange}
                      </span>
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/90"
                      >
                        Buy on Amazon ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}

      {/* footer disclosure */}
      <div className="border-t border-ww-border pt-8">
        <p className="font-mono text-[10px] leading-relaxed text-ww-muted">
          Wander Women participates in the Amazon Associates Program. As an
          Amazon Associate, we earn from qualifying purchases. All products
          are independently selected by our contributors — we only list things
          we&apos;d pack ourselves.
        </p>
      </div>
    </div>
  );
}
