import { parse } from "https://deno.land/std@0.110.0/flags/mod.ts";
const { args } = Deno;
const { filepath, replace, replacement, help } = parse(args);

if (help) {
  console.log("Useful help text");
  Deno.exit();
}

if (!filepath || !replace) {
  console.log('Required arguments: "--filepath" or "--replace" not found');
  Deno.exit(5);
}

const csvText = await Deno.readTextFile(filepath);
console.log(csvText.replace(new RegExp(replace, "gm"), replacement));
