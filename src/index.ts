#!/usr/bin/env node

import * as fs from "fs";
import cloneSeedCommand from "./commands/cloneSeed";
import copyCommand from "./commands/copy";
import envCommand from "./commands/env";
import generateCommand from "./commands/generate";
import graphql from "./commands/graphql";
import migrateCommand from "./commands/migrate";
import prerender from "./commands/prerender";
import presetsCommand from "./commands/presets";
import runSeedCommand from "./commands/runSeed";
import triggers from "./commands/triggers";
import { BuildSchemaOptions } from "type-graphql";

if (process.argv.length > 2) {
  let config: {
    graphql?: {
      build?: BuildSchemaOptions;
    };
  } = {};
  try {
    config = JSON.parse(fs.readFileSync(`${process.cwd()}/.fireenjin`, "utf8"));
  } catch (error) {
    console.log("No .fireenjin found or error parsing");
  }
  if (process.argv[2] === "copy") {
    copyCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "gql") {
    graphql(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "generate") {
    generateCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "seed:clone") {
    cloneSeedCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "seed") {
    runSeedCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "presets") {
    presetsCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "env") {
    envCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "migrate") {
    migrateCommand(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "new") {
    console.log("This command is being reengineered...");
  } else if (process.argv[2] === "prerender") {
    prerender(config).catch((err) => console.log(err));
  } else if (process.argv[2] === "triggers") {
    triggers(config).catch((err) => console.log(err));
  } else {
    console.log(`${process.argv[2]} command doesn't exist!`);
  }
} else {
  const docs = fs.readFileSync(`${__dirname}/../README.md`, "utf8");
  console.log(docs);
}
