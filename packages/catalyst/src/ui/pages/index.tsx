import { CatalystConfig } from "../../types";
import { Logo } from "../components/Logo";
import { CurrentSubrouteLink } from "../components/CurrentSubrouteLink";
import { Session } from "next-auth";
import { getCollectionsUserCanRead, getGlobalsUserCanRead } from "../../access";

type IndexPageProps = {
  config: CatalystConfig;
  session: Session;
};

export async function IndexPage({ config, session }: IndexPageProps) {
  const collections = getCollectionsUserCanRead(config, session);
  const globals = getGlobalsUserCanRead(config, session);

  return (
    <div className="flex flex-col bg-gray-100 p-16 h-full gap-4">
      <div className="flex items-center gap-2 mb-8">
        <Logo className="w-11 h-11" />
        <h1 className="text-red-600 font-black text-4xl">CATALYST</h1>
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-500 mb-1">Collections</span>
        <div className="flex flex-col gap-2">
          {Object.entries(collections).map(([key, collection]) => (
            <CurrentSubrouteLink
              key={key}
              href={`browse/${key}`}
              className="p-4 flex flex-col gap-4 font-semibold text-gray-700 border border-gray-300 rounded bg-white hover:border-gray-400"
            >
              {collection.label}
            </CurrentSubrouteLink>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-500 mb-1">Globals</span>
        <div className="flex flex-col gap-2">
          {Object.entries(globals).map(([key, global]) => (
            <CurrentSubrouteLink
              key={key}
              href={`edit/${key}`}
              className="p-4 flex flex-col gap-4 font-semibold text-gray-700 border border-gray-300 rounded bg-white hover:border-gray-400"
            >
              {global.label}
            </CurrentSubrouteLink>
          ))}
        </div>
      </div>
    </div>
  );
}
