/// <reference path="../typings/node.d.ts" />
const md5 = require('md5');
/*
function * getKey() {
    let key = 0;

    while ( true ) {
        yield key;
        key += 1
    }
}
*/
const input: string = 'bgvyzdsv';
let p1Key : number = -1;
let p2Key : number = -1;
let key = 0;

while(p2Key === -1 || p1Key === -1) {
    const hash = md5(input + key);
    
    if(p1Key === -1 && hash.slice(0, 5) === '00000')
        p1Key = key;
        
    if(p2Key === -1 && hash.slice(0, 6) === '000000')
        p2Key = key;
        
    key += 1;
}

console.log('part 1: ' + p1Key);
console.log('part 2: ' + p2Key);

//console.log(getNum() - 1);