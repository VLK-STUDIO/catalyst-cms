import { Logo } from "../../components/_shared/Logo";
import {
  getCollectionsUserCanRead,
  getGlobalsUserCanRead
} from "../../../access";
import { RouteProps } from "../types";
import { DataTypeCard } from "./DataTypeCard";

export async function IndexRoute({ config, session }: RouteProps) {
  const collections = getCollectionsUserCanRead(config, session);
  const globals = getGlobalsUserCanRead(config, session);

  return (
    <div className="flex h-full flex-col gap-4 p-16">
      <div className="mb-8 flex items-center gap-2">
        <Logo className="h-11 w-11" />
        <h1 className="text-4xl font-black text-red-600">CATALYST</h1>
      </div>

      <section className="flex flex-col">
        <h2 className="mb-1 font-semibold text-gray-500">Collections</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(collections).map(([key, collection]) => (
            <DataTypeCard
              href={`browse/${key}`}
              key={key}
              label={collection.label}
            />
          ))}
        </div>
      </section>
      <section className="flex flex-col">
        <h2 className="mb-1 font-semibold text-gray-500">Globals</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(globals).map(([key, global]) => (
            <DataTypeCard
              href={`edit-global/${key}`}
              key={key}
              label={global.label}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
