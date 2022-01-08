const getEnergy = require("./getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");

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
      exit = Game.flags.northToHome;
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


    _.pull(Memory.homeSource1Creeps, creep.name);
    _.pull(Memory.homeSource2Creeps, creep.name);
  } else if (creep.store[RESOURCE_ENERGY] <= 0 || creep.memory.getEnergy) {
    creep.memory.up = false;
    creep.memory.getEnergy = true;
    if (creep.memory.direction === "home") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        null,
        null
      );
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToNorth,
        TOP
      );
    } else if (creep.memory.direction === "south") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToSouth,
        BOTTOM
      );
    } else if (creep.memory.direction === "west") {
      retval = getEnergy(
        creep,
        targetRoomName,
        targetRoomName,
        null,
        Game.flags.homeToWest,
        LEFT
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
      opacity: 0.99,
    });

    if (creep.memory.up) {
      if (creep.pos.inRangeTo(target, 3)) {
        checkIfBlockingSource(creep, 1);

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
