import { parse } from "https://deno.land/std@0.197.0/flags/mod.ts";
import { readCSV, readCSVObjects } from "https://deno.land/x/csv/mod.ts";
const { args } = Deno;
const parsedArgs = parse(args);

const requiredArgs = [
  "input",
];

requiredArgs.forEach((arg) => {
  if (!parsedArgs[arg]) {
    throw new Error("Missing required argument: " + arg);
  }
});

const { input, output, columns } = parsedArgs;

const csvFile = await Deno.open(input);
const outputArray = [];

for await (const obj of readCSVObjects(csvFile)) {
  if (columns) {
    const filtered = columns.split(",").reduce(
      (carry: Record<string, string>, col: string) => {
        if(obj[col])
            carry[col] = obj[col];

        return carry;
      },
      {}
    );
    outputArray.push(filtered);
  } else {
    outputArray.push(obj);
  }
}

csvFile.close();

if(!output){
  console.log(JSON.stringify(outputArray));
}


Deno.exit();
