#!/usr/bin/env node

import * as fs from "fs";
import cloneSeedCommand from "./commands/cloneSeed";
import copyCommand from "./commands/copy";
import envCommand from "./commands/env";
import generateCommand from "./commands/generate";
import migrateCommand from "./commands/migrate";
import presetsCommand from "./commands/presets";
import runSeedCommand from "./commands/runSeed";
import randomSeedCommand from "./commands/randomSeed";
import triggers from "./commands/triggers";

if (process.argv.length > 2) {
  if (process.argv[2] === "copy") {
    copyCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "generate") {
    generateCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "seed:random") {
    randomSeedCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "seed:clone") {
    cloneSeedCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "seed") {
    runSeedCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "presets") {
    presetsCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "env") {
    envCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "migrate") {
    migrateCommand().catch((err) => console.log(err));
  } else if (process.argv[2] === "new") {
    console.log("This command is being reengineered...");
  } else if (process.argv[2] === "triggers") {
    triggers().catch((err) => console.log(err));
  } else {
    console.log(`${process.argv[2]} command doesn't exist!`);
  }
} else {
  const docs = fs.readFileSync(`${__dirname}/../README.md`, "utf8");
  console.log(docs);
}
