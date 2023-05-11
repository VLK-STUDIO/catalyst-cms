import { Logo } from "../components/_shared/Logo";
import { CurrentSubrouteLink } from "../components/_shared/CurrentSubrouteLink";
import { RouteProps } from "./types";

export function ForbiddenRoute() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-100">
      <Logo className="w-16" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-gray-500">
          Your account is not allowed to see this page.
        </span>
        <CurrentSubrouteLink
          className="font-semibold text-gray-500 hover:underline "
          href=""
        >
          Go to home page
        </CurrentSubrouteLink>
      </div>
    </div>
  );
}
