import { debug, getDayInput, getExampleInput } from "advent-of-code-utils";

const day = "day6";

type Distributions = Map<string, number>[];

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function characterDistributions(lines: string[]): Distributions {
    let length = lines[0].length; // Assume equal-length strings
    let distributions: Distributions = Array(length).fill(undefined).map(entry => new Map<string, number>());
    return lines.reduce((acc, line) => {
        for(let i = 0; i < length; i++) {
            acc[i].set(line[i], acc[i].has(line[i]) ? acc[i].get(line[i])! + 1 : 1);
        }
        return acc;
    }, distributions);
}

function mostFrequentByColumn(distributions: Distributions, column: number): string {
    let max = 0;
    return distributions[column].entries().reduce((acc, entry) => {
        if(entry[1] > max) {
            max = entry[1];
            return entry[0];
        }
        return acc;
    }, '');
}

function leastFrequentByColumn(distributions: Distributions, column: number): string {
    let min = Number.MAX_VALUE;
    return distributions[column].entries().reduce((acc, entry) => {
        if(entry[1] < min) {
            min = entry[1];
            return entry[0];
        }
        return acc;
    }, '');
}

function partOne(input: string[]): string {
    let message = '';
    let distributions: Distributions = characterDistributions(parseInput(input));
    for(let i = 0; i < distributions.length; i++) {
        message += mostFrequentByColumn(distributions, i);
    }
    return message;
}

function partTwo(input: string[]): string {
    let message = '';
    let distributions: Distributions = characterDistributions(parseInput(input));
    for(let i = 0; i < distributions.length; i++) {
        message += leastFrequentByColumn(distributions, i);
    }
    return message;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    const distributions: Distributions = characterDistributions(parseInput(getExampleInput(day)));
    expect(mostFrequentByColumn(distributions, 0)).toBe('e');
    expect(mostFrequentByColumn(distributions, 1)).toBe('a');
    expect(mostFrequentByColumn(distributions, 2)).toBe('s');
    
    expect(partOne(getDayInput(day))).toBe('tsreykjj');

    expect(leastFrequentByColumn(distributions, 0)).toBe('a');
    expect(leastFrequentByColumn(distributions, 1)).toBe('d');

    expect(partTwo(getDayInput(day))).toBe('hnfbujie');
});