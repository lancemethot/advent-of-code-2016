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

type ShortMap = Map<string, Map<string, number>>;

type Route = HeapItem & {
    label: string;
    visited: string;
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

// Traveling Salesman
function tsp(map: ShortMap): number {
    const total = Array.from(map.keys()).length;
    const best: Map<string, number> = new Map<string, number>();
    const heap: MinHeap<Route> = new MinHeap<Route>();
    heap.insert({ size: 0, label: '0', visited: '1' + '0'.repeat(total - 1) });

    while(heap.size() > 0) {
        const next = heap.extractMin();

        if(next.visited.split('').every(chr => chr === '1')) {
            return next.size;
        }

        const key = `${next.visited}-${next.label}`;
        if(best.has(key) && best.get(key)! <= next.size) continue;
        best.set(key, next.size);

        Array.from(map.get(next.label)!.entries()).forEach(entry => {
            let i = Number.parseInt(entry[0]);
            if(next.visited[i] === '0') {
                let mask = next.visited.split('');
                mask.splice(i, 1, '1');
                heap.insert({ size: next.size + entry[1], label: entry[0], visited: mask.join('') })
            }
        });

    }

    return 0;
}

function partOne(input: string[]): number {
    const grid = parseInput(input);
    const labeled = grid.reduce((acc, row) => {
        acc.push(... row.filter(col => col.label));
        return acc;
    }, [] as Tile[]);

    // find distances starting at each label
    const shortest: ShortMap = new Map();
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

    return tsp(shortest);

}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(14);
    expect(partOne(getDayInput(day))).toBe(460);

    expect(partTwo(getDayInput(day))).toBe(0);

});