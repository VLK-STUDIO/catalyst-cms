import { NextApiRequest, NextApiResponse } from "next";
import { handleAuthRequest, isAuthRequest } from "../auth";
import { CatalystConfig } from "../types";
import {
  isCollectionEntryCreationEndpoint,
  handleCollectionEntryCreation,
} from "./collectionEntryCreation";
import { isGlobalUpsertEndpoint, handleGlobalUpsert } from "./globalUpsert";
import {
  isCollectionEntryUpdateEndpoint,
  handleCollectionEntryUpdate,
} from "./collectionEntryUpdate";

export function createRootEndpoint<C extends CatalystConfig>(config: C) {
  return async function CatalystRouteHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Handle NextAuth routes
    if (isAuthRequest(req)) {
      return await handleAuthRequest(req, res);
    }

    // Handle Catalyst routes
    if (isCollectionEntryCreationEndpoint(req))
      return await handleCollectionEntryCreation(config, req, res);
    else if (isCollectionEntryUpdateEndpoint(req))
      return await handleCollectionEntryUpdate(config, req, res);
    else if (isGlobalUpsertEndpoint(req))
      return await handleGlobalUpsert(config, req, res);
    else {
      return res.status(404).json({
        message: "Route not found",
      });
    }
  };
}
