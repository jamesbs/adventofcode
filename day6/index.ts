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
        
        const makePoint = (coordinates: string) : Point => {
            const [x, y] = coordinates.split(',').map((v: string) => parseInt(v, 10));
            return { x: x, y: y };
        };
        
        function setLights(actionSet, instruction: string, bounds: Bounds, lights) {
            const action = actionSet[instruction];
            
            R.range(bounds.start.x, bounds.end.x + 1)
                .forEach((x: number) => {
                    R.range(bounds.start.y, bounds.end.y + 1).forEach((y: number) => {
                        lights[x][y] = action(lights[x][y]);
                    }); 
                });
           return lights;
        };
        
        const setLightsPt1 = R.partial(setLights, []);
        const getComponents = (instruction: string) : string[] => instruction.split(/ (\d*,?\d+)/).slice(0, -1);
        
        
        const lightField = R.transduce(
            R.map(R.compose(
            (components: string[]) => {
                // console.log(components, components[0], "true =>", actions[components[0]](true));
                return R.partial(setLights, [
                    {
                        'turn on': (current: boolean) => true,
                        'turn off': (current: boolean) => false,
                        'toggle': (current: boolean) => !current
                    },
                    components[0],
                    { start: makePoint(components[1]), end: makePoint(components[3]) }
                ]);
            },
            getComponents)),
            (lights, modifier) => { return modifier(lights) },
            R.range(0, 1000).map(x => R.range(0, 1000).map(y => false)),
            instructions
        );
        
        const areOn: number = R.flatten(lightField).filter((isOn: boolean) => isOn).length;
        
        console.log('part 1: ' + areOn);
        
                
        const brightField = R.transduce(
            R.map(R.compose(
            (components: string[]) => {
                return R.partial(setLights, [
                    {
                        'turn on': (current: number) => current + 1,
                        'turn off': (current: number) => Math.max(0, current - 1),
                        'toggle': (current: number) => current + 2
                    },
                    components[0],
                    { start: makePoint(components[1]), end: makePoint(components[3]) }
                ]);
            },
            getComponents)),
            (lights, modifier) => { return modifier(lights) },
            R.range(0, 1000).map(x => R.range(0, 1000).map(y => 0)),
            instructions
        );
        
        const totalBrightness: number = R.flatten(brightField).reduce(R.add);
            
       console.log('part 2:', totalBrightness);
    });