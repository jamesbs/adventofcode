/// <reference path="../typings/node.d.ts"/>
const R = require('ramda');
const readFile = require('bluebird').promisify(require('fs').readFile);
const path = require('path');

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then((data: string) => {
        const strings = data.split('\n');
        
        const niceStrings: number = R.transduce(
            R.map((s: string) => {
                const matchVowels = s.match(/[aeiou]/ig);
                
                if(   matchVowels !== null && matchVowels.length >= 3
                   && s.search(/([a-z])\1/i) !== -1
                   && s.search(/(ab|cd|pq|xy)/i) === -1)
                    return 1;
                else
                    return 0;
            }),
            R.add,
            0,
            strings.slice(0,-1)
        );
        
        console.log(niceStrings);
    });