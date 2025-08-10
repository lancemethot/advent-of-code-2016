import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day16';

function parseInput(input: string[]): string {
    return input[0];
}

function curve(text: string): string {
    let a = text;
    let b = text.split('')
                .reverse()
                .map(c => c === '1' ? '0' : '1')
                .join('');
    return `${a}0${b}`;
}

const memo: Map<string, string> = new Map<string, string>();
function checksum(text: string): string {
    let sum = memo.get(text);
    if(!sum) {
        sum = '';
        let check = text.split('');
        for(let i = 0; i < check.length - 1; i += 2) {
            sum += check[i] === check[i + 1] ? '1' : '0';
        }
        if(check.length % 2 !== 0) sum += check[check.length - 1];
        memo.set(text, sum as string);
    }
    return sum.length % 2 === 0 ? checksum(sum) : sum;
}

function partOne(input: string[], fill: number): string {
    let data = parseInput(input);
    while(data.length < fill) {
        data = curve(data);
    }
    return checksum(data.substring(0, fill));
}

function partTwo(input: string[], fill: number): string {
    let data = parseInput(input);
    while(data.length < fill) {
        data = curve(data);
    }
    return checksum(data.substring(0, fill));
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(curve('1')).toBe('100');
    expect(curve('0')).toBe('001');
    expect(curve('11111')).toBe('11111000000');
    expect(curve('111100001010')).toBe('1111000010100101011110000');

    expect(checksum('110010110100')).toBe('100');
    expect(partOne(getExampleInput(day), 20)).toBe('01100');
    expect(partOne(getDayInput(day), 272)).toBe('00000100100001100');

    expect(partTwo(getDayInput(day), 35651584)).toBe('00011010100010010');
});