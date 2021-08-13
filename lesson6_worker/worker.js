const { workerData, parentPort } = require('worker_threads');
const fs = require('fs')

const data = fs.readFileSync(workerData.filePath,'utf8')
let founded = data.match(new RegExp(`${workerData.searchString}`,'g'))
parentPort.postMessage({ result: `Search results: ${founded}` });