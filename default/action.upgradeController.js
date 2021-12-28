const getEnergy = require("./getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function upController(
  creep,
  controllerFlag,
  targetRoomName,
  exit,
  exitDirection,
  controllerID
) {
  const name = creep.name;
  const targetRoom = Game.rooms[targetRoomName];
  const creepPos = creep.pos;
  const creepRoom = creep.room;
  const creepRoomName = creep.room.name;
  const controller = Game.getObjectById(controllerID);
  let retval = -16;

  if (creepRoomName != targetRoomName) {
    if (creepRoomName === Memory.northRoomName) {
      // if in the north room but target is not north, head south
      exitDirection = BOTTOM;
      exit = Game.flags.northEntrance;
    } else if (creepRoomName === Memory.deepSouthRoomName) {
      // if in the deepSouth room but target room is not deepSouth, head north
      if (targetRoomName != Memory.e58s49RoomName || creep.memory.direction != "e58s49") {
        exitDirection = TOP;
        exit = Game.flags.southEntrance;
      }
    }

    if (creep.pos.isNearTo(exit)) {
      creep.say(exitDirection);
      retval = creep.move(exitDirection);
    } else {
      creep.say(targetRoomName);
      retval = smartMove(creep, exit, 0, true, null, null, null, 1);
    }

    return retval;
  }

  if (
    creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity(RESOURCE_ENERGY)
  ) {
    creep.memory.up = true;
    creep.memory.getEnergy = false;
  } else if (creep.store[RESOURCE_ENERGY] <= 0 || creep.memory.getEnergy) {
    creep.memory.up = false;
    creep.memory.getEnergy = true;
    if (creep.memory.direction === "south") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        null,
        null,
        targetRoomName
      );
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.northExit,
        TOP,
        targetRoomName
      );
    } else if (creep.memory.direction === "deepSouth") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.southExit,
        BOTTOM,
        targetRoomName
      );
    } else if (creep.memory.direction === "e58s49") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.e58s49Exit,
        LEFT,
        targetRoomName
      );
    }

    // if (name.startsWith("upCdS")) {
    //   console.log(name + " upC retval " + retval);
    // }

    return retval;
  }

  if (creep.memory.up) {
    creep.memory.getEnergy = false;
  }

  let target;
  if (controllerFlag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, controllerFlag).pop();
  } else if (creep.memory.controllerID) {
    target = Game.getObjectById(creep.memory.controllerID);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: (structure) => structure.structureType === STRUCTURE_CONTROLLER,
    });

    if (target) {
      creep.memory.controllerID = target.id;
    } else {
      console.log(name + " upgrade Controller target " + target);
    }
  }

  if (target) {
    new RoomVisual(creep.room.name).text("💥", target.pos.x, target.pos.y, {
      color: "red",
      font: 1.8,
      opacity: 0.5,
    });

    if (creep.memory.up) {
      if (creep.pos.inRangeTo(target, 3)) {
        retval = creep.upgradeController(target);
        if (retval == OK) {
          creep.say("uc");
        } else if (retval === ERR_NOT_IN_RANGE) {
          creep.say("uc" + target.pos.x + "," + target.pos.y);
        } else if (retval === ERR_NOT_ENOUGH_RESOURCES) {
          creep.say("uc");
          creep.memory.up = false;
          creep.memory.getEnergy = true;
          getEnergy(creep);
          return retval;
        } else {
          creep.memory.controller = null;
          creep.say("uc." + retval);
        }
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
      } else {
        retval = smartMove(creep, target, 3, true, "#ffff80", 100, 10000, 1);

        if (retval != OK) {
          creep.say("err." + retval);
        }
      }
    }
  }

  if (!creep.memory.up) {
    creep.say("h");
    creep.memory.getEnergy = true;
    retval = getEnergy(creep);
  }
}

upController = profiler.registerFN(upController, "upController");
module.exports = upController;
