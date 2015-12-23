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
        const actions = data.split('');
        const presentCoordinates = (startingCoordinates : Point[]) =>
            actions.reduce(
                (coordinates: Point[], action: string) : Point[] =>
                    R.prepend(
                        move(coordinates[startingCoordinates.length - 1], action), 
                        coordinates), 
                startingCoordinates);

        const numHousesGt1 = R.compose(
            (results) => Object.keys(results).length,
            R.countBy(({ x, y }: Point) : string => `(${x},${y})`),
            presentCoordinates
        );
        console.log('part 1: ' + numHousesGt1([ { x: 0, y: 0 } ]));
        console.log('part 2: ' + numHousesGt1([ { x: 0, y: 0 }, { x: 0, y: 0 } ]));
    });