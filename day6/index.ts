/// <reference path="../typings/node.d.ts"/>
'using strict';
const path = require('path');
const readFile = require('bluebird').promisify(require('fs').readFile);
const R = require('ramda');

interface Point {
    x: number;
    y: number;
}

interface Bounds {
    start: Point;
    end: Point;
}

interface LightAction {
    (current: boolean): boolean;
}

readFile(path.join(__dirname, 'input.txt'), 'utf8')
    .then((data: string) => {
        const instructions = data.split('\n').slice(0, -1);
        const enclosingBounds = { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
        
        const actions = {
            'turn on': (current: boolean) => true,
            'turn off': (current: boolean) => false,
            'toggle': (current: boolean) => !current
        };
        
        const makePoint = (coordinates: string) : Point => {
            const [x, y] = coordinates.split(',').map((v: string) => parseInt(v, 10));
            return { x: x, y: y };
        };
        
        const setLights = (action: LightAction, bounds: Bounds, lights) => {
            R.range(bounds.start.x, bounds.end.x + 1)
                .forEach((x: number) => {
                    R.range(bounds.start.y, bounds.end.y + 1).forEach((y: number) => {
                        //console.log(`(${x},${y}) ${lights[x][y]} => ${action(lights[x][y])}`);
                        lights[x][y] = action(lights[x][y]);
                    }); 
                });
           return lights;
        };
        
        const transducer = R.map(R.compose(
            (components: string[]) => {
                // console.log(components, components[0], "true =>", actions[components[0]](true));
                return R.partial(setLights, [ 
                    actions[components[0]],
                    { start: makePoint(components[1]), end: makePoint(components[3]) }
                ]);
            },
            (instruction: string) : string[] => instruction.split(/ (\d*,?\d+)/).slice(0, -1)
        ));
        
        const lightField = R.transduce(
            transducer,
            (lights, modifier) => {
                return modifier(lights)
            },
            R.range(0, 1000).map(x => R.range(0, 1000).map(y => false)),
            instructions
        );
        
        const areOn: number = R.flatten(lightField).filter((isOn: boolean) => isOn).length;
        console.log(areOn);
    });