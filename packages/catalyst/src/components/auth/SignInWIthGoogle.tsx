"use client";

import { signInWithGoogle } from "../../client";
import { Button } from "../Button";
import { useFirstSubroute } from "../hooks/useFirstSubroute";

export const SignInWithGoogle: React.FC = () => {
  const subroute = useFirstSubroute();

  return (
    <Button
      onClick={() => signInWithGoogle(`/${subroute}`)}
      className="!bg-red-600 px-4 hover:bg-red-700"
    >
      Sign in with Google
    </Button>
  );
};
