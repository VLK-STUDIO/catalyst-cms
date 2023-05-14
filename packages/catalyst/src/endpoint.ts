import { NextApiRequest, NextApiResponse } from "next";
import { CatalystAuth } from "./types";
import { isAuthRequest } from "./auth";

export function createRootEndpoint(auth: CatalystAuth) {
  return async function CatalystRouteHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    // Handle NextAuth routes
    if (isAuthRequest(req)) {
      return await auth.handleAuthRequest(req, res);
    } else {
      return res.status(404).json({
        message: "Route not found"
      });
    }
  };
}
