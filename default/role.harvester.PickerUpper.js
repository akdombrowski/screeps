const getEnergy = require("./getEnergy");
const transferEnergy = require("./transferEnergy");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
const build = require("./action.build");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");
const { droppedDuty } = require("./action.droppedDuty");
const tran = require("./transferEnergy");
const { pickupEnergy } = require("./action.pickUpEnergy");

function roleHarvesterPickerUpper(
  creep,
  targetRoomName,
  exit,
  exitDirection,
  extensions,
  spawns
) {
  const name = creep.name;
  const direction = creep.memory.direction;
  const sourceDir = creep.memory.sourceDir;
  const fatigue = creep.fatigue;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const deepSouthRoomName = Memory.deepSouthRoomName;
  const e58s49RoomName = Memory.e58s49RoomName;
  const southEntrance = Game.flags.southEntrance;
  const northEntrance = Game.flags.northEntrance;
  const southExit = Game.flags.southExit;
  const northExit = Game.flags.northExit;
  const e58s49Exit = Game.flags.e58s49Exit;
  let retval = -16;

  if (
    creep.memory.transfer ||
    creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
  ) {
    creep.memory.lastSourceId = null;
    creep.memory.path = null;
    creep.memory.getEnergyTargetId = null;
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
      creep.memory.transfer = false;
      creep.memory.getEnergy = true;
      return ERR_NOT_ENOUGH_RESOURCES;
    }
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;

    ret = tran(
      creep,
      null,
      null,
      targetRoomName,
      exit,
      exitDirection,
      extensions,
      spawns
    );

    extensions = ret.extensions;
    spawns = ret.spawns;
    retval = ret.retval;

    return { retval: retval, extensions: extensions, spawns: spawns };
  }

  creep.memory.buildRoad = false;
  creep.memory.transferTower = false;
  creep.memory.transfer = false;
  creep.memory.path = null;
  creep.memory.transferTargetId = null;
  creep.memory.getEnergy = true;

  if (creepRoomName != targetRoomName) {
    if (creepRoomName === northRoomName) {
      // if in the north room but target is not north, head south
      exitDirection = BOTTOM;
      exit = northEntrance;
    } else if (creepRoomName === deepSouthRoomName) {
      // if in the deepSouth room but target room is not deepSouth
      if (targetRoomName != e58s49RoomName) {
        // if target name is not the SW room, then head north to home room
        exitDirection = TOP;
        exit = southEntrance;
      }
    } else if (creepRoomName === e58s49RoomName) {
      // if in the deepSouth room but target room is not deepSouth, head north
      exitDirection = RIGHT;
      exit = e59s49Exit;
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
    _.remove(
      Memory[creep.room.name + "droppedPickerUpperNames"],
      (name) => name === creep.name
    );

    retval = pickupEnergy(creep);

    if (
      (retval != OK && retval != ERR_TIRED) ||
      creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
    ) {
      creep.memory.path = null;
      creep.memory.transfer = true;
      creep.memory.getEnergy = false;
      creep.memory.droppedTargetId = null;
    }
  }

  return { retval: retval, extensions: extensions, spawns: spawns };
}

roleHarvesterPickerUpper = profiler.registerFN(
  roleHarvesterPickerUpper,
  "roleHarvesterPickerUpper"
);
module.exports = roleHarvesterPickerUpper;
