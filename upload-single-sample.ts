import { parse } from "https://deno.land/std/flags/mod.ts";
import { join } from "https://deno.land/std/path/posix.ts";
import { run } from "https://deno.land/x/run_simple/mod.ts";

const { args } = Deno;
const parsedArgs = parse(args);
const requiredArgs = ["path", "sample"];

if (!requiredArgs.every((arg) => parsedArgs[arg])) {
  throw new Error(
    "Missing one or more of required arguments: " + requiredArgs.toString(),
  );
}

const variants: string[] = parsedArgs.variants.split(",") ||
  ["", "nonav", "embed"];

const { path, sample } = parsedArgs;
const commands = variants.map(async (sampleType) => {
  const relativeLocation = sample.replace("samples/", `samples/${sampleType}/`);
  console.log(relativeLocation);
  const output = join("demos/samples/", relativeLocation);

  console.log(output);

  const stdout = await run([
    "node",
    "./bin/cli.js",
    "demo-deploy",
    "-input",
    join(path, relativeLocation),
    "-bucket",
    "assets.highcharts.com",
    "-output",
    output,
    "-make-redirects",
    "-AWSProfile",
    "default"
  ]);
  console.log(stdout);
});

await Promise.all(commands);
