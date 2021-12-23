const smartMove = require("./move.smartMove");

function creepinMeOut(creep) {
  let targetId = creep.memory.targetId;
  let target = null;
  let buildingRoad = creep.memory.buildingRoad || true;
  let retval = -16;
  let otherCreep = creep.pos.findInRange(FIND_CREEPS, 1).pop();
  if (otherCreep.name != creep.name) {
    return otherCreep;
  } else {
    return null;
  }
}

module.exports = creepinMeOut;
