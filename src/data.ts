/**
 * @Author Alexander Bassov Sat Jul 13 2024
 * @Email blackxes.dev@gmail.com
 */

import { IRenderModel, IWorld, TileType } from "./types";
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
  grass: ["grass", "forest", "sand"],
  forest: ["forest", "grass"],
  sand: ["sand", "water", "grass"],
  water: ["water", "sand"],
} satisfies Record<TileType, TileType[]>;
