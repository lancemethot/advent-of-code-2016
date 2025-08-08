import { debug, getDayInput } from "advent-of-code-utils";

const day = "day9";

type Recursive = (data: string, recurse: Recursive) => number;

function countLength(input: string, recurse: Recursive): number {
    return input.length;
}

function decompress(input: string, recurse: Recursive): number {
    let length = 0;

    while(input.length > 0) {
        if(input[0] === '(') {
            const matches = input.match(/^\((\d+)x(\d+)\)(.*)$/);
            if(matches !== null) {
                let remainder = matches[3];
                let count = Number.parseInt(matches[1]);
                let size = Number.parseInt(matches[2]);
                const sublength = recurse(remainder.slice(0, count), recurse);
                length += sublength * size;
                input = remainder.slice(count);
            }
        } else {
            length += 1;
            input = input.slice(1);
        }
    }

    return length;
}

function partOne(input: string[]): number {
    return decompress(input[0], countLength);
}

function partTwo(input: string[]): number {
    return decompress(input[0], decompress);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(decompress('ADVENT', countLength)).toBe(6);
    expect(decompress('A(1x5)BC', countLength)).toBe(7);
    expect(decompress('(3x3)XYZ', countLength)).toBe(9);
    expect(decompress('A(2x2)BCD(2x2)EFG', countLength)).toBe(11);
    expect(decompress('(6x1)(1x3)A', countLength)).toBe(6);
    expect(decompress('X(8x2)(3x3)ABCY', countLength)).toBe(18);

    expect(partOne(getDayInput(day))).toBe(112830);  
    
    expect(decompress('(3x3)XYZ', decompress)).toBe(9);
    expect(decompress('X(8x2)(3x3)ABCY', decompress)).toBe(20);
    expect(decompress('(27x12)(20x12)(13x14)(7x10)(1x12)A', decompress)).toBe(241920);
    expect(decompress('(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN', decompress)).toBe(445);

    expect(partTwo(getDayInput(day))).toBe(10931789799);
});