import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day4';

type Room = {
    name: string;
    sectorId: number;
    checksum: string;
}

function parseInput(input: string[]): Room[] {
    return input.filter(line => line.trim().length > 0)
            .map(line => {
                const matches = line.match(/([a-z\-]+)-([0-9]+)\[([a-z]+)\]/);
                if(matches !== null) {
                    return {
                        name: matches[1],
                        sectorId: Number.parseInt(matches[2]),
                        checksum: matches[3]
                    };
                } else {
                    return undefined;
                }
            }).filter(candidate => candidate !== undefined);
}

function calculateChecksum(name: string): string {
    const map: Map<string, number> = new Map();
    name.split('').forEach(chr => {
        if(map.has(chr)) map.set(chr, map.get(chr)! + 1);
        else map.set(chr, 1);
    });
    map.delete('-'); // Remove the dash character
    const sorted = Array.from(map.entries()).sort((a, b) => {
        if(a[1] === b[1]) return a[0].localeCompare(b[0]);
        return b[1] - a[1];
    });
    return sorted.slice(0, 5).map(entry => entry[0]).join('');
}

function isValidRoom(room: Room): boolean {
    const calculated = calculateChecksum(room.name);
    return calculated === room.checksum;
}

function decryptName(name: string, sectorId: number): string {
    let decrypted = '';
    name.split('').forEach(chr => {
        if(chr === '-') decrypted += ' ';
        else decrypted += String.fromCharCode(((chr.charCodeAt(0) - 97 + sectorId) % 26) + 97);
    });
    return decrypted;
}

function partOne(input: string[]): number {
    return parseInput(input).filter(isValidRoom).reduce((acc, room) => {
        return acc + room.sectorId;
    }, 0);
}

function partTwo(input: string[]): number {
    parseInput(input).filter(isValidRoom).forEach(room => {
        const decrypted = decryptName(room.name, room.sectorId);
        debug(`Sector ${room.sectorId}: ${decrypted}`, day, true);
    });
    return 0;
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(calculateChecksum("aaaaa-bbb-z-y-x")).toBe("abxyz");
    expect(calculateChecksum("a-b-c-d-e-f-g-h")).toBe("abcde");
    expect(calculateChecksum("not-a-real-room")).toBe("oarel");
    expect(calculateChecksum("totally-real-room")).not.toBe("decoy");

    expect(partOne(getDayInput(day))).toBe(409147);

    expect(decryptName('qzmt-zixmtkozy-ivhz', 343)).toBe('very encrypted name');

    expect(partTwo(getDayInput(day))).toBe(991); // Check debug log for 'north pole storage'
});