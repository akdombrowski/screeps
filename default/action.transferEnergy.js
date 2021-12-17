const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");

function tran(creep, flag, dest, targetRoomName, exit, exitDirection) {
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
    creep.memory.lastSourceId = null;
    creep.memory.getEnergy = true;
    return -19;
  }

  if (!target) {
    switch (rm) {
      case Memory.homeRoomName:
        if (!Memory.extsInCurrentRoome59s48extensionsSpawns) {
          const extsInCurrentRoom = rm.find(FIND_MY_STRUCTURES, {
            filter: {
              function(struct) {
                if (
                  struct.structureType === STRUCTURE_EXTENSION &&
                  struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                ) {
                  return struct;
                }
              },
            },
          });

          Memory.extsInCurrentRoome59s48extensionsSpawns = extsInCurrentRoom;
        }
        break;
      case Memory.northRoomName:
        if (!Memory.extsInCurrentRoomE59S47) {
          const extsInCurrentRoom = rm.find(FIND_MY_STRUCTURES, {
            filter: {
              function(struct) {
                if (
                  struct.structureType === STRUCTURE_EXTENSION &&
                  struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                ) {
                  return struct;
                }
              },
            },
          });

          Memory.extsInCurrentRoomE59S47 = extsInCurrentRoom;
        }
        break;
      default:
        if (!Memory.extsInCurrentRoome59s48extensionsSpawns) {
          const extsInCurrentRoom = rm.find(FIND_MY_STRUCTURES, {
            filter: {
              function(struct) {
                if (
                  struct.structureType === STRUCTURE_EXTENSION &&
                  struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                ) {
                  return struct;
                }
              },
            },
          });

          Memory.extsInCurrentRoome59s48extensionsSpawns = extsInCurrentRoom;
        }
        break;
    }
  }

  if (rmName != targetRoomName) {
    if (creep.pos.isNearTo(exit)) {
      retval = creep.move(exitDirection);
    } else {
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
    }

    return retval;
  }

  // if (
  //   rmName !== targetRoomName &&
  //   !creep.pos.isNearTo(Game.flags.northEntrance)
  // ) {
  //   retval = smartMove(
  //     creep,
  //     Game.flags.northEntrance.pos,
  //     1,
  //     true,
  //     null,
  //     10,
  //     100,
  //     1,
  //     false,
  //     null
  //   );
  //   return retval;
  // }

  // if (
  //   creep.pos.isNearTo(Game.flags.northEntrance) ||
  //   pos.y >= 48 ||
  //   pos.y <= 1
  // ) {
  //   retval = creep.move(BOTTOM);
  //   return retval;
  // }

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
    if (flag && flag.pos) {
      target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    } else if (creep.memory.transferTargetId) {
      target = Game.getObjectById(creep.memory.transferTargetId);
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
    creep.memory.transferTargetId = null;
    creep.memory.path = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    enAvail < 500
  ) {
    target = null;
    creep.memory.path = null;
    creep.memory.flag = null;
  }

  let extensionNeedsEnergy = false;
  if (!target) {
    let exts;
    if (
      !Memory.e59s48extensionsSpawns ||
      Memory.e59s48extensionsSpawns.length <= 0
    ) {
      Memory.e59s48extensionsSpawns = findStructs(
        exts,
        [STRUCTURE_EXTENSION, STRUCTURE_SPAWN],
        Memory.homeRoomName
      );
    } else {
      Memory.e59s48extensionsSpawns = Memory.e59s48extensionsSpawns.filter(
        (struct) =>
          struct.store && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    }

    exts = Memory.e59s48extensionsSpawns.map(function (ext) {
      return Game.getObjectById(ext);
    });

    // find closest ext or spawn by path
    let a = creep.pos.findClosestByPath(exts, {
      filter: function (structure) {
        if (!structure.pos) {
          return false;
        }

        if (
          !structure.store[RESOURCE_ENERGY] ||
          (structure.store &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        ) {
          return true;
        }

        return false;
      },
    });

    if (a) {
      target = a;
      creep.memory.transferTargetId = target.id;

      // remove the target from list
      _.pull(Memory.e59s48extensionsSpawns, target.id);
    } else {
      // target is still null
    }
  }

  // containers or storage
  if (!target) {
    let structs = creep.room.find(FIND_MY_STRUCTURES, {
      filter: function (struct) {
        let type = struct.type;
        return (
          (type === STRUCTURE_CONTAINER || type === STRUCTURE_STORAGE) &&
          (!struct.store[RESOURCE_ENERGY] ||
            struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
        );
      },
    });

    // find closest container or storage
    if (structs && structs.length > 0) {
      target = creep.pos.findClosestByPath(structs);
    }
  }

  // towers
  if (!target && enAvail > 500) {
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
        currTarget.store.getUsedCapacity([RESOURCE_ENERGY]) >
          tower.store.getUsedCapacity([RESOURCE_ENERGY])
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

  // storage or containers
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        if (structure.structureType === STRUCTURE_STORAGE) {
          return (
            structure.store &&
            structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        } else if (
          structure.structureType === STRUCTURE_CONTAINER &&
          structure.store
        ) {
          return (
            structure.store[RESOURCE_ENERGY] <
            structure.store.getCapacity(RESOURCE_ENERGY)
          );
        }
      },
    });
  }

  if (!target) {
    target = Game.spawns.Spawn1;
  }

  if (
    target === Game.spawns.Spawn1 &&
    target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
  ) {
    retval = smartMove(
      creep,
      Game.spawns.Spawn1,
      1,
      false,
      null,
      null,
      null,
      1,
      true,
      null
    );
    target = null;
    return retval;
  }

  if (target && creep.pos.inRangeTo(target, 1)) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.memory.path = null;
      creep.say("t");
      return retval;
    } else if ((retval = ERR_FULL)) {
      creep.memory.transferTargetId = null;
      creep.memory.path = null;
      retval = smartMove(
        creep,
        target,
        10,
        true,
        null,
        null,
        null,
        1,
        true,
        null
      );
      creep.say("full");
      return retval;
    } else {
      creep.say("ouch");
      return creep.move(BOTTOM);
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

      console.log(name + " m.err." + retval);

      creep.say("m.err." + retval);
      return retval;
    } else if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
      return retval;
    }
  } else {
    console.log(name + " no target " + target);
    creep.memory.path = null;
    creep.say("t.err");
  }

  return retval;
}

tran = profiler.registerFN(tran, "tran");
module.exports = tran;

function findStructs(exts, structTypes, targetRoomName) {
  exts = Game.rooms[targetRoomName].find(FIND_MY_STRUCTURES, {
    filter: (struct) => {
      for (let i = 0; i < structTypes.length; i++) {
        if (structTypes[i] === struct.structureType) {
          return struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      }
    },
  });
  const extIDs = exts.map(function (ext) {
    return ext.id;
  });

  return extIDs;
}

findStructs = profiler.registerFN(findStructs, "findStructs");
