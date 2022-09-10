import fs from "fs";

export default async function writeToFile(filename, data) {
  return new Promise(async (resolve, reject) => {
    const filenameParts: string[] = filename.split("/");
    filenameParts.pop();
    const folderPath = filenameParts.join("/");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    try {
      fs.writeFileSync(filename, data, { encoding: "utf8", flag: "w" });
      resolve({ filename });
    } catch (err) {
      reject(err);
      console.log(`Error writing file: ${filename}`);
    }
  });
}
