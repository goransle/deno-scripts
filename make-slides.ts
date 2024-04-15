import { Marked } from "npm:marked@12.0.1";
import { markedHighlight } from "npm:marked-highlight@2.1.1";

import hljs from "npm:highlight.js@11.9.0";

const { parse } = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang, _info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

const srcDir = "./src";

for await (const file of Deno.readDir("./src")) {
  if (file.name.endsWith(".md")) {
    const md = await Deno.readTextFile(`${srcDir}/${file.name}`);
    const html = await parse(md);

    await Deno.writeTextFile(
      `./slides/${file.name.replace(".md", ".html")}`,
      html,
    );
  }
}
