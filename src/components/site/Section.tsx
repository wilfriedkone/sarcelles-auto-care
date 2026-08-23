import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ariaLabel?: string;
}) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-4">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  as = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  as?: "h1" | "h2";
}) {
  const Title = as;
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-primary">
          {eyebrow}
        </p>
      ) : null}
      <Title className="mt-3 text-3xl font-bold uppercase leading-tight md:text-5xl">
        {title}
      </Title>
      <div className="diagonal-rule mt-5 w-40" />
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
