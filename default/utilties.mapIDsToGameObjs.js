const profiler = require("./screeps-profiler");

function mapIDsToGameObjs(exts) {
  let extensionIDs = [];
  if (exts && exts.length > 0) {
    extensionIDs = exts.map((ext) => Game.getObjectById(ext));
  }

  return extensionIDs;
}
exports.mapIDsToGameObjs = mapIDsToGameObjs;
mapIDsToGameObjs = profiler.registerFN(mapIDsToGameObjs, "mapIDsToGameObjs");
