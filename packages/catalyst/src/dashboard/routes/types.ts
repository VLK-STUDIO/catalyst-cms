import { Session } from "next-auth";
import { CatalystCms, CatalystConfig } from "../../types";

export type RouteProps = {
  params: string[];
  cms: CatalystCms;
  config: CatalystConfig;
  session: Session;
  searchParams?: Record<string, string>;
};
