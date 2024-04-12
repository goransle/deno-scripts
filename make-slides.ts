import { parse } from 'npm:marked@12.0.1'

const srcDir = './src';

for await (const file of Deno.readDir('./src')) {
  if (file.name.endsWith('.md')) {
    const md = await Deno.readTextFile(`${srcDir}/${file.name}`);
    const html = await parse(md);

    await Deno.writeTextFile(`./slides/${file.name.replace('.md', '.html')}`, html);
  }
}

