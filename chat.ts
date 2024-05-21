import { parse as parseToml } from "https://deno.land/std@0.224.0/toml/parse.ts";
import { Buffer } from "node:buffer";

const tomlFile = '/Users/goranslettemark/.tabby-client/agent/config.toml';


const question = Deno.args[0];

console.log('Q:', question);

const {
  server: {
    endpoint,
    token
  }
} = await Deno.readTextFile(tomlFile).then(
  (content) => parseToml(content)
);

const headers = new Headers();
headers.set('Authorization', `Bearer ${token}`);

const healthCheck = await fetch(
  endpoint + '/v1/health',
  { headers }
).then(res => res.json());

if (healthCheck){
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'text/event-stream');

  const reply = await fetch(
    endpoint + '/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({
        messages: [
          {
            content: question,
            role: "user"
          }
        ]
      })
    }
  );

  if (reply.body){

    let runningLine = 'A: ';

    for await(const chunk of reply.body){

      // read chunk as json
      const buf = new Buffer(chunk).toString('utf-8');

      const json = JSON.parse(buf.replace('data: ', ''));

      const latestWord = json.choices[0].delta.content;


      runningLine += latestWord;
      if (runningLine.length > 80){
        console.log(runningLine);
        runningLine = '';
      }
    }

    console.log(runningLine);
  }

}



