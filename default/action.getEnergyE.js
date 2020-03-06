const transferEnergy = require("./action.transferEnergyEEast");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const smartMove = require("./action.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "east";
  const eastSource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
  const nESource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0ba");
  const nESource2 = Game.getObjectById("5bbcaf0c9099fc012e63a0bb");
  const name = creep.name;
  const sourceId = creep.memory.sourceId;
  let room = creep.room;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

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
    target = eastSource1;

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
      retval = smartMove(creep, target, 1, true, "#000fff", null, null, 1);

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
    creep.say("sad." + retval);
  }
  return retval;
}

module.exports = vest;
