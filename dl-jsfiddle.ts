import { parse } from "https://deno.land/std@0.203.0/flags/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const parsedArgs = parse(Deno.args);

const { fiddle } = parsedArgs;

const TEMPLATE = (
  {
    html,
    css,
    js,
  }: Record<"html" | "css" | "js", string>,
) =>
  `<!DOCTYPE html>
<body>
${html}
<style>
${css}
</style>
<script type="${/import.*from/.test(js) ? "module" : ""}">
${js}
</script>
</body>
`;

if (fiddle) {
  const res = await fetch(`https://jsfiddle.net/${fiddle}`);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, "text/html");

  const firstScript = doc?.querySelector("script")?.innerHTML;

  if (firstScript) {
    const tempFilePath = await Deno.makeTempFile();

    await Deno.writeTextFile(
      tempFilePath,
      `${firstScript} export default EditorConfig;`,
    );

    const { css, html, js } = (await import(`file://${tempFilePath}`))
      .default.value;

    console.log(TEMPLATE({ css, html, js }));

    await Deno.remove(tempFilePath);
  }
}
