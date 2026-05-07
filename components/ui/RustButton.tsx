import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// The canonical primary CTA — sharp editorial, font-mono, uppercase, rust.
// Keeps three sizes so every page stops reinventing padding combos:
//   lg — landing/hero CTAs
//   md — form submits, modal CTAs, full-width primaries
//   sm — inline / micro CTAs (default)
//
// Use `asChild` to wrap a Next.js <Link>:
//   <RustButton size="lg" asChild><Link href="/onboarding">Travel India →</Link></RustButton>
const rustButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none bg-rust font-mono uppercase tracking-widest text-warm-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust/40 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      size: {
        lg: "px-7 py-3.5 text-sm",
        md: "px-6 py-3 text-xs",
        sm: "px-4 py-2 text-[10px]",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      block: false,
    },
  }
);

export interface RustButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rustButtonVariants> {
  asChild?: boolean;
}

export const RustButton = React.forwardRef<HTMLButtonElement, RustButtonProps>(
  ({ className, size, block, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="rust-button"
        className={cn(rustButtonVariants({ size, block, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
RustButton.displayName = "RustButton";

export { rustButtonVariants };
