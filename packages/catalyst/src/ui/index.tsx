import { notFound, redirect } from "next/navigation";
import { CatalystCms, CatalystConfig } from "../types";
import { LoginRoute } from "./routes/login";
import { IndexRoute } from "./routes/index/route";
import { BrowseRoute } from "./routes/browse";
import { RouteProps } from "./routes/types";
import { CreateRoute } from "./routes/create";
import { LogoutRoute } from "./routes/logout";
import { EditCollectionRoute } from "./routes/editCollection";
import { EditGlobalRoute } from "./routes/editGlobal";
import { ForbiddenRoute } from "./routes/forbidden";
import { ToastProvider } from "./components/_shared/Toast/ToastProvider";
import "./__generated.css";

const ROUTE_MAP: Record<
  string,
  (props: RouteProps) => Promise<JSX.Element> | JSX.Element
> = {
  default: IndexRoute,
  browse: BrowseRoute,
  create: CreateRoute,
  "edit-collection": EditCollectionRoute,
  "edit-global": EditGlobalRoute,
  forbidden: ForbiddenRoute,
  logout: LogoutRoute
};

export function createDashboard(cms: CatalystCms, config: CatalystConfig) {
  return async function Dashboard({
    params: { catalyst = ["default"] },
    searchParams
  }: {
    params: {
      catalyst?: string[];
    };
    searchParams: Record<string, string>;
  }) {
    const [matchedRoute] = catalyst;

    if (matchedRoute === "login") {
      // @ts-expect-error Server Components
      return <LoginRoute />;
    }

    const session = await cms.auth.getSession();

    if (!session) {
      redirect("/catalyst/login");
    }

    const RouteComponent = ROUTE_MAP[matchedRoute] || notFound();

    return (
      <div className="h-full w-full overflow-y-auto bg-gray-100">
        {/* @ts-expect-error Server Components */}
        <RouteComponent
          cms={cms}
          config={config}
          params={catalyst}
          session={session}
          searchParams={searchParams}
        />
        <ToastProvider />
      </div>
    );
  };
}
