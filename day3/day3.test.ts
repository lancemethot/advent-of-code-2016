import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day3';

type PotentialTriangle = number[];

function parseInput(input: string[]): PotentialTriangle[] {
    return input.filter(line => line.trim().length > 0).map(line => {
        return line.split(' ')
                   .map(block => block.trim())
                   .filter(block => block.length > 0)
                   .map(num => Number.parseInt(num)) as PotentialTriangle;
    });
}

function isValidTriangle(candidate: PotentialTriangle): boolean {
    return ((candidate[0] + candidate[1]) > candidate[2]) &&
           ((candidate[0] + candidate[2]) > candidate[1]) &&
           ((candidate[1] + candidate[2]) > candidate[0]);
}

function partOne(input: string[]): number {
    let potential: PotentialTriangle[] = parseInput(input);
    return potential.filter(isValidTriangle).length;
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getDayInput(day))).toBe(993);

    expect(partTwo(getDayInput(day))).toBe(0);
});