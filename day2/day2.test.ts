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

const KEYPAD2: string[][] = [
    [  '',  '', '1',  '',  '', ],
    [  '', '2', '3', '4',  '', ],
    [ '5', '6', '7', '8', '9', ],
    [  '', 'A', 'B', 'C',  '', ],
    [  '',  '', 'D',  '',  '', ],
    
]

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function findButton(keypad: string[][], button: string): Coord {
    for(let x = 0; x < keypad.length; x++) {
        for(let y = 0; y < keypad[x].length; y++) {
            if(button === keypad[x][y]) {
                return { x, y };
            }
        }
    }
    return { x: 1, y: 1 };
}

function isValidButton(keypad: string[][], button: Coord): boolean {
    return button.x >= 0 && button.x < keypad.length &&
            button.y >= 0 && button.y < keypad[0].length &&
            keypad[button.x][button.y] !== '';
}

function getButtonPress(line: string, keypad: string[][], startingButton: string): string {
    let button: Coord = findButton(keypad, startingButton);
    let steps = line.split('');
    for(let i = 0; i < steps.length; i++) {
        let next: Coord = { x: button.x, y: button.y };
        switch(steps[i]) {
            case 'U': if(button.x > 0) next.x = button.x - 1; break;
            case 'D': if(button.x < keypad.length - 1) next.x = button.x + 1; break;
            case 'L': if(button.y > 0) next.y = button.y - 1; break;
            case 'R': if(button.y < keypad[0].length - 1) next.y = button.y + 1; break;
            default: console.log('odd choice');
        }
        if(isValidButton(keypad, next)) button = next;
    }
    return keypad[button.x][button.y];
}

function partOne(input: string[]): number {
    let button: string = '5';
    let buttonPresses: string[] = [];
    parseInput(input).map(line => {
        button = getButtonPress(line, KEYPAD, button);
        buttonPresses.push(button);
    });
    return Number.parseInt(buttonPresses.join(''));
}

function partTwo(input: string[]): string {
    let button: string = '5';
    let buttonPresses: string[] = [];
    parseInput(input).map(line => {
        button = getButtonPress(line, KEYPAD2, button);
        buttonPresses.push(button);
    });
    return buttonPresses.join('');
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day))).toBe(1985);
    expect(partOne(getDayInput(day))).toBe(36629);

    expect(partTwo(getExampleInput(day))).toBe('5DB3');
    expect(partTwo(getDayInput(day))).toBe('99C3D');
});