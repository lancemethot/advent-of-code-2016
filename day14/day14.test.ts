import { debug, getExampleInput, getDayInput } from 'advent-of-code-utils';
import { createHash } from 'crypto';

const day = 'day14';

type Key = {
    index: number;
    hash: string;
    triplet: string;
}

function parseInput(input: string[]): string {
    return input[0];
}

function md5(text: string): string {
    return createHash('md5').update(text).digest('hex');
}

function triples(text: string): string | undefined {
    for(let i = 0; i <= text.length - 3; i++) {
        if(text[i] === text[i + 1] && text[i] === text[i + 2]) {
            return text[i];
        }
    }
    return undefined;
}

function quintuples(text: string): string[] {
    const quintets: Set<string> = new Set<string>();
    for(let i = 0; i <= text.length - 5; i++) {
        if(text[i].repeat(5) === text.substring(i, i + 5)) {
            quintets.add(text[i]);
        }
    }
    return Array.from(quintets.keys());
}

function findKey(seed: string, limit: number): number {

    const SPAN: number = 1000;
    const keys: Key[] = [];
    let potentialKeys: Key[] = [];
    let index = 0;
    let stop = SPAN;

    while(index <= stop) {

        // prune any inelligible keys
        potentialKeys = potentialKeys.filter(key => index <= (key.index + SPAN));

        let hash = md5(`${seed}${index}`);

        let triplet = triples(hash);
        if(triplet !== undefined) {
            potentialKeys.push({ index, hash, triplet });
        }

        // see if this hash would match any keys (has quintuple(s))
        let quintents = quintuples(hash);

        // check if any potential key is waiting for a quintent
        // move matched keys to the 'keys' collection
        potentialKeys = potentialKeys.reduce((acc, key) => {
            if(quintents.every(chr => chr !== key.triplet)) acc.push(key);
            else if(key.index < index) keys.push(key);
            else acc.push(key);
            return acc;
        }, [] as Key[]);

        // adjust our stop to last key + 1000
        keys.sort((a, b) => a.index - b.index);
        let stopIndex = keys.length >= 64 ? keys[63].index : index;
        let pool = potentialKeys.filter(key => key.index <= stopIndex);
        stop = pool.length > 0 ? pool[pool.length - 1].index + SPAN : index + SPAN;

        index++;

    }

    return keys[limit - 1].index;

}

function partOne(input: string[]): number {
    return findKey(parseInput(input), 64);
}

function partTwo(input: string[]): number {
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(triples('0034e0923cc38887a57bd7b1d4f953df')).toBe('8');
    expect(triples('0034e0923cc3abc7a57bd7b1d4f95aaa')).toBe('a');
    expect(quintuples('3aeeeee1367614f3061d165a5fe3cac3')).toContain('e')
    expect(quintuples('3a3cac31367614f3061d165a5feeeeee')).toContain('e')

    expect(partOne(getExampleInput(day))).toBe(22728);
    expect(partOne(getDayInput(day))).toBe(16106);

    expect(partTwo(getDayInput(day))).toBe(0);
});
