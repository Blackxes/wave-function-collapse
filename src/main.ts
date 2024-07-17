import "./app.css";
import {
  BaseRenderModel,
  FieldContraints,
  TileTypes,
  WorldConfig,
} from "./data";
import { getNeighbours, getNormalized, getRandomFloored } from "./functions";
import {
  IWorldObject as IEntity,
  IGlobalGameObject,
  IGlobalRendererObject,
  TileTypeContrain,
} from "./types";
import { IPoint, Point, PointFunctions } from "./utils";

const Game: IGlobalGameObject = {
  initialized: false,
  initialize: () => {
    return Renderer.initialize();
  },
  entities: [],
  processed: [],
  createEntity: (coords, type) => {
    if (Game.getEntity(coords)) {
      console.log("Entity already defined");
      return false;
    }

    console.log(coords, Game.getEntity(coords), Game.entities);

    const entity: IEntity = {
      coords,
      model: { ...BaseRenderModel },
      position: PointFunctions.multiply(coords, BaseRenderModel.size),
      exists: true,
      mounted: false,
      type: type || TileTypes[Math.floor(Math.random() * TileTypes.length)],
    };

    Game.entities.push(entity);
  },
  deleteEntity: (coords) => {
    const index = Game.entities.findIndex((v) =>
      PointFunctions.compare(v.coords, coords)
    );
    return index != -1 && Game.entities.splice(index, 1);
  },
  getEntity: (coords) => {
    return Game.entities.find((v) => PointFunctions.compare(coords, v.coords));
  },
  isProcessed: (coords) => {
    return (
      Game.processed.find((v) => PointFunctions.compare(v, coords)) != undefined
    );
  },
  clearEntities: () => {
    for (const entity of { ...Game.entities }) {
      console.log("Delete", Game.deleteEntity(entity.coords));
    }
  },
  lastUpdate: null,
  updateTimer: 0,
  updateTimerThreshold: 1 / 1,
  fpsCounter: 0,
  fpsTimer: 0,
  lastFps: 0,
  run: function () {
    const delta = performance.now() - (this.lastUpdate ?? performance.now());
    this.lastUpdate = this.lastUpdate ?? performance.now();
    this.fpsTimer += delta;
    this.fpsCounter++;

    if (this.fpsTimer > 1000 / 4) {
      this.lastFps = this.fpsCounter * 4;
      this.fpsTimer -= 1000 / 4;
      this.fpsCounter = 0;
    }

    Renderer.render(delta);

    window.requestAnimationFrame(Game.run.bind(Game));
  },
  propagate: () => {
    /** Array of x_y to avoid duplicates */
    const processed: IPoint[] = [];

    for (const entity of [...Game.entities]) {
      console.group("Tile", entity.coords);
      console.log("TileDetails", entity);

      if (Game.isProcessed(entity.coords)) {
        console.log("Shitty performant");
        console.groupEnd();
        continue;
      }

      // Get entities neighbours
      const neighbours = getNeighbours(entity.coords, true);

      // Loop through neighbours and get their neighbours
      for (const neighbour of neighbours) {
        console.group("Neighbour: ", neighbour);
        // Check if that neighbour has already been processed
        if (processed.find((v) => PointFunctions.compare(v, neighbour))) {
          console.groupEnd();
          continue;
        }

        // Loop through sub neighbours and collect field type contraints
        const subNeighbours = getNeighbours(neighbour, true);
        const rawContraints: Array<TileTypeContrain[]> = [];

        for (const subNeighbour of subNeighbours) {
          const e = Game.getEntity(subNeighbour);

          if (!e) {
            continue;
          }

          rawContraints.push(FieldContraints[e.type]);
        }

        // debugger;

        // Filter out invalid contraints
        // Count the number of times the contrer out the ones less than neighbour count
        const filteredContraints = rawContraints
          .flat()
          .filter(
            (t, _, a) =>
              a.filter((v) => v.type == t.type).length == rawContraints.length
          )
          .filter((v, i, a) => a.indexOf(v) == i);

        // debugger;

        // Remove neighbours to attempt different types and complete the area
        if (!filteredContraints.length) {
          console.log("No contraints available delete neighbours");
          subNeighbours.forEach((v) => Game.deleteEntity(v));
          continue;
        }

        // Pick a random contraint from probability normalized contraints
        const normalized = Object.values(
          getNormalized(filteredContraints, "probability")
        ).sort((a, b) => b.normalizedValue - a.normalizedValue);

        // debugger;

        let randomNumber = Math.random();
        let threshold = 0;
        // Commulate probabilities until the randomNumber is lower which selects the tile type
        const selectedContraint = normalized.find(
          (v) => (threshold += v.normalizedValue) && threshold > randomNumber
        );

        console.log("SelectedContraint: ", selectedContraint);
        console.log("RandomNumber: ", randomNumber);
        console.log("Threshold: ", threshold);

        Game.createEntity(neighbour, selectedContraint?.type);

        // Add to processed neighbours
        processed.push(neighbour);

        console.groupEnd();
      }

      Game.processed.push(entity.coords);

      console.groupEnd();
    }

    console.log("Propagating");
  },
};

const Renderer: IGlobalRendererObject = {
  canvas: null,
  context: null,
  contextWrapper: null,
  initialized: false,
  initialize: () => {
    Renderer.canvas = document.createElement("canvas");
    Renderer.context = Renderer.canvas.getContext("2d");

    if (!Renderer.canvas) return false;

    Renderer.canvas.width = WorldConfig.size.x;
    Renderer.canvas.height = WorldConfig.size.y;
    Renderer.contextWrapper = document.querySelector(".game-wrapper");

    if (
      Renderer.canvas.height != window.innerHeight ||
      Renderer.canvas.width != window.innerWidth
    ) {
      Renderer.contextWrapper?.classList.add("detatched");
    }

    Renderer.canvas.classList.add("game-canvas");
    window.addEventListener("resize", Renderer.updateWindow.bind(Renderer));

    return (Renderer.initialized = true);
  },
  updateWindow: () => {
    if (!Renderer.canvas) return false;

    // Renderer.canvas.width = window.innerWidth;
    // Renderer.canvas.height = window.innerHeight;
  },
  mountCanvas: () => {
    if (!Renderer.contextWrapper || !Renderer.canvas) return false;

    Renderer.contextWrapper.append(Renderer.canvas);
  },
  toLocalPoint: (point) => {
    return {
      x: point.x - (Renderer.canvas?.offsetLeft || 0),
      y: point.y - (Renderer.canvas?.offsetTop || 0),
    };
  },
  toCoords: (point) => {
    return {
      x: Math.floor(point.x / BaseRenderModel.size.x),
      y: Math.floor(point.y / BaseRenderModel.size.y),
    };
  },
  render: (_) => {
    const context = Renderer.context as unknown as CanvasRenderingContext2D;
    const canvas = Renderer.canvas as unknown as HTMLCanvasElement;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw units
    for (const unit of Game.entities) {
      if (!unit.mounted) {
        // const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
        // unit.model.backgroundColor = color;
        unit.mounted = true;
      }

      switch (unit.type) {
        case "grass":
          context.fillStyle = "lime";
          break;
        case "sand":
          context.fillStyle = "yellow";
          break;
        case "forest":
          context.fillStyle = "darkgreen";
          break;
        case "water":
          context.fillStyle = "blue";
          break;
      }

      context.fillRect(
        unit.position.x,
        unit.position.y,
        unit.model.size.x,
        unit.model.size.y
      );
    }

    context.textAlign = "right";
    context.textBaseline = "hanging";
    context.font = "12px system-ui";
    context.fillStyle = "red";
    context.fillText(Game.lastFps + "" || "-", canvas.width - 10, 10);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const jsNotEnabled = document.querySelector("#js-not-enabled");

  if (!jsNotEnabled) return;

  jsNotEnabled?.remove();

  // Prepare canvas
  Game.initialize();
  Renderer.initialize();
  Renderer.mountCanvas();

  if (!Renderer.canvas || !Renderer.context) {
    return !void console.log("Initialization failed.") && false;
  }

  // Initiate random tile
  // const randomTile = PointFunctions.divide(
  //   new Point(
  //     Math.floor(Math.random() * WorldConfig.size.x),
  //     Math.floor(Math.random() * WorldConfig.size.y)
  //   ),
  //   BaseRenderModel.size
  // );
  // Game.createUnitOnCoords(randomTile);

  // Handles mouse input // Creates/Removes tiles
  const handleMouseEvent = (evt: MouseEvent) => {
    const localPoint = Renderer.toCoords(
      Renderer.toLocalPoint(new Point(evt.clientX, evt.clientY))
    );

    // debugger;

    if (evt.buttons == 1) {
      Game.createEntity(localPoint);
    } else if (evt.buttons == 2) {
      Game.deleteEntity(localPoint);
    }
  };

  // Event listeners
  Renderer.canvas.addEventListener("mousedown", handleMouseEvent);
  // Renderer.canvas.addEventListener("mousemove", handleMouseEvent);
  document.addEventListener("contextmenu", (evt) => evt.preventDefault());

  document.querySelector(".action-propagate")?.addEventListener("click", () => {
    Game.propagate();
  });
  document
    .querySelector(".action-field-define-random")
    ?.addEventListener("click", () => {
      const point = new Point(
        getRandomFloored(WorldConfig.tilesCount.x),
        getRandomFloored(WorldConfig.tilesCount.y)
      );

      Game.createEntity(point);
    });
  document
    .querySelector(".action-field-clear")
    ?.addEventListener("click", () => {
      Game.clearEntities();
    });

  // Scrolling
  Renderer.canvas.addEventListener("wheel", (evt) => {
    WorldConfig.zoom += evt.deltaY <= 0 ? 0.1 : -0.1;
  });

  Game.run();
});
