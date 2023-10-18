const pluralize = require("pluralize");
const fs = require("fs");
const path = require("path");
const package = require(`${process.env.enjinProjectDir}/package.json`);
const hasStorybook = Object.keys(package.devDependencies).includes(
  "@storybook/html"
);
const hasDocs = Object.keys(package.devDependencies).includes(
  "@fireenjin/docs"
);
const enjinSettings = package.enjin ? package.enjin : {};
let templateDir = enjinSettings?.templateDir || `${__dirname}/templates`;

function getTemplatePath(templateFile) {
  const customTemplatePath = path.join(
    process.env.enjinProjectDir,
    "templates",
    templateFile
  );
  try {
    return fs.existsSync(customTemplatePath)
      ? customTemplatePath
      : `${templateDir}/${templateFile}`;
  } catch {
    return `${templateDir}/${templateFile}`;
  }
}

function camelize(text) {
  return text.replace(
    /^([A-Z])|[\s-_]+(\w)/g,
    function (match, p1, p2, offset) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    }
  );
}

function dashize(string) {
  return string.replace(/\s+/g, "-").toLowerCase();
}

function pascalize(string) {
  return `${string}`
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w+)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3.toLowerCase()}`
    )
    .replace(new RegExp(/\s/, "g"), "")
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

function dateStringToYMD(str) {
  const d = str ? new Date(Date.parse(str)) : new Date();

  return (
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2)
  );
}

function dateStringToYMDHIS(str) {
  const d = str ? new Date(Date.parse(str)) : new Date();

  return (
    d.getFullYear() +
    "-" +
    ("00" + (d.getMonth() + 1)).slice(-2) +
    "-" +
    ("00" + d.getDate()).slice(-2) +
    "_" +
    ("00" + d.getHours()).slice(-2) +
    "-" +
    ("00" + d.getMinutes()).slice(-2) +
    "-" +
    ("00" + d.getSeconds()).slice(-2)
  );
}

module.exports = function (plop) {
  process.env.enjinProjectDir = process.env.enjinProjectDir
    ? process.env.enjinProjectDir
    : process.cwd();
  plop.setHelper("plural", (txt) => pluralize(txt));
  plop.setHelper("pathFromName", (txt) => {
    const parts = txt.split("/");
    parts.pop();

    return parts.join("/");
  });
  plop.setHelper("nameFromPathCamel", (txt) => camelize(txt.split("/").pop()));
  plop.setHelper("nameFromPathPascal", (txt) =>
    pascalize(txt.split("/").pop())
  );
  plop.setHelper("nameFromPathDash", (txt) => dashize(txt.split("/").pop()));
  plop.setHelper("pluralCamel", (txt) => camelize(pluralize(txt)));
  plop.setHelper("pluralPascal", (txt) => pascalize(pluralize(txt)));
  plop.setGenerator("input", {
    description: "define data structure of an input",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new input",
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this input is used for",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/inputs/{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("input.hbs"),
      },
    ],
  });
  plop.setGenerator("endpoint", {
    description:
      "A new unit (with input & output), resolver, query, and http trigger",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new endpoint",
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this endpoint is used for",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.input.ts`,
        templateFile: getTemplatePath("input.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.output.ts`,
        templateFile: getTemplatePath("output.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.test.ts`,
        templateFile: getTemplatePath("endpoint.unit.test.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("endpoint.unit.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/resolvers/{{nameFromPathPascal name}}.ts`,
        templateFile: getTemplatePath("resolver.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/triggers/{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("trigger.https.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/queries/{{nameFromPathCamel name}}.gql`,
        templateFile: getTemplatePath("query.write.hbs"),
      },
    ],
  });
  plop.setGenerator("resolver", {
    description: "A new resolver for GraphQL",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new resolver",
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this resolver is used for",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/resolvers/{{nameFromPathPascal name}}.ts`,
        templateFile: getTemplatePath("resolver.hbs"),
      },
    ],
  });
  plop.setGenerator("trigger", {
    description: "A new trigger for Firebase Functions",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new trigger",
      },
      {
        type: "input",
        name: "description",
        message: "A description of what this trigger is used for",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/triggers/{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("trigger.https.hbs"),
      },
    ],
  });
  plop.setGenerator("migration", {
    description:
      "A task that will run once per environment and save the results",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the migration",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${
          process.env.enjinProjectDir
        }/src/migrations/${dateStringToYMD()}_{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("migration.hbs"),
      },
    ],
  });
  const componentProps = [
    {
      type: "input",
      name: "name",
      message: "The name of the new component",
    },
  ];
  const handlebarsData = {
    simple: false,
  };
  if (!enjinSettings.namespace) {
    componentProps.push({
      type: "input",
      name: "namespace",
      message: "The namespace of the component",
      filter: (data) => {
        return !data || data === ""
          ? ""
          : data.replace(" ", "-").toLowerCase() + "-";
      },
    });
  } else {
    handlebarsData.namespace =
      handlebarsData.namespace === ""
        ? ""
        : enjinSettings.namespace.replace(" ", "-").toLowerCase() + "-";
  }
  const componentActions = [
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.tsx`,
      templateFile: getTemplatePath("component.tsx.hbs"),
      data: handlebarsData,
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.css`,
      templateFile: getTemplatePath("component.css.hbs"),
      data: handlebarsData,
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.e2e.ts`,
      templateFile: getTemplatePath("component.e2e.hbs"),
      data: handlebarsData,
    },
    {
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.spec.ts`,
      templateFile: getTemplatePath("component.spec.hbs"),
      data: handlebarsData,
    },
  ];
  if (hasStorybook) {
    componentActions.push({
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.stories.js`,
      templateFile: getTemplatePath("component.stories.hbs"),
      data: handlebarsData,
    });
  }
  if (hasDocs) {
    componentActions.push({
      type: "add",
      path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.presets.js`,
      templateFile: getTemplatePath("component.presets.hbs"),
      data: handlebarsData,
    });
  }
  plop.setGenerator("component", {
    description: "Create a new web component",
    prompts: componentProps,
    actions: componentActions,
  });
  plop.setGenerator("page", {
    description: "Create a new page component",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new page",
      },
      {
        type: "list",
        name: "type",
        message: "The type of page",
        choices: ["list", "form", "blank"],
        default: "blank",
      },
      {
        type: "input",
        name: "namespace",
        message: "The namespace of the page",
        default: enjinSettings?.namespace || "",
        filter: (data) => {
          return !data || data === ""
            ? ""
            : data.replace(" ", "-").toLowerCase() + "-";
        },
      },
      {
        type: "input",
        name: "endpoint",
        message: "The endpoint for the list / form page",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.tsx`,
        templateFile: getTemplatePath("page.{{type}}.tsx.hbs"),
        data: handlebarsData,
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/components/{{dashCase name}}/{{dashCase name}}.css`,
        templateFile: getTemplatePath("page.{{type}}.css.hbs"),
        data: handlebarsData,
      },
    ],
  });
  plop.setGenerator("model", {
    description: "Define data structure and relationships",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new model",
      },
      {
        type: "confirm",
        name: "queries",
        message: "Generate CRUD queries?",
        default: true,
      },
    ],
    actions: (data) => {
      let actions = [
        {
          type: "add",
          path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/{{nameFromPathPascal name}}.ts`,
          templateFile: getTemplatePath("model.hbs"),
        },
        {
          type: "add",
          path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/{{nameFromPathPascal name}}.model.ts`,
          templateFile: getTemplatePath("model.graphql.hbs"),
        },
        {
          type: "add",
          path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/{{nameFromPathPascal name}}.resolver.ts`,
          templateFile: getTemplatePath("model.resolver.hbs"),
        },
        {
          type: "add",
          path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/{{nameFromPathPascal name}}.input.ts`,
          templateFile: getTemplatePath("model.input.hbs"),
        },
      ];

      if (data.queries) {
        actions = [
          ...actions,
          {
            type: "add",
            path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/add{{nameFromPathPascal name}}.gql`,
            templateFile: getTemplatePath("query.add.hbs"),
          },
          {
            type: "add",
            path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/edit{{nameFromPathPascal name}}.gql`,
            templateFile: getTemplatePath("query.edit.hbs"),
          },
          {
            type: "add",
            path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/delete{{nameFromPathPascal name}}.gql`,
            templateFile: getTemplatePath("query.delete.hbs"),
          },
          {
            type: "add",
            path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/find{{nameFromPathPascal name}}.gql`,
            templateFile: getTemplatePath("query.find.hbs"),
          },
          {
            type: "add",
            path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/list{{nameFromPathPascal name}}.gql`,
            templateFile: getTemplatePath("query.list.hbs"),
          },
        ];
      }

      return actions;
    },
  });
  plop.setGenerator("queries", {
    description: "Generate queries for an endpoint",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the model these are for",
      },
    ],
    actions: (data) => [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/add{{nameFromPathPascal name}}.gql`,
        templateFile: getTemplatePath("query.add.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/edit{{nameFromPathPascal name}}.gql`,
        templateFile: getTemplatePath("query.edit.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/delete{{nameFromPathPascal name}}.gql`,
        templateFile: getTemplatePath("query.delete.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/find{{nameFromPathPascal name}}.gql`,
        templateFile: getTemplatePath("query.find.hbs"),
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/models/{{nameFromPathPascal name}}/queries/list{{nameFromPathPascal name}}.gql`,
        templateFile: getTemplatePath("query.list.hbs"),
      },
    ],
  });
  plop.setGenerator("query", {
    description: "A query to get or modify data used for codegen",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the query",
      },
      {
        type: "list",
        name: "type",
        message: "The type of query",
        choices: ["read", "write"],
        default: "read",
      },
    ],
    actions: (data) => [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/queries/{{nameFromPathCamel name}}.gql`,
        templateFile: getTemplatePath("query.${data.type}.hbs"),
      },
    ],
  });
  plop.setGenerator("unit", {
    description: "A unit of functionality",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the new unit of functionality",
      },
      {
        type: "input",
        name: "description",
        message: "The description of what the new unit of functionality does",
      },
    ],
    actions: [
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.ts`,
        templateFile: getTemplatePath("unit.hbs"),
        data: {
          simple: true,
        },
      },
      {
        type: "add",
        path: `${process.env.enjinProjectDir}/src/units/{{pathFromName name}}/{{nameFromPathCamel name}}/{{nameFromPathCamel name}}.test.ts`,
        templateFile: getTemplatePath("unit.test.hbs"),
        data: {
          simple: true,
        },
      },
    ],
  });
};
