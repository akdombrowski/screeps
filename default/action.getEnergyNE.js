const transferEnergy = require("./action.transferEnergyEEast");
const buildRoad = require("./action.buildRoad");
const transferEnergyE = require("./action.transferEnergyeRm");
const smartMove = require("./action.smartMove");

function checkForCreepsNearSource(creep, range, sources) {
  let target = sources[0];
  let nESource2 = Game.getObjectById("5bbcaf0c9099fc012e63a0bb");

  _.forEach(sources, src => {
    let sourceCreeps = target.pos.findInRange(FIND_CREEPS, range);
    if (sourceCreeps.length > 2 && !_.any(sourceCreeps, creep)) {
      target = nESource2;
    }
  });

  return target;
}

function vest(creep, flag, path) {
  creep.memory.direction = "ne";
  const eastSource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
  const nESource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0ba");
  const nESource2 = Game.getObjectById("5bbcaf0c9099fc012e63a0bb");
  const name = creep.name;
  const sourceId = creep.memory.sourceId;
  let room = creep.room;


  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    creep.memory.getEnergy = false;

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        transferEnergyE(creep);
      } else {
        creep.memory.buildingRoad = true;
      }
    } else if (creep.memory.transfer) {
      transferEnergyE(creep);
    }
    return retval;
  }

  if(room.name !== "E36N32") {
    retval = smartMove(creep, Game.flags.e36n32contr, 10, false, null, 100, 1000, 4);
    return retval;
  }

  creep.memory.transfer = false;
  creep.memory.getEnergy = true;

  if (!target) {
    target = nESource1;
    target = checkForCreepsNearSource(creep, 1, [nESource1, nESource2]);
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
      retval = smartMove(creep, target, 1, false, null, null, 100, 1);
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
        retval = smartMove(creep, target, 1, false, null, null, 100, 1);
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
