/**
 * @Author Alexander Bassov Sat Jul 20 2024
 * @Email blackxes.dev@gmail.com
 */

export interface IClockState {
  initialTime: number;
  last: null | number;
  lastAnimationFrameId: null | number;
  isPaused: boolean;
  timeLeft: number;
  promise: null | Promise<boolean>;
}

export type IClockStateDto = Pick<
  IClockState,
  "initialTime" | "timeLeft" | "isPaused"
>;

export interface IClockUpdateReason {
  isInitial?: boolean;
  hasStarted?: boolean;
  hasPaused?: boolean;
  hasFinished?: boolean;
  hasReseted?: boolean;
}

export type IClockUpdatedCallbackSignature = (
  timeLeft: number,
  reason: IClockUpdateReason
) => void;

export interface IClock {
  start: () => Promise<boolean>;
  reset: () => boolean;
  pause: () => boolean;
  hasStartedOnce: () => boolean;
  getTimeLeft: () => number;
  /** Is clock paused / Does not describe whether the clock was started once ever */
  getIsPaused: () => boolean;
  /** Did the clock ever start once regardless of the pausing state */
  getClockState: () => IClockStateDto;
}

export interface IGigaClock {
  wait: (
    ms: number,
    onUpdated: IClockUpdatedCallbackSignature
  ) => Promise<boolean>;
  create: typeof createClock;
}

const createClock = (
  ms: number,
  onUpdated?: IClockUpdatedCallbackSignature
): IClock => {
  const initialClockTime = Math.max(0, ms);
  const clockState: IClockState = {
    timeLeft: initialClockTime,
    isPaused: true,
    initialTime: initialClockTime,
    last: null,
    promise: null,
    lastAnimationFrameId: 0,
  };

  const resetClock = (): boolean => {
    clockState.timeLeft = initialClockTime;
    clockState.last = null;
    clockState.promise = null;
    onUpdated && onUpdated(initialClockTime, { hasReseted: true });
    return true;
  };

  const startClock = (): Promise<boolean> => {
    clockState.timeLeft <= 0 && resetClock();
    clockState.isPaused = false;
    onUpdated && onUpdated(initialClockTime, { hasStarted: true });
    return clockState.promise ?? (clockState.promise = new Promise(runner));
  };

  const pauseClock = (): boolean => {
    clockState.isPaused = true;
    clockState.lastAnimationFrameId &&
      window.cancelAnimationFrame(clockState.lastAnimationFrameId);
    onUpdated && onUpdated(initialClockTime, { hasPaused: true });
    return true;
  };

  const finishClock = (): boolean => {
    clockState.timeLeft = 0;
    clockState.isPaused = true;
    return true;
  };

  const runner = (resolve: (value: boolean) => void) => {
    const updateClock = () => {
      const delta = performance.now() - (clockState.last ?? performance.now());
      clockState.last = performance.now();

      if (clockState.isPaused) {
        return (clockState.lastAnimationFrameId =
          window.requestAnimationFrame(updateClock));
      }

      clockState.timeLeft -= delta;

      if (clockState.timeLeft < 0) {
        finishClock();
        onUpdated &&
          onUpdated(clockState.timeLeft, {
            hasFinished: true,
          });
        resolve(true);
      } //
      else {
        window.requestAnimationFrame(updateClock);
        onUpdated && onUpdated(clockState.timeLeft, {});
      }
    };
    clockState.lastAnimationFrameId = window.requestAnimationFrame(updateClock);
  };

  // Trigger to setup some potential default values for listeners
  onUpdated && onUpdated(clockState.timeLeft, { isInitial: true });

  return {
    start: startClock,
    pause: pauseClock,
    reset: resetClock,
    hasStartedOnce: () => clockState.timeLeft < initialClockTime,
    getTimeLeft: () => clockState.timeLeft,
    getIsPaused: () => clockState.isPaused,
    getClockState: () => ({
      initialTime: clockState.initialTime,
      isPaused: clockState.isPaused,
      timeLeft: clockState.timeLeft,
    }),
  };
};

const GigaClock: IGigaClock = {
  wait: (ms, onUpdated) => createClock(ms, onUpdated).start(),
  create: createClock,
};

export { GigaClock as Clock };
