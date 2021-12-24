const transferEnergy = require("./transferEnergy.transferEnergy");
const transferEnergyN = require("./action.transferEnergyN");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const smartMove = require("./move.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "north";
  const northSource1 = Game.getObjectById("5bbcaefa9099fc012e639e8c");
  const name = creep.name;
  const sourceId = creep.memory.sourceId;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (creep.room.name === "E35N31") {
    if (creep.pos.isNearTo(Game.flags.northExit)) {
      retval = creep.move(TOP);
    } else if(target) {
      retval = smartMove(creep, target, 1, false, null, null, null, 1);
    } else {
      retval = smartMove(creep, Game.flags.northExit.pos, 1, false, null, null, null, 1);
    }
    return retval;
  }

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        transferEnergyN(creep);
      } else {
        creep.memory.buildingRoad = true;
      }
    } else if (creep.memory.transfer) {
      transferEnergyN(creep);
    }
    return retval;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  if (!target) {
    target = northSource1;
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      creep.say("h," + retval);
      creep.memory.sourceId = target.id;

      return retval;
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
    } else {
      retval = smartMove(creep, target, 1, false, null, null, null, 1);
    }
    return retval;
  } else if (!target) {
    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pos.isNearTo(target.pos)) {
        creep.say("pu");
        retval = creep.pickup(target);
      } else {
        creep.say("pu");
        retval = smartMove(creep, target, 1, false, null, null, null, 1);
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
