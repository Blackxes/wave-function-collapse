/**
 * @Author Alexander Bassov Tue Jul 16 2024
 * @Email blackxes.dev@gmail.com
 */

import { WorldConfig } from "./data";
import { TileNeighbours } from "./types";
import { IPoint, Point } from "./utils";

export function getNeighbours(coords: IPoint, asArray: true): IPoint[];
export function getNeighbours(coords: IPoint, asArray?: false): TileNeighbours;
export function getNeighbours(
  coords: IPoint,
  asArray?: boolean
): IPoint[] | TileNeighbours {
  const neighbours: TileNeighbours = {
    top: coords.y - 1 >= 0 ? new Point(coords.x, coords.y - 1) : null,
    bottom:
      coords.y + 1 < WorldConfig.tilesCount.y
        ? new Point(coords.x, coords.y + 1)
        : null,
    left: coords.x - 1 >= 0 ? new Point(coords.x - 1, coords.y) : null,
    right:
      coords.x + 1 < WorldConfig.tilesCount.x
        ? new Point(coords.x + 1, coords.y)
        : null,
  };

  if (!asArray) {
    return neighbours;
  }

  return Object.values(neighbours).filter((v: IPoint | null) => v) as IPoint[];
}

/**
 * Generates a random number inside the thresholds
 * @param max Upper threshold (Exclusive)
 * @param min Lower threshold (Inclusive)
 */
export const getRandom = (max: number, min: number = 0) =>
  Math.random() * (max - min) + min;

/**
 * Generates a floored random number inside the thresholds
 * @param max Upper threshold (Exclusive)
 * @param min Lower threshold (Inclusive)
 */
export const getRandomFloored = (max: number, min: number = 0) =>
  Math.floor(getRandom(max, min));

export function getNormalized<
  O extends { [K: string]: any },
  K extends keyof O
>(array: O[], key: K): Array<O & { normalizedValue: number }> {
  const total = array.reduce((s, v) => (s += v[key]), 0);
  return array.map((v) => ({ ...v, normalizedValue: v[key] / total }));
}
