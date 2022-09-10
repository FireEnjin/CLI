import fs from "fs";

export default async function readFilesToArray(
  dir: string,
  { withFileTypes }: { withFileTypes?: boolean } = {}
) {
  try {
    let files: any[] = [];
    fs.readdirSync(dir, { withFileTypes } as any).forEach((file) => {
      console.log(file);
      files.push(file);
    });
    return files;
  } catch (error) {
    console.log("No template partials found.");
    return null;
  }
}
