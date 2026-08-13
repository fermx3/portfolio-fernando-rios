import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// The middleware negotiates the locale for "/" before this renders, so this is
// only a fallback. It follows routing.defaultLocale rather than hardcoding one.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
