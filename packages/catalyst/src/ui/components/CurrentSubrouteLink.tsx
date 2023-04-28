"use client";

import Link from "next/link";
import { ComponentProps } from "react";
import { useFirstSubroute } from "../hooks/useFirstSubroute";

type Props = ComponentProps<typeof Link>;

export const CurrentSubrouteLink: React.FC<Props> = (props) => {
  const subroute = useFirstSubroute();

  return <Link {...props} href={`${subroute}/${props.href}`} />;
};
