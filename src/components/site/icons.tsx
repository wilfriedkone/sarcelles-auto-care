import {
  Car,
  ClipboardCheck,
  Cpu,
  Droplet,
  KeyRound,
  ScanLine,
  Snowflake,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { ServiceIconName } from "@/config/site";

const map: Record<ServiceIconName, LucideIcon> = {
  wrench: Wrench,
  scan: ScanLine,
  zap: Zap,
  cpu: Cpu,
  key: KeyRound,
  droplet: Droplet,
  snowflake: Snowflake,
  clipboard: ClipboardCheck,
  car: Car,
};

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconName;
  className?: string;
}) {
  const Icon = map[name] ?? Wrench;
  return <Icon className={className} aria-hidden="true" />;
}
