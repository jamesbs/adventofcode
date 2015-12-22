/// <reference path="../typings/node.d.ts"/>
const R = require('ramda');
const readFile = require('bluebird').promisify(require('fs').readFile);
const path = require('path');

interface Point {
    x: number;
    y: number;
}

function move(point: Point, action: string) : Point {
    if (action === '>')
        return { x: point.x + 1, y: point.y };
    else if (action === 'v')
        return { x: point.x, y: point.y - 1 };
    else if (action === '<')
        return { x: point.x - 1, y: point.y };
    else
        return { x: point.x, y: point.y + 1 };
}

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then((data: string) => {
        const presentCoordinates = data.split('')
            .reduce((coordinates: Point[], action: string) : Point[] => {
                return R.prepend(
                    move(coordinates[0], action), 
                    coordinates);
            }, [ { x: 0, y: 0 } ]);
            
        const results = R.countBy(({ x, y }: Point) : string => '(' + x + ',' + y + ')', presentCoordinates);
        const gt1 = Object.keys(results).length;
        
        console.log(gt1);
    });