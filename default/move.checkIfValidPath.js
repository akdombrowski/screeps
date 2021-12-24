const profiler = require("./screeps-profiler");

function checkIfValidPath(path, name) {
  let retval = -16;
  if ((path && path.length === 0) || !path || !path[0]) {
    // console.log(name + " smartMove no path");
    retval = ERR_NOT_FOUND;
  }
  return retval;
}
exports.checkIfValidPath = checkIfValidPath;
checkIfValidPath = profiler.registerFN(checkIfValidPath, "checkIfValidPath");
