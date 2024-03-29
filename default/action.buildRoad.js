const smartMove = require("./move.smartMove");
const getEnergy = require("./getEnergy");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");

function buildRoad(creep) {
  let name = creep.name;
  let targetId = creep.memory.targetId;
  let target = null;
  let buildingRoad = creep.memory.buildingRoad || true;
  let retval = -16;

  if (
    creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
  ) {
    buildingRoad = true;
    creep.memory.buildingRoad = buildingRoad;
    creep.memory.lastSourceId = null;
  } else if (creep.store[RESOURCE_ENERGY] <= 0) {
    creep.memory.getEnergy = true;
    creep.memory.buildingRoad = false;
    creep.say("getEn");
    return NOT_ENOUGH_RESOURCES;
  }

  if (buildingRoad && creep.store[RESOURCE_ENERGY] > 0) {
    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      creep.room.lookAt(target).progress >=
        creep.room.lookAt(target).progressTotal
    ) {
      target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
        filter: (constructionSite) => {
          return (
            constructionSite.progress < constructionSite.progressTotal &&
            constructionSite.structureType == STRUCTURE_ROAD
          );
        },
      });
      targetId = target ? target.id : null;
    }

    target = Game.getObjectById(targetId);

    if (target === null) {
      creep.memory.buildingRoad = false;
      creep.memory.transfer = true;
      return retval;
    }

    if (creep.pos.inRangeTo(target, 3)) {
      creep.memory.path = null;

      checkIfBlockingSource(creep);

      if (
        creep.pos.findInRange(FIND_CREEPS, 1).pop().name != creep.name &&
        creep.pos.isNearTo(Game.getObjectById(Memory.source1eRm))
      ) {
        creep.move(LEFT);
        creep.say("pass");
      } else {
        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("rd");
      }
    } else {
      retval = smartMove(creep, target.pos, 3, "#ffff0f");

      if (retval != OK) {
        creep.say("err");
      } else if (creep.fatigue > 0) {
        creep.say("f" + creep.fatigue);
        return ERR_TIRED;
      } else {
        creep.say("m");
      }
    }

    if (creep.store[RESOURCE_ENERGY] <= 0) {
      creep.memory.buildingRoad = false;
      creep.memory.getEnergy = true;
    }
  } else {
    retval = ERR_NOT_ENOUGH_ENERGY;
    creep.memory.getEnergy = true;
    if (creep.memory.direction.startsWith("n")) {
      getEnergy(creep, Memory.northRoomName, null, null, null, null);
    } else {
      getEnergy(creep, Memory.homeRoomName, null, null, null, null);

    }
  }

  return retval;
}

buildRoad = profiler.registerFN(buildRoad, "buildRoad");
module.exports = buildRoad;
