import { LogoutLoading } from "../components/auth/LogoutLoading";

export function LogoutRoute() {
  return (
    <div className="w-full h-full bg-gray-100 flex flex-col justify-center items-center gap-8">
      <h1 className="text-red-600 font-black text-5xl">CATALYST</h1>
      <LogoutLoading />
    </div>
  );
}
