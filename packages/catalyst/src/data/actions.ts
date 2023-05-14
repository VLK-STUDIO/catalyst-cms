import {
  createCollectionEntry,
  editCollectionEntry
} from "../actions/collections";
import { editGlobal } from "../actions/globals";

export function createCollectionEntryCreationAction(collectionName: string) {
  return (data: Record<string, unknown>) =>
    createCollectionEntry(collectionName, data);
}

export function createCollectionEntryUpdateAction(collectionName: string) {
  return (docId: string, edits: Record<string, unknown>, locale: string) =>
    editCollectionEntry({ collectionName, docId }, edits, locale);
}

export function createGlobalUpdateAction(globalName: string) {
  return (edits: Record<string, unknown>, locale: string) =>
    editGlobal(globalName, edits, locale);
}
