import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day19';

type Elf = {
    id: number;
    presents: number;
    next: Elf;
}

function parseInput(input: string[]): number {
    return Number.parseInt(input[0]);
}

function linkedList(elves: number): Elf {
let head: Elf = { id: 1, presents: 1, next: null as unknown as Elf };
    let prev = head;
    for(let i = 2; i <= elves; i++) {
        const node: Elf = { id: i, presents: 1, next: null as unknown as Elf };
        prev.next = node;
        prev = node;
    }
    prev.next = head;
    return head;
}

function whiteElephant(start: Elf): number {
    while(start.next !== start) {
        start.presents += start.next.presents;
        start.next = start.next.next;
        start = start.next;
    }
    return start.id;
}

// Co-pilot answer... 
// power-of-3 piecewise rule
function winnerAcrossBig(n: bigint): bigint {
    if (n <= 1n) return 1n;
    let p = 1n;
    while (p * 3n <= n) p *= 3n; 
    if (n === p) return n;
    if (n <= 2n * p) return n - p;
    return 2n * n - 3n * p;
}

function partOne(input: string[]): number {
    return whiteElephant(linkedList(parseInput(input)));
}

function partTwo(input: string[]): number {
    return Number(winnerAcrossBig(BigInt(parseInput(input))));
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(['5'])).toBe(3);
    expect(partOne(getDayInput(day))).toBe(1834471);

    expect(partTwo(['5'])).toBe(2);
    expect(partTwo(getDayInput(day))).toBe(1420064);
});
