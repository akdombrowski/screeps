const profiler = require("./screeps-profiler");

function checkIfValidPath(path, name) {
  if ((path && path.length === 0) || !path || !path[0]) {
    // console.log(name + " smartMove no path");
    return null;
  }
  return path;
}
exports.checkIfValidPath = checkIfValidPath;
checkIfValidPath = profiler.registerFN(checkIfValidPath, "checkIfValidPath");
