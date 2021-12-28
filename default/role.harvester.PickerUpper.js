const getEnergy = require("./getEnergy");
const transferEnergy = require("./transferEnergy.transferEnergy");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
const build = require("./action.build");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");
const { droppedDuty } = require("./action.droppedDuty");

function roleHarvesterPickerUpper(creep, targetRoomName, exit, exitDirection) {
  const name = creep.name;
  const direction = creep.memory.direction;
  const sourceDir = creep.memory.sourceDir;
  const fatigue = creep.fatigue;
  const rm = creep.room;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const deepSouthRoomName = Memory.deepSouthRoomName;
  const e58s49RoomName = Memory.e58s49RoomName;
  const southExit = Game.flags.southExit;
  const northExit = Game.flags.northExit;
  const e58s49Exit = Game.flags.e58s49Exit;
  let retval = -16;

  if (
    creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0 ||
    creep.memory.transfer
  ) {
    creep.memory.lastSourceId = null;
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;

    if (creep.room.name != targetRoomName) {
      if (creep.room.name === Memory.northRoomName) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northEntrance;
      } else if (creep.room.name === Memory.deepSouthRoomName) {
        // if in the deepSouth room but target room is not deepSouth
        if (targetRoomName != Memory.e58s49RoomName) {
          // if target name is not the SW room, then head north to home room
          exitDirection = TOP;
          exit = Game.flags.southEntrance;
        }
      } else if (creep.room.name === Memory.e58s49RoomName) {
        // if in the deepSouth room but target room is not deepSouth, head north
        exitDirection = RIGHT;
        exit = Game.flags.e59s49Exit;
      }

      if (creep.pos.isNearTo(exit)) {
        creep.say(exitDirection);
        retval = creep.move(exitDirection);
      } else {
        creep.say(targetRoomName);
        retval = smartMove(
          creep,
          exit,
          1,
          true,
          null,
          null,
          null,
          1,
          false,
          null
        );
      }
    } else {
      droppedDuty(creep);
    }
  } else if (
    creep.memory.getEnergy ||
    !creep.store[RESOURCE_ENERGY] ||
    creep.store[RESOURCE_ENERGY] <= 0
  ) {
    creep.memory.buildRoad = false;
    creep.memory.transferTower = false;
    creep.memory.transfer = false;
    creep.memory.path = null;
    creep.memory.transferTargetId = null;
    creep.memory.getEnergy = true;

    if (creep.memory.direction === "south") {
      retval = getEnergy(
        creep,
        homeRoomName,
        null,
        null,
        null,
        null,
        homeRoomName
      );
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        northRoomName,
        null,
        null,
        northExit,
        TOP,
        northRoomName
      );
    } else if (creep.memory.direction === "deepSouth") {
      retval = getEnergy(
        creep,
        deepSouthRoomName,
        null,
        null,
        southExit,
        BOTTOM,
        deepSouthRoomName
      );
    } else if (creep.memory.direction === "e58s49") {
      retval = getEnergy(
        creep,
        e58s49RoomName,
        null,
        null,
        e58s49Exit,
        LEFT,
        e58s49RoomName
      );
    } else {
      creep.memory.direction = "south";
      retval = getEnergy(
        creep,
        homeRoomName,
        null,
        null,
        northExit,
        TOP,
        homeRoomName
      );
    }
  } else if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] > 0) {
    creep.memory.transEnTower = false;
    creep.memory.getEnergy = false;
    retval = -16;


  }

  return retval;
}

roleHarvesterPickerUpper = profiler.registerFN(
  roleHarvesterPickerUpper,
  "roleHarvesterPickerUpper"
);
module.exports = roleHarvesterPickerUpper;
