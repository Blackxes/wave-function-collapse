/**
 * @Author Alexander Bassov Sat Jul 20 2024
 * @Email blackxes.dev@gmail.com
 */

export interface IGameLoopState {
  isPaused: boolean;
  isRunning: boolean;
  isTrackingFps: boolean;
  layers: IGameLoopLayer[];
  lastRequestAnimationFrameId: null | ReturnType<
    typeof window.requestAnimationFrame
  >;
}

export interface IGameLoop {
  getFrameRate: () => number;
  pushLayer: (layer: ILayer) => void;
  removeLayer: (identifier: string) => void;
  start: () => void;
  stop: () => void;
  pause: () => void;
  continue: () => void;
  run: () => void;
}

export interface ILayer {
  identifier: string;
  callback: IUpdateCallback;
}
export interface IGameLoopLayer extends ILayer {
  ignoreRunningState?: boolean;
  removable?: boolean;
}

export interface IClockState {
  last: null | number;
  timer: number;
  threshold: number;
}

export interface IFpsTracker {
  counter: number;
  passedUpdates: number;
  deltaSamples: number[];
  /** Max percentual amount of samples of current framerate */
  maxSamplesToFpsRatio: null | number;
  getCurrentRate: () => number;
}

export type IUpdateCallback = (delta: number, currentFrame: number) => void;

const _FpsTracker: IFpsTracker = {
  counter: 0,
  passedUpdates: 0,
  deltaSamples: [],
  maxSamplesToFpsRatio: null,
  getCurrentRate: () =>
    Math.floor(
      1 /
        (_FpsTracker.deltaSamples.reduce((s, v) => (s += v), 0) /
          _FpsTracker.deltaSamples.length)
    ),
};

const _GameLoopClock: IClockState = {
  last: null,
  // To use a custom ups: 1 / ups
  threshold: 1,
  timer: 0,
};

const _GameLoopState: IGameLoopState = {
  isPaused: false,
  isRunning: false,
  isTrackingFps: false,
  layers: [],
  lastRequestAnimationFrameId: null,
};

const GameLoop: IGameLoop = {
  pushLayer(layer) {
    _GameLoopState.layers.push(layer);
  },
  removeLayer(identifier) {
    const foundIndex = _GameLoopState.layers.findIndex(
      (v) => v.identifier == identifier
    );
    foundIndex != -1 && _GameLoopState.layers.splice(foundIndex, 1);
  },
  start: function (): void {
    _GameLoopState.isPaused = false;
    _GameLoopState.isRunning = true;
    _GameLoopState.lastRequestAnimationFrameId = window.requestAnimationFrame(
      GameLoop.run
    );
  },
  stop: function (): void {
    _GameLoopState.isPaused = false;
    _GameLoopState.isRunning = false;
    _GameLoopState.lastRequestAnimationFrameId &&
      window.cancelAnimationFrame(_GameLoopState.lastRequestAnimationFrameId);
  },
  pause: function (): void {
    _GameLoopState.isPaused = true;
  },
  continue: function (): void {
    _GameLoopState.isPaused = false;
  },
  run: function (): void {
    const delta =
      (performance.now() - (_GameLoopClock.last ?? performance.now())) / 1000;
    _GameLoopClock.last = performance.now();
    _GameLoopClock.timer += delta;

    // Fps tracking
    _FpsTracker.deltaSamples.push(delta);
    _FpsTracker.deltaSamples.splice(
      0,
      Math.max(
        0,
        _FpsTracker.deltaSamples.length -
          (1 / delta) * (_FpsTracker.maxSamplesToFpsRatio ?? 1)
      )
    );

    // Update layers
    if (_GameLoopClock.timer > _GameLoopClock.threshold) {
      _FpsTracker.counter++;

      for (let i = 0; i < _GameLoopState.layers.length; i++) {
        const layer = _GameLoopState.layers[i];
        if (!layer.ignoreRunningState && !_GameLoopState.isRunning) {
          continue;
        }
        layer.callback(_GameLoopClock.timer, _FpsTracker.counter);
      }
      _GameLoopClock.timer -= _GameLoopClock.threshold || delta;

      if (_FpsTracker.counter + 1 > 1 / delta) {
        _FpsTracker.counter = 0;
      }
    }

    _GameLoopState.lastRequestAnimationFrameId = window.requestAnimationFrame(
      GameLoop.run
    );
  },
  getFrameRate() {
    return _FpsTracker.getCurrentRate();
  },
};

export default GameLoop;
