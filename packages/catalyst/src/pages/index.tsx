import "@unocss/reset/tailwind-compat.css";
import { notFound } from "next/navigation";
import { CatalystAuth, CatalystConfig, CatalystData } from "../types";
import { IndexPage } from "./base";
import { BrowsePage } from "./browse";
import { CreatePage } from "./create";
import { EditPage } from "./edit";
import LoginPage from "./login";
import LogoutPage from "./logout";
import "./uno.css";

type RootPageProps = {
  params: {
    catalyst?: string[];
  };
  searchParams?: Record<string, string>;
};

export function createRootPage<C extends CatalystConfig>(
  config: C,
  data: CatalystData<C>,
  auth: CatalystAuth
) {
  return async function RootPage({ params, searchParams }: RootPageProps) {
    if (!params.catalyst) {
      // @ts-expect-error Server Components
      return <IndexPage config={config} auth={auth} />;
    }

    if (params.catalyst[0] === "browse") {
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
    } else if (params.catalyst[0] === "create") {
      const collectionName = params.catalyst[1];

      const collection = config.collections[collectionName];

      if (!collection) {
        notFound();
      }

      return (
        // @ts-expect-error Server Components
        <CreatePage
          collection={{
            ...collection,
            name: collectionName,
          }}
          i18n={config.i18n}
        />
      );
    } else if (params.catalyst[0] === "edit") {
      const collectionName = params.catalyst[1];
      const docId = params.catalyst[2];

      const collection = config.collections[collectionName];

      if (!collection) {
        notFound();
      }

      return (
        // @ts-expect-error server components
        <EditPage
          collection={{
            ...collection,
            name: collectionName,
          }}
          data={data}
          docId={docId}
          searchParams={searchParams}
          i18n={config.i18n}
        />
      );
    } else if (params.catalyst[0] === "login") {
      return (
        // @ts-expect-error Server Components
        <LoginPage />
      );
    } else if (params.catalyst[0] === "logout") {
      // @ts-expect-error Server Components
      return <LogoutPage />;
    }

    notFound();
  };
}
