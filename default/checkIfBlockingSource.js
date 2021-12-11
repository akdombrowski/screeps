const moveAway = require("./action.moveAway");

function checkIfBlockingSource(creep) {
  const nearbySources = creep.pos.findInRange(FIND_SOURCES_ACTIVE, 1);
  const nearbyCreeps = creep.pos.findInRange(FIND_CREEPS, 1);
  let retval = OK;

  if (nearbySources.length > 0 &&
    nearbyCreeps.length > 0) {
    retval = moveAway(creep, nearbySources, nearbyCreeps);
  }

  return retval;
}
exports.checkIfBlockingSource = checkIfBlockingSource;
