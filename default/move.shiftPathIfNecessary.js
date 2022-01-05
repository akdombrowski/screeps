const profiler = require("./screeps-profiler");

function shiftPathIfNecessary(path, creepPos) {
  if (path[0] && path[0].x && creepPos.isEqualTo(path[0].x, path[0].y)) {
    console.log("shifting path");

    path.shift();
  }
}
exports.shiftPathIfNecessary = shiftPathIfNecessary;
shiftPathIfNecessary = profiler.registerFN(
  shiftPathIfNecessary,
  "shiftPathIfNecessary"
);
