import { debug, getDayInput } from "advent-of-code-utils";
import { createHash } from 'node:crypto';

const day = "day5";

function md5(input: string): string {
    return createHash('md5').update(input).digest('hex');
}

function determinePassword(doorId: string): string {
    let i = 0;
    let password = '';
    while(password.length < 8) {
        const hash = md5(`${doorId}${i}`);
        if(hash.startsWith('00000') && hash.length > 5) {
            password = password + hash.substring(5, 6);
        }
        i++;
    }
    return password;
}

function determineEnhancedPassword(doorId: string): string {
    let i = 0;
    let password: string[] = Array(8).fill('_');
    while(true) {
        const hash = md5(`${doorId}${i}`);
        if(hash.startsWith('00000') && hash.length > 6) {
            let position = Number.parseInt(hash[5]);
            if(Number.isInteger(position) && position < password.length && password[position] === '_') {
                password[position] = hash[6];
                if(password.every(chr => chr !== '_')) break;
            }
        }
        i++;
    }
    return password.join('');
}

function partOne(input: string[]): string {
    return determinePassword(input[0]);
}

function partTwo(input: string[]): string {
    return determineEnhancedPassword(input[0]);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(determinePassword('abc')).toBe('18f47a30');
    expect(partOne(getDayInput(day))).toBe('c6697b55');

    expect(determineEnhancedPassword('abc')).toBe('05ace8e3');
    expect(partTwo(getDayInput(day))).toBe('8c35d1ab');
});