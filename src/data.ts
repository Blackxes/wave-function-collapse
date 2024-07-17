/**
 * @Author Alexander Bassov Sat Jul 13 2024
 * @Email blackxes.dev@gmail.com
 */

import { IRenderModel, IWorld, TileType, TileTypeContrain } from "./types";
import { Point } from "./utils";

export const BaseRenderModel: IRenderModel = {
  size: new Point(10, 10),
  imagePath: "./images/tower.webp",
  backgroundColor: "#ff8000",
};

export const WorldConfig: IWorld = {
  tilesCount: { x: 50, y: 50 },
  size: { x: 500, y: 500 },
  zoom: 1,
};

export const TileTypes = ["grass", "forest", "water", "sand"] as const;

export const FieldContraints = {
  grass: [
    {
      type: "grass",
      probability: 2,
    },
    {
      type: "forest",
      probability: 0.5,
    },
  ],
  forest: [
    {
      type: "forest",
      probability: 1,
    },
    {
      type: "grass",
      probability: 1,
    },
  ],
  sand: [
    {
      type: "grass",
      probability: 1,
    },
  ],
  water: [
    {
      type: "water",
      probability: 3,
    },
    {
      type: "sand",
      probability: 1,
    },
  ],
} satisfies Record<TileType, TileTypeContrain[]>;
