/// <reference path="../typings/node.d.ts"/>
'using strict';
const path = require('path');
const readFile = require('bluebird').promisify(require('fs').readFile);
const R = require('ramda');

interface Point {
    name: string;
}

interface Edge {
    nodes: Pair<Point>;
    distance: number;
}

interface Pair<T> {
    first: T;
    second: T;
}

function createNodePair(node1: Point, node2: Point) : Pair<Point> {
    if(node1.name > node2.name)
        return { first: node2, second: node1 };
    else
        return { first: node1, second: node2 };
};

function nodePairName(nodes: Pair<Point>) : string {
    return nodes.first.name + '-' + nodes.second.name;
}

readFile(path.join(__dirname, 'input.txt'), 'utf8') 
    .then(data => {
        'use strict';
        
        const { nodes, edges } = 
            (nodesEdges => {
                nodesEdges.nodes = R.uniqBy(R.prop('name'), nodesEdges.nodes)
                
                return nodesEdges;
            })(
                data.split('\n').slice(0,-1)
                    .map((line: string) => {
                        'use strict'
                        const components = line.split(' ');
                        const node1 = { name: components[0] };
                        const node2 = { name: components[2] };
                        
                        let c =  {
                            nodes: [ node1, node2 ],
                            edge: { 
                                nodes: createNodePair(node1, node2), 
                                distance: parseInt(components[4], 10)
                            }
                        };
                        
                        return c;
                    })
                    .reduce((nodesEdges, nodeEdge) => {
                        nodesEdges.nodes = nodesEdges.nodes.concat(nodeEdge.nodes);
                        nodesEdges.edges[nodePairName(nodeEdge.edge.nodes)] = nodeEdge.edge;
                        return nodesEdges;
                    }, { nodes: [], edges: {} })                
            );
        
        const getDistance = (nodePair: Pair<Point>) : number => {
            if(nodePair.first.name === '')
                return 0;
            else
                return edges[nodePairName(nodePair)].distance;
        };

        const getMinDistance = (from, remainingNodes) : number => 
            R.apply(Math.min, 
                remainingNodes.map(to => {
                    'use strict';
                    const distance = getDistance(createNodePair(from, to));
                    
                    if(remainingNodes.length === 1)
                        return distance;
                    else
                        return distance + getMinDistance(to, R.difference(remainingNodes, [ to ]));
                })
            );
            
        const distance : number = getMinDistance({name:''}, nodes);
            
        console.log(distance);
    });