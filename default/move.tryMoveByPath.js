const profiler = require("./screeps-profiler");

function tryMoveByPath(creep, path, name) {
  let retval = -16;
  try {
    retval = creep.moveByPath(path);

    // if (name.startsWith("upCdS")) {
    //   console.log(name + " path in smartMove " + path);
    //   console.log(name + " moveByPath in smartMove " + retval);
    // }
  } catch (e) {
    console.log(name + " moveByPath exception path: " + path);
    console.log(e);

    creep.memory.path = null;
    retval = -16;
  }

  return retval;
}
exports.tryMoveByPath = tryMoveByPath;
tryMoveByPath = profiler.registerFN(tryMoveByPath, "tryMoveByPath");
