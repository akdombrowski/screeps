const transferEnergy = require("./transferEnergy");
const profiler = require("./screeps-profiler");

function transferEnergyBasedOnDirection(creep, extensions, spawns) {
  const northRoomName = Memory.northRoomName;
  const homeRoomName = Memory.homeRoomName;
  const southRoomName = Memory.southRoomName;
  const southwestRoomName = Memory.southwestRoomName;
  const westRoomName = Memory.westRoomName;
  const southToHome = Game.flags.southToHome;
  const westToHome = Game.flags.westToHome;
  const northwestToWest = Game.flags.northwestToWest;
  const northToHome = Game.flags.northToHome;
  let ret = { retval: -16, extensions: extensions, spawns: spawns };

  if (creep) {
    if (creep.memory.direction === "north") {
      ret = transferEnergy(
        creep,
        null,
        null,
        homeRoomName,
        northToHome,
        BOTTOM,
        extensions,
        spawns
      );
    } else if (creep.memory.direction === "south") {
      ret = transferEnergy(
        creep,
        null,
        null,
        homeRoomName,
        southToHome,
        TOP,
        extensions,
        spawns
      );
    } else if (creep.memory.direction === "southwest") {
      ret = transferEnergy(
        creep,
        null,
        null,
        homeRoomName,
        southToHome,
        TOP,
        extensions,
        spawns
      );
    } else if (creep.memory.direction === "west") {
      ret = transferEnergy(
        creep,
        null,
        null,
        westRoomName,
        westToHome,
        RIGHT,
        extensions,
        spawns
      );
    } else if (creep.memory.direction === "home") {
      ret = transferEnergy(
        creep,
        null,
        null,
        homeRoomName,
        null,
        null,
        extensions,
        spawns
      );
    } else if (creep.memory.direction === "northwest") {
      ret = transferEnergy(
        creep,
        null,
        null,
        westRoomName,
        northwestToWest,
        BOTTOM,
        extensions,
        spawns
      );
    } else {
      creep.memory.direction = "home";
      ret = transferEnergy(
        creep,
        null,
        null,
        homeRoomName,
        null,
        null,
        extensions,
        spawns
      );
    }
  }
  return ret;
}
exports.transferEnergyBasedOnDirection = transferEnergyBasedOnDirection;
transferEnergyBasedOnDirection = profiler.registerFN(
  transferEnergyBasedOnDirection,
  "transferEnergyBasedOnDirection"
);
