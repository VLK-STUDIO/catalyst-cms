import { Logo } from "../components/Logo";
import { SignInWithGoogle } from "../components/auth/SignInWIthGoogle";

const LoginPage = async () => {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center gap-8">
      <div className="flex gap-3 items-center">
        <Logo />
        <h1 className="text-red-600 font-black text-5xl">CATALYST</h1>
      </div>
      <SignInWithGoogle />
    </div>
  );
};

export default LoginPage;
