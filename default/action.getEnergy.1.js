const { droppedDuty } = require("./action.droppedDuty");
const transferEnToTower = require("./action.transEnTower");
const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const buildRoad = require("./action.buildRoad");

function vest(creep, sourceRmTargeted, taskRm, flag, maxOps, path) {
  let tower = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower, tower2];
  let retval = -16;
  let name = creep.name;
  let rmName = creep.room.name;
  let rm = creep.rm;
  let roll = creep.memory.role;
  let s1RmEnAvail = Memory.s1.room.energyAvailable;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;
    return OK;
  } else {
    creep.memory.getEnergy = true;
    creep.memory.transfer = false;
  }

  let target;
  let lastSourceId = creep.memory.lastSourceId;
  let numCrps = Object.keys(Game.creeps).length;
  let targetedRm = Game.rooms[sourceRmTargeted];
  let isTargetStructure = false;

  if (!targetedRm) {
    switch (sourceRmTargeted) {
      case "E34N31":
        target = creep.room.name != sourceRmTargeted ? Game.flags.west : null;
        targetedRm = Game.flags.west.room;
        break;
      case "E36N31":
        target = creep.room.name != sourceRmTargeted ? Game.flags.east : null;
        targetedRm = Game.flags.east.room;
        break;
      case "E36N32":
        target =
          creep.room.name != sourceRmTargeted ? Game.flags.neSource1 : null;
        targetedRm = Game.flags.neSource1.room;
        break;
      case "E35N32":
        target = creep.room.name != sourceRmTargeted ? Game.flags.north1 : null;
        targetedRm = Game.flags.north1.room;

        break;
      default:
        target = creep.room.name != sourceRmTargeted ? Game.flags.Flag1 : null;
        targetedRm = Memory.s1.room;
        break;
    }
  }

  if (target && !target.energy && !targetedRm) {
    retval = smartMove(creep, target, 3);
    return retval;
  }

  // target = target || Game.getObjectById(lastSourceId);

  if (targetedRm) {
    if (!target || target.energy <= 0) {
      target = targetedRm
        .find(FIND_SOURCES_ACTIVE, {
          filter: source => {
            if (
              !(targetedRm.name === "E35N31" && source.pos.isEqualTo(41, 8))
            ) {
              // console.log("name2: " + creep.name + " "  + source)

              return source;
            }
          }
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
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag).pop();

    // Can't find sources, probably in a different room. Just head that way.
    if (!target) {
      retval = smartMove(creep, flag, 1);
      return retval;
    }
    creep.say("flag");
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  // console.log("name2: " + creep.name + " "  + target)

  // If i don't have a target yet. Check containers and storage units
  //  for energy.
  if (!target || !target.energy || target.energy <= 0) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
          _.sum(structure.store) >= creep.carryCapacity
        ) {
          // console.log("name: " + structure)
          return structure;
        }
      }
    });

    isTargetStructure = target ? true : false;
    
    if (!target || target.energy <= 0) {
      creep.memory.path = null;
      target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
        filter: structure => {
          if (structure.pos.findInRange(FIND_CREEPS, 2).length <= 6) {
            return structure;
          }
        }
      });
    }
  }

  // If I have a target, go harvest it.
  if (target) {
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
      return;
    }
    // else if (path) {
    //   // There's already a found path I can taked
    //   if (creep.pos.isNearTo(creep.room.getPositionAt(path[0].x, path[0].y))) {
    //     retval = creep.moveByPath(path);
    //   }
    //   if (retval === OK) {
    //     creep.say("m." + target.pos.x + "," + target.pos.y);
    //   } else {
    //     creep.say("mp." + retval);
    //   }
    //
    else {
      retval = smartMove(creep, target, 1, true, "#FF32F1", 2000, 100);
      creep.say("m." + target.pos.x + "," + target.pos.y);
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
