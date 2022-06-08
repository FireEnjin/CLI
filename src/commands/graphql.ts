import { BuildSchemaOptions } from "type-graphql";
import buildSchema from "../grapqhl/buildSchema";
import fs from "fs";

export default async () => {
  let fireenjinConfig: {
    graphql?: {
      build?: BuildSchemaOptions;
    };
  } = {};
  try {
    fireenjinConfig = JSON.parse(
      fs.readFileSync(`${process.cwd()}/.fireenjin`, "utf8")
    );
  } catch (error) {
    console.log("No .fireenjin found or error parsing");
  }
  const task = process.argv[3];
  if (task === "start") {
  } else {
    buildSchema(fireenjinConfig?.graphql?.build);
  }
};
