export default async function checkForReferences(object: any) {
  const data = object;
  for (const key of Object.keys(object)) {
    const value = object[key];
    if (value?.constructor?.name === "Timestamp") {
      data[key] = value.toDate();
    } else if (typeof value === undefined) {
      data[key] = null;
    }
  }

  return data;
}
