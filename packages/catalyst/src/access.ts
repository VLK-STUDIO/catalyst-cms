import { Session } from "next-auth";
import { CatalystCollection, CatalystConfig, CatalystDataType } from "./types";

export function getCollectionsUserCanRead(
  config: CatalystConfig,
  user: Session
) {
  return Object.fromEntries(
    Object.entries(config.collections).filter(([, collection]) =>
      canUserReadDataType(user, collection)
    )
  );
}

export function getGlobalsUserCanRead(config: CatalystConfig, user: Session) {
  return Object.fromEntries(
    Object.entries(config.globals).filter(([, global]) =>
      canUserReadDataType(user, global)
    )
  );
}

export function canUserReadDataType(
  user: Session | null,
  dataType: CatalystDataType
) {
  if (!dataType.access) return true;

  if (!dataType.access.read) return true;

  return dataType.access.read(user);
}

export function canUserUpdateDataType(
  user: Session | null,
  dataType: CatalystDataType
) {
  if (!dataType.access) return true;

  if (!dataType.access.update) return true;

  return dataType.access.update(user);
}

export function canUserCreateCollectionEntry(
  user: Session | null,
  collection: CatalystCollection
) {
  if (!collection.access) return true;

  if (!collection.access.create) return true;

  return collection.access.create(user);
}

export function canUserDeleteCollectionEntry(
  user: Session | null,
  collection: CatalystCollection
) {
  if (!collection.access) return true;

  if (!collection.access.delete) return true;

  return collection.access.delete(user);
}
