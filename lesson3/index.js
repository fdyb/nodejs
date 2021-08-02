const fs = require("fs");

const ip1 = /89.123.1.41/,
  ip2 = /34.48.240.111/,
  FileName1 = "./89.123.1.41_requests.log",
  FileName2 = "./34.48.240.111_requests.log",
  readStream = fs.createReadStream("./access.log", {
    encoding: "utf8",
    highWaterMark: 64 * 1024,
  }),
  writeStream1 = fs.createWriteStream(FileName1, {
    flags: "a",
    encoding: "utf8",
  }),
  writeStream2 = fs.createWriteStream(FileName2, {
    flags: "a",
    encoding: "utf8",
  });

let readed = 0;
var block = 0;
fs.stat('./access.log', (err,stats) => block = stats.size/50);
let counter = 1;
readStream.on("data", (chunk) => {
  let arr = chunk.split("\n");
  arr.forEach((item) => {
    if (ip1.test(item)) {
      writeStream1.write(item + "\n");
    }
    if (ip2.test(item)) {
      writeStream2.write(item + "\n");
    }
  });
  readed = readed + 64*1024;
  if (readed > block*counter) {
      counter++
      process.stdout.write(`#`);
    }
});

readStream.on("end", () => {
  console.log("\n Close reading stream.");
  writeStream1.end(() => console.log(`File ${FileName1} writing finished.`));
  writeStream2.end(() => console.log(`File ${FileName2} writing finished.`));
  fs.stat(FileName1, (err,stats) => console.log(`File ${FileName1} size ${stats.size} bytes`));
  fs.stat(FileName2, (err,stats) => console.log(`File ${FileName2} size ${stats.size} bytes`));
});
