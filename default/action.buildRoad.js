const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergy.1");
const { NOT_ENOUGH_RESOURCES } = require("./constant/msgs");

function buildRoad(creep) {
  let name = creep.name;
  let targetId = creep.memory.targetId;
  let target = null;
  let buildingRoad = creep.memory.buildingRoad || true;
  let retval = -16;

  if (creep.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
    buildingRoad = true;
    creep.memory.buildingRoad = buildingRoad;
  } else if (creep.store[RESOURCE_ENERGY] <= 0) {
    creep.memory.getEnergy = true;
    creep.memory.buildingRoad = false;
    creep.say("getEn");
    return NOT_ENOUGH_RESOURCES;
  }


  console.log(name + " buildRoad")

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
    getEnergy(creep);
  }

  return retval;
}

module.exports = buildRoad;
