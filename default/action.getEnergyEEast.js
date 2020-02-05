const transferEnergy = require("./action.transferEnergyEEast");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const smartMove = require("./action.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "eeast";
  const eeastSource1 = Game.getObjectById("5bbcaf1b9099fc012e63a2dc");
  const eeastSource2 = Game.getObjectById("5bbcaf1b9099fc012e63a2de");
  const name = creep.name;
  const sourceId = creep.memory.sourceId;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

    if (name === Memory.eeastSource2CreepName) {
      Memory.eeastSource2CreepName = null;
    }

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        transferEnergy(creep);
      } else {
        creep.memory.buildingRoad = true;
      }
    } else if (creep.memory.transfer) {
      transferEnergy(creep);
    }
    return retval;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  if (!target) {
    if (
      (!Room.lookForAt(
        eeastSource2.pos.x + 1,
        eeastSource2.pos.y,
        LOOK_CREEPS
      ) &&
        Memory.eeastSource2CreepName) ||
      Memory.eeastSource2CreepName === name
    ) {
      target = eeastSource2;
      Memory.eeastSource2CreepName = name;
    } else {
      target = eeastSource1;
    }
    creep.memory.sourceId = target.id;
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      creep.say("h");
      creep.memory.sourceId = target.id;

      return retval;
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);

      return retval;
    } else {
      retval = smartMove(creep, target, 1, true, "#000fff", 2000, 1000);

      return retval;
    }
  } else if (!target) {
    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pos.isNearTo(target.pos)) {
        creep.say("pu");
        retval = creep.pickup(target);
      } else {
        creep.say("pu");
        retval = smartMove(creep, target, 1);
      }

      creep.memory.sourceId = null;
      return retval;
    }
  } else {
    console.log("creep.name " + creep.name + " is sad.");
    creep.say("sad");
  }
  return retval;
}

module.exports = vest;
