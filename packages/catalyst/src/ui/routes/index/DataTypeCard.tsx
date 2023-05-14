import clsx from "clsx";
import { CurrentSubrouteLink } from "../../components/_shared/CurrentSubrouteLink";

type Props = {
  href: string;
  className?: string;
  label: string;
};

export function DataTypeCard({ href, className, label }: Props) {
  return (
    <CurrentSubrouteLink
      href={href}
      className={clsx(
        "flex h-32 w-72 flex-col gap-4 rounded border border-gray-300 bg-white p-8 text-xl font-semibold text-gray-700 hover:border-gray-400",
        className
      )}
    >
      {label}
    </CurrentSubrouteLink>
  );
}
