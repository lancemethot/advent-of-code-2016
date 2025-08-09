import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = "day10";

enum Destination {
    BOT = 'bot',
    BIN = 'output'
};

type BotRule = {
    id: number;
    low: {
        type: Destination;
        id: number;
    };
    high: {
        type: Destination;
        id: number;
    };
}

type Bot = BotRule & {
    id: number;
    chips: number[];
}

function newBot(id: number): Bot {
    return { id, chips: [], low: { id: -1, type: Destination.BIN }, high: { id: -1, type: Destination.BIN } };
}

function parseInput(input: string[]): Map<number, Bot> {
    return input.reduce((acc, line) => {
        let id: number = -1;
        let bot: Bot | undefined = undefined;
        let matches = line.match(/^value (\d+) goes to bot (\d+)$/);
        if(matches !== null) {
            id = Number.parseInt(matches[2]);
            bot = acc.get(id) ?? newBot(id);
            bot.chips.push(Number.parseInt(matches[1]));
        } else {
            matches = line.match(/^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/);
            if(matches !== null) {
                id = Number.parseInt(matches[1]);
                bot = acc.get(id) ?? newBot(id);

                bot.low.id = Number.parseInt(matches[3]);
                bot.low.type = matches[2] as Destination;

                bot.high.id = Number.parseInt(matches[5]);
                bot.high.type = matches[4] as Destination;
            }
        }
        if(bot) acc.set(id, bot);
        return acc;
    }, new Map<number, Bot>());
}

function execute(bots: Map<number, Bot>, low: number, high: number, checkBins: boolean = false): number {

    const bins: Map<number, number[]> = new Map<number, number[]>();

    let checklist: number[] = Array.from(bots.keys());
    let checkers: number[] = [];

    while(checklist.length > 0) {
        let id = checklist.shift();
        let bot = bots.get(id!);
        if(!bot) continue;

        if(bot.chips.length === 2) {
            bot.chips.sort((a, b) => a - b);
            if(bot.chips[0] === low && bot.chips[1] === high) {
                checkers.push(bot.id);
            }

            if(bot.low.type === Destination.BIN) {
                let bin = bins.get(bot.low.id) || [];
                bin.push(bot.chips[0]);
                bins.set(bot.low.id, bin);
            } else {
                bots.get(bot.low.id)!.chips.push(bot.chips[0]);
                checklist.push(bot.low.id);
            }

            if(bot.high.type === Destination.BIN) {
                let bin = bins.get(bot.high.id) || [];
                bin.push(bot.chips[1]);
                bins.set(bot.high.id, bin);
            } else {
                bots.get(bot.high.id)!.chips.push(bot.chips[1]);
                checklist.push(bot.high.id);
            }

            if(checkBins) {
                let zero = bins.get(0);
                let one = bins.get(1);
                let two = bins.get(2);
                if(zero && zero.length > 0 && one && one.length > 0 && two && two.length > 0) {
                    return zero[0] * one[0] * two[0];
                }
            }
            bots.get(bot.id)!.chips = [];
        }
    }

    return checkers.pop() || -1;

}

function partOne(input: string[], low: number, high: number): number {
    return execute(parseInput(input), low, high, false);
}

function partTwo(input: string[]): number {
    return execute(parseInput(input), -1, -1, true);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(getExampleInput(day), 2, 5)).toBe(2);
    expect(partOne(getDayInput(day), 17, 61)).toBe(101);  

    expect(partTwo(getDayInput(day))).toBe(37789);
});