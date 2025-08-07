import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day2';

type Coord = {
    x: number;
    y: number;
}

const KEYPAD: string[][] = [
    [ '1', '2', '3', ],
    [ '4', '5', '6', ],
    [ '7', '8', '9', ]
];

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function findButton(button: string): Coord {
    for(let x = 0; x < KEYPAD.length; x++) {
        for(let y = 0; y < KEYPAD[x].length; y++) {
            if(button === KEYPAD[x][y]) {
                return { x, y };
            }
        }
    }
    return { x: 1, y: 1 };
}

function getButtonPress(line: string, startingButton: string): string {
    let button: Coord = findButton(startingButton);
    let steps = line.split('');
    for(let i = 0; i < steps.length; i++) {
        switch(steps[i]) {
            case 'U': if(button.x > 0) button.x = button.x - 1; break;
            case 'D': if(button.x < KEYPAD.length - 1) button.x = button.x + 1; break;
            case 'L': if(button.y > 0) button.y = button.y - 1; break;
            case 'R': if(button.y < KEYPAD[0].length - 1) button.y = button.y + 1; break;
            default: console.log('odd choice');
        }
    }
    return KEYPAD[button.x][button.y];
}

function partOne(input: string[]): number {
    let button: string = '5';
    let buttonPresses: string[] = [];
    parseInput(input).map(line => {
        button = getButtonPress(line,  button);
        buttonPresses.push(button);
    });
    return Number.parseInt(buttonPresses.join(''));
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(1985);
    expect(partOne(getDayInput(day))).toBe(36629);

    expect(partTwo(getDayInput(day))).toBe(0);
});