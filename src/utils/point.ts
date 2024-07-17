/**
 * @Author Alexander Bassov Sun Jul 14 2024
 * @Email blackxes.dev@gmail.com
 */

import { IPoint } from "./types";

export class Point implements IPoint {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const PointFunctions = {
  add(a: IPoint, b: IPoint) {
    return new Point(a.x + b.x, a.y + b.y);
  },
  subtract(a: IPoint, b: IPoint) {
    return new Point(a.x - b.x, a.y - b.y);
  },
  multiply(a: IPoint, b: IPoint | number) {
    return typeof b == "number"
      ? new Point(a.x * b, a.y * b)
      : new Point(a.x * b.x, a.y * b.y);
  },
  divide(a: IPoint, b: IPoint | number) {
    return typeof b == "number"
      ? new Point(a.x / b, a.y / b)
      : new Point(a.x / b.x, a.y / b.y);
  },
  compare(a: IPoint, b: IPoint) {
    return a.x == b.x && a.y == b.y;
  },
  toString(point: IPoint, divider: string = "_") {
    return point.x + divider + point.y;
  },
};

export { PointFunctions };
