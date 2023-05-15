import { Logo } from "../components/_shared/Logo";
import { SignInWithGoogle } from "../components/login/SignInWIthGoogle";

export async function LoginRoute() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-gray-100">
      <div className="flex items-center gap-3">
        <Logo />
        <h1 className="text-5xl font-black text-red-600">CATALYST</h1>
      </div>
      <SignInWithGoogle />
    </div>
  );
}
