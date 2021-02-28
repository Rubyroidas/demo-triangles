export type Point = {
    x: number;
    y: number;
}

export const shuffleAlongSide = (size: number, percent: number): number[] => {
    const count = Math.round(size * percent); // total points including edges
    const biasedStep = size / (count - 1);
    const result = [0];

    for (let i = 0; i < count; i++) {
        const stepBase = biasedStep * i + biasedStep * 0.25;
        result.push(
            Math.min(size - 1, Math.round(Math.random() * biasedStep * 0.5 + stepBase))
        );
    }

    if (!result.includes(size - 1)) {
        result.push(size - 1);
    }

    return result.sort();
};
// TODO: make space filling true good
export const shuffleInsideArea = (width: number, height: number, percent: number): Point[] => {
    const count = Math.round(width * height * percent * percent);
    return new Array(count).fill(0)
        .map(() => ({
            x: Math.round(Math.random() * width - 1),
            y: Math.round(Math.random() * height - 1),
        }))
        // filtering too close to the border points - 5% close
        .filter(({x, y}) => x > width * 0.05 && y > height * 0.05 && x < width * 0.95 && y < height * 0.95);
};
export const unique = (array: Point[]): Point[] =>
    array.reduce((p: Point[], curr: Point) => {
        let exists = p.find(item => item.x === curr.x && item.y === curr.y);
        if (!exists) {
            p.push(curr);
        }
        return p;
    }, []);
export const sortByCritera = <T>(array: T[], criteria: (f: T) => number): T[] => {
    return array
        .map((item: T): [number, T] => [criteria(item), item])
        .sort(([c1], [c2]) => c1 - c2)
        .map(([_, item]): T => item);
};
export const distance = (p1: Point, p2: Point): number =>
    Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
