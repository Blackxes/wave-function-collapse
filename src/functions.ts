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
