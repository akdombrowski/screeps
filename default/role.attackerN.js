const smartMove = require("./move.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./action.getEnergy");
const profiler = require("./screeps-profiler");

function roleAttackerN(creep) {
  let s1 = Game.spawns.Spawn1;
  let rm = creep.room;
  let creeps = Game.creeps;
  let enAvail = rm.energyAvailable;
  let invader;
  let retval;
  let northExit = Game.flags.northExit;
  let getEnergy = creep.memory.getEnergy;
  let transfer = creep.memory.transfer;
  let name = creep.name;

  if (rm.name === Memory.homeRoomName) {
    if (creep.pos.isNearTo(northExit)) {
      retval = creep.move(TOP);
    } else if (creep.pos.y > 2 && creep.pos.y < 49) {
      retval = smartMove(creep, northExit.pos, 1);
    } else {
      retval = creep.move(TOP);
    }

    return retval;
  } else if (rm.name === Memory.northRoomName) {
    if (creep.pos.y >= 48) {
      retval = creep.move(TOP);
    }
  }

  let enemyCreep = Game.getObjectById(Memory.nAttackerId);
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
    creep.say("goodbye");
    creep.suicide();
  }
  return retval;
}

roleAttackerN = profiler.registerFN(roleAttackerN, "roleAttackerN");
module.exports = roleAttackerN;
