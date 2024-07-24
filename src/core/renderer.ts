/**
 * @Author Alexander Bassov Mon Jul 22 2024
 * @Email blackxes.dev@gmail.com
 */

export interface IRenderObject {
  position: { x: number; y: number };
  size: { h: number; w: number };
  rotation: number;
}

export interface ICamera {
  viewport: { w: number; h: number };
  position: { x: number; y: number };
}

export interface IScene {
  objects: IRenderObject[];
  camera: ICamera;
}

export interface IRendererState {
  canvas: null | HTMLCanvasElement;
  context: null | CanvasRenderingContext2D;
  width: number;
  height: number;
  scene: null | IScene;
}

export interface RendererInitializingOptions {
  width?: number;
  height?: number;
}

export interface IRenderer {
  initialize: (
    canvas: HTMLCanvasElement,
    options: RendererInitializingOptions
  ) => boolean;
}

const RendererState: IRendererState = {
  canvas: null,
  context: null,
  height: 0,
  width: 0,
  scene: null,
};

const Renderer: IRenderer = {
  initialize: (canvas: HTMLCanvasElement) => {
    RendererState.canvas = canvas;
    RendererState.context = canvas.getContext("2d");
    return true;
  },
};

export default Renderer;
