import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day21';

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function swapPosition(text: string, x: number, y: number): string {
    if(x === y || x < 0 || y < 0) return text;
    if(x > y) [x, y] = [y, x];
    return text.slice(0, x) +
           text[y] +
           text.slice(x + 1, y) +
           text[x] +
           text.slice(y + 1);
}

function swapLetter(text: string, x: string, y: string): string {
    return swapPosition(text, text.indexOf(x), text.indexOf(y));
}

function rotate(text: string, direction: string, steps: number): string {
    let start = direction === 'right' ? text.length - (steps % text.length) : steps % text.length;
    let rotated = '';
    for(let i = 0; i < text.length; i++) {
        rotated += text[(i + start) % text.length];
    }
    return rotated;
}

function rotateByPosition(text: string, x: string): string {
    let index = text.indexOf(x);
    let steps = 1 + index + (index >= 4 ? 1 : 0);
    return rotate(text, 'right', steps);
}

function reverse(text: string, x: number, y: number): string {
    return text.slice(0, x) +
           text.slice(x, y + 1).split('').reverse().join('') +
           text.slice(y + 1);
}

function move(text: string, x: number, y: number): string {
    let temp: string[] = text.split('');
    let atX = temp.splice(x, 1)[0];
    temp.splice(y, 0, atX);
    return temp.join('');
}

function partOne(input: string[], start: string): string {
    const instructions: string[] = parseInput(input);
    return instructions.reduce((acc, step) => {
        let matches = step.match(/swap position (\d+) with position (\d+)/);
        if(matches !== null) {
            return swapPosition(acc, Number.parseInt(matches[1]), Number.parseInt(matches[2]));
        }
        matches = step.match(/swap letter (\w+) with letter (\w+)/);
        if(matches !== null) {
            return swapLetter(acc, matches[1], matches[2]);
        }
        matches = step.match(/rotate (left|right) (\d+) step[s]*/);
        if(matches !== null) {
            return rotate(acc, matches[1], Number.parseInt(matches[2]));
        }
        matches = step.match(/rotate based on position of letter (\w+)/);
        if(matches !== null) {
            return rotateByPosition(acc, matches[1]);
        }
        matches = step.match(/reverse positions (\d+) through (\d+)/);
        if(matches !== null) {
            return reverse(acc, Number.parseInt(matches[1]), Number.parseInt(matches[2]));
        }
        matches = step.match(/move position (\d+) to position (\d+)/);
        if(matches !== null) {
            return move(acc, Number.parseInt(matches[1]), Number.parseInt(matches[2]));
        }
        return acc;
    }, start);
}

function partTwo(input: string[], password: string): string {
    const instructions: string[] = parseInput(input);
    return instructions.reverse().reduce((acc, step) => {
        let matches = step.match(/swap position (\d+) with position (\d+)/);
        if(matches !== null) {
            return swapPosition(acc, Number.parseInt(matches[2]), Number.parseInt(matches[1]));
        }
        matches = step.match(/swap letter (\w+) with letter (\w+)/);
        if(matches !== null) {
            return swapLetter(acc, matches[2], matches[1]);
        }
        matches = step.match(/rotate (left|right) (\d+) step[s]*/);
        if(matches !== null) {
            return rotate(acc, matches[1] === 'right' ? 'left' : 'right', Number.parseInt(matches[2]));
        }
        matches = step.match(/rotate based on position of letter (\w+)/);
        if(matches !== null) {
            return rotateByPosition(acc, matches[1]);
        }
        matches = step.match(/reverse positions (\d+) through (\d+)/);
        if(matches !== null) {
            return reverse(acc, Number.parseInt(matches[1]), Number.parseInt(matches[2]));
        }
        matches = step.match(/move position (\d+) to position (\d+)/);
        if(matches !== null) {
            return move(acc, Number.parseInt(matches[2]), Number.parseInt(matches[1]));
        }
        return acc;
    }, password);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(swapPosition('abcde', 4, 0)).toBe('ebcda');
    expect(swapLetter('ebcda', 'd', 'b')).toBe('edcba');
    expect(reverse('edcba', 0, 4)).toBe('abcde');
    expect(rotate('abcde', 'left', 1)).toBe('bcdea');
    expect(move('bcdea', 1, 4)).toBe('bdeac');
    expect(move('bdeac', 3, 0)).toBe('abdec');
    expect(rotateByPosition('abdec', 'b')).toBe('ecabd');
    expect(rotateByPosition('ecabd', 'd')).toBe('decab');

    expect(partOne(getExampleInput(day), 'abcde')).toBe('decab');
    expect(partOne(getDayInput(day), 'abcdefgh')).toBe('bdfhgeca');

    //expect(partTwo(getDayInput(day), 'fbgdceah')).toBe('');
});
