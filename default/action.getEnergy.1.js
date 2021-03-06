const { droppedDuty } = require("./action.droppedDuty");
const transferEnToTower = require("./action.transEnTower");
const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const buildRoad = require("./action.buildRoad");
const vestEE = require("./action.getEnergyEEast");

function vest(creep, sourceRmTargeted, taskRm, flag, maxOps, path) {
  let tower = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower, tower2];
  let retval = -16;
  let name = creep.name;
  let rmName = creep.room.name;
  let rm = creep.rm;
  let pos = creep ? creep.pos : null;
  let roll = creep.memory.role;
  let direction = creep.memory.direction;
  let s1RmEnAvail = Memory.s1.room.energyAvailable;
  let range = 1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.path = null;
    creep.memory.getEnergy = false;
    creep.memory.getEnergyTargetId = null;
    creep.memory.transfer = true;
    return OK;
  }

  if(creep.room.name !== "E35N31" && creep.memory.role === "worker") {
    retval = smartMove(creep, Game.flags.Flag1, 5, false, null, 10, 1000, 2);
    return retval;
  }

  if (direction === "eeast") {
    retval = vestEE(creep);
    creep.memory.getEnergyTargetId = null;
    return retval;
  }

  creep.memory.getEnergy = true;
  creep.memory.transfer = false;

  let target;
  let lastSourceId = creep.memory.lastSourceId;
  let numCrps = Object.keys(Game.creeps).length;
  let targetedRm = Game.rooms[sourceRmTargeted];
  let isTargetStructure = false;

  if (!targetedRm) {
    switch (sourceRmTargeted) {
      case "E34N31":
        target =
          creep.room.name !== sourceRmTargeted ? Game.flags.westExit : null;
        targetedRm = Game.flags.west.room;
        break;
      case "E36N31":
        target = creep.room.name !== sourceRmTargeted ? Game.flags.east : null;
        targetedRm = Game.flags.east.room;
        break;
      case "E36N32":
        target =
          creep.room.name !== sourceRmTargeted
            ? Game.flags.neSource1
            : creep.room.name;
        targetedRm = Game.flags.neSource1.room;
        break;
      case "E35N32":
        target =
          creep.room.name !== sourceRmTargeted ? Game.flags.north1 : null;
        targetedRm = Game.flags.north1.room;

        break;
      default:
        target = creep.room.name !== sourceRmTargeted ? Game.flags.Flag1 : null;
        targetedRm = Memory.s1.room;
        break;
    }
  }

  if (target && target.pos.room && !target.energy && !targetedRm) {
    retval = smartMove(creep, target, 1, false, null, null, null, 1);
    creep.say("ge.m." + retval);
    return retval;
  }

  // target = target || Game.getObjectById(lastSourceId);
  let sources;
  let useMoveTo = false;
  if (direction === "south") {
    sources = ["5bbcaefa9099fc012e639e8f"];
    target = Game.getObjectById(sources[0]);
    useMoveTo = true;
  }

  if (targetedRm) {
    // if (lastSourceId) {
    //   console.log(name + " getEnergy ");
    //   target = Game.getObjectById(lastSourceId);
    // }

    if (
      !target ||
      (target.room.name === "E35N31" && target.pos.isEqualTo(41, 8)) ||
      target.energy <= 0
    ) {
      target = targetedRm
        .find(FIND_SOURCES_ACTIVE, {
          filter: source => {
            if (
              !(targetedRm.name === "E35N31" && source.pos.isEqualTo(41, 8)) &&
              source.energy > 0
            ) {
              // console.log("name2: " + creep.name + " "  + source)

              return source;
            }
          },
        })
        .pop();
    }

    if (target) {
      creep.memory.lastSourceId = target.id;
    }
  }

  // Do I need to pick up some dropped energy somewhere?
  retval = droppedDuty(creep);
  if (retval === OK) {
    console.log(name + "droppedDuty");
    return retval;
  }

  // See if there's a particular target from a previous trip
  // or one that's been specified.
  if (flag && !target) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag).pop();

    // Can't find sources, probably in a different room. Just head that way.
    if (!target) {
      retval = smartMove(creep, flag, 1, false, null, null, null, 1);
      return retval;
    }
    creep.say("flag");
  } else if (creep.memory.flag && !target) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  if (
    !target ||
    (target &&
      target.store &&
      (!target.store[RESOURCE_ENERGY] || target.store[RESOURCE_ENERGY] < 50))
  ) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: struct => {
        const type = struct.structureType;

        if (
          (type === STRUCTURE_CONTAINER || type === STRUCTURE_LINK) &&
          struct.store.getUsedCapacity(RESOURCE_ENERGY) >= 50 &&
          struct.pos.y < 27 &&
          struct.id !== "5cfd3d207e979d09d3c5ad2c"
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
  if (direction === "south" && !target) {
    let southStorageStructures = ["5d0178505a74ac0a0094daab"];
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
    if (target &&
      storageCreep &&
      storageCreep.name !== name &&
      storageCreep2 &&
      storageCreep2.name !== name &&
      pos && creep
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
      filter: structure => {
        if (structure.pos.findInRange(FIND_CREEPS, 2).length <= 1) {
          return structure;
        }
      },
    });
  }

  if (target) {
    // If I have a target, go harvest it.
    creep.memory.lastSourceId = target.id;
    if (target.structureType) {
      isTargetStructure = true;
    }
    // I'm right next to the target. Harvest.
    if (creep.pos.isNearTo(target)) {
      if (isTargetStructure) {
        retval = creep.withdraw(target, RESOURCE_ENERGY);
        if (retval != OK) {
          creep.say("w." + retval);
          creep.memory.lastSourceId = null;
        }
      } else {
        retval = creep.harvest(target);
      }
      if (retval === OK) {
        creep.say("v");
      } else {
        creep.say("v." + retval);
        creep.memory.lastSourceId = null;
      }
    } else if (creep.fatigue > 0) {
      // Still tired
      creep.say("f." + creep.fatigue);
    } else {
      retval = smartMove(creep, target, 1, false, null, null, null, 1);

      if (retval === OK) {
        creep.say(target.pos.x + "," + target.pos.y);
      } else {
        creep.say("crap");
      }
    }
  } else {
    // Something went wrong;
    target = null;
    creep.memory.lastSourceId = target;
    creep.say("sad");
  }

  return retval;
}

module.exports = vest;
