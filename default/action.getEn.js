const transferEnergy = require("./action.transferEnergyEEast");
const buildRoad = require("./action.buildRoad");
const transferEnergyE = require("./action.transferEnergyeRm");
const transEn = require("./action.transEn");
const smartMove = require("./action.smartMove");

function sourceWithLessCreeps(
  creep,
  range,
  sources,
  alternateSource,
  numCreepsAllowedNearSource
) {
  let target = sources[0];

  _.forEach(sources, (src) => {
    let sourceCreeps = src.pos.findInRange(FIND_CREEPS, range);
    if (
      sourceCreeps.length < numCreepsAllowedNearSource &&
      !_.any(sourceCreeps, creep)
    ) {
      target = src;
    }
  });

  return target;
}

function vest(creep, flag, path, targetRoomName, source1Id, source2Id) {
  // const nESource1 = Game.getObjectById("5bbcaedb9099fc012e639a94");
  const source1 = Game.getObjectById(source1Id);
  // const nESource2 = Game.getObjectById("5bbcaedb9099fc012e639a95");
  const source2 = Game.getObjectById(source2Id);
  const name = creep.name;
  const sourceId = creep.memory.sourceId;

  let room = creep.room;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
    creep.memory.getEnergy = true;

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        transferEnergy(creep);
      }
    } else if (creep.memory.transfer) {
      transferEnergyE(creep);
    }
    return retval;
  }

  if (room.name !== targetRoomName) {
    retval = smartMove(creep, flag, 10);
    return retval;
  }

  creep.memory.transfer = false;
  creep.memory.getEnergy = true;

  if (!target) {
    target = nESource1;
    target = sourceWithLessCreeps(creep, 1, [nESource1, nESource2]);
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
    creep.say("sad." + retval);
  }
  return retval;
}

module.exports = vest;
