const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const buildRoad = require("./action.buildRoad");

function vest(creep, flag, path) {
  creep.memory.direction = "east";
  const eastSource = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
  const eastExit = Game.flags.eastExit;
  const eastEntrance = Game.flags.eastEntrance1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.buildingRoad = true;
    if (Memory.eastHarvesters.length < 2) {
      creep.memory.buildingRoad = false;
      creep.memory.transfer = true;
    }

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        transferEnergy(creep);
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
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.east1);
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
        let pathMem = 200;
        let igCreeps = true;
        if (moveAwayFromCreep(creep)) {
          pathMem = 0;
          igCreeps = false;
        }
        creep.moveTo(target, {
          range: 1,
          reusePath: pathMem,
          ignoreCreeps: igCreeps,
          visualizePathStyle: { stroke: "f0ffff" }
        });
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
    creep.moveTo(eastExit, {
      visualizePathStyle: { stroke: "#ffffff" }
    });

    if (creep.pos == eastExit.pos) {
      creep.move(TOP);
      creep.move(TOP);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
