const getAttackEvents = require("./getAttackEvents");
function checkForAttackers(
  Game,
  wAttackDurationSafeCheck,
  nRm,
  Memory,
  northAttackerId,
  eRm,
  eastAttackerId,
  wRm,
  westAttackerId,
  sAttackDurationSafeCheck,
  rm,
  invaderId
) {
  if (nRm && (!Memory.northAttack || Game.time >= wAttackDurationSafeCheck)) {
    northAttackerId = getAttackEvents(nRm);
    Memory.northAttackerId = northAttackerId;
    if (northAttackerId) {
      nAttackDurationSafeCheck = Game.time + 1000;
      console.log("nAttacker:" + northAttackerId);
    }
  }
  if (eRm && (!Memory.eastAttack || Game.time >= wAttackDurationSafeCheck)) {
    eastAttackerId = getAttackEvents(eRm);
    Memory.eastAttackerId = eastAttackerId;
    if (eastAttackerId) {
      eAttackDurationSafeCheck = Game.time + 1000;
      console.log("eAttacker:" + eastAttackerId);
    }
  }
  if (wRm && (!Memory.westAttack || Game.time >= wAttackDurationSafeCheck)) {
    westAttackerId = getAttackEvents(wRm);
    Memory.westAttackerId = westAttackerId;
    if (westAttackerId) {
      wAttackDurationSafeCheck = Game.time + 1000;
      console.log("wAttacker:" + westAttackerId);
    }
  }
  if (rm && (!Memory.invader || Game.time >= sAttackDurationSafeCheck)) {
    invaderId = getAttackEvents(rm);
    Memory.invaderId = invaderId;
    if (invaderId) {
      sAttackDurationSafeCheck = Game.time + 1000;
      sAttackDurationSafeCheck = Game.time + 1000;
      console.log("invader:" + invaderId);
    }
  }
}
module.exports = checkForAttackers;
