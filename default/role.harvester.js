const getEnergy = require("./getEnergy");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./move.smartMove");
const build = require("./build");
const profiler = require("./screeps-profiler");
const {
  transferEnergyBasedOnDirection,
} = require("./transferEnergy.transferEnergyBasedOnDirection");

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
    _.pull(Memory.homeSource1Creeps, creep.name);
    _.pull(Memory.homeSource2Creeps, creep.name);

    ret = transferEnergyBasedOnDirection(creep, extensions, spawns);
    retval = ret.retval;
    extensions = ret.extensions;
    spawns = ret.spawns;
  } else if (creepRoomName != targetRoomName) {
    // creep has a target room but isnt there

    creep.memory.buildRoad = false;
    creep.memory.transferTower = false;
    creep.memory.path = null;
    creep.memory.transferTargetId = null;

    if (creepRoomName === northRoomName) {
      // if in the north room but target is not north, head home, the other rooms are that way
      exitDirection = BOTTOM;
      exit = northToHome;
    } else if (creepRoomName === southRoomName) {
      // if in the deepSouth room but target room is not deepSouth
      if (targetRoomName != southwestRoomName) {
        // if target name is not the SW room, then head north to home room
        // because target room is either north or home room and you have to go the same way to get to either
        exitDirection = TOP;
        exit = southToHome;
      } else {
        // in deep home room but target is west of here, head left
        exitDirection = LEFT;
        exit = southToSouthwest;
      }
    } else if (creepRoomName === southwestRoomName) {
      // if in the deepSouthWest room but target room is not there, head to dS as a start
      exitDirection = RIGHT;
      exit = southwestToSouth;
    } else if (creepRoomName === homeRoomName) {
      if (targetRoomName === southRoomName) {
        exitDirection = BOTTOM;
        exit = homeToSouth;
      } else if (targetRoomName === northRoomName) {
        exitDirection = TOP;
        exit = homeToNorth;
      }
    }

    if (creep.pos.isNearTo(exit)) {
      creep.say("👋");
      retval = creep.move(exitDirection);
    } else {
      creep.say("🎯" + targetRoomName + "🚀");
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
