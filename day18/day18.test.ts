import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day18';

enum Tile {
    SAFE = '.',
    TRAP = '^'
}

function parseInput(input: string[]): string {
    return input[0];
}

function isTrap(tiles: string): boolean {
    return ['^^.', '.^^', '^..', '..^'].includes(tiles);
}

function generate(text: string): string {
    let next: string = '';
    let check = `.${text}.`;
    for(let i = 1; i < check.length - 1; i++) {
        next += isTrap(check.substring(i - 1, i + 2)) ? Tile.TRAP : Tile.SAFE;
    }
    return next;
}

function partOne(input: string[], rows: number): number {
    let grid: string[] = [ parseInput(input) ];
    for(let i = 1; i < rows; i++) {
        grid.push(generate(grid[i - 1]));
    }
    return grid.reduce((acc, row) => acc + row.split('').filter(c => c === Tile.SAFE).length, 0);
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(['..^^.'], 3)).toBe(6);
    expect(partOne(['.^^.^.^^^^'], 10)).toBe(38);

    expect(partOne(getDayInput(day), 40)).toBe(2016);

    expect(partTwo(getDayInput(day))).toBe(0);
});