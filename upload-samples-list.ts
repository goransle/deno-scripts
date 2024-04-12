import { readLines } from "https://deno.land/std@0.102.0/io/bufio.ts";
import { run } from "https://deno.land/x/run_simple/mod.ts";

for await (const line of readLines(Deno.stdin)) {
  if(line.length){
    console.log(line)
    if(Deno.args.includes('--dryrun')){
      console.log('Pretending to upload ' + line);
    }
    else {
      if(Deno.args.includes('--dryrun')){
        console.log('Pretending to upload ' + line);
      }
      else {
        console.log(line)
        const cmd = `upload-single-sample --path tmp/samples/ --sample ${line.replace(/^samples\//, '')}`;

          const stdout = await run(cmd)
        .catch(error => console.error(error));

        console.log(stdout);
      }
    }
  }
}
