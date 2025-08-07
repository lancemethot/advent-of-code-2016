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

// Transpose columns into triangles
function transform(potential: PotentialTriangle[]): PotentialTriangle[] {
    let candidates: PotentialTriangle[] = [];
    for(let i = 0; i < potential.length; i++) {
        if((i + 1) % 3 === 0) {
            candidates.push([potential[i-2][0], potential[i-1][0], potential[i][0]] as PotentialTriangle);
            candidates.push([potential[i-2][1], potential[i-1][1], potential[i][1]] as PotentialTriangle);
            candidates.push([potential[i-2][2], potential[i-1][2], potential[i][2]] as PotentialTriangle);
        }
    }
    return candidates;
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
    let potential: PotentialTriangle[] = parseInput(input);
    potential = transform(potential);
    return potential.filter(isValidTriangle).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getDayInput(day))).toBe(993);

    expect(partTwo(getDayInput(day))).toBe(1849);
});