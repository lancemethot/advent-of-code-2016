import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day12";

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function execute(instructions: string[]): number[] {

    const registers: Map<string, number> = new Map();
    ['a','b','c','d'].forEach(reg => registers.set(reg, 0));

    for(let i = 0; i < instructions.length; i++) {
        let matches = instructions[i].match(/(inc|dec) ([abcd])/);
        if(matches !== null) {
            let reg = matches[2] as string;
            if(matches[1] === 'inc') {
                // inc
                registers.set(reg, registers.get(reg)! + 1);
            } else {
                // dec
                registers.set(reg, registers.get(reg)! - 1);
            }
        } else {
            matches = instructions[i].match(/(cpy|jnz) (\w+) (-*\w+)/);
            if(matches !== null) {
                if(matches[1] === 'cpy') {
                    // copy
                    let dest = matches[3] as string;
                    let val = Number.parseInt(matches[2]);
                    if(Number.isNaN(val)) {
                        val = registers.get(matches[2])!;
                    }
                    registers.set(dest, val);
                } else {
                    // jump
                    let check = Number.parseInt(matches[2]);
                    if(Number.isNaN(check)) check = registers.get(matches[2])!;

                    if(check !== 0) {
                        i += Number.parseInt(matches[3])! - 1;
                    }
                }
            }
        }
    }

    return Array.from(registers.entries()).sort().map(register => register[1]);
}

function partOne(input: string[]): number {
    return execute(parseInput(input))[0];
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(42);
    expect(partOne(getDayInput(day))).toBe(318003);

    expect(partTwo(getDayInput(day))).toBe(0);
});