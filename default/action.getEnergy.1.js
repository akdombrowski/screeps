const { droppedDuty } = require("./action.droppedDuty");

const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const buildRoad = require("./action.buildRoad");

function vest(creep, sourceRmTargeted, taskRm, flag, path) {
  if (creep.memory.buildroad && _.sum(creep.carry) > 0) {
    buildRoad(creep);
    return;
  }

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    if (
      creep.memory.role === "h" &&
      creep.room.energyAvailable > 300 &&
      creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (site) => {
          return site.structureType === STRUCTURE_ROAD;
        },
      })
    ) {
      buildRoad(creep);
      creep.memory.buildroad = true;
      creep.memory.getEnergy = true;
    } else {
      creep.memory.buildroad = false;
      creep.memory.getEnergy = false;
    }
    return;
  } else {
    creep.memory.buildroad = false;
    creep.memory.getEnergy = true;
  }

  let retval = -16;
  let target;
  let name = creep.name;
  let rmName = creep.room.name;
  let rm = creep.rm;
  let lastSourceId = creep.memory.lastSourceId;
  let numCrps = Object.keys(Game.creeps).length;
  let targetedRm = Game.rooms[sourceRmTargeted];
  let isTargetStructure = false;

  if (creep.room.name === "E35N31") {
    console.log(creep.name + " " + targetedRm + " " + rmName);
  }

  if (!targetedRm) {
    switch (sourceRmTargeted) {
      case "E34N31":
        targetedRm = Game.flags.west.room;
        break;
      case "E36N31":
        targetedRm = Game.flags.east.room;
        break;
      case "E36N32":
        targetedRm = Game.flags.neSource1.room;
        break;
      case "E35N32":
        targetedRm = Game.flags.north1.room;
        break;
      default:
        targetedRm = Memory.s1.room;
        break;
    }
  }

  // target = Game.getObjectById(lastSourceId);

  if (targetedRm) {
    target =
      target ||
      targetedRm
        .find(FIND_SOURCES_ACTIVE, {
          filter: (source) => {
            if (creep.room.name === "E35N31") {
              console.log(
                source.pos +
                  " " +
                  creep.room.getPositionAt(41, 8) +
                  " " +
                  source.pos.isEqualTo(41, 8)
              );
            }
            if (
              source.pos.findInRange(FIND_CREEPS, 2).length <= 6 &&
              !(
                creep.room.name === "E35N31" &&
                source.pos.isEqualTo(41, 8)
              )
            ) {
              return source;
            }
          },
        })
        .pop();

    // console.log("target:" + target);

    creep.memory.lastSourceId = target.id;

    retval = smartMove(creep, target, 5, true, "#00A11A", 2000, 2000);
    return retval;
  }

  // Do I need to pick up some dropped energy somewhere?
  retval = droppedDuty(creep);
  if (retval === OK) {
    return retval;
  }

  // See if there's a particular target from a previous trip
  // or one that's been specified.
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag);
    creep.say("flag");
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag);
  }

  // // If I don't have a target yet or the target has no energy look for a \
  // // new source
  // if (!target || target.energy <= 0) {
  //   target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
  //     filter: (structure) => {
  //       if (structure.pos.findInRange(FIND_CREEPS, 2).length <= 6) {
  //         return structure;
  //       }
  //     },
  //   });
  // }

  // If i don't have a target yet. Check containers and storage units
  //  for energy.
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        if (
          (structure.structureType == STRUCTURE_CONTAINER ||
            structure.structureType == STRUCTURE_STORAGE) &&
          _.sum(structure.store) >= creep.carryCapacity &&
          structure.pos.findInRange(FIND_CREEPS, 2).length <= 6
        ) {
          return structure;
        }
      },
    });
    isTargetStructure = target ? true : false;
  }

  // If I have a target, go harvest it.
  if (target) {
    creep.memory.lastSourceId = target.id;
    // I'm right next to the target. Harvest.
    if (creep.pos.isNearTo(target)) {
      if (isTargetStructure) {
        retval = creep.withdraw(target, RESOURCE_ENERGY);
      } else {
        retval = creep.harvest(target);
      }
      if (retval === OK) {
        creep.say("v");
      } else {
        creep.say("v." + retval);
      }
    } else if (creep.fatigue > 0) {
      // Still tired
      creep.say("f." + creep.fatigue);
      return;
    } else if (path) {
      // There's already a found path I can taked
      if (creep.pos.isNearTo(creep.room.getPositionAt(path[0].x, path[0].y))) {
        retval = creep.moveByPath(path);
      }
      if (retval === OK) {
        creep.say("m." + target.pos.x + "," + target.pos.y);
      } else {
        creep.say("mp." + retval);
      }
    } else {
      retval = smartMove(creep, target, 1, true, "#FF32F1", 2000, 1000);
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
