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
  const neSource1 = Game.flags.neSource1;
  const neSource2 = Game.flags.neSource2;
  let s2 = Game.getObjectById(Memory.s2);

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    if (Memory.eastHarvesters.length < 2) {
      creep.memory.buildingRoad = false;
      creep.memory.transfer = true;
    }

    // if (creep.memory.buildingRoad) {
    //   let retval = buildRoad(creep);
    //   if (retval != OK) {
    //     creep.memory.transfer = true;
    //     if (creep.name.endsWith("east")) {
    //       transferEnergyeRm(creep);
    //     } else {
    //       transferEnergy(creep);
    //     }
    //   } else {
    //     creep.memory.buildingRoad = true;
    //   }
    // }

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
    if (neSource1 && creep.memory.role === "h") {
      source1 = creep.room.lookForAt(LOOK_SOURCES, neSource1).pop();
      if (source1 && source1.pos.findInRange(FIND_CREEPS, 2).pop()) {
        target = neSource2;
        creep.memory.nesource = 2;
      } else {
        target = neSource1;
        creep.memory.nesource = 1;
      }
    } else {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.east).pop();
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
        if (smartMove(creep, target, false, 0) === -2) {
          smartMove(creep, target, 1, false, 0);
        }
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
  } else if (creep.room.name === "E36N32") {
    // target = source1;
    if (creep.memory.neSource === 1) {
      target = neSource1;
    } else {
      target = neSource2;
    }
    // if (source1) {
    //   target = source1;
    // }
    if (creep.pos.isNearTo(target)) {
      let retval;
      source = creep.room.lookForAt(LOOK_SOURCES, target).pop();
      target = source;
      retval = creep.harvest(target);
      creep.say("h." + retval);
    } else {
      smartMove(creep, target, 1, false, 0);
    }
  } else {
    console.log("creep.name " + creep.name);
    creep.say("sad");
  }
}

module.exports = vest;
