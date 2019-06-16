const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");

const smartMove = require("./action.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "east";
  const eastSource = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
  const eastExit = Game.flags.eastExit;
  const eastEntrance = Game.flags.eastEntrance1;
  let s2 = Game.getObjectById(Memory.s2);

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    if (Memory.eastHarvesters.length < 2) {
      creep.memory.buildingRoad = false;
      creep.memory.transfer = true;
    }

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        if (creep.name.endsWith("east")) {
          transferEnergyeRm(creep);
        } else {
          transferEnergy(creep);
        }
      } else {
        creep.memory.buildingRoad = true;
      }
    }

    if (creep.memory.transfer) {
      transferEnergy(creep);
    }

    return;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  let target;
  if (creep.pos.isNearTo(eastExit) || creep.pos.x < 1) {
    creep.move(RIGHT);
    creep.move(RIGHT);

    creep.say("RIGHT");
    return;
  }

  if (creep.room.name == "E36N31") {
    if (eastSource) {
      target = eastSource;
    } else {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.east);
    }

    if (target) {
      if (creep.pos.isNearTo(eastSource)) {
        creep.harvest(eastSource);
        creep.say("h");
        creep.memory.sourceId = target.id;
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return;
      } else {
        smartMove(creep, target, 1);
      }
    }
    // else if (!target) {
    //   target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    //   if (target) {
    //     if (creep.pos.isNearTo(target.pos)) {
    //       creep.say("pickup");
    //       creep.pickup(target);
    //       return;
    //     } else {
    //       creep.say("pickup");
    //       creep.moveTo(target, {
    //         reusePath: 20,
    //         range: 1,
    //         visualizePathStyle: { stroke: "#ffffff" }
    //       });
    //       return;
    //     }
    //   }
    // }
  } else if (creep.room.name == "E35N31") {
    smartMove(creep, eastExit, 1);

    if (creep.pos == eastExit.pos) {
      creep.move(TOP);
      creep.move(TOP);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
