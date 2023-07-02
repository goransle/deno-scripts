const detailsTemplate = `---
name: Basic line
authors:
  - Torstein Hønsi
js_wrap: b
alt_text: >-
  Highcharts basic line chart JavaScript example displays graph plot of solar
  employment growth areas over time.
tags:
  - Highcharts demo
categories:
  - Line charts
...
`;

const htmlTemplate = `<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>
`;

const files = {
    'demo.details': detailsTemplate,
    'demo.html': htmlTemplate,
    'demo.css': '',
    'demo.js' : ''
};

Object.entries(files).forEach(([fileName, content]) =>{
    Deno.writeTextFileSync(fileName, content);
});

Deno.exit(0);
