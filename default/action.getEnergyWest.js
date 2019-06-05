const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "west";
  const westSource = Game.getObjectById("5bbcaeeb9099fc012e639c4e");
  const westExit = Game.flags.westExit;
  const westEntrance = Game.flags.westEntrance1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.buildingRoad = true;
    if (Memory.westHarvesters.length < 2) {
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
  if (creep.pos.isNearTo(westExit)) {
    creep.move(TOP);
    creep.move(TOP);

    creep.say("TOP");
    return;
  }

  if (creep.room.name == "E34N31") {
    if (westSource) {
      target = westSource;
    } else {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.west);
    }

    if (target) {
      if (creep.pos.isNearTo(westSource)) {
        creep.harvest(westSource);
        creep.say("h");
        creep.memory.sourceId = target.id;
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return;
      } else {
        smartMove(creep, target, 1);
      }
    }
    //  else if (!target) {
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
    smartMove(creep, westExit, 1);
    if (creep.pos == westExit.pos) {
      creep.move(LEFT);
      creep.move(LEFT);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
