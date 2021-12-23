const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function fleeFromTargetBecauseFull(creep, retval, target) {
  creep.memory.transferTargetId = null;
  creep.memory.path = null;
  retval = smartMove(creep, target, 10, true, null, null, null, 1, true, null);
  creep.say("full");
  return retval;
}
exports.fleeFromTargetBecauseFull = fleeFromTargetBecauseFull;
fleeFromTargetBecauseFull = profiler.registerFN(
  fleeFromTargetBecauseFull,
  "fleeFromTargetBecauseFull"
);
