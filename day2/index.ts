/// <reference path="../typings/node.d.ts"/>
const R = require('ramda');
const readFile = require('bluebird').promisify(require('fs').readFile);
const path = require('path');

interface Box {
    l: number;
    w: number;
    h: number;
}

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then((data: string) => {
        const input : string[] = data.split('\n').slice(0, -1);
        
        const calculateArea = ( { l, w, h }: Box ): number => {
            return 2 * l * w + 2 * w * h + 2 * h * l + Math.min(l * w, l * h, h * w);
        }; 
        
        const transducer = R.map(R.compose(
            calculateArea, // calculate area of box
            (dimensions: number[]) : Box => ({ l: dimensions[0], w: dimensions[1], h: dimensions[2] }),
            R.map(R.partialRight(parseInt, [ 10 ])), // convert string dimensions to number
            (line: string) : string[] => line.split('x')
        ));
        
        const final = R.transduce(
            transducer,
            R.add,
            0,
            input
        );
        
        console.log(final);
    });