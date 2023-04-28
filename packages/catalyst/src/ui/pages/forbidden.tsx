import Link from "next/link";
import { Logo } from "../components/Logo";
import { CurrentSubrouteLink } from "../components/CurrentSubrouteLink";

export const ForbiddenPage = () => {
  return (
    <div className="h-full bg-gray-100 flex flex-col items-center justify-center gap-4">
      <Logo className="w-16" />
      <div className="flex flex-col items-center gap-1">
        <span className="text-gray-500">
          Your account is not allowed to see this page.
        </span>
        <CurrentSubrouteLink
          className="text-gray-500 font-semibold hover:underline "
          href=""
        >
          Go to home page
        </CurrentSubrouteLink>
      </div>
    </div>
  );
};
