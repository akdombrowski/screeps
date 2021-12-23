const moveAway = require("./action.moveAway");
const profiler = require("./screeps-profiler");

function checkIfBlockingSource(creep, range) {
  const nearbySources = creep.pos.findInRange(FIND_SOURCES_ACTIVE, range);
  const nearbyCreeps = creep.pos.findInRange(FIND_CREEPS, range);
  let retval = OK;

  // nearbyCreeps always includes self
  if (nearbyCreeps.length > 1 && nearbySources.length > 0) {
    retval = moveAway(creep, nearbySources, nearbyCreeps);
  }

  return retval;
}

checkIfBlockingSource = profiler.registerFN(
  checkIfBlockingSource,
  "checkIfBlockingSource"
);
exports.checkIfBlockingSource = checkIfBlockingSource;
