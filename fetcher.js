/*
Implement a small command line node app called fetcher.js 
which should take a URL as a command-line argument as well 
as a local file path and download the resource to the specified path. 
*/

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
  fs.access(localPath, fs.W_OK, (err) => { // Tests a user's permissions for the file specified by path.'fs.W_OK' check means file can be written by calling process.
    if (err) {
      console.log("Local path is not valid");
      process.exit();
    }
    if (fs.existsSync(localPath)) { // Test whether or not the given path exists. Returns true if the file exists, false otherwise.
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
  fs.writeFile(`${localPath}`, body, err => { //Asynchronously writes data to a file, replacing the file if it already exists. 
    if (err) return console.log(err);
    request(url, (err, response) => {
      const size = response.headers['content-length']; // The response header contains the date, size and type of file that the server is sending back.
      if (err) console.log('error:', err,);
      console.log(`Downloaded and saved ${size} bytes to .${localPath}`);
      process.exit();
    });
  });
};
