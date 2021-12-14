const moveAway = require("./action.moveAway");

function checkIfBlockingSource(creep, range) {
  const nearbySources = creep.pos.findInRange(FIND_SOURCES_ACTIVE, range);
  const nearbyCreeps = creep.pos.findInRange(FIND_CREEPS, range);
  let retval = OK;

  // nearbyCreeps always includes self
  if (nearbyCreeps.length > 1) {
    retval = moveAway(creep, nearbySources, nearbyCreeps);
  }

  return retval;
}
exports.checkIfBlockingSource = checkIfBlockingSource;
