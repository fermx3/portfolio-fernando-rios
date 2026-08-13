import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

// routing is the single source of truth for locales; do not redeclare them here.
export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(es|en)/:path*", "/((?!_next|_vercel|api|.*\\..*).*)"],
};
