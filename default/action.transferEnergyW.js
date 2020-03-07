const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const transEnTower = require("./action.transEnTower");

function tran(creep, flag, dest) {
  let target;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let s1 = Memory.s1;
  let spawn2 = Game.spawns.spawn2;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = rm.energyAvailable;
  let retval = -16;

  if (_.sum(creep.carry) <= 0) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    return retval;
  }

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) < 50) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
    return retval;
  }

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
     if (creep.room.name === "E34N31") {
      if (creep.pos.x > 49) {
        retval = creep.move(RIGHT);
      } else {
        retval = smartMove(creep, tower6, 3);
      }
      return retval;
    } else if (creep.room.name === "E35N31") {
      if (creep.pos.x < 1) {
        return creep.move(RIGHT);
      }
    } else if (flag) {
      target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
    } else if (creep.memory.dest) {
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }
  }

  target = Game.getObjectById(Memory.tower6Id);

  if (
    target &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getUsedCapacity(RESOURCE_ENERGY) >=
      target.store.getCapacity(RESOURCE_ENERGY)
  ) {
    target = null;
    creep.memory.flag = null;
  }

  // if (
  //   target &&
  //   target.structureType === STRUCTURE_TOWER &&
  //   rm &&
  //   enAvail < 1000
  // ) {
  //   target = null;
  //   creep.memory.flag = null;
  // }

  if (!target && direction === "west" && enAvail > 1000) {
    target = towers[5];
  }

  let extensionNeedsEnergy = false;
  if (!target && (direction === "south" || direction === "west")) {
    let exts;

    exts = Game.rooms["E35N31"].find(FIND_STRUCTURES, {
      filter: struct => {
        return struct.structureType === STRUCTURE_EXTENSION;
      },
    });
    Memory.e35n31Extensions = [];
    _.each(exts, ext => {
      Memory.e35n31Extensions.push(ext.id);
    });
    if (!Memory.e35n31Extensions) {
    } else {
      let extsObjs = [];
      _.each(Memory.e35n31Extensions, (val, key, collection) => {
        extsObjs.push(Game.getObjectById(val));
      });
      exts = extsObjs;
    }

    let a = creep.pos.findClosestByPath(exts, {
      filter: function(structure) {
        if (!structure) {
          return false;
        }
        let type = structure.structureType;
        if (
          ((type === STRUCTURE_EXTENSION &&
            structure !== Memory.spawnExts[0] &&
            structure !== Memory.spawnExts[1]) ||
            (structure.structureType === STRUCTURE_SPAWN &&
              structure.name === "spawn2")) &&
          (structure.store[RESOURCE_ENERGY] <= 150 ||
            !structure.store[RESOURCE_ENERGY])
        ) {
          if (direction === "west" && structure.pos.x < 10) {
            target = structure;
            return structure;
          } else if (direction !== "west" && structure.pos.x > 10) {
            target = structure;
            return target;
          }
        }
      },
    });
    if (a) {
      target = a;
    }
  }

  if (!target) {
    let spawns = [s1, spawn2];
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType === STRUCTURE_STORAGE ||
          (structure.structureType == STRUCTURE_CONTAINER && structure.store)
        ) {
          if (direction === "west" && structure.pos.x < 10) {
            return (
              structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
            );
          } else {
            return (
              structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
            );
          }
        }
      },
    });
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    creep.memory.path = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.say("t");
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    retval = smartMove(creep, target, 1);

    if (retval !== OK) {
      creep.memory.path = null;
      creep.say("m.err." + retval);
    } else if (retval === OK) {
      creep.memory.dest = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
    }
  } else {
    creep.memory.path = null;
    creep.say("t.err");
  }

  if (retval) {
    return retval;
  }
}

module.exports = tran;
