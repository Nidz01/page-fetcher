const request = require('request');
const fs = require("fs");
const readline = require('readline');

const url = process.argv[2];
const localPath = process.argv[3];

const stdin = process.stdin;
stdin.setRawMode(true);
stdin.setEncoding('utf8');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

request(url, (err, response, body) => {
  if (err) console.log('error:', err);
  if (!response || response.statusCode !== 200) {
    console.log('Error! Valid url not provided');
    process.exit();
  }
  fs.access(localPath, fs.W_OK, (err) => {
    if (err) {
      console.log("Local path is not valid");
      process.exit();
    }
    if (fs.existsSync(localPath)) {
      rl.question('local path already exists. \nOverwrite file? (Y or N + enter) ', (key) => {
        if (key === 'Y') {
          writeFile(body);
        }
        if (key === 'N') {
          console.log('no file written\n');
          process.exit();
        }
      });
    } else {
      writeFile(body);
    }
  });
});
  
const writeFile = (body) => {
  fs.writeFile(`${localPath}`, body, err => {
    if (err) return console.log(err);
    request(url, (err, response) => {
      const size = response.headers['content-length'];
      if (err) console.log('error:', err,);
      console.log(`Downloaded and saved ${size} bytes to .${localPath}`);
      process.exit();
    });
  });
};