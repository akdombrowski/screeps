const { findInvaders } = require("./invasion.findInvaders");
const profiler = require("./screeps-profiler");

function checkForAttackers() {
  let northRoom = Game.rooms[Memory.northRoomName];
  let homeRoom = Game.rooms[Memory.homeRoomName];
  let deepSouthRoom = Game.rooms[Memory.deepSouthRoomName];
  let e58s49Room = Game.rooms[Memory.e58s49RoomName];
  let e58s48Room = Game.rooms[Memory.e58s48RoomName];
  let attackDurationSafeCheck = Memory.attackDurationSafeCheck;
  let dSAttackDurationSafeCheck = Memory.dSAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let swAttackDurationSafeCheck = Memory.swAttackDurationSafeCheck;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let lastCheckForInvaderTimeE59S48 = Memory.lastCheckForInvaderTimeE59S48 || 2;
  let lastCheckForInvaderTimeE59S47 = Memory.lastCheckForInvaderTimeE59S47 || 2;
  let lastCheckForInvaderTimeE59S49 = Memory.lastCheckForInvaderTimeE59S49 || 2;
  let lastCheckForInvaderTimeE58S49 = Memory.lastCheckForInvaderTimeE58S49 || 2;
  let lastCheckForInvaderTimeE58S48 = Memory.lastCheckForInvaderTimeE58S48 || 2;

  Memory.invaderIDE59S48 = findInvaders(
    homeRoom,
    lastCheckForInvaderTimeE59S48,
    attackDurationSafeCheck
  );

  Memory.invaderIDE59S49 = findInvaders(
    deepSouthRoom,
    lastCheckForInvaderTimeE59S49,
    dSAttackDurationSafeCheck
  );

  Memory.invaderIDE59S47 = findInvaders(
    northRoom,
    lastCheckForInvaderTimeE59S47,
    nAttackDurationSafeCheck
  );

  Memory.invaderIDE58S49 = findInvaders(
    e58s49Room,
    lastCheckForInvaderTimeE58S49,
    swAttackDurationSafeCheck
  );

  Memory.invaderIDE58S48 = findInvaders(
    e58s48Room,
    lastCheckForInvaderTimeE58S48,
    wAttackDurationSafeCheck
  );
}

checkForAttackers = profiler.registerFN(checkForAttackers, "checkForAttackers");
module.exports = checkForAttackers;
