import glob from "tiny-glob";
import * as fbAdmin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

async function checkForReferences(object: any) {
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

export default async () => {
  const env = require(`${process.cwd()}/environment.json`);
  const getDirectories = (source) =>
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

  function connectDatabase() {
    const serviceAccountKey = JSON.parse(
      fs.readFileSync(`${process.cwd()}/service-account.json`, "utf8")
    );
    const project = serviceAccountKey.project_id;
    fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(serviceAccountKey),
      databaseURL: `https://${project}.firebaseio.com`,
      storageBucket: `${project}.appspot.com`,
    });

    const firestore = fbAdmin.firestore();

    if (env?.firestore?.emulate) {
      firestore.settings({
        host: env.firestore?.host ? env.firestore.host : "localhost:8080",
        ssl: !!env.firestore?.ssl,
      });
    }

    return firestore;
  }

  let seedCount = 0;
  const seedGlob = (
    process.argv[3]
      ? process.argv[3]
      : env?.defaultSeeds
      ? env.defaultSeeds
      : getDirectories(`${process.cwd()}/dist/seeds`).join(",")
  )
    .split(",")
    .map((collection) => `./dist/seeds/${collection}/**/*.js`);
  const files: string[] = [];

  for (const seedFolder of seedGlob) {
    files.push(...(await glob(seedFolder)));
  }

  const db = connectDatabase();
  for (const file of files) {
    try {
      const pathArr = file.split(path.sep);
      let currentSeed = require(`${file.replace(
        `dist${path.sep}`,
        `${process.cwd()}${path.sep}dist${path.sep}`
      )}`).default(db);
      currentSeed =
        typeof currentSeed.then === "function"
          ? await currentSeed
          : currentSeed;
      let isDocument = pathArr[3].indexOf(".") >= 0;
      let docRef: any = db
        .collection(pathArr[2])
        .doc(isDocument ? pathArr[3].split(".")[0] : pathArr[3]);

      if (!isDocument) {
        for (let i = 5; i < pathArr.length; i++) {
          isDocument = pathArr[i].indexOf(".") >= 0;
          docRef =
            isDocument || docRef
              ? docRef.doc(isDocument ? pathArr[i].split(".")[0] : pathArr[i])
              : docRef.collection(pathArr[i]);
        }
      }

      await docRef.set(await checkForReferences(currentSeed));

      seedCount = seedCount + 1;
    } catch (error) {
      console.log(`Seed failed to run`, file, error);
    }
  }

  console.log(`${seedCount} seeds ran successfully!`);
};
