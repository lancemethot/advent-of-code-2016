import { debug, getDayInput, getExampleInput } from "advent-of-code-utils";

const day = "day6";

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function mostFrequentByColumn(lines: string[], column: number): string {
    let map: Map<string, number> = lines.reduce((acc, line) => {
        acc.set(line[column], acc.has(line[column]) ? acc.get(line[column])! + 1 : 1);
        return acc;
    }, new Map<string, number>());
    let max = 0;
    return map.entries().reduce((acc, entry) => {
        if(entry[1] > max) {
            max = entry[1];
            return entry[0];
        }
        return acc;
    }, '');
}

function partOne(input: string[]): string {
    const lines = parseInput(input);
    let message = '';
    for(let i = 0; i < lines[0].length; i++) {
        message += mostFrequentByColumn(lines, i);
    }
    return message;
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(mostFrequentByColumn(parseInput(getExampleInput(day)), 0)).toBe('e');
    expect(mostFrequentByColumn(parseInput(getExampleInput(day)), 1)).toBe('a');
    expect(mostFrequentByColumn(parseInput(getExampleInput(day)), 2)).toBe('s');
    
    expect(partOne(getDayInput(day))).toBe('tsreykjj');

    expect(partTwo(getDayInput(day))).toBe(0);
});