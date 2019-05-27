const transferEnergy = require("./action.transferEnergy");

function vest(creep, flag, path) {
  creep.memory.direction = "north";
  const northSource = Game.getObjectById("5bbcaefa9099fc012e639e8c");
  const northExit = Game.flags.northExit;
  const northEntrance = Game.flags.northEntrance1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;
    if (creep.room.name == "E35N32") {
      creep.moveTo(northEntrance, {
        range: 1,
        reusePath: 200,
        visualizePathStyle: { stroke: "ffffff" }
      });
    }
    transferEnergy(creep);

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
    if (northSource) {
      target = northSource;
    } else {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.north1);
    }

    if (target) {
      if (creep.pos.isNearTo(northSource)) {
        creep.harvest(northSource);
        creep.say("h");
      }

      creep.memory.sourceId = target.id;
      if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return;
      }
      creep.moveTo(target, {
        reusePath: 200,
        range: 1,
        visualizePathStyle: { stroke: "ffffff" }
      });
    }
    //  else if (!target) {
    //   target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    //   if (target) {
    //     if (creep.pos.isNearTo(target.pos)) {
    //       creep.say("pickup");
    //       creep.pickup(target);
    //       return;
    //     } else {
    //       creep.say("ðpickup");
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
    creep.moveTo(northExit, {
      reusePath: 200,
      range: 1,
      visualizePathStyle: { stroke: "#ffffff" }
    });

    if (creep.pos == northExit.pos) {
      creep.move(TOP);
      creep.move(TOP);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
