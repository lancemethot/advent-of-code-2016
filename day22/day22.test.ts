import { debug, getDayInput, getExampleInput, HeapItem, manhatten, MinHeap } from 'advent-of-code-utils';

const day = 'day22';

type Coord = {
    x: number;
    y: number;
}

type DiskNode = Coord & {
    size: number;
    used: number;
    avail: number;
    usedPct: number;
    movable?: boolean;
}

type Filesystem = DiskNode[][];

type Path = HeapItem & {
    position: Coord;
    steps: number;
}

function parseLine(line: string): DiskNode | undefined {
    const matches = line.match(/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/);
    if(matches !== null) {
        return {
            x: Number.parseInt(matches[1]),
            y: Number.parseInt(matches[2]),
            size: Number.parseInt(matches[3]),
            used: Number.parseInt(matches[4]),
            avail: Number.parseInt(matches[5]),
            usedPct: Number.parseInt(matches[6]),
            movable: true
        };
    }
    return undefined;
}

function parseInput(input: string[]): Filesystem {
    return input.reduce((acc, line) => {
        const diskNode = parseLine(line);
        if(diskNode !== undefined) {
            while(acc.length <= diskNode.x) acc.push([]);
            acc[diskNode.x].push(diskNode);
        }
        return acc;
    }, [] as Filesystem);
}

function key(diskNode: DiskNode): string {
    return `${diskNode.x},${diskNode.y}`;
}

function viablePair(a: DiskNode, b: DiskNode): boolean {
    return a.used > 0 && key(a) !== key(b) && a.used <= b.avail;
}

function neighbors(filesystem: Filesystem, position: Coord): DiskNode[] {
    return [
        { x: position.x - 1, y: position.y }, // left
        { x: position.x, y: position.y - 1 }, // up
        { x: position.x + 1, y: position.y }, // right
        { x: position.x, y: position.y + 1 }, // down
    ]
    .filter(coord => coord.x >= 0 && coord.y >= 0 && coord.x < filesystem.length && coord.y < filesystem[0].length)
    .filter(coord => filesystem[coord.x][coord.y].movable)
    .map(coord => filesystem[coord.x][coord.y]);
}

function astar(filesystem: Filesystem, start: Coord, goal: Coord): number {

    const heap: MinHeap<Path> = new MinHeap<Path>();
    const target = { x: goal.x - 1, y: goal.y };
    const visited: number[][] = filesystem.map(row => row.map(dn => Number.MAX_VALUE));

    heap.insert({ size: manhatten(start, target), position: start, steps: 0 });

    while(heap.size() > 0) {

        let next = heap.extractMin();

        if(next.position.x === target.x && next.position.y === target.y) {
            return next.steps;
        }

        // Neighbors
        neighbors(filesystem, next.position)
            .filter(move => !(move.x === goal.x && move.y === goal.y))
            .filter(move => move.used <= filesystem[next.position.x][next.position.y].size)
            .forEach(move => {
                let steps = next.steps + 1;
                if(steps < visited[move.x][move.y]) {
                    visited[move.x][move.y] = steps;
                    heap.insert({ size: steps + manhatten(move, target), position: move, steps });
                }
            });

    }

    return -1;

}

function shortestPath(filesystem: Filesystem): number {

    const S = { x: 0, y: 0 };
    let G = { x: filesystem.length - 1, y: 0 };

    // Mark walls as immovable
    filesystem.forEach(row => {
        row.forEach(dn => {
            const around = neighbors(filesystem, dn);
            if(around.every(near => near.size < dn.used))
                filesystem[dn.x][dn.y].movable = false;
        });
    });

    // Find empty node to move data around
    let E: Coord = filesystem.reduce((acc, row) => {
        acc.push(... row.reduce((acc, col) => {
            if(col.used === 0 && col.avail > 0) acc.push(col);
            return acc;
        }, [] as Coord[]));
        return acc;
    }, [] as Coord[])[0];

    // Strategy:
    // move G to (G.x-1, G.y) (left) (check what happens if y needs to change)
    // move E to (G.x-1, G.y) (in front of G)
    // repeat until G at S

    let steps = 0;
    while(!(G.x === S.x && G.y === S.y)) {
        steps += 1 + astar(filesystem, E, G);
        G = { x: G.x - 1, y: G.y };
        E = { x: G.x + 1, y: G.y };
    }

    return steps;

}

function partOne(input: string[]): number {
    let filesystem = parseInput(input);
    let pairs: Set<string> = new Set<string>();
    let flattened = filesystem.reduce((acc, row) => [... acc, ... row], [] as DiskNode[]);
    for(let i = 0; i < flattened.length; i++) {
        for(let h = 0; h < flattened.length; h++) {
            if(viablePair(flattened[i], flattened[h])) pairs.add(`${key(flattened[i])}|${key(flattened[h])}`);
        }
    }
    return pairs.size;
}

function partTwo(input: string[]): number {
    return shortestPath(parseInput(input));
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);
    
    expect(partOne(getDayInput(day))).toBe(952);

    expect(partTwo(getExampleInput(day))).toBe(7);
    expect(partTwo(getDayInput(day))).toBe(181);

});