/// <reference path="../typings/node.d.ts" />
'use strict';
const readFile = require('bluebird').promisify(require('fs').readFile);
const path = require('path');
const R = require('ramda');

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then(function(data : string) {
        const floor : number = R.transduce(
            R.map((action : string) : number => {
                if(action === '(')
                    return 1;
                else
                    return -1;
            }),
            R.add,
            0,
            data.split(''));
        console.log(floor);     
    });
    