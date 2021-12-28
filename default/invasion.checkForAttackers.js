const { findInvaders } = require("./findInvaders");
const profiler = require("./screeps-profiler");

function checkForAttackers() {
  let northRoom = Game.rooms[Memory.northRoomName];
  let eRm = Memory.eRm;
  let wRm = Memory.wRm;
  let homeRoom = Game.rooms[Memory.homeRoomName];
  let deepSouthRoom = Game.rooms[Memory.deepSouthRoomName];
  let neRm = Memory.neRm;
  let nwRm = Memory.nwRm;
  let nwwRm = Memory.nwwRm;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let attackDurationSafeCheck = Memory.attackDurationSafeCheck;
  let neAttackDurationSafeCheck = Memory.neAttackDurationSafeCheck;
  let nwAttackDurationSafeCheck = Memory.nwAttackDurationSafeCheck;
  let dSAttackDurationSafeCheck = Memory.dSAttackDurationSafeCheck;
  let nwwAttackDurationSafeCheck = Memory.nwwAttackDurationSafeCheck;
  let lastCheckForInvaderTimeE59S48 = Memory.lastCheckForInvaderTimeE59S48 || 0;
  let lastCheckForInvaderTimeE59S47 = Memory.lastCheckForInvaderTimeE59S47 || 0;
  let lastCheckForInvaderTimeE59S49 = Memory.lastCheckForInvaderTimeE59S49 || 0;
  const attackerCheckWaitTime = 2;

  Memory.invaderIDE59S49 = findInvaders(
    deepSouthRoom,
    lastCheckForInvaderTimeE59S49,
    attackerCheckWaitTime
  );

  Memory.invaderIDE59S48 = findInvaders(
    homeRoom,
    lastCheckForInvaderTimeE59S48,
    attackerCheckWaitTime
  );

  Memory.invaderIDE59S47 = findInvaders(
    northRoom,
    lastCheckForInvaderTimeE59S47,
    attackerCheckWaitTime
  );
}

checkForAttackers = profiler.registerFN(checkForAttackers, "checkForAttackers");
module.exports = checkForAttackers;
