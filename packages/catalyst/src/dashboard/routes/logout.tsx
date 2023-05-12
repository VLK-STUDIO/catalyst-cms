import { LogoutLoading } from "../components/logout/LogoutLoading";

export function LogoutRoute() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 bg-gray-100">
      <h1 className="text-5xl font-black text-red-600">CATALYST</h1>
      <LogoutLoading />
    </div>
  );
}
