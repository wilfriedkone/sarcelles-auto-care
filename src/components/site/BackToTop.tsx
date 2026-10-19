import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/** Bouton "remonter en haut", visible dès que l'on a un peu défilé. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Remonter en haut de la page"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "group fixed right-4 bottom-24 z-40 flex size-13 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-red transition-all duration-300 hover:-translate-y-1 lg:right-6 lg:bottom-6 lg:size-14",
        visible ? "opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0",
      )}
    >
      <ArrowUp
        className="size-6 transition-transform group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </button>
  );
}
