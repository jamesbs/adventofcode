/// <reference path="../typings/node.d.ts" />
'use strict';
const readFile = require('bluebird').promisify(require('fs').readFile);
const path = require('path');
const R = require('ramda');

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then(function(data : string) {
        const actions = data.split('');
        
        const { hit, floor } = R.transduce(
            R.map((action: any[]) => {
                return {
                    pos: action[0],
                    floor: (action[1] === '(') ? 1 : -1
                };
            }),
            (a, b) => {
                a.floor = R.add(a.floor, b.floor)
                
                if(a.floor === -1 && a.hit === undefined) {
                    a.hit = b.pos;
                };

                return a;
            },
            { floor: 0 },
            R.zip(R.range(1, actions.length + 1), actions);
            
        console.log('part 1: ' + floor); 
        console.log('part 2: ' + hit);    
    });
    