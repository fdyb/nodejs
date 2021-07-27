const colors_module = require("colors/safe")

const colors = [colors_module.red, colors_module.yellow, colors_module.green]

function isNumber(val) {
    return /^\d+$/.test(val)
}

function simpleNumbers(n) {
    let inputArr = []
    for (let i = 1; i <= n; i++) {
        inputArr.push(i)
    }
    let p = 2
    while (p < n) {
        inputArr = inputArr.filter(item => !(((item % p) == 0) && (item > p)))
        p = inputArr.find(item => (item>p))
    }
    return inputArr
}

const N = process.argv[2]

if (!isNumber(N)) {
    console.log('enter number value')
}
else {
    let result = simpleNumbers(parseInt(N))
    if (result.length == 0) {
        console.log(colors[0](`no simple number in 0..${N}`))
    }
    let x = 0
    result.forEach(item => {
        console.log(colors[x](item));
        x = (x+1) == 3? 0 : x+1;
    })
}

