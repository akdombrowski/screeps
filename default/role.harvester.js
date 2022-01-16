const getEnergy = require("./getEnergy");
const buildRoad = require("./action.buildRoad");
const build = require("./build");
const profiler = require("./screeps-profiler");
const {
  transferEnergyBasedOnDirection,
} = require("./transferEnergy.transferEnergyBasedOnDirection");
const { pullFromSourceArrays } = require("./getEnergy.pullFromSourceArrays");
const { moveToDifferentRoom } = require("./move.moveToDifferentRoom");

function roleHarvester(
  creep,
  extensions,
  spawns,
  targetRoomName,
  exit,
  exitDirection,
  targetBuildRoomName
) {
  const name = creep.name;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  const direction = creep.memory.direction;
  const sourceDir = creep.memory.sourceDir;
  const fatigue = creep.fatigue;
  const rm = creep.room;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  const southwestRoomName = Memory.southwestRoomName;
  const northwestRoomName = Memory.northwestRoomName;
  const southeastRoomName = Memory.southeastRoomName;
  const northeastRoomName = Memory.northeastRoomName;
  const northeasteastRoomName = Memory.northeasteastRoomName;
  const westRoomName = Memory.westRoomName;
  const northToHome = Game.flags.northToHome;
  const southToHome = Game.flags.southToHome;
  const southwestToSouth = Game.flags.southwestToSouth;
  const homeToNorth = Game.flags.homeToNorth;
  const homeToSouth = Game.flags.homeToSouth;
  const homeToWest = Game.flags.homeToWest;
  const westToHome = Game.flags.westToHome;
  const southToSouthwest = Game.flags.southToSouthwest;
  const westToNorthwest = Game.flags.westToNorthwest;

  let retval = -16;

  if (
    (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0 ||
      creep.memory.transfer) &&
    creep.store[RESOURCE_ENERGY] > 0
  ) {
    let ret = null;
    creep.memory.lastSourceId = null;
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;

    // done getting energy, remove from source arrays
    pullFromSourceArrays(name);

    ret = transferEnergyBasedOnDirection(creep, extensions, spawns);

    retval = ret.retval;
    extensions = ret.extensions;
    spawns = ret.spawns;
  } else if (creepRoomName != targetRoomName) {
    // creep has a target room but isnt there

    creep.memory.buildRoad = false;
    creep.memory.transferTower = false;
    // creep.memory.path = null;
    creep.memory.transferTargetId = null;

    retval = moveToDifferentRoom(
      creepRoomName,
      exitDirection,
      exit,
      targetRoomName,
      creep,
      retval
    );
  } else if (
    creep.memory.getEnergy ||
    !creep.store[RESOURCE_ENERGY] ||
    creep.store[RESOURCE_ENERGY] <= 0
  ) {
    creep.memory.buildRoad = false;
    creep.memory.transferTower = false;
    creep.memory.transfer = false;
    creep.memory.transferTargetId = null;
    creep.memory.getEnergy = true;

    if (creep.memory.direction === "home") {
      retval = getEnergy(creep, homeRoomName, null, null, null, null);
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(creep, northRoomName, null, null, homeToNorth, TOP);
    } else if (creep.memory.direction === "south") {
      retval = getEnergy(creep, southRoomName, null, null, homeToSouth, BOTTOM);
    } else if (creep.memory.direction === "southwest") {
      retval = getEnergy(
        creep,
        southwestRoomName,
        null,
        null,
        southToSouthwest,
        LEFT
      );
    } else if (creep.memory.direction === "west") {
      retval = getEnergy(creep, westRoomName, null, null, homeToWest, LEFT);
    } else if (creep.memory.direction === "northwest") {
      retval = getEnergy(
        creep,
        northwestRoomName,
        null,
        null,
        westToNorthwest,
        TOP
      );
    } else {
      creep.memory.direction = "home";
      retval = getEnergy(creep, homeRoomName, null, null, homeToNorth, TOP);
    }
  } else if (creep.memory.buildRoad) {
    creep.memory.transfer = false;
    creep.memory.getEnergy = false;

    if (targetBuildRoomName) {
      retval = build(creep, targetBuildRoomName, buildExitDirection, buildExit);
    } else {
      retval = build(creep, Memory.homeRoomName, RIGHT, Game.flags.westToHome);
    }

    if (retval === OK) {
      creep.memory.buildRoad = true;
    }
  } else {
    creep.memory.buildRoad = false;
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  return { retval: retval, extensions: extensions, spawns: spawns };
}

roleHarvester = profiler.registerFN(roleHarvester, "roleHarvester");
module.exports = roleHarvester;

