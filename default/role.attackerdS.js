const smartMove = require("./action.smartMove");
const profiler = require("./screeps-profiler");

function roleAttackerdS(creep) {
  let s1 = Game.spawns.Spawn1;
  let rm = creep.room;
  let creeps = Game.creeps;
  let enAvail = rm.energyAvailable;
  let invader;
  let retval;
  let northExit = Game.flags.northExit;
  let southExit = Game.flags.southExit;
  let getEnergy = creep.memory.getEnergy;
  let transfer = creep.memory.transfer;
  let name = creep.name;

  if (rm.name === Memory.homeRoomName) {
    if (creep.pos.isNearTo(southExit)) {
      retval = creep.move(BOTTOM);
    } else {
      retval = smartMove(creep, southExit, 1);
    }

    return retval;
  }

  let enemyCreep = Game.getObjectById(Memory.dSAttackerId);
  if (enemyCreep) {
    invader = enemyCreep;
  } else {
    let enemyCreeps = rm.find(FIND_HOSTILE_STRUCTURES);

    if (!enemyCreeps || enemyCreeps.length <= 0) {
      enemyCreeps = rm.find(FIND_HOSTILE_CREEPS);
    }

    if (!enemyCreeps || enemyCreeps.length <= 0) {
      enemyCreeps = rm.find(FIND_HOSTILE_SPAWNS);
    }

    invader = enemyCreeps.pop();
  }

  if (creep.pos.isNearTo(invader)) {
    retval = creep.attack(invader);
  } else if (invader) {
    retval = smartMove(creep, invader, 1);
  } else {
    Memory.dSAttackerId = null;
    creep.say("goodbye");
    creep.suicide();
  }
  return retval;
}

roleAttackerdS = profiler.registerFN(roleAttackerdS, "roleAttackerdS");
module.exports = roleAttackerdS;
