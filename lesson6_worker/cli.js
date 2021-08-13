const fs = require('fs')
const yargs = require('yargs')
const inquirer = require('inquirer');
const { join } = require('path');
const { Worker } = require('worker_threads')

function searchInFile(workerData) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData });
  
      worker.on('message', resolve);
      worker.on('error', reject);
    })
  }
  

const options = yargs
	.usage("Usage: -d <dir>")
	.option("d", { alias: "dir", describe: "Directory", type: "string", demandOption: true })
	.argv;

let curDir = options.dir;
let list = [];

try {
    list = fs.readdirSync(curDir)
}
catch(err) {
    curDir = process.cwd()
    list = fs.readdirSync(curDir)
    console.log(`No such directory... Directory set to ${curDir}`);
} 

const getFile = (list) => {

    let isDir = true;

     inquirer.prompt([
        {
            name:'element',
            type:'list',
            message:'Choose file:',
            choices: list
        }
    ])
    .then(answer => answer.element)
    .then(element => {
        let filePath = join(curDir,element);
        if (fs.lstatSync(filePath).isFile()) {
            inquirer.prompt([
                {
                    name:'search',
                    type:'string',
                    message:'Enter search string',
                }
            ])
            .then(answer => answer.search)
            .then(searchString => {
                searchInFile({searchString: searchString, filePath: filePath})
                .then(result => console.log(result)) 
                .catch(err => console.error(err));
            })
            isDir = false;
        }
        else {
            curDir = join(curDir,element)
            list = fs.readdirSync(curDir)
            getFile(list)  
        }
    } 
    )

    return isDir;
}

isDir = getFile(list)



