import { debug, getDayInput, getExampleInput, HeapItem, MinHeap} from 'advent-of-code-utils';

const day = 'day13';

enum Tile {
    WALL = '#',
    OPEN = '.'
}

type Coord = {
    x: number;
    y: number;
    tile?: Tile;
}

type Route = HeapItem & {
    position: Coord;
    visited: Coord[];
}

function parseInput(input: string[]): { favorite: number, exit: Coord } {
    const favorite = Number.parseInt(input[0]);
    const coord = input[1].split(',');
    return {
        favorite,
        exit: {
            x: Number.parseInt(coord[0]),
            y: Number.parseInt(coord[1])
        }
    };
}

function popcountBig(n: bigint): number {
  let count = 0;
  let v = n < 0n ? -n : n; // defensive; coords are non-negative in AoC
  while (v !== 0n) {
    v &= (v - 1n);
    count++;
  }
  return count;
}

function isWallBig(x: number, y: number, seed: number | bigint): boolean {
  const xb = BigInt(x);
  const yb = BigInt(y);
  const sb = typeof seed === 'bigint' ? seed : BigInt(seed);

  const sum = (xb * xb) + (3n * xb) + (2n * xb * yb) + yb + (yb * yb) + sb;
  return (popcountBig(sum) % 2) === 1;
}

function createGrid(seed: number): Coord[][] {
    const grid: Coord[][] = [];
    for(let x = 0; x < seed; x++) {
        const row: Coord[] = [];
        for(let y = 0; y < seed; y++) {
            row.push({ x, y, tile: isWallBig(x, y, seed) ? Tile.WALL : Tile.OPEN });
        }
        grid.push(row);
    }
    return grid;
}

function moves(grid: Coord[][], position: Coord, visited: Coord[]): Coord[] {
    return [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x,     y: position.y - 1 },
        { x: position.x,     y: position.y + 1 }
    ].filter(move => move.x >= 0 && move.x < grid.length &&
        move.y >= 0 && move.y < grid[0].length
    ).filter(move => grid[move.x][move.y].tile === Tile.OPEN)
     .filter(move => visited.every(step => !(move.x === step.x && move.y === step.y)));
}

function dijkstra(grid: Coord[][], start: Coord, exit: Coord): number {

    let heap: MinHeap<Route> = new MinHeap<Route>();
    heap.insert({ size: 0, position: start, visited: [ start ] });

    while(heap.size() > 0) {
        let route: Route = heap.extractMin();

        if(route.position.x === exit.x && route.position.y === exit.y) {
            return route.visited.length - 1;
        }

        moves(grid, route.position, route.visited).forEach(move => {
            let newRoute: Route = { size: route.size + 1, position: move, visited: [ ...route.visited, move ]};
            heap.insert(newRoute);
        });

    }

    return 0;

}

function partOne(input: string[]): number {
    const { favorite, exit } = parseInput(input);
    const grid = createGrid(favorite);
    return dijkstra(grid, { x: 1, y: 1 }, exit);
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(11);
    expect(partOne(getDayInput(day))).toBe(90);

    expect(partTwo(getDayInput(day))).toBe(0);
});