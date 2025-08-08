import { debug, getDayInput } from "advent-of-code-utils";

const day = "day8";

type Screen = string[][];

const ON = '#';
const OFF = '.';

function parseInput(input: string[]): string[] {
    return input.filter(line => line.trim().length > 0);
}

function blankScreen(width: number, height: number): Screen {
    let screen: Screen = [];
    for(let i = 0; i < height; i++) {
        screen.push(new Array(width).fill(OFF));
    }
    return screen;
}

function copyScreen(screen: Screen): Screen {
    let newScreen: Screen = blankScreen(screen[0].length, screen.length);
    for(let x = 0; x < screen.length; x++) {
        for(let y = 0; y < screen[x].length; y++) {
            newScreen[x][y] = screen[x][y];
        }
    }
    return newScreen;
}

function drawScreen(screen: Screen): void {
    debug(screen.map(row => row.join('')).join('\n'), day, true);
}

function rect(screen: Screen, width: number, height: number): Screen {
    let newScreen = copyScreen(screen);
    for(let x = 0; x < height; x++) {
        for(let y = 0; y < width; y++) {
            newScreen[x][y] = ON;
        }
    }
    return newScreen;
}

function rotateRow(screen: Screen, row: number, length: number): Screen {
    let newScreen = copyScreen(screen);
    let width = newScreen[0].length;
    for(let y = 0; y < screen[row].length; y++) {
        newScreen[row][(y + length) % width] = screen[row][y];
    }
    return newScreen;
}

function rotateColumn(screen: Screen, column: number, length: number): Screen {
    let newScreen = copyScreen(screen);
    let height = newScreen.length;
    for(let x = 0; x < screen.length; x++) {
        newScreen[(x + length) % height][column] = screen[x][column];
    }
    return newScreen;
}

function swipeCard(input: string[]): Screen {
    return parseInput(input).reduce((acc, command) => {
        let matches = command.match(/^(rect |rotate row y=|rotate column x=)(\d+)(x| by )(\d+)$/);
        if(matches === null) return acc;
        if(matches[1].startsWith('rect')) {
            acc = rect(acc, Number.parseInt(matches[2]), Number.parseInt(matches[4]));
        } else if(matches[1].includes('row')) {
            acc = rotateRow(acc, Number.parseInt(matches[2]), Number.parseInt(matches[4]));
        } else if(matches[1].includes('column')) {
            acc = rotateColumn(acc, Number.parseInt(matches[2]), Number.parseInt(matches[4]));
        }
        return acc;
    }, blankScreen(50, 6));
}

function partOne(input: string[]): number {
    return swipeCard(input).reduce((acc, row) => {
        return acc + row.filter(col => col === ON).length;
    }, 0);
}

function partTwo(input: string[]): string {
    let screen = swipeCard(input);
    drawScreen(screen);
    return 'EOARGPHYAO'; // view debug output from part 1
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getDayInput(day))).toBe(128);    
    expect(partTwo(getDayInput(day))).toBe('EOARGPHYAO');
});