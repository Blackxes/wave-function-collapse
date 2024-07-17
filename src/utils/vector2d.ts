/**
 * @Author Alexander Bassov Sun May 05 2024
 * @Email blackxes.dev@gmail.com
 */

import { IPoint } from "./types";

export interface IStaticPoint {
  add: (a: IPoint, b: IPoint) => IPoint;
  subtract: (a: IPoint, b: IPoint) => IPoint;
  multiply: (a: IPoint, b: IPoint | number) => IPoint;
  divide: (a: IPoint, b: IPoint | number) => IPoint;
}

export interface IVector2d extends IPoint {
  add: (b: IPoint) => void;
  subtract: (b: IPoint) => void;
  multiply: (scale: number) => void;
  divide: (divider: number) => void;
  length: () => number;
  normalize: () => IPoint;
  dot: (b: IPoint) => number;
}

// Static vector
export const Vector2dFunctions = {
  add(a: IPoint, b: IPoint) {
    return new Vector2d(a.x + b.x, a.y + b.y);
  },
  subtract(a: IPoint, b: IPoint) {
    return new Vector2d(a.x - b.x, a.y - b.y);
  },
  multiply(vec: IPoint, scale: number) {
    return new Vector2d(vec.x * scale, vec.y * scale);
  },
  multiplyVec(a: IPoint, b: IPoint) {
    return new Vector2d(a.x * b.x, a.y * b.y);
  },
  divide(vec: IPoint, divider: number) {
    return Vector2dFunctions.multiply(vec, 1 / divider);
  },
  length(vec: IPoint) {
    return Math.sqrt(vec.x ** 2 + vec.y ** 2);
  },
  normalize(vec: IPoint) {
    const length = Vector2dFunctions.length(vec);
    return new Vector2d(vec.x / length, vec.y / length);
  },
  dot(a: IPoint, b: IPoint) {
    return a.x * b.x + a.y * b.y;
  },
};

// Localized vector
export class Vector2d implements IPoint {
  x: number = 0;
  y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  add(b: IPoint) {
    this.x += b.x;
    this.y += b.y;
  }
  subtract(b: IPoint) {
    this.x -= b.x;
    this.y -= b.y;
  }
  multiply(scale: number) {
    this.x *= scale;
    this.y *= scale;
  }
  divide(divider: number) {
    this.multiply(1 / divider);
  }
  length(): number {
    return Vector2dFunctions.length(this);
  }
  normalize(): IPoint {
    return Vector2dFunctions.normalize(this);
  }
  dot(b: IPoint): number {
    return Vector2dFunctions.dot(this, b);
  }
}
