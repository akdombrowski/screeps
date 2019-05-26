const transferEnergy = require("./action.transferEnergy");

function vest(creep, flag, path) {
  let goEast = Memory.goEast || true;
  let goNorth = Memory.goNorth || false;
  let stayCentral = Memory.stayCentral || false;
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    if (creep.memory.role == "harvester" || creep.memory.role == "h") {
      creep.memory.transfer = true;
      if (creep.room.name == "E35N32") {
        creep.moveTo(Game.flags.northEntrance1);
      } else if (creep.room.name == "E36N31") {
        creep.moveTo(Game.flags.eastEntrance1);
      }
      transferEnergy(creep);
    }
    return;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  let target;
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag);
  } else if (creep.memory.sourceId) {
    target = Game.getObjectById(creep.memory.sourceId);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag);
  } else if (creep.memory.role == "harvester" || creep.memory.role == "h") {
    if (creep.pos.isNearTo(Game.flags.northExit)) {
      creep.move(TOP);
      return;
    } else if (creep.room.name == "E35N32") {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.north);
    } else if (creep.room.name == "E36N31") {
      target = creep.room.lookForAt(LOOK_SOURCES, Game.flags.east);
    } else if (creep.memory.goNorth ? true : goNorth) {
      creep.moveTo(Game.flags.northExit, {
        visualizePathStyle: { stroke: "ffffff" }
      });
      creep.say("⛄north");
      creep.memory.goNorth = true;
      Memory.goNorth = true;
      Memory.goEast = false;
      Memory.stayCentral = false;

    } else if (creep.memory.goEast ? true : goEast) {
      creep.moveTo(Game.flags.eastExit, {
        visualizePathStyle: { stroke: "ffffff" }
      });
      creep.say("🌝east");
      creep.memory.goEast = true;
      Memory.goNorth = false;
      Memory.goEast = true;
      Memory.stayCentral = false;
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pos.isNearTo(target.pos)) {
        creep.say("pickup");
        creep.pickup(target);
        return;
      } else {
        creep.say("🚚pickup");
        creep.moveTo(target, {
          range: 1,
          visualizePathStyle: { stroke: "#ffffff" }
        });
        return;
      }
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_SOURCES, {
      filter: source => {
        return source.energy > 0;
      }
    });
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);

      if (retval == OK) {
        creep.say("⛏︎");
        creep.memory.sourceId = target.id;
      } else {
        creep.say("⛏︎.err");
      }
    } else if (creep.fatigue > 0) {
      creep.say("🛌🏻." + creep.fatigue);
      return;
    } else if (path) {
      creep.say("⛏︎." + target.pos.x + "," + target.pos.y);

      if (creep.fatigue > 0) {
        creep.say("🛌🏻." + creep.fatigue);
        return;
      }

      creep.moveByPath(path);
    } else {
      creep.moveTo(target, { range: 1 });
      creep.memory.sourceId = target.id;
    }
  } else if (creep.room.name == "E35N31") {
    creep.moveTo(Game.flags.northExit, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
    if (creep.pos == Game.flags.northExit.pos) {
      creep.move(TOP);
    }
    creep.say("northExit");
  } else if (creep.room.name == "E36N31") {
    creep.moveTo(Game.flags.eastExit, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
    if (creep.pos == Game.flags.eastExit.pos) {
      creep.move(RIGHT);
    }
    creep.say("eastExit");
  } else {
    if (creep.pos.isNearTo(Game.getObjectById("5bbcaefa9099fc012e639e8c"))) {
      creep.harvest(Game.getObjectById("5bbcaefa9099fc012e639e8c"));
      creep.say("⛏︎");
    } else {
      retval = creep.moveTo(
        Game.getObjectById("5bbcaefa9099fc012e639e8c", {
          visualizePathStyle: { stroke: "#ffff00" },
          range: 1
        })
      );
      if (retval == OK) {
        creep.say(
          Game.getObjectById("5bbcaefa9099fc012e639e8c").pos.x +
            "," +
            Game.getObjectById("5bbcaefa9099fc012e639e8c").pos.y
        );
      } else {
        creep.say("err " + retval);
      }
    }
  }
}

module.exports = vest;
