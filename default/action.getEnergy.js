const { droppedDuty } = require("./action.droppedDuty");
const transferEnToTower = require("./action.transEnTower");
const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const vestEE = require("./action.getEnergyEEast");
const profiler = require("./screeps-profiler");

function vest(
  creep,
  sourceRmTargetedName,
  taskRm,
  flag,
  exit,
  exitDirection,
  targetRoomName
) {
  let tower = Game.getObjectById(Memory.tower1Id);
  let retval = -16;
  let name = creep.name;
  let rmName = creep.room.name;
  let rm = creep.rm;
  let pos = creep ? creep.pos : null;
  let roll = creep.memory.role;
  let s1RmEnAvail = Memory.s1.room.energyAvailable;
  let range = 1;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;

  creep.memory.getEnergy = true;
  creep.memory.transfer = false;

  if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
    console.log(name + " resetting getEnergy");

    creep.memory.path = null;
    creep.memory.getEnergy = false;
    creep.memory.getEnergyTargetId = null;
    creep.memory.transfer = true;
    return OK;
  }

  if (creep.room.name !== homeRoomName && creep.memory.role === "worker") {
    retval = smartMove(creep, Game.flags.Flag1, 5, true, null, 10, 10000, 2);
    return retval;
  }

  creep.memory.getEnergy = true;
  creep.memory.transfer = false;

  let target;
  let lastSourceId = creep.memory.lastSourceId;
  let targetedRmName = sourceRmTargetedName;
  let isTargetStructure = false;

  switch (sourceRmTargetedName) {
    case northRoomName:
      target =
        creep.room.name !== sourceRmTargetedName ? Game.flags.northExit : null;
      targetedRmName = sourceRmTargetedName;
      break;
    case "E36N31":
      target = creep.room.name != sourceRmTargetedName ? Game.flags.east : null;
      targetedRmName = Game.flags.east.room;
      break;
    case "E36N32":
      target =
        creep.room.name != sourceRmTargetedName
          ? Game.flags.neSource1
          : creep.room.name;
      targetedRmName = Game.flags.neSource1.room;
      break;
    case "E35N32":
      target =
        creep.room.name != sourceRmTargetedName ? Game.flags.north1 : null;
      targetedRmName = Game.flags.north1.room;

      break;
    default:
      target = null;
      targetedRmName = Memory.s1.room.name;
      break;
  }

  if (target && targetedRmName != homeRoomName) {
    if (creep.pos.isNearTo(exit)) {
      retval = creep.move(exitDirection);
    } else {
      retval = smartMove(creep, exit, 1, true, null, null, 10000, 1);
    }

    if (retval === OK) {
      creep.say(target.pos.x + "," + target.pos.y + " " + target.room.name);
      return retval;
    } else if (retval === ERR_TIRED) {
      creep.say("f." + retval);
      return retval;
    } else {
      creep.say("cant." + retval);
      return retval;
    }
  } else if (targetedRmName != homeRoomName) {
    if (creep.memory.lastSourceId) {
      lastSourceId = creep.memory.lastSourceId;
      target = Game.getObjectById(creep.memory.lastSourceId);

      if (target && target.room.name != targetedRmName) {
        target = null;
        creep.memory.lastSourceId = null;
      }

      if (target && target.pos.findInRange(FIND_CREEPS, 3).length > 5) {
        creep.memory.lastSourceId = null;
        target = null;
      }
    }

    if (!target) {
      let sources = Game.rooms[targetedRmName].find(FIND_SOURCES_ACTIVE);
      target = chooseSource(creep, sources);
    }

    if (target) {
      creep.memory.lastSourceId = target.id;
      lastSourceId = creep.memory.lastSourceId;
    }

    if (retval === OK) {
      creep.say("TOP");
      return retval;
    } else if (retval != -16) {
      creep.say("cant." + retval);
      return retval;
    }
  }

  if (creep.memory.lastSourceId) {
    target = Game.getObjectById(creep.memory.lastSourceId);

    if (target && target.energy <= 0) {
      target = null;
      creep.memory.lastSourceId = null;
      creep.memory.path = null;
    } else if (target && target.pos.findInRange(FIND_CREEPS, 3).length > 5) {
      target = null;
    }
  }

  if (
    target &&
    target.pos &&
    target.room &&
    !target.energy &&
    !targetedRmName
  ) {
    retval = smartMove(creep, target, 1, true, null, null, null, 1);
    creep.say(target.pos.x + "," + target.pos.y);
    return retval;
  }

  // target = target || Game.getObjectById(lastSourceId);
  let sources;
  if (
    !target &&
    creep.room.name === Memory.homeRoomName &&
    sourceRmTargetedName === Memory.homeRoomName
  ) {
    if (creep.memory.lastSourceId) {
      target = Game.getObjectById(creep.memory.lastSourceId);
      if (target && target.pos.findInRange(FIND_CREEPS, 3).length > 8) {
        creep.say("too busy");
        target = null;
      }
    }

    if (!target) {
      let source1 = Game.getObjectById("59bbc5d22052a716c3cea136");
      let source2 = Game.getObjectById("59bbc5d22052a716c3cea135");
      sources = [source1, source2];
      // 0 or 1 outcome
      let randInt = getRandomInt(2);

      // target = Game.getObjectById(sources[randInt]);
      target = chooseSource(creep, sources);

      if (target) {
        creep.memory.lastSourceId = target.id;
      }
    }
  }

  if (!target || (target && target.energy <= 0)) {
    target = Game.rooms[targetedRmName]
      .find(FIND_SOURCES_ACTIVE, {
        filter: (source) => {
          if (
            targetedRmName.name === targetedRmName.name &&
            source.energy > 0
          ) {
            return source;
          }
        },
      })
      .pop();
  }

  if (target) {
    creep.memory.lastSourceId = target.id;
  }

  // Do I need to pick up some dropped energy somewhere?
  retval = droppedDuty(creep);
  if (retval === OK) {
    return retval;
  } else if (retval === ERR_TIRED) {
    creep.say("drop." + creep.fatigue)
    return retval;
  }else if (retval != -16) {
    console.log(name + " droppedCreep retval " + retval);
  }

  // See if there's a particular target from a previous trip
  // or one that's been specified.
  if (flag && !target) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag).pop();

    // Can't find sources, probably in a different room. Just head that way.
    creep.say("flag");
    if (!target) {
      retval = smartMove(creep, flag, 1, true, null, null, null, 1);
      return retval;
    }
  } else if (creep.memory.flag && !target) {
    creep.say("flag");
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  if (
    !target ||
    (target &&
      target.store &&
      (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50))
  ) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (struct) => {
        const type = struct.structureType;

        if (
          (type === STRUCTURE_CONTAINER || type === STRUCTURE_LINK) &&
          struct.store.getUsedCapacity(RESOURCE_ENERGY) >= 50
        ) {
          // console.log("name: " + structure)
          return struct;
        }
      },
    });
    isTargetStructure = target ? true : false;
  }

  // If i don't have a target yet. Check containers and storage units
  //  for energy.
  if (!target) {
    let southStorageStructures = ["61b469b5b87275b8511dfebf"];
    target = Game.getObjectById(southStorageStructures[0]);
    let storageCreep = creep.room.lookForAt(LOOK_CREEPS, 43, 9).pop();
    let storageCreep2 = creep.room.lookForAt(LOOK_CREEPS, 44, 9).pop();
    if (
      !target ||
      !target.store[RESOURCE_ENERGY] ||
      target.store[RESOURCE_ENERGY] < 400
    ) {
      target = null;
    }
    if (
      target &&
      storageCreep &&
      storageCreep.name !== name &&
      storageCreep2 &&
      storageCreep2.name !== name &&
      pos &&
      creep
    ) {
      if (creep.pos.inRangeTo(target, 5)) {
        creep.say("wait");
        return retval;
      }
    }
  }

  if (
    !target ||
    (target &&
      target.store &&
      (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50))
  ) {
    creep.memory.path = null;
    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
      filter: (structure) => {
        if (structure.pos.findInRange(FIND_CREEPS, 2).length <= 1) {
          return structure;
        }
      },
    });
  }

  if (target) {
    if (target instanceof String || target instanceof Number) {
      target = Game.getObjectById(target);
    }

    if (target instanceof Flag) {
      target = creep.room.lookForAt(
        LOOK_SOURCES,
        target.pos.x,
        target.pos.y
      )[0];
    }

    if (target) {
      // If I have a target, go harvest it.
      creep.memory.lastSourceId = target.id;

      if (target.structureType) {
        isTargetStructure = true;
      }
    }

    // I'm right next to the target. Harvest.
    if (creep.pos.isNearTo(target)) {
      if (isTargetStructure) {
        retval = creep.withdraw(target, RESOURCE_ENERGY);
        if (retval != OK) {
          creep.say("v." + retval);
          creep.memory.lastSourceId = null;
        }
      } else {
        retval = creep.harvest(target);
      }

      if (retval === OK) {
        creep.say("v");
        creep.memory.lastSourceId = target.id;
      } else {
        creep.say(retval);

        creep.memory.lastSourceId = null;
      }
    } else if (creep.fatigue > 0) {
      // Still tired
      creep.say("f." + creep.fatigue);
    } else if (target) {
      retval = smartMove(creep, target, 1, true, null, null, null, 1);

      if (retval === OK) {
        creep.memory.lastSourceId = target.id;
        creep.say(target.pos.x + "," + target.pos.y);
      } else {
        console.log(
          name + " getEnergy smartmove crap " + retval + " target " + target
        );

        creep.say("crap");
      }
    } else {
      creep.memory.lastSourceId = null;
      creep.memory.path = null;

      console.log(name + " getEnergy fart, no target");
      creep.say("fart");
    }
  } else {
    // Something went wrong;
    target = null;
    creep.memory.lastSourceId = target;
    console.log(name + " getEnergy sad, no target");
    creep.say("sad");
  }
  return retval;
}

function chooseSource(creep, sources) {
  if (!sources || sources.length <= 0) {
    return null;
  }

  let target = null;

  if (sources[0].energy <= 0) {
    target = sources[1].energy > 0 ? sources[1] : null;
  }

  if (sources[1] && sources[1] <= 0) {
    target = sources[0].energy > 0 ? sources[0] : null;
  }

  sources = sources.filter((s) => s.energy > 0);
  if (sources.length <= 0) {
    // no sources have energy
    return null;
  }

  if (sources.length === 1) {
    target = sources[0];
  }

  if (!target && creep.pos.inRangeTo(sources[0], 3)) {
    target = sources[0];
  }

  if (!target && creep.pos.inRangeTo(sources[1], 3)) {
    target = sources[1];
  }

  if (!target && sources.length > 0) {
    const numCreepsBySource0 = sources[0].pos.findInRange(
      FIND_CREEPS,
      5
    ).length;
    const numCreepsBySource1 = sources[1].pos.findInRange(
      FIND_CREEPS,
      5
    ).length;
    if (numCreepsBySource0 > numCreepsBySource1 && sources[1].energy > 0) {
      target = sources[1];
    } else if (
      numCreepsBySource1 > numCreepsBySource0 &&
      sources[0].energy > 0
    ) {
      target = sources[0];
    }
  }

  if (!target && sources.length > 0) {
    target = creep.pos.findClosestByPath(sources);
  }
  return target;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
getRandomInt = profiler.registerFN(getRandomInt, "getRandomInt");

vest = profiler.registerFN(vest, "vest");
module.exports = vest;
