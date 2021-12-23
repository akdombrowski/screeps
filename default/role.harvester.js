const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");

function roleHarvester(creep, extensions, spawns) {
  const name = creep.name;
  const direction = creep.memory.direction;
  const sourceDir = creep.memory.sourceDir;
  const fatigue = creep.fatigue;
  const rm = creep.room;
  const homeRmName = Memory.homeRoomName;
  const northRmName = Memory.northRoomName;
  const deepSouthRmName = Memory.deepSouthRoomName;
  let retval = -16;

  if (
    creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0 ||
    creep.memory.transfer
  ) {
    let ret = null;
    creep.memory.lastSourceId = null;
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;

    if (creep.memory.direction.startsWith("n")) {
      ret = transferEnergy(
        creep,
        null,
        null,
        Memory.homeRoomName,
        Game.flags.northEntrance,
        BOTTOM,
        extensions,
        spawns
      );
    } else if (
      creep.memory.direction.startsWith("dS") ||
      creep.memory.direction.startsWith("deepSouth")
    ) {
      ret = transferEnergy(
        creep,
        null,
        null,
        Memory.homeRoomName,
        Game.flags.southEntrance,
        TOP,
        extensions,
        spawns
      );
    } else {
      ret = transferEnergy(
        creep,
        null,
        null,
        Memory.homeRoomName,
        null,
        null,
        extensions,
        spawns
      );
    }
    retval = ret.retval;
    extensions = ret.extensions;
    spawns = ret.spawns;
  }

  if (
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
      retval = getEnergy(creep, homeRmName, null, null, null, null, homeRmName);
    } else if (creep.memory.direction === "north") {
      retval = getEnergy(
        creep,
        northRmName,
        null,
        null,
        Game.flags.northExit,
        TOP,
        Memory.northRoomName
      );
    } else if (creep.memory.direction === "deepSouth") {
      retval = getEnergy(
        creep,
        deepSouthRmName,
        null,
        null,
        Game.flags.southExit,
        BOTTOM,
        Memory.deepSouthRoomName
      );
    } else {
      retval = getEnergy(
        creep,
        northRmName,
        null,
        null,
        Game.flags.northExit,
        TOP,
        Memory.northRoomName
      );
    }
  } else if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] > 0) {
    let ret = null;
    creep.memory.transEnTower = false;
    creep.memory.getEnergy = false;
    retval = -16;

    if (creep.memory.direction.startsWith("n")) {
      ret = transferEnergy(
        creep,
        null,
        null,
        Memory.homeRoomName,
        Game.flags.northEntrance,
        BOTTOM
      );
    } else if (
      creep.memory.direction.startsWith("deepSouth") ||
      creep.memory.direction.startsWith("dS")
    ) {
      ret = transferEnergy(
        creep,
        null,
        null,
        Memory.homeRoomName,
        Game.flags.southEntrance,
        TOP
      );
    } else {
      ret = transferEnergy(creep, null, null, Memory.homeRoomName, null, null);
    }

    retval = ret.retval;
    extensions = ret.extensions;
    spawns = ret.spawns;

    if (retval === ERR_TIRED) {
      creep.say("f." + fatigue);
      return { retval: retval, extensions: extensions, spawns: spawns };
    }

    if (retval === -17) {
      return { retval: retval, extensions: extensions, spawns: spawns };
    }

    if (retval === -5 || retval === -2) {
      creep.memory.path = null;
      return { retval: retval, extensions: extensions, spawns: spawns };
    }

    // if (retval !== OK && direction === "south") {
    //   creep.memory.transferTower = true;
    //   creep.memory.buildRoad = false;

    //   retval = transEnTower(creep, 2000);
    //   // return retval;
    //   if (retval === OK || retval === ERR_TIRED) {
    //     return retval;
    //   }
    // }

    // didn't give energy to tower. build road.
    if (
      retval != OK ||
      (!creep.memory.transfer &&
        !creep.memory.transferTower &&
        !creep.memory.getEnergy)
    ) {
      retval = build(creep);
      if (retval === OK) {
        creep.memory.buildRoad = true;
      }
    } else if (retval === OK && creep.memory.transferTower) {
      creep.memory.buildRoad = false;
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      creep.say("tower");
    }

    if (retval === ERR_TIRED) {
      creep.say("f." + fatigue);
    }

    // didn't build road and didn't transto tower
    if (retval != OK) {
      creep.say("sad." + retval);
    }
  } else if (creep.memory.buildRoad) {
    creep.memory.transfer = false;
    creep.memory.getEnergy = false;

    retval = build(creep);
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