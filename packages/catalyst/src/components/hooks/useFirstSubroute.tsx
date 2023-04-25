import { usePathname } from "next/navigation";

export function useFirstSubroute() {
  const pathname = usePathname()!;

  return pathname.startsWith("/")
    ? pathname.split("/")[1]
    : pathname.split("/")[0];
}
