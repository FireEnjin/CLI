import "reflect-metadata";
import path from "path";
import { connectFirestore, session } from "@fireenjin/graphql";
import { ApolloServer } from "apollo-server";
import { buildSchemaSync } from "type-graphql";

async function main({
  authChecker,
  schemaPath,
  schemaComments,
  emitSchema,
  introspection,
}: {
  authChecker?: any;
  schemaPath?: string;
  schemaComments?: boolean;
  emitSchema?: boolean;
  introspection?: boolean;
} = {}) {
  const db = connectFirestore({
    serviceAccount: true,
  });
  const server = new ApolloServer({
    context: async ({ req, res }) => session({ req, res, db }),
    schema: buildSchemaSync({
      resolvers: [
        path.join(__dirname, "..", "/src/models/**/*.{ts,js}"),
        path.join(__dirname, "..", "/src/resolvers/**/*.{ts,js}"),
      ],
      emitSchemaFile: emitSchema
        ? {
            path: schemaPath || __dirname + "/../schema.gql",
            commentDescriptions: schemaComments ?? true,
          }
        : false,
      authChecker,
      // authMode: "null",
      globalMiddlewares: [],
      nullableByDefault: true,
    }),
    introspection: !!introspection,
  });

  await server.listen(4000);
  console.log("Server has started!");
}
main();
