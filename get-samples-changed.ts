import { run } from "https://deno.land/x/run_simple@2.1.0/mod.ts";
const { args } = Deno;

try {
  const [from, to] = args;

  if (!from || !to) {
    throw new Error(
      "Missing arguments! Usage: get-samples-changed newTagOrBranch oldTagOrBranch",
    );
  }

  const cmd = `git diff --name-only ${from} ${to}`;

  const diffingFiles = await run(cmd);

  const returnList = new Set<string>();
  diffingFiles.split("\n").reduce((carry, file: string) => {
    const match = file.match(/samples\/.+(?=\/demo\.)/);
    if (match) {
      carry.add(match[0]);
    }

    return carry;
  }, returnList);

  console.log(Array.from(returnList).join('\n'));
} catch (error) {
  console.error(error.message);
}
