const { droppedDuty } = require("./action.droppedDuty");
const transferEnToTower = require("./action.transEnTower");
const transferEnergy = require("./transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const vestEE = require("./action.getEnergyEEast");
const profiler = require("./screeps-profiler");
const { chooseSource } = require("./getEnergy.chooseSource");

function getEnergy(creep, targetRoomName, taskRm, flag, exit, exitDirection) {
  let tower = Game.getObjectById(Memory.tower1Id);
  let retval = -16;
  let name = creep.name;
  let creepRoomName = creep.room.name;
  let rm = creep.rm;
  let pos = creep ? creep.pos : null;
  let roll = creep.memory.role;
  let s1RmEnAvail = Game.getObjectById(Memory.homeRoomSpawn1ID).room
    .energyAvailable;
  let range = 1;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  let lastSourceId = creep.memory.lastSourceId;
  let target = Game.getObjectById(lastSourceId);
  let isTargetStructure = false;
  let homeSource1Creeps = Memory.homeSource1Creeps || [];
  let homeSource2Creeps = Memory.homeSource2Creeps || [];

  creep.memory.getEnergy = true;
  creep.memory.transfer = false;
  creep.memory.transferTargetId = null;

  if (
    creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
  ) {
    console.log(name + " resetting getEnergy");

    _.pull(Memory.homeSource1Creeps, creep.name);
    _.pull(Memory.homeSource2Creeps, creep.name);
    creep.memory.lastSourceId = null;
    creep.memory.path = null;
    creep.memory.getEnergy = false;
    creep.memory.getEnergyTargetId = null;
    creep.memory.transfer = true;
    return OK;
  }

  if (!target && creepRoomName != targetRoomName) {
    if (targetRoomName != northRoomName && creepRoomName === northRoomName) {
      // if in the north room but target is not north, head home
      exitDirection = BOTTOM;
      exit = Game.flags.northEntrance;
    } else if (
      targetRoomName != southRoomName &&
      creepRoomName === southRoomName
    ) {
      if (targetRoomName === southwestRoomName) {
        exitDirection = LEFT;
        exit = Game.flags.southToSouthwest;
      } else {
        exitDirection = TOP;
        exit = Game.flags.southToHome;
      }
    } else if (
      targetRoomName != e58s49RoomName &&
      creepRoomName === e58s49RoomName
    ) {
      // if in the SW room but target room is not SW, head to deepSouth
      exitDirection = RIGHT;
      exit = Game.flags.e59s49Entrance;
    } else if (
      targetRoomName != homeRoomName &&
      creepRoomName === homeRoomName
    ) {
      if (targetRoomName === northRoomName) {
        // if in the home room but target room is north
        exitDirection = TOP;
        exit = Game.flags.homeToNorth;
      } else if (targetRoomName === southRoomName) {
        // in home room but target is not north
        exitDirection = BOTTOM;
        exit = Game.flags.homeToSouth;
      }
    }

    if (creep.pos.isNearTo(exit)) {
      creep.say(exitDirection);
      retval = creep.move(exitDirection);
    } else {
      creep.say(targetRoomName);
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

  if (
    !target ||
    (target &&
      target.store &&
      (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50)) ||
    target.energy <= 0 ||
    target.amount <= 0
  ) {
    creep.memory.lastSourceId = null;
    target = null;
  }

  if (!target) {
    _.remove(
      Memory[creep.room.name + "droppedPickerUpperNames"],
      (name) => name === creep.name
    );

    retval = droppedDuty(creep);

    if (retval === OK || retval === ERR_TIRED) {
      return retval;
    }
  }

  if (!creep.memory.droppedTargetId) {
    Memory[creep.room.name + "droppedPickerUpperNames"] = _.without(
      Memory[creep.room.name + "droppedPickerUpperNames"],
      creep.name
    );
  }

  if (
    (!target && Game.rooms[targetRoomName]) ||
    (target && target.room.name != creep.room.name)
  ) {
    let sources = Game.rooms[targetRoomName].find(FIND_SOURCES);
    let chosenSource = null;

    if (sources.length > 0) {
      chosenSource = chooseSource(creep, sources);
    }

    if (chosenSource) {
      target = chosenSource;
      creep.memory.lastSourceId = target.id;

      // need to define ids in main when ready to use this
      if (target.id === Memory.homeSource1ID) {
        if (!Memory.homeSource1Creeps.find((name) => name === creep.name)) {
          homeSource1Creeps.push(creep.name);

          Memory.homeSource1Creeps = homeSource1Creeps;
        }
      } else if (target.id === Memory.homeSource2ID) {
        if (!Memory.homeSource2Creeps.find((name) => name === creep.name)) {
          homeSource2Creeps.push(creep.name);
          Memory.homeSource2Creeps = homeSource2Creeps;
        }
      }
    }
  }

  if (
    !target ||
    (target &&
      target.store &&
      (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50)) ||
    target.energy <= 0
  ) {
    creep.memory.lastSourceId = null;

    target = creep.room
      .find(FIND_STRUCTURES, {
        filter: (struct) => {
          const type = struct.structureType;

          if (
            type === STRUCTURE_CONTAINER &&
            struct.store.getUsedCapacity(RESOURCE_ENERGY) >= 50
          ) {
            return struct;
          }
        },
      })
      .pop();

    isTargetStructure = target ? true : false;
  }

  if (
    !target ||
    (target && target.store && target.store[RESOURCE_ENERGY] <= 0)
  ) {
    if (Game.rooms[targetRoomName]) {
      target = Game.rooms[targetRoomName]
        .find(FIND_SOURCES_ACTIVE, {
          filter: (source) => {
            if (source.energy > 0) {
              return source;
            }
          },
        })
        .pop();
    }
  }

  // // Do I need to pick up some dropped energy somewhere?
  // if (!name.startsWith("upC")) {
  //   retval = droppedDuty(creep);
  //   if (retval === OK) {
  //     return retval;
  //   } else if (retval === ERR_TIRED) {
  //     creep.say("drop." + creep.fatigue);
  //     return retval;
  //   } else if (retval != -16) {
  //     // console.log(name + " droppedCreep retval " + retval);
  //   }
  // }

  // See if there's a particular target from a previous trip
  // or one that's been specified.
  if (flag && !target) {
    creep.memory.lastSourceId = null;
    target = creep.room.lookForAt(LOOK_SOURCES, flag).pop();

    // Can't find sources, probably in a different room. Just head that way.
    creep.say("🚩");
    if (!target) {
      retval = smartMove(creep, flag, 1, true, null, null, null, 1);
      return retval;
    }
  } else if (creep.memory.flag && !target) {
    creep.say("memory.🚩");
    creep.memory.lastSourceId = null;
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  // // If i don't have a target yet. Check storage units
  // //  for energy.
  // if (!target) {
  //   let southStorageStructures = ["61b469b5b87275b8511dfebf"];
  //   target = Game.getObjectById(southStorageStructures[0]);
  //   let storageCreep = creep.room.lookForAt(LOOK_CREEPS, 43, 9).pop();
  //   let storageCreep2 = creep.room.lookForAt(LOOK_CREEPS, 44, 9).pop();
  //   if (
  //     !target ||
  //     !target.store[RESOURCE_ENERGY] ||
  //     target.store[RESOURCE_ENERGY] < 400
  //   ) {
  //     target = null;
  //   }
  //   if (
  //     target &&
  //     storageCreep &&
  //     storageCreep.name !== name &&
  //     storageCreep2 &&
  //     storageCreep2.name !== name &&
  //     pos &&
  //     creep
  //   ) {
  //     if (creep.pos.inRangeTo(target, 5)) {
  //       creep.say("wait");
  //       return retval;
  //     }
  //   }
  // }

  // // get from link
  // if (
  //   !target ||
  //   (target &&
  //     target.store &&
  //     (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50))
  // ) {
  //   creep.memory.lastSourceId = null;
  //   target = creep.room
  //     .find(FIND_STRUCTURES, {
  //       filter: (struct) => {
  //         const type = struct.structureType;

  //         if (
  //           type === STRUCTURE_LINK &&
  //           struct.store.getUsedCapacity(RESOURCE_ENERGY) >= 50
  //         ) {
  //           // console.log("name: " + structure)
  //           return struct;
  //         }
  //       },
  //     })
  //     .pop();
  //   isTargetStructure = target ? true : false;
  // }

  // find the closest active source
  if (
    !target ||
    (target &&
      (target.energy <= 0 ||
        (target.store &&
          (!target.store[RESOURCE_ENERGY] ||
            target.store[RESOURCE_ENERGY] < 50))))
  ) {
    creep.memory.lastSourceId = null;
    creep.memory.path = null;
    target = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
  }

  let isPickupResource = false;
  // find dropped resources
  if (
    !target ||
    (target &&
      (target.energy <= 0 ||
        (target.store &&
          (!target.store[RESOURCE_ENERGY] ||
            target.store[RESOURCE_ENERGY] < 50))))
  ) {
    creep.memory.lastSourceId = null;
    creep.memory.path = null;
    target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: (resource) => {
        resource.resourceType === RESOURCE_ENERGY && resource.amount > 50;
      },
    });
    isPickupResource = true;
  }

  // find tombstones
  if (
    !target ||
    (target &&
      (target.energy <= 0 ||
        (target.store &&
          (!target.store[RESOURCE_ENERGY] ||
            target.store[RESOURCE_ENERGY] < 50))))
  ) {
    creep.memory.lastSourceId = null;
    creep.memory.path = null;
    target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
      filter: (tombstone) => {
        if (tombstone.room.name === creepRoomName) {
          return tombstone.store[RESOURCE_ENERGY] > 50;
        }

        return false;
      },
    });
    if (target) {
      isTargetStructure = true;
    }
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
      if (target.resourceType === RESOURCE_ENERGY) {
        isPickupResource = true;
      }
      if (target.deathTime) {
        isTargetStructure = true;
      }
    }

    // I'm right next to the target. Harvest.
    if (target && creep.pos.isNearTo(target)) {
      if (isTargetStructure) {
        retval = creep.withdraw(target, RESOURCE_ENERGY);
        if (retval != OK) {
          creep.say("v." + retval + "🤬");
          creep.memory.lastSourceId = null;
        }
      } else if (isPickupResource) {
        retval = creep.pickup(target);
      } else {
        retval = creep.harvest(target);
      }

      if (retval === OK) {
        creep.say("🧀");
        creep.memory.lastSourceId = target.id;

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
          _.pull(Memory.homeSource1Creeps, creep.name);
          _.pull(Memory.homeSource2Creeps, creep.name);
        }
      } else if (retval === ERR_TIRED) {
        creep.say("v." + creep.fatigue + "😴");
        creep.memory.lastSourceId = target.id;
      } else {
        creep.say("v." + retval + "🤬");

        creep.memory.lastSourceId = null;
      }
    } else if (creep.fatigue > 0) {
      // Still tired
      creep.say("v." + creep.fatigue + "😴");
    } else if (target) {
      // have target but not near it, move to it
      retval = smartMove(
        creep,
        target,
        1,
        true,
        null,
        null,
        null,
        1,
        false,
        null
      );

      if (retval === OK) {
        creep.memory.lastSourceId = target.id;
        creep.say("v." + target.pos.x + "," + target.pos.y + "🚀");
      } else if (retval === ERR_TIRED) {
        creep.say("v." + creep.fatigue + "😴");
      } else {
        creep.memory.lastSourceId = null;
        // console.log(
        //   name +
        //     " getEnergy smartmove failed " +
        //     retval +
        //     " target " +
        //     target +
        //     " target.pos: " +
        //     target.pos +
        //     " creep.pos: " +
        //     creep.pos
        // );

        creep.say("v." + retval + "💩");
      }
    } else {
      creep.memory.lastSourceId = null;
      creep.memory.path = null;

      console.log(name + " getEnergy fart, no target");
      creep.say("v.    💨  ");
    }
  } else {
    // Something went wrong;
    target = null;
    creep.memory.lastSourceId = target;
    // console.log(name + " getEnergy sad, no target");
    creep.say("v😭");
  }

  return retval;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
getRandomInt = profiler.registerFN(getRandomInt, "getRandomInt");

getEnergy = profiler.registerFN(getEnergy, "getEnergy");
module.exports = getEnergy;

function addMeToSourceList(creep, targetSource) {}
