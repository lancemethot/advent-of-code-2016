import { debug, getDayInput, getExampleInput } from 'advent-of-code-utils';

const day = 'day15';

type Disc = {
    id: number;
    positions: number;
    current: number;
}

function parseInput(input: string[]): Disc[] {
    return input.map(line => {
        const [id, positions, _time, current] = line.match(/\d+/g)!.map(Number);
        return { id, positions, current };
    });
}

// Returns the times in which this disc is in the '0' position
function zeroPositions(disc: Disc, sample: number = 10): number[] {
    const times: number[] = [];
    for (let time = 0; time < sample; time++) {
        if ((disc.current + time) % disc.positions === 0) {
            times.push(time);
        }
    }
    return times;
}

function partOne(input: string[]): number {
    const discs = parseInput(input);
    const zeroTimes = discs.map(disc => zeroPositions(disc, 1000000));

    let time = 0;
    while(true) {
        let t = time;
        for(let d = 0; d < discs.length; d++) {
            t++;
            if(!zeroTimes[d].includes(t)) {
                break;
            }
            if(d === discs.length - 1) {
                return time;
            }
        }
        time++;
    }

}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(zeroPositions({ id: 1, positions: 5, current: 4 })).toEqual([1, 6]);
    expect(zeroPositions({ id: 2, positions: 2, current: 1 })).toEqual([1, 3, 5, 7, 9]);

    expect(partOne(getExampleInput(day))).toBe(5);
    expect(partOne(getDayInput(day))).toBe(317371);

    expect(partTwo(getDayInput(day))).toBe(0);
});