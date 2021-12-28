const profiler = require("./screeps-profiler");

function tryDeserializingPath(path) {
  if (path && path instanceof String) {
    try {
      path = Room.deserializePath(path);
    } catch (e) {
      console.error("deserializing path from memory: " + e);
    }
  }
  return path;
}
tryDeserializingPath = profiler.registerFN(
  tryDeserializingPath,
  "tryDeserializingPath"
);
exports.tryDeserializingPath = tryDeserializingPath;
