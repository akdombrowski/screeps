const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function vest(creep, flag, path) {
  creep.memory.direction = "west";
  const westSource = Game.getObjectById("5bbcaeeb9099fc012e639c4e");
  const westExit = Game.flags.westExit;
  const westEntrance = Game.flags.westEntrance1;

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;
    if (creep.room.name == "E35N32") {
      let pathMem = 200;
      let igCreeps = true;
      if (moveAwayFromCreep(creep)) {
        pathMem = 0;
        igCreeps = false;
      }
      creep.moveTo(westEntrance, {
        range: 1,
        ignoreCreeps: igCreeps,
        reusePath: pathMem,
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
        let pathMem = 200;
        let igCreeps = true;
        if (moveAwayFromCreep(creep)) {
          pathMem = 0;
          igCreeps = false;
        }
        creep.moveTo(target, {
          reusePath: pathMem,
          ignoreCreeps: igCreeps,
          range: 1,
          visualizePathStyle: { stroke: "f0ffff" }
        });
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
    let pathMem = 200;
    let igCreeps = true;
    if (moveAwayFromCreep(creep)) {
      pathMem = 0;
      igCreeps = false;
    }
    creep.moveTo(westExit, {
      reusePath: pathmem,
      ignoreCreeps: igCreeps,
      range: 1,
      visualizePathStyle: { stroke: "#ffffff" }
    });

    if (creep.pos == westExit.pos) {
      creep.move(LEFT);
      creep.move(LEFT);
    }
  } else {
    creep.say("sad");
  }
}

module.exports = vest;
