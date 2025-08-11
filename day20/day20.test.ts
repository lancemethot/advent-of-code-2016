import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day20';

type IpRange = {
    start: number;
    end: number;
}

function parseInput(input: string[]): IpRange[] {
    return input.reduce((acc, line) => {
        let matches = line.match(/(\d+)-(\d+)/);
        acc.push( { start: Number(matches![1]), end: Number(matches![2])})
        return acc;
    }, [] as IpRange[]);
}

function mergeOverlaps(ips: IpRange[]): IpRange[] {
    ips.sort((a, b) => a.start - b.start);
    const merged: IpRange[] = [];
    let current = ips[0];

    for (let i = 1; i < ips.length; i++) {
        if (current.end >= ips[i].start) {
            current.end = Math.max(current.end, ips[i].end);
        } else {
            merged.push(current);
            current = ips[i];
        }
    }
    merged.push(current);
    return merged;
}

function partOne(input: string[]): number {
    const ranges = parseInput(input);
    const merged = mergeOverlaps(ranges);
    let lowest = 0;
    for(let i = 0; i < merged.length; i++) {
        if(lowest < merged[i].start) break;
        else lowest = merged[i].end + 1;
    }
    return lowest;
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(3);
    expect(partOne(getDayInput(day))).toBe(32259706);

    expect(partTwo(getDayInput(day))).toBe(0);
});
