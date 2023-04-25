import { signIn } from "next-auth/react";

export function signInWithGoogle(callbackUrl: string) {
  return signIn("google", { callbackUrl });
}
