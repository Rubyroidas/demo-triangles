import * as PIXI from 'pixi.js';

import {distance, shuffleAlongSide, shuffleInsideArea, Point, sortByCritera, unique} from './utils';

type Triangle = {
    points: Point[];
    color: number;
    alpha: number;
}

const app = new PIXI.Application({backgroundColor: 0xdddddd, width: 1280, height: 768});
document.getElementById('app')!.appendChild(app.view);

const {width, height} = app.view;

const pointsAngles = (pp: Point[]) => [
    Math.atan2(pp[0].y - pp[1].y, pp[0].x - pp[1].x) / Math.PI * 180,
    Math.atan2(pp[0].y - pp[2].y, pp[0].x - pp[2].x) / Math.PI * 180,
];

// POINTS GENERATION
const points: Point[] = unique([
    ...shuffleInsideArea(width, height, 0.005),
    ...(shuffleAlongSide(width, 0.005).map(x => ({x, y: 0}))),
    ...(shuffleAlongSide(width, 0.005).map(x => ({x, y: height - 1}))),
    ...(shuffleAlongSide(height, 0.005).map(y => ({x: 0, y}))),
    ...(shuffleAlongSide(height, 0.005).map(y => ({x: width - 1, y}))),
]);
// CREATING TRIANGLES
const generateTriangles = (points: Point[]): Triangle[] => {
    const triangles: Triangle[] = [];

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const otherPoints = points.filter((p, index) => i !== index);
        const closestPoints = sortByCritera(otherPoints, p => distance(point, p));
        // reiterate this down below
        const triangle: Triangle = {
            points: [point, closestPoints[0]],
            color: 0x800000,
            alpha: Math.random() * 0.5 + 0.25
        };
        for (let k = 0; k < closestPoints.length; k++) {
            const cp = closestPoints[k];
            const pp = [...triangle.points, cp];

            // not on one line
            const [angle1, angle2] = pointsAngles(pp);
            if (!(
                Math.abs(angle1 - angle2) < 10 || Math.abs((angle1 + 180) % 360 - angle2) < 10
            )) {
                triangle.points.push(cp);
                break;
            }
        }

        if (!triangles.find(t => {
            const pointIntersections = t.points.filter(p => triangle.points.includes(p)).length;
            return pointIntersections > 1;
        })) {
            triangles.push(triangle);
        }
    }

    return triangles;
};
const triangles: Triangle[] = generateTriangles(points);

console.table(triangles.map(t => [...t.points.map(({x,y}) => `${x} - ${y}`), ...pointsAngles(t.points)]));

// RENDER
const gr = new PIXI.Graphics();
for (const triangle of triangles) {
    const {points, color, alpha} = triangle;
    if (points.length < 2) {
        continue;
    }

    gr.lineStyle(4, 0x8080ff, 1, 0.5, true);
    gr.beginFill(color, alpha);
    gr.drawPolygon(points.map(p => new PIXI.Point(p.x, p.y)));
    gr.endFill();
}
// debugging points
for (const point of points) {
    gr.lineStyle(2, 0x00ff00, 1, 0.5, true);
    gr.beginFill(0x808080);
    gr.drawCircle(point.x, point.y, 5);
    gr.endFill();
}

app.stage.addChild(gr);
