"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useFirstSubroute } from "../hooks/useFirstSubroute";

export const LogoutLoading: React.FC = () => {
  const subroute = useFirstSubroute();

  useEffect(() => {
    signOut({ callbackUrl: `/${subroute}/login` });
  }, []);

  return <span>You are being logged out...</span>;
};
