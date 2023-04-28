import "@unocss/reset/tailwind-compat.css";
import "../uno.css";
import { notFound, redirect } from "next/navigation";
import { CatalystAuth, CatalystConfig, CatalystDataObject } from "../../types";
import { IndexPage } from ".";
import { BrowsePage } from "./browse";
import { CreatePage } from "./create";
import { EditCollectionPage } from "./editCollection";
import LoginPage from "./login";
import LogoutPage from "./logout";
import { EditGlobalPage } from "./editGlobal";
import { ForbiddenPage } from "./forbidden";

type RootPageProps = {
  params: {
    catalyst?: string[];
  };
  searchParams?: Record<string, string>;
};

export function createRootPage<C extends CatalystConfig>(
  config: C,
  data: CatalystDataObject<C>,
  auth: CatalystAuth
) {
  return async function RouteSwitch({ params, searchParams }: RootPageProps) {
    if (params.catalyst && params.catalyst[0] === "login") {
      // @ts-expect-error Server Components
      return <LoginPage />;
    }

    const session = await auth.getSession();

    if (!session) {
      redirect("/catalyst/login");
    }

    if (!params.catalyst) {
      // @ts-expect-error Server Components
      return <IndexPage config={config} session={session} />;
    }

    const [route] = params.catalyst;

    if (route === "browse") {
      const collectionName = params.catalyst[1];

      const collection = config.collections[collectionName];

      if (!collection) {
        notFound();
      }

      return (
        // @ts-expect-error Server Components
        <BrowsePage
          collection={{ ...collection, name: collectionName }}
          data={data}
        />
      );
    } else if (route === "create") {
      const collectionName = params.catalyst[1];

      const collection = config.collections[collectionName];

      if (!collection) {
        notFound();
      }

      return (
        // @ts-expect-error Server Components
        <CreatePage
          collection={collection}
          name={collectionName}
          i18n={config.i18n}
        />
      );
    } else if (route === "edit") {
      const [_, typeName, docId] = params.catalyst;

      const collection = config.collections[typeName];

      if (collection) {
        return (
          // @ts-expect-error server components
          <EditCollectionPage
            collection={collection}
            data={data}
            searchParams={searchParams}
            i18n={config.i18n}
            name={typeName}
            docId={docId}
          />
        );
      }

      const global = config.globals[typeName];

      if (!global) {
        notFound();
      }

      return (
        // @ts-expect-error Server Components
        <EditGlobalPage
          global={global}
          data={data}
          searchParams={searchParams}
          i18n={config.i18n}
          name={typeName}
        />
      );
    } else if (route === "login") {
      return (
        // @ts-expect-error Server Components
        <LoginPage />
      );
    } else if (route === "logout") {
      // @ts-expect-error Server Components
      return <LogoutPage />;
    } else if (route === "forbidden") {
      return <ForbiddenPage />;
    }

    notFound();
  };
}
