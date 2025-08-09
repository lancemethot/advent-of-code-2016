import { debug, getDayInput, getExampleInput, HeapItem, MinHeap } from 'advent-of-code-utils';

const day = "day11";

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
    bottom: number;
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
    return generators.length === 0 || chips.every(chip => generators.some(gen => gen.element === chip.element));
}

function combinations(items: Item[]): Item[][] {
    const combos: Item[][] = [];
    for(let i = 0; i < items.length; i++) {
        for(let j = i + 1; j < items.length; j++) {
            combos.push([ items[i], items[j] ]);
        }
    }
    for(let i = 0; i < items.length; i++) {
        combos.push([ items[i] ]);
    }
    return combos;
}

function hash(round: Round): string {
    // Canonical, element-agnostic state hash: elevator floor + sorted pairs of (chipFloor-generatorFloor)
    const positions: Record<string, { chip: number; gen: number }> = {};
    round.items.forEach((floorItems, floorIdx) => {
        floorItems.forEach(item => {
            const pos = positions[item.element] ?? { chip: -1, gen: -1 };
            if (item.type === Cargo.MICROCHIP) pos.chip = floorIdx;
            else pos.gen = floorIdx;
            positions[item.element] = pos;
        });
    });
    const pairs = Object.values(positions)
        .map(p => `${p.chip}-${p.gen}`)
        .sort()
        .join('|');
    return `${round.floor}:${pairs}`;
}

function execute(items: Item[][]): number {
    const visited: Set<string> = new Set();
    const heap: MinHeap<Round> = new MinHeap();
    let top: number = items.length - 1;

    const computeBottom = (floors: Item[][]): number => {
        for (let i = 0; i < floors.length; i++) {
            if (floors[i].length > 0) return i;
        }
        return top; // all on top
    };

    heap.insert({ size: 0, floor: 0, bottom: computeBottom(items), items });

    while(heap.size() > 0) {
        let round = heap.extractMin();
        let hashValue = hash(round);

        if(visited.has(hashValue)) continue;
        else visited.add(hashValue);

        // check if everything is on the top floor (exit)
        if(round.floor === top && round.bottom === top) {
            return round.size;
        }

        // Generate combinations (pairs and singles)
        let combos = combinations(round.items[round.floor]);
        // Heuristic ordering: when going up, try pairs first; when going down, singles first
        const pairsFirst = combos.filter(c => c.length === 2).concat(combos.filter(c => c.length === 1));
        const singlesFirst = combos.filter(c => c.length === 1).concat(combos.filter(c => c.length === 2));

        if(round.floor < top) {
            // Check for valid moves going up
            pairsFirst.forEach(combo => {
                const remainder = round.items[round.floor].filter(item => !combo.includes(item));
                const dest = [ ...combo, ...round.items[round.floor + 1] ];
                if(isValidFloor(remainder) && isValidFloor(dest)) {
                    let newItems = round.items.map((f, i) => i === round.floor ? remainder : f);
                    newItems[round.floor + 1] = dest;
                    const newBottom = computeBottom(newItems);
                    heap.insert({ size: round.size + 1, floor: round.floor + 1, bottom: newBottom, items: newItems });
                }
            });
        }

        if(round.floor > round.bottom) {
            // Check for valid moves going down
            singlesFirst.forEach(combo => {
                const remainder = round.items[round.floor].filter(item => !combo.includes(item));
                const dest = [ ...combo, ...round.items[round.floor - 1] ];
                if(isValidFloor(remainder) && isValidFloor(dest)) {
                    let newItems = round.items.map((f, i) => i === round.floor ? remainder : f);
                    newItems[round.floor - 1] = dest;
                    const newBottom = computeBottom(newItems);
                    heap.insert({ size: round.size + 1, floor: round.floor - 1, bottom: newBottom, items: newItems });
                }
            });
        }
    }

    return 0;
}

function partOne(input: string[]): number {
    return execute(parseInput(input));
}

function partTwo(input: string[]): number {
    const items = parseInput(input);
    items[0].push({ element: 'elerium', type: Cargo.GENERATOR });
    items[0].push({ element: 'elerium', type: Cargo.MICROCHIP });
    items[0].push({ element: 'dilithium', type: Cargo.GENERATOR });
    items[0].push({ element: 'dilithium', type: Cargo.MICROCHIP });
    return execute(items);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(11);
    expect(partOne(getDayInput(day))).toBe(47);

    expect(partTwo(getDayInput(day))).toBe(71);
});