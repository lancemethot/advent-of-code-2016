import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day23';

enum Command {
    INC = 'inc',
    DEC = 'dec',
    CPY = 'cpy',
    JNZ = 'jnz',
    TGL = 'tgl'
}

type Instruction = {
    command: Command;
    args: string[];
}

const REGS = 'abcd';

function parseInput(input: string[]): Instruction[] {
    return input.reduce((acc, line) => {
        if(line.trim().length > 0) {
            const matches = line.match(/^(inc|dec|cpy|jnz|tgl) (-*\w+)\s*(-*\w+)*$/)
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

// Look for pattern that is the equivalent of addition
// INC X -> DEC Y -> JNZ Y -2
// or
// DEC X -> INC Y -> JNZ X -2
function matchesAdditionPattern(instructions: Instruction[], registers: Map<string, number>, i: number): boolean {
    if(i > instructions.length - 3) return false;
    let x = instructions[i];
    let y = instructions[i + 1];
    let z = instructions[i + 2];
    return REGS.includes(x.args[0]) && REGS.includes(y.args[0]) && x.args[0] !== y.args[0] &&
           ((x.command === Command.INC && y.command === Command.DEC) ||
            (x.command === Command.DEC && y.command === Command.INC)) &&
            (z.command === Command.JNZ && z.args[0] === (y.command === Command.DEC ? y.args[0] : x.args[0]) && valueOrRegisterValue(registers, z.args[1]) === -2);
}

// Look for pattern that is the equivalent of multiplication
// CPY B C => INC A => DEC C => JNZ C -2 => DEC D => JNZ D -5
function matchesMultiplicationPattern(instructions: Instruction[], registers: Map<string, number>, i: number): boolean {
    if(i > instructions.length - 6) return false;
    let u = instructions[i];
    let v = instructions[i + 1];
    let w = instructions[i + 2];
    let x = instructions[i + 3];
    let y = instructions[i + 4];
    let z = instructions[i + 5];
    return u.command === Command.CPY && REGS.includes(u.args[1]) &&
           v.command === Command.INC && REGS.includes(v.args[0]) &&
           w.command === Command.DEC && REGS.includes(w.args[0]) && w.args[0] === u.args[1] &&
           x.command === Command.JNZ && x.args[0] === u.args[1] && valueOrRegisterValue(registers, x.args[1]) === -2 &&
           y.command === Command.DEC && REGS.includes(y.args[0]) &&
           z.command === Command.JNZ && z.args[0] === y.args[0] && valueOrRegisterValue(registers, z.args[1]) === -5;
}

function execute(instructions: Instruction[], registers: Map<string, number>, i: number): number {
    let reg: string = '';
    let val: number = 0;
    let check: number = 0;

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
        default:
            debug(`ignoring instruction: ${instructions[i].command}`, day, true);
    }

    return i++;

}

function long(instructions: Instruction[], registers: Map<string, number>): number[] {
    for(let i = 0; i < instructions.length; i++) {
        i = execute(instructions, registers, i);
    }
    return Array.from(registers.entries()).sort().map(register => register[1]);
}

function short(instructions: Instruction[], registers: Map<string, number>): number[] {
    for(let i = 0; i < instructions.length; i++) {
        // Skip ahead if we're doing inc X, dec Y, jnz Y -2
        if(matchesAdditionPattern(instructions, registers, i)) {
            let x = instructions[i].args[0];
            let y = instructions[i + 1].args[0];
            if(instructions[i].command === Command.DEC && instructions[i + 1].command === Command.INC) {
                x = instructions[i + 1].args[0];
                y = instructions[i].args[0];
            }
            if(REGS.includes(x) && REGS.includes(y)) {
                registers.set(x, registers.get(x)! + registers.get(y)!);
                registers.set(y, 0);
                i += 2;
                continue;
            }
        }
        // Skip ahead if there's a block of instructions that multiply
        if(matchesMultiplicationPattern(instructions, registers, i)) {
            let a = instructions[i + 1].args[0];
            let b = instructions[i].args[0];
            let c = instructions[i].args[1];
            let d = instructions[i + 4].args[0];
            if(REGS.includes(a) && REGS.includes(b) && REGS.includes(c) && REGS.includes(d)) {
                registers.set(a, registers.get(a)! + (registers.get(b)! * registers.get(d)!));
                registers.set(c, 0);
                registers.set(d, 0);
                i += 5;
                continue;
            }
        }

        i = execute(instructions, registers, i);
    }
    return Array.from(registers.entries()).sort().map(register => register[1]);
}

function partOne(input: string[], a: number): number {
    const registers: Map<string, number> = new Map();
    REGS.split('').forEach(reg => registers.set(reg, 0));
    registers.set('a', a);
    return long(parseInput(input), registers)[0];
}

function partTwo(input: string[], a: number): number {
    const registers: Map<string, number> = new Map();
    REGS.split('').forEach(reg => registers.set(reg, 0));
    registers.set('a', a);
    return short(parseInput(input), registers)[0];
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 0)).toBe(3);
    expect(partOne(getDayInput(day), 7)).toBe(10440);
    
    expect(partTwo(getDayInput(day), 12)).toBe(479007000);

});