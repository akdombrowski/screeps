const { findInvaders } = require("./invasion.findInvaders");
const profiler = require("./screeps-profiler");

function checkForAttackers() {
  let northRoom = Game.rooms[Memory.northRoomName];
  let homeRoom = Game.rooms[Memory.homeRoomName];
  let southRoom = Game.rooms[Memory.southRoomName];
  let westRoom = Game.rooms[Memory.westoomName];
  let southwestRoom = Game.rooms[Memory.southwestRoomName];
  let invaderId = null;
  let attackDurationSafeCheck = Memory.attackDurationSafeCheck;
  let dSAttackDurationSafeCheck = Memory.dSAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let swAttackDurationSafeCheck = Memory.swAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let lastCheckForInvaderTimeHome = Memory.lastCheckForInvaderTimeHome || 2;
  let lastCheckForInvaderTimeSouth = Memory.lastCheckForInvaderTimeSouth || 10;
  let lastCheckForInvaderTimeNorth = Memory.lastCheckForInvaderTimeNorth || 10;
  let lastCheckForInvaderTimeWest = Memory.lastCheckForInvaderTimeWest || 10;
  let lastCheckForInvaderTimeSouthwest = Memory.lastCheckForInvaderTimeSouthwest || 10;
  let retHome = null;
  let retSouth = null;

  retHome = findInvaders(
    homeRoom,
    lastCheckForInvaderTimeHome,
    attackDurationSafeCheck,
    "Home"
  );

  retSouth = findInvaders(
    southRoom,
    lastCheckForInvaderTimeSouth,
    sAttackDurationSafeCheck,
    "South"
  );

  retNorth = findInvaders(
    northRoom,
    lastCheckForInvaderTimeNorth,
    nAttackDurationSafeCheck,
    "North"
  );

  retWest = findInvaders(
    westRoom,
    lastCheckForInvaderTimeWest,
    wAttackDurationSafeCheck,
    "West"
  );



  // Memory.invaderIDE59S47 = findInvaders(
  //   northRoom,
  //   lastCheckForInvaderTimeE59S47,
  //   nAttackDurationSafeCheck
  // );

  // Memory.invaderIDE58S49 = findInvaders(
  //   e58s49Room,
  //   lastCheckForInvaderTimeE58S49,
  //   swAttackDurationSafeCheck
  // );

  // Memory.invaderIDE58S48 = findInvaders(
  //   e58s48Room,
  //   lastCheckForInvaderTimeE58S48,
  //   wAttackDurationSafeCheck
  // );
}

checkForAttackers = profiler.registerFN(checkForAttackers, "checkForAttackers");
module.exports = checkForAttackers;
