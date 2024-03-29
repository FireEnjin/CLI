import * as fs from "fs";
import glob from "tiny-glob";
import * as pluralize from "pluralize";
import path from "path";

async function renderToFile(
  templateName: string,
  location: string,
  dataFilter: (data) => string
) {
  return new Promise(async (resolve, reject) => {
    let templateFile = `${__dirname}/../../templates/${templateName}.hbs`;
    try {
      if (fs.existsSync(process.cwd() + `/templates/${templateName}.hbs`)) {
        templateFile = process.cwd() + `/templates/${templateName}.hbs`;
      } else if (fs.existsSync(process.cwd() + `/${templateName}.hbs`)) {
        templateFile = path.join(
          process.cwd(),
          "../.fireenjin/templates",
          `/${templateName}.hbs`
        );
      }
    } catch (err) {
      console.error(err);
    }
    fs.readFile(templateFile, "utf8", async (_err: any, data: any) => {
      try {
        fs.writeFileSync(location, dataFilter(data));
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  });
}

function capitalize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function camelize(s) {
  if (typeof s !== "string") return "";
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function replaceModelName(data, modelName) {
  return data
    .replace(/{{pascalCase modelName}}/g, capitalize(modelName))
    .replace(/{{camelCase modelName}}/g, modelName);
}

export default async (config: any) => {
  let importStr = ``;
  let exportStr = ``;
  let endpointStr = ``;
  const skipResolvers: string[] = [];
  const triggers: string[] = [];
  const endpoints: string[] = [];
  const models: any = {};
  let endpointCount = 0;
  const schema = require(`${process.cwd()}/dist/graphql.schema.json`);

  // CHECK FOR CUSTOM RESOLVERS
  try {
    fs.readdir(
      config?.express?.resolverDir
        ? `${process.cwd()}/${config?.express?.resolverDir}`
        : `${process.cwd()}/dist/resolvers/`,
      (err, files) => {
        if (!err)
          files.forEach((file) => {
            skipResolvers.push(file.split(".")[0].toLowerCase());
          });
      }
    );
  } catch (err) {
    console.log("error getting resolver...");
  }

  // CREATE IMPORT AND EXPORT STRINGS FOR TRIGGERS
  for (const file of await glob(`./src/triggers/**/*.ts`)) {
    // const triggerFile = fs.readFileSync(file, "utf8");
    const pathParts = file.split(path.sep);
    const triggerName = pathParts[pathParts.length - 1].split(".")[0];
    importStr += `const ${triggerName} = require("./triggers/${triggerName}");\n`;
    exportStr += `  ${triggerName}: ${triggerName}.default,\n`;
    triggers.push(triggerName.toLowerCase());
  }

  // CREATE API ENDPOINTS FROM GRAPHQL SCHEMA
  for (const gqlType of schema.__schema.types) {
    if (["Query", "Mutation"].indexOf(gqlType.name) === -1) continue;
    for (const field of gqlType.fields) {
      if (
        endpoints.indexOf(field.name.toLowerCase) >= 0 ||
        skipResolvers.indexOf(field.name.toLowerCase()) >= 0 ||
        triggers.indexOf(field.name.toLowerCase()) >= 0
      )
        continue;
      if (gqlType.name === "Query" && field.type.kind === "OBJECT") {
        try {
          // await renderToFile(
          //   "firebaseFunctionFind",
          //   `./dist/triggers/${field.name}.js`,
          //   data => replaceModelName(data, field.name)
          // );
          const modelName = capitalize(pluralize.singular(field.name));
          models[modelName] = true;
          endpointStr += `app.get("/${camelize(
            modelName
          )}/:id", async (req, res) => {
  const model = new ${modelName}.default();
  if (
    model.onAuth &&
    typeof model.onAuth === "function" &&
    !(await model.onAuth(
      "find",
      {
        id: req.params.id,
      },
      hookOptions
    ))
  )
    return res.status(400).send({
      message: "Permission Denied!"
    });
  const doc =
    model.onBeforeFind && typeof model.onBeforeFind === "function"
      ? await model.onBeforeFind(req.params.id, hookOptions)
      : await model.find(req.params.id);
  return res.send(
    await cleanData(
      model.onAfterFind && typeof model.onAfterFind === "function"
        ? await model.onAfterFind(doc, hookOptions)
        : doc
    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})
  );
});\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Query" && field.type.kind === "LIST") {
        try {
          // await renderToFile(
          //   "firebaseFunctionList",
          //   `./dist/triggers/${field.name}.js`,
          //   data => replaceModelName(data, pluralize.singular(field.name))
          // );
          const modelName = capitalize(pluralize.singular(field.name));
          models[modelName] = true;
          endpointStr += `app.get("/${camelize(
            modelName
          )}",  async (req, res) => {
  const model = new ${modelName}.default();
  if (
    model.onAuth &&
    typeof model.onAuth === "function" &&
    !(await model.onAuth("list", req.query ? req.query : {}, hookOptions))
  )
    return res.status(400).send({
      message: "Permission Denied!"
    });
  const docs =
    model.onBeforeList && typeof model.onBeforeList === "function"
      ? await model.onBeforeList(req.query, hookOptions)
      : await model.paginate(req.query);
  return res.send(
    await cleanData(
      model.onAfterList && typeof model.onAfterList === "function"
        ? await model.onAfterList(docs, hookOptions)
        : docs
    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})
  );
});\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Mutation" && field.name.startsWith("add")) {
        try {
          // await renderToFile(
          //   "firebaseFunctionAdd",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(3))
          // );
          const modelName = capitalize(field.name.slice(3));
          models[modelName] = true;
          endpointStr += `app.post("/${camelize(
            modelName
          )}", async (req, res) => {
  const requestInput = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (typeof requestInput === "string") return res.status(400).send({
    message: "Invalid doc data input!"
  });
  const model = new ${modelName}.default();
  if (
    model.onAuth &&
    typeof model.onAuth === "function" &&
    !(await model.onAuth("add", requestInput, hookOptions))
  )
    return res.status(400).send({
      message: "Permission Denied!"
    });
  const docData =
    model.onBeforeAdd && typeof model.onBeforeAdd === "function"
      ? await model.onBeforeAdd(requestInput, hookOptions)
      : model.onBeforeWrite && typeof model.onBeforeWrite === "function"
      ? await model.onBeforeWrite(requestInput, hookOptions)
      : requestInput;
  if (docData === false) {
    return res.status(400).send({
      message: "No data for doc!"
    });
  }

  const newDoc = await model.create(docData);

  return res.send(
    await cleanData(
      model.onAfterAdd && typeof model.onAfterAdd === "function"
        ? await model.onAfterAdd(newDoc, hookOptions)
        : model.onAfterWrite && typeof model.onAfterWrite === "function"
        ? await model.onAfterWrite(newDoc, hookOptions)
        : newDoc
    , {with: requestInput.with, include: requestInput.include, exclude: requestInput.exclude})
  );
});\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (gqlType.name === "Mutation" && field.name.startsWith("edit")) {
        try {
          // await renderToFile(
          //   "firebaseFunctionEdit",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(4))
          // );
          const modelName = capitalize(field.name.slice(4));
          models[modelName] = true;
          endpointStr += `app.post("/${camelize(
            modelName
          )}/:id", async (req, res) => {
  const requestInput = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (typeof requestInput === "string") return res.status(400).send({
    message: "Invalid doc data input!"
  });
  const model = new ${modelName}.default();
  if (
    model.onAuth &&
    typeof model.onAuth === "function" &&
    !(await model.onAuth("edit", { ...requestInput, id: req.params.id }, hookOptions))
  )
    return res.status(400).send({
      message: "Permission Denied!"
    });
  const docData =
    model.onBeforeEdit && typeof model.onBeforeEdit === "function"
      ? await model.onBeforeEdit({ id: req.params.id, ...requestInput }, hookOptions)
      : model.onBeforeWrite && typeof model.onBeforeWrite === "function"
      ? await model.onBeforeWrite({ id: req.params.id, ...requestInput }, hookOptions)
      : data;
  if (docData === false) {
    return res.status(400).send({
      message: "No data for doc!"
    });
  }

  const doc = await model.update({ id: req.params.id, ...docData });
  
  return res.send(
    await cleanData(
      model.onAfterEdit && typeof model.onAfterEdit === "function"
        ? await model.onAfterEdit(doc, hookOptions)
        : model.onAfterWrite && typeof model.onAfterWrite === "function"
        ? await model.onAfterWrite(doc, hookOptions)
        : doc
    , {with: requestInput.with, include: requestInput.include, exclude: requestInput.exclude})
  );
});\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      } else if (
        gqlType.name === "Mutation" &&
        field.name.startsWith("delete")
      ) {
        try {
          // await renderToFile(
          //   "firebaseFunctionDelete",
          //   `./dist/triggers/${field.name}.js`,
          //   data =>
          //     replaceModelName(data, field.name.slice(6))
          // );
          const modelName = capitalize(field.name.slice(6));
          models[modelName] = true;
          endpointStr += `app.delete("/${camelize(
            modelName
          )}/:id", async (req, res) => {
  const requestInput = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (typeof requestInput === "string") return res.status(400).send({
    message: "Invalid doc data input!"
  });
  const model = new ${modelName}.default();
  if (
    model.onAuth &&
    typeof model.onAuth === "function" &&
    !(await model.onAuth("list", { id: req.params.id }, hookOptions))
  )
    return res.status(400).send({
      message: "Permission Denied!"
    });
  const modelBefore = await model.find(req.params.id);
  if (model.onBeforeDelete && typeof model.onBeforeDelete === "function") {
    const delData = await model.onBeforeDelete({
      id: req.params.id,
      ...modelBefore
    }, hookOptions);
    if (delData === false) {
      return res.status(400).send({
        message: "No data for doc!"
      });
    }
  }
  await model.delete(req.params.id);

  return res.send(
    await cleanData(
      model.onAfterDelete && typeof model.onAfterDelete === "function"
        ? await model.onAfterDelete({ id: req.params.id, ...modelBefore }, hookOptions)
        : { id: req.params.id, ...modelBefore }
    , {with: req.query.with, include: req.query.include, exclude: req.query.exclude})
  );
});\n`;
        } catch (e) {
          endpointCount--;
          console.log(`Error creating ${field.name} trigger...`, e);
        }
      }
      endpoints.push(field.name.toLowerCase());
    }
  }

  for (const modelName of Object.keys(models)) {
    importStr += `const ${modelName} = require("./models/${modelName}/${modelName}.model");\n`;
  }

  try {
    await renderToFile("firebaseFunctionsIndex", "./dist/index.js", (data) => {
      return data
        .replace(/{{imports}}/g, importStr)
        .replace(/{{exports}}/g, exportStr)
        .replace(/{{endpoints}}/g, endpointStr);
    });
  } catch (e) {
    console.log("Error rendering firebase functions index... ", e);
  }

  console.log(
    `Rendered Firebase Functions index file with ${
      triggers.length + 1
    } triggers and ${endpointCount + endpoints.length} api endpoints...`
  );
};
