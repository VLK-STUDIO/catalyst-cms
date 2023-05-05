/**
 * Recursively looks through an object and replaces all references with their _id.
 *
 * @param obj
 * @returns obj with all references replaced with their _id
 */
export function getObjectWithDepopulatedReferences(obj: any): any {
  const newObj = { ...obj };
  for (let prop in newObj) {
    if (typeof newObj[prop] === "object") {
      if (newObj[prop]._id !== undefined) {
        newObj[prop] = newObj[prop]._id;
      } else {
        newObj[prop] = getObjectWithDepopulatedReferences(newObj[prop]);
      }
    }
  }
  return newObj;
}
