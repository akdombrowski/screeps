const getEnergy = require("./getEnergy");
const smartMove = require("./move.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const build = require("./build");
const profiler = require("./screeps-profiler");

function roleWorker(
  creep,
  flag,
  workRoom,
  exit,
  exitDirection,
  targetRoomName
) {
  let s1 = Game.getObjectById(Memory.s1);
  let name = creep.name;
  let direction = creep.memory.direction;
  let rm = creep.room;
  let pos = creep.pos;
  let retval = -16;
  let homeRoomName = Memory.homeRoomName;

  if (rm.name != targetRoomName) {
    if (creep.pos.isNearTo(exit)) {
      retval = creep.move(exitDirection);
    } else {
      if (exit && exit.pos) {
        creep.say(exit.pos.x + "," + exit.pos.y);
        retval = smartMove(
          creep,
          exit,
          1,
          true,
          null,
          null,
          null,
          1,
          false,
          null
        );
      } else {
        console.log(name + " bogus exit in roleWorker");
      }
    }

    return retval;
  }

  if (
    creep.getEnergy ||
    !creep.store[RESOURCE_ENERGY] ||
    creep.store[RESOURCE_ENERGY] <= 0 ||
    (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && !creep.memory.working)
  ) {
    creep.memory.working = false;
    creep.say("h");
    creep.memory.getEnergy = true;

    retval = getEnergy(creep, homeRoomName);

    return retval;
  } else if (
    creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
  ) {
    creep.memory.working = true;
    creep.memory.getEnergy = false;
  } else if (!creep.memory.working) {
    console.log(name + " role.worker.js confusion ");
    return retval;
  }

  if (creep.memory.working) {
    return build(creep);
  } else {
    return retval;
  }
}

roleWorker = profiler.registerFN(roleWorker, "roleWorker");
module.exports = roleWorker;
