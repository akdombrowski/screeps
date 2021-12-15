const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");

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

  switch (rm) {
    case Memory.homeRoomName:
      if (!Memory.extsInCurrentRoomE59S48) {
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

        Memory.extsInCurrentRoomE59S48 = extsInCurrentRoom;
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
      if (!Memory.extsInCurrentRoomE59S48) {
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

        Memory.extsInCurrentRoomE59S48 = extsInCurrentRoom;
      }
      break;
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
    if (!Memory.e35n31Extensions || Memory.e35n31Extensions.length >= 0) {
      exts = Game.rooms[Memory.homeRoomName].find(FIND_MY_STRUCTURES, {
        filter: (struct) => {
          return (
            (struct.structureType === STRUCTURE_EXTENSION ||
              struct.structureType === STRUCTURE_SPAWN) &&
            struct.store &&
            struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      const extIDs = exts.map(function (ext) {
        return ext.id;
      });
      Memory.e35n31Extensions = extIDs;
    } else {
      exts = Memory.e35n31Extensions.map(function (ext) {
        return Game.getObjectById(ext);
      });
    }

    if (!target) {
      let a = creep.pos.findClosestByPath(exts, {
        filter: function (structure) {
          if (!structure.pos) {
            return false;
          }

          if (
            (structure.store && !structure.store[RESOURCE_ENERGY]) ||
            (structure.store &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
          ) {
            return structure;
          }
        },
      });

      if (a) {
        target = a;
        creep.memory.transferTargetId = target.id;
      }
    }
  }

  // containers or storage
  if (!target) {
    if (!Memory.e35s48structs) {
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

      if (structs && structs.length > 0) {
        target = creep.pos.findClosestByPath(structs);
      }
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

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => {
        if (
          structure.structureType === STRUCTURE_STORAGE &&
          !name.startsWith("h")
        ) {
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
            !structure.store ||
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

module.exports = tran;
