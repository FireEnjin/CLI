import "reflect-metadata";
import { buildSchemaSync, BuildSchemaOptions } from "type-graphql";

export default (
  config: BuildSchemaOptions = {
    resolvers: [
      process.cwd() + "/dist/models/**/*.js",
      process.cwd() + "/dist/resolvers/**/*.js",
    ],
    authChecker: () => true,
    emitSchemaFile: {
      path: process.cwd() + "/schema.gql",
      commentDescriptions: true,
    },
    globalMiddlewares: [],
    nullableByDefault: true,
  }
) => {
  return buildSchemaSync(config);
};
