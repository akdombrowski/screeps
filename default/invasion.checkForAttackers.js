const { findInvaders } = require("./invasion.findInvaders");
const profiler = require("./screeps-profiler");

function checkForAttackers() {
  let northRoom = Game.rooms[Memory.northRoomName];
  let homeRoom = Game.rooms[Memory.homeRoomName];
  let southRoom = Game.rooms[Memory.southRoomName];
  let e58s49Room = Game.rooms[Memory.e58s49RoomName];
  let e58s48Room = Game.rooms[Memory.e58s48RoomName];
  let invaderId = null;
  let attackDurationSafeCheck = Memory.attackDurationSafeCheck;
  let dSAttackDurationSafeCheck = Memory.dSAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let swAttackDurationSafeCheck = Memory.swAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let lastCheckForInvaderTimeHome = Memory.lastCheckForInvaderTimeHome || 2;
  let lastCheckForInvaderTimeSouth = Memory.lastCheckForInvaderTimeSouth || 10;
  let lastCheckForInvaderTimeE59S47 =
    Memory.lastCheckForInvaderTimeE59S47 || 10;
  let lastCheckForInvaderTimeE59S49 =
    Memory.lastCheckForInvaderTimeE59S49 || 10;
  let lastCheckForInvaderTimeE58S49 =
    Memory.lastCheckForInvaderTimeE58S49 || 10;
  let lastCheckForInvaderTimeE58S48 =
    Memory.lastCheckForInvaderTimeE58S48 || 10;
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
