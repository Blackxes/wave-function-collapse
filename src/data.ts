/**
 * @Author Alexander Bassov Sat Jul 13 2024
 * @Email blackxes.dev@gmail.com
 */

import { IRenderModel, IWorld, TileType, TileTypeContrain } from "./types";
import { Point } from "./utils";

export const BaseRenderModel: IRenderModel = {
  size: new Point(50, 50),
  imagePath: "./images/tower.webp",
  backgroundColor: "#ff8000",
};

export const WorldConfig: IWorld = {
  tilesCount: { x: 10, y: 10 },
  size: { x: 500, y: 500 },
  zoom: 1,
};

export const TileTypes = ["grass", "forest", "water", "sand"] as const;

export const FieldContraints = {
  grass: [
    {
      type: "grass",
      probability: 1,
    },
    {
      type: "forest",
      probability: 1,
    },
    {
      type: "sand",
      probability: 1,
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
      type: "sand",
      probability: 1,
    },
    {
      type: "water",
      probability: 1,
    },
    {
      type: "grass",
      probability: 1,
    },
  ],
  water: [
    {
      type: "water",
      probability: 1,
    },
    {
      type: "sand",
      probability: 1,
    },
  ],
} satisfies Record<TileType, TileTypeContrain[]>;
