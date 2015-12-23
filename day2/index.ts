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
        const calcWrappingPaperArea = ( { l, w, h }: Box ): number => {
            return 2 * l * w + 2 * w * h + 2 * h * l + Math.min(l * w, l * h, h * w);
        };
        
        const calcRibbonLength = ( { l, w, h }: Box ): number => {
            return l * w * h + 2 * Math.min(l + w, l + h, h + w);  
        };
        
        const transducer = R.map(R.compose(
            ( box: Box ) => ({
                area: calcWrappingPaperArea(box),
                length: calcRibbonLength(box)
            }),
            (dimensions: number[]) : Box => ({ l: dimensions[0], w: dimensions[1], h: dimensions[2] }),
            R.map(R.partialRight(parseInt, [ 10 ])), // convert string dimensions to number
            (line: string) : string[] => line.split('x')
        ));
        
        const { area, length } = R.transduce(
            transducer,
            (a, b) => {
                return ({ area: R.add(a.area, b.area), length: R.add(a.length, b.length) });
            },
            { area: 0, length: 0 },
            data.split('\n').slice(0, -1)
        );
        
        console.log('part 1: ' + area);
        console.log('part 2: ' + length);
    });