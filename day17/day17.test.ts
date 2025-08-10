import { debug, getDayInput, HeapItem, MinHeap } from 'advent-of-code-utils';
import { createHash } from 'crypto';

const day = 'day17';

type Coord = {
    x: number;
    y: number;
}

type Path = HeapItem & {
    position: Coord;
    route: string;
}

function parseInput(input: string[]): string {
    return input[0];
}

function md5(text: string): string {
    return createHash('md5').update(text).digest('hex').toLocaleLowerCase();
}

function moves(position: Coord, passcode: string, route: string): { position: Coord, direction: string }[] {
    const hash = md5(`${passcode}${route}`).substring(0, 4);
    return [
        { x: position.x - 1, y: position.y },
        { x: position.x + 1, y: position.y },
        { x: position.x,     y: position.y - 1 },
        { x: position.x,     y: position.y + 1 }
    ].reduce((acc, move, index) => {
        if(move.x >= 0 && move.x < 4 && move.y >= 0 && move.y < 4) {
            let c = hash[index];
            if('bcdef'.includes(c)) acc.push({ position: move, direction: 'UDLR'[index] });
        }
        return acc;
    }, [] as { position: Coord, direction: string }[]);
}

function dijkstra(passcode: string, shortest: boolean = true): string {
    const heap: MinHeap<Path> = new MinHeap<Path>();
    const paths: Set<string> = new Set<string>();

    heap.insert({ size: 0, position: { x: 0, y: 0 }, route: '' });

    while(heap.size() > 0) {
        let next = heap.extractMin();

        if(next.position.x === 3 && next.position.y === 3) {
            if(shortest) return next.route;
            else paths.add(next.route);
            continue;
        }

        moves(next.position, passcode, next.route).forEach(move => {
            if(!paths.has(`${next.route}${move.direction}`)) {
                heap.insert({ size: next.size + 1, position: move.position, route: next.route + move.direction });
            }
        });

    }

    return Array.from(paths.keys()).sort((a, b) => b.length - a.length).shift() as string;
}

function partOne(input: string[]): string {
    return dijkstra(parseInput(input), true);
}

function partTwo(input: string[]): number {
    return dijkstra(parseInput(input), false).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(dijkstra('ihgpwlah')).toBe('DDRRRD');
    expect(dijkstra('kglvqrro')).toBe('DDUDRLRRUDRD');
    expect(dijkstra('ulqzkmiv')).toBe('DRURDRUDDLLDLUURRDULRLDUUDDDRR');

    expect(partOne(getDayInput(day))).toBe('RDDRULDDRR');

    expect(dijkstra('ihgpwlah', false).length).toBe(370);
    expect(dijkstra('kglvqrro', false).length).toBe(492);
    expect(dijkstra('ulqzkmiv', false).length).toBe(830);

    expect(partTwo(getDayInput(day))).toBe(766);
});