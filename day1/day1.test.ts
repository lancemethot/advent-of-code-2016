import { debug, getDayInput } from '../utils';

const day = 'day1';

type Coord = {
    x: number;
    y: number;
}

function manhatten(a: Coord, b: Coord): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function turn(direction: string, leftOrRight: string): string {
    const leftTurns: string[] = 'nwse'.split('');
    const rightTurns: string[] = 'nesw'.split('');
    return leftOrRight === 'L' ?
            leftTurns[(leftTurns.indexOf(direction) + 1) % 4] :
            rightTurns[(rightTurns.indexOf(direction) + 1) % 4];
}

function partOne(input: string[]): number {
    let direction: string = 'n';
    let position: Coord = input.join('').split(',').map(s => s.trim()).reduce((acc, step) => {
        direction = turn(direction, step.substring(0, 1));
        switch(direction) {
            case 'n':
                acc.x += Number.parseInt(step.substring(1));
                break;
            case 's':
                acc.x -= Number.parseInt(step.substring(1));
                break;
            case 'e':
                acc.y += Number.parseInt(step.substring(1));
                break;
            case 'w':
                acc.y -= Number.parseInt(step.substring(1));
                break;
        }
        return acc;
    }, { x: 0, y: 0 } as Coord);
    return manhatten({ x: 0, y: 0}, position);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["R2, L3"])).toBe(5);
    expect(partOne(["R2, R2, R2"])).toBe(2);
    expect(partOne(["R5, L5, R5, R3"])).toBe(12);
    expect(partOne(getDayInput(day))).toBe(291);
});
