import { BuildSchemaOptions } from "type-graphql";
import buildSchema from "../grapqhl/buildSchema";
import fs from "fs";

export default async (config: any) => {
  const task = process.argv[3];
  if (task === "start") {
  } else {
    buildSchema(config?.graphql?.build || {});
  }
};
