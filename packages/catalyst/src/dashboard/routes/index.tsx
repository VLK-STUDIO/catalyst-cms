import { Logo } from "../components/_shared/Logo";
import { CurrentSubrouteLink } from "../components/_shared/CurrentSubrouteLink";
import { getCollectionsUserCanRead, getGlobalsUserCanRead } from "../../access";
import { RouteProps } from "./types";

export async function IndexRoute({ config, session }: RouteProps) {
  const collections = getCollectionsUserCanRead(config, session);
  const globals = getGlobalsUserCanRead(config, session);

  return (
    <div className="flex h-full flex-col gap-4 p-16">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-11 w-11" />
        <h1 className="text-4xl font-black text-red-600">CATALYST</h1>
      </div>

      <div className="flex flex-col">
        <span className="mb-1 font-semibold text-gray-500">Collections</span>
        <div className="flex flex-col gap-2">
          {Object.entries(collections).map(([key, collection]) => (
            <CurrentSubrouteLink
              key={key}
              href={`browse/${key}`}
              className="flex flex-col gap-4 rounded border border-gray-300 bg-white p-4 font-semibold text-gray-700 hover:border-gray-400"
            >
              {collection.label}
            </CurrentSubrouteLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="mb-1 font-semibold text-gray-500">Globals</span>
        <div className="flex flex-col gap-2">
          {Object.entries(globals).map(([key, global]) => (
            <CurrentSubrouteLink
              key={key}
              href={`edit-global/${key}`}
              className="flex flex-col gap-4 rounded border border-gray-300 bg-white p-4 font-semibold text-gray-700 hover:border-gray-400"
            >
              {global.label}
            </CurrentSubrouteLink>
          ))}
        </div>
      </div>
    </div>
  );
}
