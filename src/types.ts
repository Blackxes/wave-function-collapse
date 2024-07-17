/**
 * @Author Alexander Bassov Sat Jul 13 2024
 * @Email blackxes.dev@gmail.com
 */

import { TileTypes } from "./data";
import { IPoint } from "./utils/types";

export interface IGlobalGameObject {
  initialized: boolean;
  initialize: () => boolean;
  entities: IWorldObject[];
  createEntity: (position: IPoint, type?: TileType) => void;
  deleteEntity: (position: IPoint) => void;
  getEntity: (coords: IPoint) => IWorldObject | undefined;
  clearEntities: () => void;
  lastUpdate: null | number;
  updateTimer: number;
  updateTimerThreshold: number;
  fpsCounter: number;
  fpsTimer: number;
  lastFps: number;
  run: () => void;
  propagate: () => void;
}

export interface IGlobalRendererObject {
  initialized: boolean;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  contextWrapper: HTMLDivElement | null;
  initialize: () => boolean;
  updateWindow: () => void;
  mountCanvas: () => void;
  /** Converts a global position into the canvas local position */
  toLocalPoint: (point: IPoint) => IPoint;
  /**
   * Converts a raw position into a gridded point
   * @example (230, 20) and tile size of 50 would result in (4, 0)
   */
  toCoords: (position: IPoint) => IPoint;
  render: (delta: number) => void;
}

export interface IRenderModel {
  size: IPoint;
  imagePath: string;
  backgroundColor: string;
}

export type TileType = (typeof TileTypes)[number];

export interface TileTypeContrain {
  type: TileType;
  probability: number;
}

export interface TileNeighbours {
  top: IPoint | null;
  right: IPoint | null;
  bottom: IPoint | null;
  left: IPoint | null;
}

export interface IWorldObject {
  coords: IPoint;
  position: IPoint;
  type: TileType;
  exists: boolean;
  model: IRenderModel;
  mounted: boolean;
}

export interface IWorld {
  tilesCount: IPoint;
  size: IPoint;
  zoom: number;
}
