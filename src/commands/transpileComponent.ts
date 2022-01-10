import { transpile } from "@stencil/core/compiler";
import * as fs from "fs";

export default async (file: string) => {
  if (!file) throw new Error("A path to a stencil.js component is required!");
  const fileContent = fs.readFileSync(`${process.cwd()}/${file}`, "utf8");
  try {
    process.chdir(process.cwd());
  } catch {
    console.log("Error changing dir");
  }
  const result: any = await transpile(fileContent, {
    file,
    componentExport: "module",
    module
    coreImportPath:
      "https://unpkg.com/@stencil/core@2.12.0/compiler/stencil.min.js",
  });

  return result.code;
};
