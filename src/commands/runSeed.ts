import glob from "tiny-glob";
import * as fs from "fs";
import * as path from "path";
import checkForReferences from "../firebase/checkForReferences";
import connectDatabase from "../firebase/connectDatabase";

export default async () => {
  const env = require(`${process.cwd()}/environment.json`);
  const getDirectories = (source) =>
    fs
      .readdirSync(source, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

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

  const db = connectDatabase({
    emulate: !!(env?.emulate || env?.firestore?.emulate),
    host: env?.firestore?.host,
    ssl: env?.firestore?.ssl,
  });
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
