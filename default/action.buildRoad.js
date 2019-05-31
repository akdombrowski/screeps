const smartMove = require("./action.smartMove");

function buildRoad(creep) {
  let targetId = creep.memory.targetId;
  let target = null;
  let buildingRoad = creep.memory.buildingRoad || true;
  let retval = -16;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    buildingRoad = true;
    creep.memory.buildingRoad = buildingRoad;
  }
  if (buildingRoad && _.sum(creep.carry) > 0) {
    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      creep.room.lookAt(target).progress >=
        creep.room.lookAt(target).progressTotal
    ) {
      target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: constructionSite => {
          return (
            constructionSite.progress < constructionSite.progressTotal &&
            constructionSite.structureType == STRUCTURE_ROAD
          );
        }
      });
      targetId = target ? target.id : null;
    }

    target = Game.getObjectById(targetId);

    if (target == null) {
      creep.memory.buildingRoad = false;
      creep.memory.transfer = true;
      return retval;
    }
    if (creep.pos.inRangeTo(target, 3)) {
      retval = creep.build(target);
      creep.memory.b = targetId;
    } else {
      retval = smartMove(creep, target.pos, 3, "#ffff0f");
      if (retval != OK) {
        creep.say("err");
      } else if (creep.fatigue > 0) {
        creep.say("f" + creep.fatigue);
        return ERR_TIRED;
      } else {
        creep.say("road");
      }
    }

    if (creep.carry.energy <= 0) {
      creep.memory.buildingRoad = false;
      creep.memory.getEnergy = true;
    }
  } else {
    retval = ERR_NOT_ENOUGH_ENERGY;
  }
  return retval;
}

module.exports = buildRoad;
