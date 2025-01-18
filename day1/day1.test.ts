import { debug, getDayInput } from 'advent-of-code-utils';

const day = 'day1';

type Coord = {
    x: number;
    y: number;
}

type Line = {
    a: Coord;
    b: Coord;
}

function parseInput(input: string[]): string[] {
    return input.join('').split(',').map(s => s.trim());
}

function manhatten(a: Coord, b: Coord): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function intersection(a: Line, b: Line): Coord | null {
    // Calculate the denominator
    const denominator = ((b.b.y - b.a.y) * (a.b.x - a.a.x) - (b.b.x - b.a.x) * (a.b.y - a.a.y));
    
    // Check for parallel lines
    if (denominator === 0) {
        return null;
    }

    // Calculate intersection point coordinates
    const ua = ((b.b.x - b.a.x) * (a.a.y - b.a.y) - (b.b.y - b.a.y) * (a.a.x - b.a.x)) / denominator;
    const ub = ((a.b.x - a.a.x) * (a.a.y - b.a.y) - (a.b.y - a.a.y) * (a.a.x - b.a.x)) / denominator;

    // Check if intersection point lies on both line segments
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return {
            x: a.a.x + ua * (a.b.x - a.a.x),
            y: a.a.y + ua * (a.b.y - a.a.y)
        }
    }

    // Lines do not intersect
    return null;
}

function turn(direction: string, leftOrRight: string): string {
    const leftTurns: string[] = 'nwse'.split('');
    const rightTurns: string[] = 'nesw'.split('');
    return leftOrRight === 'L' ?
            leftTurns[(leftTurns.indexOf(direction) + 1) % 4] :
            rightTurns[(rightTurns.indexOf(direction) + 1) % 4];
}

function move(steps: string[] = [], stopEarly: boolean = false): Coord {
    let direction: string = 'n';
    let position: Coord = { x: 0, y: 0 };
    let lines: Line[] = [];
    for(let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let duration = Number.parseInt(step.substring(1));
        let next: Coord = { x: position.x, y: position. y };
        direction = turn(direction, step.substring(0, 1));

        switch(direction) {
            case 'n': next.x += duration; break;
            case 's': next.x -= duration; break;
            case 'e': next.y += duration; break;
            case 'w': next.y -= duration; break;
        }

        if(stopEarly) {
            let intersect: Coord | null = lines.reduce((acc, line) => {
                return acc !== null ? acc : intersection({
                    a: position,
                    b: next
                }, line);
            }, null as Coord | null);

            if(intersect !== null) {
                return intersect;
            }

            lines.push({ a: position, b: next });
        }

        position = next;

    }

    return position;
}

function partOne(input: string[]): number {
    let position: Coord = move(parseInput(input));
    return manhatten({ x: 0, y: 0}, position);
}

function partTwo(input: string[]): number {
    let position: Coord = move(parseInput(input), true);
    return manhatten({ x: 0, y: 0}, position);
}

test(day, () => {
    debug(`[**${day}**] ${new Date()}\n\n`, day, false);

    expect(partOne(["R2, L3"])).toBe(5);
    expect(partOne(["R2, R2, R2"])).toBe(2);
    expect(partOne(["R5, L5, R5, R3"])).toBe(12);
    expect(partOne(getDayInput(day))).toBe(291);

    expect(partTwo(["R8, R4, R4, R8"])).toBe(2);
    expect(partTwo(getDayInput(day))).toBe(0);
});
