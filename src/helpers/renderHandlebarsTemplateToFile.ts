import writeToFile from "../helpers/writeToFile";
import fs from "fs";
import renderHandlebars from "./renderHandlebars";
const prettier = require("prettier");

async function renderAndWrite(
  templateFile,
  outFile,
  data,
  formatWithPrettier,
  partials,
  helpers
) {
  const renderedFile = renderHandlebars(templateFile, data, {
    partials,
    helpers,
  });
  await writeToFile(
    outFile,
    formatWithPrettier ? prettier.format(renderedFile) : renderedFile
  );
}

export default async function renderHandlebarsTemplateToFile(
  templateFile: string,
  outFile: string,
  {
    data,
    formatWithPrettier,
    partials,
    helpers,
    templatesDir,
  }: {
    formatWithPrettier?: boolean;
    data?: any;
    partials?: { id: string; html?: string }[];
    helpers?: { [helperName: string]: any };
    templatesDir?: string;
  } = {}
) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(
      `${templatesDir || `${process.cwd()}/templates`}/${templateFile}`,
      "utf8",
      async (customErr, customTemplateFile) => {
        if (customErr) {
          fs.readFile(
            `${__dirname}/../../templates/${templateFile}`,
            "utf8",
            async (err, templateFile) => {
              if (err) {
                console.log(err);
                reject(err);
              }

              try {
                const renderedFile = await renderAndWrite(
                  templateFile,
                  outFile,
                  data,
                  formatWithPrettier,
                  partials,
                  helpers
                );
                resolve(renderedFile);
              } catch (err) {
                reject(err);
              }
            }
          );
        } else {
          try {
            const renderedFile = await renderAndWrite(
              customTemplateFile,
              outFile,
              data,
              formatWithPrettier,
              partials,
              helpers
            );
            resolve(renderedFile);
          } catch (err) {
            reject(err);
          }
        }
      }
    );
  });
}
