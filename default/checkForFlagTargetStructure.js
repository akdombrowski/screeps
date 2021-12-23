const profiler = require("./screeps-profiler");

function checkForFlagTargetStructure(flag, creep) {
  let target = null;
  if (flag && flag.pos) {
    target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }
  return target;
}
exports.checkForFlagTargetStructure = checkForFlagTargetStructure;
checkForFlagTargetStructure = profiler.registerFN(
  checkForFlagTargetStructure,
  "checkForFlagTarget"
);
