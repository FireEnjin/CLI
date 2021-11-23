import * as fs from "fs";
import * as path from "path";
import glob from "tiny-glob";

const currentEnv = process.argv[3] ? process.argv[3] : "local";

export default async () => {
  console.log(`Running ${currentEnv} environment setup by copying files...`);
  for (const file of await glob(`./env/${currentEnv}/**/*.*`)) {
    const fileDest =
      process.cwd() +
      path.sep +
      (file as string)
        .split(path.sep)
        .filter((_part, index) => index > 1)
        .join(path.sep);
    fs.copyFileSync(file, fileDest);
  }
};
