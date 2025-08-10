import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day19';

type Elf = {
    id: number;
    presents: number;
    next: Elf;
}

function parseInput(input: string[]): Elf {
    // Create a linked list
    let elves = Number.parseInt(input[0]);
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

function partOne(input: string[]): number {
    return whiteElephant(parseInput(input));
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(['5'])).toBe(3);
    expect(partOne(getDayInput(day))).toBe(1834471);

    expect(partTwo(['5'])).toBe(0);
    expect(partTwo(getDayInput(day))).toBe(0);
});
