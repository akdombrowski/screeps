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
  let room = creep.room;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;

  if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0 || _.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

    if (name === Memory.eeastSource2CreepName) {
      Memory.eeastSource2CreepName = null;
    }
    return retval;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  if (!target) {
    if (
      (!room.lookForAt(
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
      retval = smartMove(creep, target, 1, false, null, null, null, 1);

      // retval = creep.moveTo(target, {
      //   visualizePathStyle: {
      //     fill: "transparent",
      //     stroke: "#fff",
      //     lineStyle: "dashed",
      //     strokeWidth: 0.15,
      //     opacity: 0.1,
      //   },
      // });
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
