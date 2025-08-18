import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from 'advent-of-code-utils';

const day = 'day24';

enum TileType {
    WALL = '#',
    OPEN = '.'
}

type Coord = {
    x: number;
    y: number;
}

type Tile = Coord & {
    type: TileType;
    label?: string;
}

type TileGraph = Map<string, Map<string, number>>;

type Route = HeapItem & {
    label: string;
    visited: number; // bitmask
}

function parseInput(input: string[]): Tile[][] {
    return input.reduce((acc, line, x) => {
        acc.push(line.split('').map((chr, y) => {
            return {
                x,
                y,
                type: chr === TileType.WALL ? TileType.WALL : TileType.OPEN,
                label: (chr !== TileType.WALL && chr !== TileType.OPEN) ? chr : undefined
            } as Tile;
        }));
        return acc;
    }, [] as Tile[][]);
}

function moves(grid: Tile[][], position: Coord): Coord[] {
    return [
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y },
        { x: position.x,     y: position.y + 1 },
        { x: position.x,     y: position.y - 1 }
    ].filter(move => move.x >= 0 && move.x < grid.length && move.y >= 0 && move.y < grid[0].length)
     .filter(move => grid[move.x][move.y].type !== TileType.WALL);
}

function bfs(grid: Tile[][], start: Coord): number[][] {
    const distances: number[][] = grid.map(row => row.map(_col => Number.MAX_VALUE));
    const queue: { steps: number, position: Coord }[] = [ { steps: 0, position: start } ];

    while (queue.length > 0) {
        const next = queue.shift()!;

        if(distances[next.position.x][next.position.y] > next.steps) {
            distances[next.position.x][next.position.y] = next.steps;

            moves(grid, next.position).forEach(move => {
                if(distances[move.x][move.y] > next.steps + 1) {
                    queue.push({ steps: next.steps + 1, position: move });
                }
            });
        }
    }

    return distances;
}

function gridToGraph(grid: Tile[][]): TileGraph {
    const labeled = grid.reduce((acc, row) => {
        acc.push(... row.filter(col => col.label));
        return acc;
    }, [] as Tile[]);

    // find distances starting at each label
    const shortest: TileGraph = new Map();
    for(let i = 0; i < labeled.length; i++) {
        const distances = bfs(grid, labeled[i]);
        // record shortest distance between each label
        for(let h = 0; h < labeled.length; h++) {
            if(i !== h) {
                let target = labeled[h];
                let distance = distances[target.x][target.y];
                let label1 = labeled[i].label!;
                let label2 = labeled[h].label!;
                if(!shortest.has(label1)) {
                    shortest.set(label1, new Map<string, number>());
                }
                if(!shortest.has(label2)) {
                    shortest.set(label2, new Map<string, number>());
                }
                shortest.get(label1)!.set(label2, distance);
                shortest.get(label2)!.set(label1, distance);
            }
        }
    }

    return shortest;
}

// Traveling Salesman
function tsp(map: TileGraph, full: boolean = true): number {
    const total = Array.from(map.keys()).length;
    const fullMask = (1 << total) - 1;

    const best: Map<string, number> = new Map<string, number>();
    let bestCycle = Number.MAX_VALUE;

    const heap: MinHeap<Route> = new MinHeap<Route>();
    heap.insert({ size: 0, label: '0', visited: 1 });

    while (heap.size() > 0) {
        const next = heap.extractMin();

        if (!full && next.visited === fullMask) {
            return next.size;
        }

        if (full && next.visited === fullMask) {
            const cycleCost = next.size + map.get(next.label)!.get("0")!;
            if (cycleCost < bestCycle) bestCycle = cycleCost;
            continue;
        }

        // Prune if full cycle already found that's <= current path cost (can't improve)
        if (full && next.size >= bestCycle) continue;

        const key = `${next.visited}-${next.label}`;
        if (best.has(key) && best.get(key)! <= next.size) continue;
        best.set(key, next.size);

        Array.from(map.get(next.label)!.entries()).forEach(entry => {
            let i = Number.parseInt(entry[0]);
            const bit = 1 << i;
            if ((next.visited & bit) === 0) {
                heap.insert({ size: next.size + entry[1], label: entry[0], visited: next.visited | bit });
            }
        });
    }

    return full ? (bestCycle === Number.MAX_VALUE ? 0 : bestCycle) : 0;
}

function partOne(input: string[]): number {
    return tsp(gridToGraph(parseInput(input)), false);
}

function partTwo(input: string[]): number {
    return tsp(gridToGraph(parseInput(input)), true);
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(14);
    expect(partOne(getDayInput(day))).toBe(460);

    expect(partTwo(getDayInput(day))).toBe(668);

});