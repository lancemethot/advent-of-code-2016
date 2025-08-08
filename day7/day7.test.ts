import { debug, getDayInput } from "advent-of-code-utils";

const day = "day7";

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function isABBA(sequence: string): boolean {
    return sequence.length === 4 &&
        (sequence[0] == sequence[3]) &&
        (sequence[1] == sequence[2]) &&
        (sequence[0] !== sequence[1]);
}

function isABA(sequence: string): boolean {
    return sequence.length === 3 &&
        (sequence[0] == sequence[2]) &&
        (sequence[0] !== sequence[1]);
}

function toBAB(sequence: string): string {
    return `${sequence[1]}${sequence[0]}${sequence[1]}`;
}

function supportsTLS(ip: string): boolean {
    let isSupported = false;
    let inHyperText = false;
    let chunk = '';
    
    for(let i = 0; i < ip.length; i++) {
        if(ip[i] === '[') {
            chunk = '';
            inHyperText = true;
        } else if(ip[i] === ']') {
            chunk = '';
            inHyperText = false;
        } else {
            chunk += ip[i];
            if(chunk.length > 3) {
                let check = isABBA(chunk.slice(chunk.length - 4));
                if(check) {
                    if(inHyperText) return false;
                    isSupported = true;
                }
            }
        }
    }

    return isSupported;
}

function supportsSSL(ip: string): boolean {
    let inHyperText = false;
    let chunk = '';
    let supernetSequences: string[] = [];
    let hypernetSequences: string[] = [];

    for(let i = 0; i < ip.length; i++) {
        if(ip[i] === '[') {
            chunk = '';
            inHyperText = true;
        } else if(ip[i] === ']') {
            chunk = '';
            inHyperText = false;
        } else {
            chunk += ip[i];
            if(chunk.length > 2) {
                let check = isABA(chunk.slice(chunk.length - 3));
                if(check) {
                    if(inHyperText) hypernetSequences.push(chunk.slice(chunk.length - 3));
                    else supernetSequences.push(chunk.slice(chunk.length - 3));
                }
            }
        }
    }

    return supernetSequences.reduce((acc, sequence) => {
        let bab = toBAB(sequence);
        return acc || hypernetSequences.filter(seq => seq === bab).length > 0; 
    }, false);
}

function partOne(input: string[]): number {
    return parseInput(input).filter(supportsTLS).length;
}

function partTwo(input: string[]): number {
    return parseInput(input).filter(supportsSSL).length;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(supportsTLS('abba[mnop]qrst')).toBe(true);
    expect(supportsTLS('abcd[bddb]xyyx')).toBe(false);
    expect(supportsTLS('aaaa[qwer]tyui')).toBe(false);
    expect(supportsTLS('ioxxoj[asdfgh]zxcvbn')).toBe(true);

    expect(partOne(getDayInput(day))).toBe(118);

    expect(supportsSSL('aba[bab]xyz')).toBe(true);
    expect(supportsSSL('xyx[xyx]xyx')).toBe(false);
    expect(supportsSSL('aaa[kek]eke')).toBe(true);
    expect(supportsSSL('zazbz[bzb]cdb')).toBe(true);
    
    expect(partTwo(getDayInput(day))).toBe(260);

});