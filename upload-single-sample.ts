import { parse } from "https://deno.land/std/flags/mod.ts";
import { join } from "https://deno.land/std/path/posix.ts";
const { args, stdout, run } = Deno;

const parsedArgs = parse(args);
const requiredArgs = ['path', 'sample'];

if (!requiredArgs.every(arg => parsedArgs[arg])) {
    throw new Error('Missing one or more of required arguments: '+ requiredArgs.toString());
}

const variants: string[] = parsedArgs.variants.split(',') || ['', 'nonav', 'embed'];

const { path, sample } = parsedArgs;
const commands = variants.map(sampleType => {
    const relativeLocation = sample.replace('samples/', `samples/${sampleType}/`);

    return run({
        cmd: [
            'node',
            './bin/cli.js',
            'demo-deploy',
            '-input',
            join(path, relativeLocation),
            '-bucket',
            'assets.highcharts.com',
            '-output',
            join('demos', relativeLocation),
            '-make-redirects',
            '-AWSProfile',
            'default'
        ],
        stdout: 'piped'
    });
});

for await (const cmd of commands) {
    const { code } = await cmd.status()
    if (code === 0) {
        const rawOutput = await cmd.output();
        await stdout.write(rawOutput);
    }
    cmd.close();
}
