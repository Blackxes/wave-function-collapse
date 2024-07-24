import "./app.css";
import { IPoint } from "./utils";
// import {
//   BaseRenderModel,
//   FieldContraints,
//   TileTypes,
//   WorldConfig,
// } from "./data";
// import { getNeighbours, getNormalized } from "./functions";
// import {
//   IWorldObject as IEntity,
//   IGlobalGameObject,
//   IGlobalRendererObject,
//   TileTypeContrain,
// } from "./types";
// import { IPoint, PointFunctions } from "./utils";

const canvas = document.querySelector("canvas") as HTMLCanvasElement;
canvas.width = 800;
canvas.height = 800;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const paintWhite = () => {
  context.save();
  context.fillStyle = "white";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.restore();
};

const state = {
  camera: { x: 0, y: 0 },
  zoom: 1,
};

const size = { w: 100, h: 100 };

const renderObject = (options: { pos: IPoint; backgroundColor: string }) => {
  const fixedPos = {
    x:
      options.pos.x * state.zoom -
      (size.w * state.zoom) / 2 +
      canvas.width / 2 -
      state.camera.x * state.zoom,
    y:
      options.pos.y * state.zoom -
      (size.h * state.zoom) / 2 +
      canvas.height / 2 -
      state.camera.y * state.zoom,
  };

  context.fillStyle = options.backgroundColor;
  context.fillRect(
    fixedPos.x,
    fixedPos.y,
    size.w * state.zoom,
    size.h * state.zoom
  );
};

const objects = [
  {
    x: -100,
    y: -100,
    backgroundColor: "orange",
  },
  {
    x: -100,
    y: 100,
    backgroundColor: "green",
  },
  {
    x: 100,
    y: -100,
    backgroundColor: "red",
  },
  {
    x: 100,
    y: 100,
    backgroundColor: "blue",
  },
];

const render = () => {
  paintWhite();

  // Rect 1
  for (const { x, y, backgroundColor } of objects) {
    renderObject({ pos: { x, y }, backgroundColor });
  }

  context.fillStyle = "green";
  for (let y = 0; y < canvas.height; y += 50) {
    for (let x = 0; x < canvas.width; x += 50) {
      context.fillRect(x, y, 2, 2);
    }
  }

  context.fillStyle = "yellow";
  for (let y = 0; y < canvas.height; y += 100) {
    for (let x = 0; x < canvas.width; x += 100) {
      context.fillRect(x, y, 2, 2);
    }
  }

  window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);
// window.render = render;

document.addEventListener("wheel", (evt: WheelEvent) => {
  // Zoom
  state.zoom = Math.max(1, state.zoom - Math.min(1, Math.max(-1, evt.deltaY)));
  console.log(state, objects);
});

document.addEventListener("keydown", (evt: KeyboardEvent) => {
  if (evt.code == "ArrowUp") state.camera.y -= 50 / state.zoom;
  if (evt.code == "ArrowDown") state.camera.y += 50 / state.zoom;
  if (evt.code == "ArrowLeft") state.camera.x -= 50 / state.zoom;
  if (evt.code == "ArrowRight") state.camera.x += 50 / state.zoom;
});

// const Game: IGlobalGameObject = {
//   initialized: false,
//   initialize: () => {
//     Game.updateCallbacks.push(Game.autoPropagate);

//     return Renderer.initialize();
//   },
//   entities: [],
//   processed: [],
//   updateCallbacks: [],
//   createEntity: (coords, type) => {
//     if (Game.getEntity(coords)) {
//       console.log("Entity already defined");
//       return false;
//     }

//     const entity: IEntity = {
//       coords,
//       model: { ...BaseRenderModel },
//       position: PointFunctions.multiply(coords, BaseRenderModel.size),
//       exists: true,
//       mounted: false,
//       type: type || TileTypes[Math.floor(Math.random() * TileTypes.length)],
//     };

//     Game.entities.push(entity);
//   },
//   deleteEntity: (coords) => {
//     const entityIndex = Game.entities.findIndex((v) =>
//       PointFunctions.compare(v.coords, coords)
//     );
//     const processedIndex = Game.processed.findIndex((v) =>
//       PointFunctions.compare(v, coords)
//     );

//     return (
//       entityIndex != -1 &&
//       Game.entities.splice(entityIndex, 1) &&
//       processedIndex != -1 &&
//       Game.processed.splice(processedIndex, 1)
//     );
//   },
//   getEntity: (coords) => {
//     return Game.entities.find((v) => PointFunctions.compare(coords, v.coords));
//   },
//   isProcessed: (coords) => {
//     return (
//       Game.processed.find((v) => PointFunctions.compare(v, coords)) != undefined
//     );
//   },
//   clearEntities: () => {
//     for (const entity of [...Game.entities]) {
//       Game.deleteEntity(entity.coords);
//     }
//   },
//   lastUpdate: null,
//   updateTimer: 0,
//   updateTimerThreshold: 1 / 20,
//   fpsCounter: 0,
//   fpsTimer: 0,
//   lastFps: 0,
//   run: function () {
//     const delta =
//       (performance.now() - (Game.lastUpdate ?? performance.now())) / 1000;
//     Game.lastUpdate = performance.now();
//     Game.updateTimer += delta;
//     Game.fpsTimer += delta;
//     Game.fpsCounter++;

//     // FPS rendering
//     if (Game.fpsTimer > 1 / 8) {
//       Game.lastFps = Game.fpsCounter * 8;
//       Game.fpsTimer -= 1 / 8;
//       Game.fpsCounter = 0;
//     }

//     // Game update
//     if (Game.updateTimer > Game.updateTimerThreshold) {
//       Game.updateTimer -= Game.updateTimerThreshold;
//       Game.updateCallbacks.forEach((c) => c(delta));
//     }

//     Renderer.render(delta);

//     window.requestAnimationFrame(Game.run);
//   },
//   propagate: () => {
//     /** Array of x_y to avoid duplicates */
//     const processed: IPoint[] = [];

//     for (const entity of [...Game.entities]) {
//       if (Game.isProcessed(entity.coords)) {
//         continue;
//       }

//       // Get entities neighbours
//       const neighbours = getNeighbours(entity.coords, true);

//       // Loop through neighbours and get their neighbours
//       for (const neighbour of neighbours) {
//         // Check if that neighbour has already been processed
//         if (processed.find((v) => PointFunctions.compare(v, neighbour))) {
//           continue;
//         }

//         // Loop through sub neighbours and collect field type contraints
//         const subNeighbours = getNeighbours(neighbour, true);
//         const rawContraints: Array<TileTypeContrain[]> = [];

//         for (const subNeighbour of subNeighbours) {
//           const e = Game.getEntity(subNeighbour);

//           if (!e) {
//             continue;
//           }

//           rawContraints.push(FieldContraints[e.type]);
//         }

//         // debugger;

//         // Filter out invalid contraints
//         // Count the number of times the contrer out the ones less than neighbour count
//         const filteredContraints = rawContraints
//           .flat()
//           .filter(
//             (t, _, a) =>
//               a.filter((v) => v.type == t.type).length == rawContraints.length
//           )
//           .filter((v, i, a) => a.indexOf(v) == i);

//         // debugger;

//         // Remove neighbours to attempt different types and complete the area
//         if (!filteredContraints.length) {
//           subNeighbours.forEach((v) => Game.deleteEntity(v));
//           continue;
//         }

//         // Pick a random contraint from probability normalized contraints
//         const normalized = Object.values(
//           getNormalized(filteredContraints, "probability")
//         ).sort((a, b) => b.normalizedValue - a.normalizedValue);

//         // debugger;

//         let randomNumber = Math.random();
//         let threshold = 0;
//         // Commulate probabilities until the randomNumber is lower which selects the tile type
//         const selectedContraint = normalized.find(
//           (v) => (threshold += v.normalizedValue) && threshold > randomNumber
//         );

//         Game.createEntity(neighbour, selectedContraint?.type);

//         // Add to processed neighbours
//         processed.push(neighbour);
//       }

//       Game.processed.push(entity.coords);
//     }

//     return Game.processed.length != Game.entities.length;
//   },
//   autoPropagationEnabled: false,
//   autoPropagate: (_) => {
//     if (!Game.autoPropagationEnabled) {
//       return;
//     }

//     if (!Game.propagate()) {
//       Game.stopAutoPropagation();
//     }
//   },
//   startAutoPropagation: () =>
//     !void console.log("Auto propagation started") &&
//     (Game.autoPropagationEnabled = true),
//   stopAutoPropagation: () =>
//     !void console.log("Auto propagation stopped") &&
//     (Game.autoPropagationEnabled = false),

//   currentPaintingTileType: null,
// };

// const Renderer: IGlobalRendererObject = {
//   canvas: null,
//   context: null,
//   contextWrapper: null,
//   initialized: false,
//   initialize: () => {
//     Renderer.canvas = document.createElement("canvas");
//     Renderer.context = Renderer.canvas.getContext("2d");

//     if (!Renderer.canvas) return false;

//     Renderer.canvas.width = WorldConfig.size.x;
//     Renderer.canvas.height = WorldConfig.size.y;
//     Renderer.contextWrapper = document.querySelector(".game-wrapper");

//     if (
//       Renderer.canvas.height != window.innerHeight ||
//       Renderer.canvas.width != window.innerWidth
//     ) {
//       Renderer.contextWrapper?.classList.add("detatched");
//     }

//     Renderer.canvas.classList.add("game-canvas");
//     window.addEventListener("resize", Renderer.updateWindow.bind(Renderer));

//     return (Renderer.initialized = true);
//   },
//   updateWindow: () => {
//     if (!Renderer.canvas) return false;

//     // Renderer.canvas.width = window.innerWidth;
//     // Renderer.canvas.height = window.innerHeight;
//   },
//   mountCanvas: () => {
//     if (!Renderer.contextWrapper || !Renderer.canvas) return false;

//     Renderer.contextWrapper.append(Renderer.canvas);
//   },
//   toLocalPoint: (point) => {
//     return {
//       x: point.x - (Renderer.canvas?.offsetLeft || 0),
//       y: point.y - (Renderer.canvas?.offsetTop || 0),
//     };
//   },
//   toCoords: (point) => {
//     return {
//       x: Math.floor(point.x / BaseRenderModel.size.x),
//       y: Math.floor(point.y / BaseRenderModel.size.y),
//     };
//   },
//   render: (_) => {
//     const context = Renderer.context as unknown as CanvasRenderingContext2D;
//     const canvas = Renderer.canvas as unknown as HTMLCanvasElement;

//     // Clear canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw units
//     for (const unit of Game.entities) {
//       if (!unit.mounted) {
//         // const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
//         // unit.model.backgroundColor = color;
//         unit.mounted = true;
//       }

//       switch (unit.type) {
//         case "grass":
//           context.fillStyle = "lime";
//           break;
//         case "sand":
//           context.fillStyle = "yellow";
//           break;
//         case "forest":
//           context.fillStyle = "darkgreen";
//           break;
//         case "water":
//           context.fillStyle = "blue";
//           break;
//       }

//       context.fillRect(
//         unit.position.x,
//         unit.position.y,
//         unit.model.size.x,
//         unit.model.size.y
//       );
//     }

//     context.textAlign = "right";
//     context.textBaseline = "hanging";
//     context.font = "12px system-ui";
//     context.fillStyle = "red";
//     context.fillText(Game.lastFps + "" || "-", canvas.width - 10, 10);
//   },
// };

// document.addEventListener("DOMContentLoaded", () => {
//   const jsNotEnabled = document.querySelector("#js-not-enabled");

//   if (!jsNotEnabled) return;

//   jsNotEnabled?.remove();

//   // Prepare canvas
//   Game.initialize();
//   Renderer.initialize();
//   Renderer.mountCanvas();

//   if (!Renderer.canvas || !Renderer.context) {
//     return !void console.log("Initialization failed.") && false;
//   }

//   // Initiate random tile
//   // const randomTile = PointFunctions.divide(
//   //   new Point(
//   //     Math.floor(Math.random() * WorldConfig.size.x),
//   //     Math.floor(Math.random() * WorldConfig.size.y)
//   //   ),
//   //   BaseRenderModel.size
//   // );
//   // Game.createUnitOnCoords(randomTile);

//   // Handles mouse input // Creates/Removes tiles
//   const handleMouseEvent = (evt: MouseEvent) => {
//     const localPoint = Renderer.toCoords(
//       Renderer.toLocalPoint(new Point(evt.clientX, evt.clientY))
//     );

//     if (evt.buttons == 1) {
//       Game.createEntity(localPoint, Game.currentPaintingTileType ?? "forest");
//     } else if (evt.buttons == 2) {
//       Game.deleteEntity(localPoint);
//     }
//   };

//   // Event listeners
//   Renderer.canvas.addEventListener("mousedown", handleMouseEvent);
//   Renderer.canvas.addEventListener("mousemove", handleMouseEvent);
//   Renderer.canvas.addEventListener(
//     "mouseup",
//     () => (Game.currentPaintingTileType = null)
//   );
//   document.addEventListener("contextmenu", (evt) => evt.preventDefault());

//   document.querySelector(".action-propagate")?.addEventListener("click", () => {
//     Game.propagate();
//   });

//   document
//     .querySelector(".action-propagate-auto")
//     ?.addEventListener("click", () => {
//       Game.startAutoPropagation();
//     });

//   document
//     .querySelector(".action-field-define-random")
//     ?.addEventListener("click", () => {
//       const point = new Point(
//         getRandomFloored(WorldConfig.tilesCount.x),
//         getRandomFloored(WorldConfig.tilesCount.y)
//       );

//       Game.createEntity(point);
//     });
//   document
//     .querySelector(".action-field-clear")
//     ?.addEventListener("click", () => {
//       Game.clearEntities();
//     });

//   // Add selection buttons for available field types
//   const wel_manipulation_actions = document.querySelector(
//     ".actions-field-manipulation"
//   );

//   const els_paintButtons: HTMLButtonElement[] = [];

//   for (const config of TileTypeConfigs) {
//     const el_button = document.createElement("button");
//     el_button.textContent =
//       config.type.charAt(0).toUpperCase() + config.type.substring(1);
//     el_button.setAttribute("type", "button");
//     el_button.setAttribute("data-tiletype", config.type);
//     el_button.style.setProperty("--bs-btn-bg", config.backgroundColor);
//     el_button.style.setProperty("--bs-btn-color", config.frontgroundColor);
//     el_button.style.setProperty(
//       "--bs-btn-hover-bg",
//       "rgba(from var(--bs-btn-bg) r g b / 0.25)"
//     );
//     // el_button.style.setProperty(
//     //   "--bs-btn-hover-border-color",
//     //   config.backgroundColor
//     // );
//     el_button.classList.add(
//       "action",
//       "action-set-painttype",
//       "px-4",
//       "btn",
//       "btn-sm"
//     );

//     el_button.addEventListener("click", () => {
//       Game.currentPaintingTileType = config.type;

//       for (const button of els_paintButtons) {
//         Game.currentPaintingTileType == button.dataset["tiletype"]
//           ? button.classList.add("active-paint")
//           : button.classList.remove("active-paint");
//       }
//     });

//     els_paintButtons.push(el_button);

//     wel_manipulation_actions?.appendChild(el_button);
//   }

//   // Scrolling
//   Renderer.canvas.addEventListener("wheel", (evt) => {
//     WorldConfig.zoom += evt.deltaY <= 0 ? 0.1 : -0.1;
//   });

//   Game.run();
// });

// const el = document.createElement("div");
// el.style.fontSize = "30px";
// document.querySelector("body")?.prepend(el);

// GameLoop.pushLayer({
//   identifier: "game",
//   callback: (delta, frame) => {
//     el.textContent = "" + GameLoop.getFrameRate();
//   },
// });

// GameLoop.start();

// let prom: null | Promise<boolean> = null;

// const func = () => {
//   console.log(prom);
//   window.requestAnimationFrame(func);
// }
