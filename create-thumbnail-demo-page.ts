import * as glob from 'npm:glob';

import { parse } from "https://deno.land/std/flags/mod.ts";

const { inDir, outFile } = parse(Deno.args)

if(!inDir)
  throw new Error('inDir is required');

const thumbnailPaths = await glob.glob('**/*.{jpg,jpeg,png,svg}', {
  cwd: inDir,
  absolute: true
});

const itemTemplate = (path) => `
<li>
  <a href="${path}">
  ${path}
  </a>
  <img src="${path}" />
  </li>
`;

const HTML = `
<html>
  <head>
    <title>Thumbnails</title>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      .thumbs {
        display: flex;
        flex-wrap: wrap;

        ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          flex-basis: 33%;

          li {
            margin: 10px;
            padding: 0;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 5px #ccc;
            width: 100%;
          }
        }
      }
      </style>
  </head>
  <body>
  <div class="thumbs">
    <ul>
    ${thumbnailPaths.map(itemTemplate).join('')}</div>
    </ul>
  </body>
</html>
`;

if (outFile){
  Deno.writeTextFile(
    outFile,
    HTML
  );

  Deno.exit();
}

console.log(HTML)
