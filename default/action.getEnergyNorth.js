const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const buildRoad = require("./action.buildRoad");

const smartMove = require("./action.smartMove");
function vest(creep, flag, path) {
  creep.memory.direction = "north";
  const northSource = Game.getObjectById("5bbcaefa9099fc012e639e8c");
  const northExit = Game.flags.northExit;
  const northEntrance = Game.flags.northEntrance1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    if (Memory.northHarvesters.length < 2) {
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
  if (creep.pos.isNearTo(northExit)) {
    creep.move(TOP);
    creep.move(TOP);

    creep.say("TOP");
    return;
  }

  if (creep.room.name == "E35N32") {
    let eventLog = creep.room.getEventLog();
    let attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
    attackEvents.forEach(event => {
      let target = Game.getObjectById(event.targetId);
      if (target && target.my) {
        console.log(event);
      }
    });
    if (northSource) {
      target = northSource;
    } else {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.north1);
    }

    if (target) {
      if (creep.pos.isNearTo(northSource)) {
        creep.harvest(northSource);
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
    smartMove(creep, northExit, 1);

    if (creep.pos == northExit.pos) {
      creep.move(TOP);
      creep.move(TOP);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
