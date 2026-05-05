import Image from "next/image";
import rawProducts from "@/lib/mock-data/shop-products.json";

export const metadata = {
  title: "Safety Shop — Wander Women",
  description:
    "Products every solo woman traveller should pack. Curated by our contributors. Real Amazon affiliate links.",
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
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ww-muted">
          Affiliate picks
        </p>
        <h1 className="mb-3 font-serif text-4xl text-ink md:text-5xl">
          The safety kit.
        </h1>
        <p className="mb-4 font-mono text-sm leading-relaxed text-ww-muted">
          The kit our contributors actually carry. Every link is an Amazon
          affiliate — you pay nothing extra, we earn a small commission that
          funds more intel cards.
        </p>
        <p className="inline-block border border-gold/40 bg-gold-light px-3 py-1.5 font-mono text-[10px] text-gold">
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
                  className="group flex flex-col border border-ww-border bg-sand"
                >
                  {/* product image */}
                  <div className="relative h-44 overflow-hidden bg-warm-white">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="mb-1 font-mono text-sm font-semibold leading-snug text-ink">
                      {product.name}
                    </h2>
                    <p className="mb-3 flex-1 text-xs leading-relaxed text-ww-muted">
                      {product.whyItMatters}
                    </p>

                    <div className="flex items-center justify-between gap-3 border-t border-ww-border pt-3">
                      <span className="font-mono text-sm font-semibold text-rust">
                        {product.priceRange}
                      </span>
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-ink bg-ink px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-warm-white transition-colors hover:bg-ink/80"
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
