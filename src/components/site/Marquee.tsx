import { Cog } from "lucide-react";

import { cn } from "@/lib/utils";

/** Bande rouge qui fait défiler une liste de mots en continu (décorative). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const sequence = items.map((item) => (
    <span key={item} className="inline-flex items-center gap-7 pr-7">
      {item}
      <Cog className="size-5 opacity-80" aria-hidden="true" />
    </span>
  ));

  return (
    <div
      aria-hidden="true"
      className={cn(
        "group overflow-hidden whitespace-nowrap bg-primary py-3 font-display text-lg font-bold uppercase tracking-wider text-primary-foreground md:text-2xl",
        className,
      )}
    >
      <div className="animate-marquee flex w-max">
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
