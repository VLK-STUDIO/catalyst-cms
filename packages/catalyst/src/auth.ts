import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import mongoClientPromise from "./mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { CatalystAuthConfig } from "./types";

export function isAuthRequest(req: NextApiRequest) {
  return req.url!.includes("auth");
}

export function createCatalystAuthObject({
  providers,
  whitelist
}: CatalystAuthConfig) {
  const authOptions: AuthOptions = {
    providers,
    callbacks: {
      signIn: async ({ user }) => {
        if (process.env.NODE_ENV === "development") return true;

        const client = await mongoClientPromise;

        const collection = client.db().collection(whitelist.collection);

        const doc = await collection.findOne({
          [whitelist.field]: (user as any)[whitelist.field]
        });

        return doc !== null;
      }
    }
  };

  return {
    handleAuthRequest: (req: NextApiRequest, res: NextApiResponse) => {
      req.query.nextauth = req.query.catalyst!.slice(1)!;

      return NextAuth(req, res, authOptions);
    },
    getSession: () => getServerSession(authOptions),
    getSessionFromRequest: (req: NextApiRequest, res: NextApiResponse) =>
      getServerSession(req, res, authOptions)
  };
}
