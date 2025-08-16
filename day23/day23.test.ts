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

function valueOrRegistervalue(registers: Map<string, number>, value: string): number {
    let val = Number.parseInt(value);
    if(Number.isNaN(val) && registers.has(value)) {
        val = registers.get(value)!;
    }
    return val;
}

function execute(instructions: Instruction[], registers: Map<string, number>): number[] {
    const valid_registers: string[] = Array.from(registers.keys());
    debug(`Starting execution with registers: ${JSON.stringify(Array.from(registers.entries()))}`, day, true);
    for(let i = 0; i < instructions.length; i++) {
        let reg: string = '';
        let val: number = 0;
        let check: number = 0;
        debug(`>> a=${registers.get('a')} i=${i} >> ${instructions[i].command} ${instructions[i].args.join(' ')}`, day, true);
        switch(instructions[i].command) {
            case Command.INC:
                // Increment
                reg = instructions[i].args[0];
                if(valid_registers.includes(reg)) registers.set(reg, registers.get(reg)! + 1);
                break;
            case Command.DEC:
                // Decrement
                reg = instructions[i].args[0];
                if(valid_registers.includes(reg)) registers.set(reg, registers.get(reg)! - 1);
                break;
            case Command.CPY:
                // Copy
                reg = instructions[i].args[1];
                val = valueOrRegistervalue(registers, instructions[i].args[0]);
                if(valid_registers.includes(reg) && !Number.isNaN(val)) registers.set(reg, val);
                break;
            case Command.JNZ:
                // Jump
                check = valueOrRegistervalue(registers, instructions[i].args[0]);
                val = valueOrRegistervalue(registers, instructions[i].args[1]);

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

    }

    return Array.from(registers.entries()).sort().map(register => register[1]);

}

function partOne(input: string[], a: number): number {
    const registers: Map<string, number> = new Map();
    ['a','b','c','d'].forEach(reg => registers.set(reg, 0));
    registers.set('a', a);
    return execute(parseInput(input), registers)[0];
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {

    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 0)).toBe(3);
    expect(partOne(getDayInput(day), 7)).toBe(10440);
    
    expect(partTwo(getDayInput(day))).toBe(0);

});