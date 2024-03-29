const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const profiler = require("./screeps-profiler");

function tranToTower(creep, minRmEnAvail, flag, dest) {
  let target;
  let retval = -16;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let transTowerId = creep.memory.transTowerId;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = rm.energyAvailable;
  let myTowers = creep.memory.myTowers || [];
  let towers4En = [];
  let minEnergy = -Infinity;
  let towerId;
  let destMem = creep.memory.dest;
  let transfering = creep.memory.transferTower;

  if (creep.store[RESOURCE_ENERGY] > 0) {
    creep.memory.transferTower = true;
  } else {
    creep.memory.transferTower = false;
    creep.memory.getEnergy = true;
    return ERR_NOT_ENOUGH_ENERGY;
  }

  if (rm.energyAvailable < minRmEnAvail && !transfering) {
    console.log(name + " rm energy too low or not transfertower");
    return retval;
  }

  if (
    creep.memory.transTowerId &&
    creep.memory.transTowerId.structureType === STRUCTURE_TOWER
  ) {
    target = Game.getObjectById(creep.memory.transTowerId);
  }

  if (!target || target.store.getUsedCapacity(RESOURCE_ENERGY) > 200) {
    target = towers[0];
    let currTarget = towers[0];
    let prevTarget = towers[0];

    _.each(towers, tower => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return;
      }


      // Skip tower 6 for south creeps
      // if (creep.memory.direction === "south") {
      //   return;
      // }

      if (!tower.store[RESOURCE_ENERGY] || tower.store[RESOURCE_ENERGY] <= 0) {
        currTarget = tower;
        return false;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (
        currTarget &&
        currTarget.store &&
        tower.store &&
        tower.store.getFreeCapacity([RESOURCE_ENERGY]) >
          currTarget.store.getFreeCapacity([RESOURCE_ENERGY])
      ) {
        currTarget = tower;
        return true;
      }
      prevTarget = tower;
      return;
    });

    target = currTarget;

    if (
      target &&
      target.store &&
      target.store.getFreeCapacity([RESOURCE_ENERGY]) <= 0
    ) {
      target = null;
    }
  }

  if (!target) {
    creep.say("wut tower?");
    console.log(name + " " + creep.fatigue);
    console.log(name + " wut tower");
    creep.memory.transferTower = false;
    return ERR_NOT_FOUND;
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    creep.memory.path = null;
    creep.memory.transTowerId = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);

    if (retval === OK) {
      creep.say("t");
      creep.memory.dest = target.id;
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    // creep.say("m." + target.pos.x + "," + target.pos.y);
    creep.memory.transTowerId = target.id;
    retval = smartMove(creep, target, 1, true, null, null, null, 1);

    if (retval === ERR_NOT_FOUND) {
      creep.memory.transTowerId = null;
      creep.say("err." + retval);
    } else if (retval != OK) {
      creep.memory.transTowerId = null;
      creep.say("m." + retval);
    } else {
      creep.say("m");
      creep.memory.dest = target.id;
    }

    creep.memory.dest = target.id;
  } else {
    console.log(name + " no target switching off of transentower");
    creep.memory.dest = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.transfer = false;
    creep.memory.transferTower = false;
    creep.memory.path = null;
  }

  return retval;
}

tranToTower = profiler.registerFN(tranToTower, "tranToTower");
module.exports = tranToTower;
