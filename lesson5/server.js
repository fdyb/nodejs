const http = require("http");
const path = require("path");
const fs = require("fs");

http
  .createServer((request, response) => {
    if (request.method === "GET") {
      let filePath = '';
      switch (request.url) {
        case "/style.css":
          filePath = path.join(__dirname, "style.css");
          readStream = fs.createReadStream(filePath);
          response.writeHead(200, { "Content-Type": "text/css" });
          readStream.pipe(response);
          break;
        default:
          filePath = path.join(__dirname, "index.html");
          readStream = fs.createReadStream(filePath);
          response.writeHead(200, { "Content-Type": "text/html" });
          readStream.pipe(response);
      }
    } else {
      if (request.method === "POST") {
        let receivedData = "";
        request.on("data", (chunk) => {
          receivedData += chunk;
        });
        request.on("end", () => {
          let data = JSON.parse(receivedData);
          let filePath = path.join(
            data.parentDir === "/" ? __dirname : data.parentDir,
            data.element
          );
          if (data.element === 'home') {
            filePath = path.dirname(data.parentDir)
          }

          if (fs.lstatSync(filePath).isFile()) {
            readStream = fs.createReadStream(filePath);
            response.writeHead(200, { "Content-Type": "text/html" });
            readStream.pipe(response);
          } else {
            data = {
              parentDir: filePath,
              list: fs.readdirSync(filePath),
            };
            response.writeHead(200, { "Content-Type": "json" });
            console.log(JSON.stringify(data));
            response.end(JSON.stringify(data));
          }
        });
      } else {
        response.end("Method Not Allowed");
      }
    }
  })
  .listen(3000, "localhost");
