import * as fs from "fs";
import glob from "tiny-glob";

const currentEnv = process.argv[3] ? process.argv[3] : "local";

export default async () => {
  console.log(`Running ${currentEnv} environment setup by copying files...`);
  for (const file of await glob(`./env/${currentEnv}/**/*.*`)) {
    fs.copyFileSync(
      file,
      process.cwd() +
        "/" +
        (file as string)
          .split("/")
          .filter((_part, index) => index > 2)
          .join("/")
    );
  }
};
