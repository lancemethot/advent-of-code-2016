import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day25';

enum Command {
    INC = 'inc',
    DEC = 'dec',
    CPY = 'cpy',
    JNZ = 'jnz',
    TGL = 'tgl',
    OUT = 'out'
}

type Instruction = {
    command: Command;
    args: string[];
}

const REGS = 'abcd';

function parseInput(input: string[]): Instruction[] {
    return input.reduce((acc, line) => {
        if(line.trim().length > 0) {
            const matches = line.match(/^(inc|dec|cpy|jnz|tgl|out) (-*\w+)\s*(-*\w+)*$/)
            if(matches) {
                acc.push({
                    command: matches[1] as Command,
                    args: [ matches[2], matches[3] ].filter(match => match !== undefined)
                })
            }
        }
        return acc;
    }, [] as Instruction[]);
}

function valueOrRegisterValue(registers: Map<string, number>, value: string): number {
    let val = Number.parseInt(value);
    if(Number.isNaN(val) && registers.has(value)) {
        val = registers.get(value)!;
    }
    return val;
}

function hash(instructions: Instruction[], registers: Map<string, number>, i: number, expected: 0 | 1): string {
    return `${i}-`+
        `${Array.from(registers.entries()).map(entry => `${entry[0]}${entry[1]}`).join('|')}`+
        `${instructions.map(instr => `${instr.command}${instr.args}`).join('|')}`+
        `${expected}`;
}

// Strategy
// have an 'expected' OUT value
// when OUT appears, check if expected !== value
// if it does, end early
// when OUT appears, keep track of state:
// - state = index + registers + instruction set hash + expected
// if state appears twice, exit early with a win
function solve(instructions: Instruction[], registers: Map<string, number>): boolean {
    let reg: string = '';
    let val: number = 0;
    let check: number = 0;
    let expected: 0 | 1 = 0;
    let state: Set<string> = new Set<string>();

    for(let i = 0; i < instructions.length; i++) {
        switch(instructions[i].command) {
            case Command.INC:
                // Increment
                reg = instructions[i].args[0];
                if(registers.has(reg)) registers.set(reg, registers.get(reg)! + 1);
                break;
            case Command.DEC:
                // Decrement
                reg = instructions[i].args[0];
                if(registers.has(reg)) registers.set(reg, registers.get(reg)! - 1);
                break;
            case Command.CPY:
                // Copy
                reg = instructions[i].args[1];
                val = valueOrRegisterValue(registers, instructions[i].args[0]);
                if(registers.has(reg) && !Number.isNaN(val)) registers.set(reg, val);
                break;
            case Command.JNZ:
                // Jump
                check = valueOrRegisterValue(registers, instructions[i].args[0]);
                val = valueOrRegisterValue(registers, instructions[i].args[1]);

                if(!Number.isNaN(check) && check !== 0 && !Number.isNaN(val)) {
                    i += val - 1;
                }
                break;
            case Command.TGL:
                // Toggle
                let h = Number.parseInt(instructions[i].args[0]);
                if(Number.isNaN(h)) h = registers.get(instructions[i].args[0])!;
                h += i;
                if(h >= 0 && h < instructions.length) {
                    let command = instructions[h].command;
                    switch(command) {
                        case Command.INC:
                            instructions[h].command = Command.DEC;
                            break;
                        case Command.DEC:
                            instructions[h].command = Command.INC;
                            break;
                        case Command.CPY:
                            instructions[h].command = Command.JNZ;
                            break;
                        case Command.JNZ:
                            instructions[h].command = Command.CPY;
                            break;
                        case Command.TGL:
                            instructions[h].command = Command.INC;
                            break;
                        default:
                            debug(`invalid toggle: ${command}`, day, true);
                    }
                }
                break;
            case Command.OUT:
                val = valueOrRegisterValue(registers, instructions[i].args[0]);
                
                // early exit
                if(expected !== val) {
                    return false;
                }

                let key = hash(instructions, registers, i, expected);
                
                // loop detector.. we win
                if(state.has(key)) {
                    return true;
                }

                state.add(key);
                expected = val === 0 ? 1 : 0;
                break;
            default:
                debug(`ignoring instruction: ${instructions[i].command}`, day, true);
        }

    }

    return true;
} 

function partOne(input: string[]): number {
    let counter = 0;
    while(true) {
        const registers: Map<string, number> = new Map();
        REGS.split('').forEach(reg => registers.set(reg, 0));
        registers.set('a', counter);
        if(solve(parseInput(input), registers)) {
            return counter;
        }
        counter++;
    }
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getDayInput(day))).toBe(189);
    
    expect(partTwo(getDayInput(day))).toBe(0);

});