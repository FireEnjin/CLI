import fs from "fs";
import jsonStringToObject from "../helpers/jsonStringToObject";
import readFilesToArray from "../helpers/readFilesToArray";
import renderHandlebarsTemplateToFile from "../helpers/renderHandlebarsTemplateToFile";
const yargs = require("yargs").argv;

export default async () => {
  const env = require(`${process.cwd()}/environment.json`);
  const formatWithPrettier =
    yargs?.f || yargs?.format || env?.prerender?.formatWithPrettier || false;
  const dir =
    yargs?.d || yargs?.dir || env?.prerender?.dir || `${process.cwd()}/www`;
  const title = yargs?.t || yargs?.title || env?.prerender?.title;
  const head = yargs?.h || yargs?.head || env?.prerender?.head || "";
  const body = yargs?.b || yargs?.body || env?.prerender?.body || "";
  const file =
    yargs?.f || yargs?.file || env?.prerender?.templateFile || "index.hbs";
  const outFile =
    yargs?.o || yargs?.out || env?.prerender?.outFile || "index.html";
  const data = jsonStringToObject(
    yargs?.d || yargs?.data || env?.prerender?.data
  );
  const partialsPath =
    yargs?.p ||
    yargs?.partials ||
    env?.prerender?.partials ||
    `${process.cwd()}/templates/partials`;
  const partialFilenames = await readFilesToArray(partialsPath);
  const partials: { id: string; html: string }[] = [];
  for (const filename of partialFilenames || []) {
    const filenameParts = filename.split(".");
    if (filenameParts?.length > 1) filenameParts.pop();
    try {
      partials.push({
        id: filenameParts.join("."),
        html: fs.readFileSync(`${partialsPath}/${filename}`).toString(),
      });
    } catch (e) {
      console.log(`Error loading partial ${filename}: `, e);
    }
  }
  await renderHandlebarsTemplateToFile(file, `${dir}/${outFile}`, {
    data: {
      ...(data || {}),
      title,
      head,
      body,
    },
    formatWithPrettier,
    partials,
  });

  return true;
};
