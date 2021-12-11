const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");

function tran(creep, flag, dest) {
  let targetId = creep.memory.transferTargetId;
  let target = Game.getObjectById(targetId);
  let rm = creep.room;
  let rmName = rm.name;
  let name = creep.name;
  let pos = creep.pos;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let fatigue = creep.fatigue;
  let s1 = Memory.s1;
  let spawn2 = Game.spawns.spawn2;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = rm.energyAvailable;
  let retval = -16;

  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0
  ) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    creep.memory.transferTargetId = null;
    creep.memory.getEnergy = true;
    return -19;
  }

  if (rmName !== "E59S48") {
    retval = smartMove(creep, Game.flags.tower6.pos, 5, true, null, 10, 500, 8);
    return retval;
  }

  if (pos.x < 1) {
    retval = creep.move(RIGHT);
    return retval;
  }

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
    if (flag) {
      target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
    } else if (creep.memory.destID) {
      target = Game.getObjectById(creep.memory.destID);
      // target = creep.memory.destID.pos.lookFor(LOOK_STRUCTURES).pop();
      console.log("target " + target);
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }
  }

  if (
    target &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getUsedCapacity(RESOURCE_ENERGY) >=
      target.store.getCapacity(RESOURCE_ENERGY)
  ) {
    target = null;
    creep.memory.flag = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    enAvail < 1000
  ) {
    target = null;
    creep.memory.flag = null;
  }

  let extensionNeedsEnergy = false;
  if (!target) {
    let exts;

    if (!Memory.e35n31Extensions) {
      exts = Game.rooms[Memory.homeRoomName].find(FIND_STRUCTURES, {
        filter: (struct) => {
          return struct.structureType === STRUCTURE_EXTENSION;
        },
      });
      Memory.e35n31Extensions = [];
      _.each(exts, (ext) => {
        Memory.e35n31Extensions.push(ext.id);
      });
    } else {
      let extsObjs = [];
      _.each(Memory.e35n31Extensions, (val, key, collection) => {
        extsObjs.push(Game.getObjectById(val));
      });
      exts = extsObjs;
    }

    let a = creep.pos.findClosestByPath(exts, {
      filter: function (structure) {
        if (!structure) {
          return false;
        }
        let type = structure.structureType;
        if (
          (type === STRUCTURE_EXTENSION ||
            (structure.structureType === STRUCTURE_SPAWN &&
              structure.name === "spawn2")) &&
          (structure.store[RESOURCE_ENERGY] <= 150 ||
            !structure.store[RESOURCE_ENERGY])
        ) {
          return target;
        }
      },
    });
    if (a) {
      target = a;
      creep.memory.destID = target.id;
    }
  }

  if (!target && enAvail > 1000) {
    let towers = creep.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER },
    });
    let currTarget = towers[0];
    let prevTarget = towers[0];

    _.each(towers, (tower) => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return;
      }

      if (!tower.store[RESOURCE_ENERGY] || tower.store[RESOURCE_ENERGY] <= 0) {
        currTarget = tower;
        return false;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (
        currTarget &&
        currTarget.store &&
        tower.store &&
        currTarget.store.getUsedCapacity([RESOURCE_ENERGY]) > tower.store.getUsedCapacity([RESOURCE_ENERGY])

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
    let spawns = [s1, spawn2];
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        if (
          structure.structureType === STRUCTURE_STORAGE &&
          !name.startsWith("h")
        ) {
          return (
            !structure.store ||
            structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        } else if (
          structure.structureType === STRUCTURE_CONTAINER &&
          structure.store
        ) {
          return (
            !structure.store ||
            structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        }
      },
    });
  }

  if (target && creep.pos.inRangeTo(target, 1)) {
    creep.memory.path = null;
    creep.memory.transferTargetId = target.id;
    if (target instanceof String || target instanceof Number) {
      target = Game.getObjectById(target);
    }
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.memory.path = null;
      creep.memory.transferTargetId = null;
      creep.say("t");
      return retval;
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (target) {
    creep.memory.transferTargetId = target.id;

    retval = smartMove(creep, target, 1);

    if (creep.pos.isNearTo(target)) {
      return -17;
    }
    if (retval !== OK) {
      creep.memory.path = null;

      creep.say("m.err." + retval);
      return retval;
    } else if (retval === OK) {
      creep.memory.destID = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
      return retval;
    }
  } else {
    console.log(name + " no target " + target);
    creep.memory.path = null;
    creep.say("t.err");
  }

  console.log("target: " + target);

  if (retval) {
    console.log(name + " here retval " + retval);
    return retval;
  }
}

module.exports = tran;
