import { debug, getDayInput } from 'advent-of-code-utils';

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
}

type Filesystem = DiskNode[][];

function parseLine(line: string): DiskNode | undefined {
    const matches = line.match(/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/);
    if(matches !== null) {
        return {
            x: Number.parseInt(matches[1]),
            y: Number.parseInt(matches[2]),
            size: Number.parseInt(matches[3]),
            used: Number.parseInt(matches[4]),
            avail: Number.parseInt(matches[5]),
            usedPct: Number.parseInt(matches[6])
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
    return 0;
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);
    
    expect(partOne(getDayInput(day))).toBe(952);

    expect(partTwo(getDayInput(day))).toBe(0);
});