import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day15';

type Disc = {
    id: number;
    positions: number;
    current: number;
}

function parseInput(input: string[]): Disc[] {
    return input.map(line => {
        const [id, positions, _time, current] = line.match(/\d+/g)!.map(Number);
        return { id, positions, current };
    });
}

function gcd(a: number, b: number): number {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return Math.abs(a);
}

function lcm(a: number, b: number): number {
    return (a / gcd(a, b)) * b;
}

function earliestTime(discs: Disc[]): number {
    const sorted = discs.sort((a, b) => b.positions - a.positions);
    const constraints = sorted.map(disc => {
        const m = disc.positions;
        const a = ((-disc.current - disc.id) % m + m) % m;
        return { m, a };
    });

    let t = 0;
    let step = 1;
    for(const { m, a } of constraints) {
        while(t % m !== a) t+= step;
        step = lcm(step, m);
    }
    return t;
}

function partOne(input: string[]): number {
    const discs = parseInput(input);
    return earliestTime(discs);
}

function partTwo(input: string[]): number {
    const discs = parseInput(input);
    discs.push({ id: discs.length + 1, positions: 11, current: 0 });
    return earliestTime(discs);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(5);
    expect(partOne(getDayInput(day))).toBe(317371);

    expect(partTwo(getDayInput(day))).toBe(2080951);
});