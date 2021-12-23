const profiler = require("./screeps-profiler");

function setVisualAndPathInMemory(creep, path, pathColor) {
  creep.room.visual.poly(path, {
    stroke: pathColor,
    lineStyle: "dashed",
    opacity: 0.25,
  });

  if (path[0] && path[0].x && creep.pos.isEqualTo(path[0].x, path[0].y)) {
    path.shift();
    creep.memory.path = path;
  }
}
exports.setVisualAndPathInMemory = setVisualAndPathInMemory;
setVisualAndPathInMemory = profiler.registerFN(
  setVisualAndPathInMemory,
  "setVisualAndPathInMemory"
);
