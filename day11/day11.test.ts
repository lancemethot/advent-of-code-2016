import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from 'advent-of-code-utils';

const day = "day11";

const BOTTOM = 0;
const TOP = 3;

enum Cargo {
    MICROCHIP = "microchip",
    GENERATOR = "generator"
}

type Item = {
    element: string;
    type: "microchip" | "generator";
}

type Round = HeapItem & {
    floor: number;
    items: Item[][];
}

function parseInput(input: string[]): Item[][] {
    return input.reduce((acc, line) => {
        acc.push([]);
        const matches = line.match(/The \w+ floor contains (.+)./)
        if(matches !== null && matches[1] !== 'nothing relevant') {
            const items = matches[1].matchAll(/\ban? ([a-z]+)(?: (generator)|-compatible microchip)\b/g);
            if(items !== null) {
                items.forEach(item => {
                    acc[acc.length - 1].push({
                        element: item[1],
                        type: item[2] ? 'generator' : 'microchip',
                    });
                });
            }
        }
        return acc;
    }, [] as Item[][]);
}

function isValidFloor(floor: Item[]): boolean {
    let chips = floor.filter(item => item.type === Cargo.MICROCHIP);
    let generators = floor.filter(item => item.type === Cargo.GENERATOR);
    return chips.length === 0 || chips.every(chip => generators.some(gen => gen.element === chip.element));
}

function combinations(items: Item[]): Item[][] {
    const combos: Item[][] = [];
    for(let i = 0; i < items.length; i++) {
        combos.push([ items[i] ]);
    }
    for(let i = 0; i < items.length; i++) {
        for(let j = i + 1; j < items.length; j++) {
            combos.push([ items[i], items[j] ]);
        }
    }
    return combos;
}

function hash(round: Round): string {
    const floorHashes = round.items.map(floor => floor.map(item => `${item.element}-${item.type}`).sort().join(','));
    return `${round.floor}-${floorHashes.join('|')}`;
}

function partOne(input: string[]): number {
    const heap: MinHeap<Round> = new MinHeap();
    heap.insert({ size: 0, floor: 0, items: parseInput(input) });

    const visited: Set<string> = new Set();

    while(heap.size() > 0) {
        let round = heap.extractMin();
        let hashValue = hash(round);

        if(visited.has(hashValue)) continue;
        else visited.add(hashValue);

        // check if everything is on the fourth floor (exit)
        if(round.floor === TOP && round.items[0].length === 0 && round.items[1].length === 0 && round.items[2].length === 0) {
            return round.size;
        }

        let combos = combinations(round.items[round.floor]);

        if(round.floor < TOP) {
            // Check for valid moves going up
            combos.forEach(combo => {
                if(isValidFloor([ ...combo, ...round.items[round.floor + 1] ])) {
                    let newItems = round.items.map((f, i) => i === round.floor ? f.filter(item => !combo.includes(item)) : f);
                    newItems[round.floor + 1] = [ ...newItems[round.floor + 1], ...combo ];
                    heap.insert({ size: round.size + 1, floor: round.floor + 1, items: newItems });
                }
            });
        }

        if(round.floor > BOTTOM) {
            // Check for valid moves going down
            combos.forEach(combo => {
                if(isValidFloor([ ...combo, ...round.items[round.floor - 1] ])) {
                    let newItems = round.items.map((f, i) => i === round.floor ? f.filter(item => !combo.includes(item)) : f);
                    newItems[round.floor - 1] = [ ...newItems[round.floor - 1], ...combo ];
                    heap.insert({ size: round.size + 1, floor: round.floor - 1, items: newItems });
                }
            });
        }
    }

    return 0;
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(11);
    expect(partOne(getDayInput(day))).toBe(47);

    expect(partTwo(getDayInput(day))).toBe(0);
});