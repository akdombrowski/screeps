const getAttackEvents = require("./invasion.getAttackEvents");
function checkForAttackers() {
  let nRm = Memory.nRm;
  let eRm = Memory.eRm;
  let wRm = Memory.wRm;
  let rm = Memory.rm;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let attackerId;

  if (nRm && (!Memory.nAttackerId || Game.time >= wAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(nRm);
    Memory.nAttackerId = attackerId;
    if (attackerId) {
      Memory.nAttackDurationSafeCheck = Game.time + 1000;
      console.log("nAttacker:" + attackerId);
    }
  }
  if (eRm && (!Memory.eAttackerId || Game.time >= eAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(eRm);
    Memory.eAttackerId = attackerId;
    if (attackerId) {
      Memory.eAttackDurationSafeCheck = Game.time + 1000;
      console.log("eAttacker:" + attackerId);
    }
  }
  if (wRm && (!Memory.wAttackerId || Game.time >= wAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(wRm);
    Memory.wAttackerId = attackerId;
    if (attackerId) {
      Memory.wAttackDurationSafeCheck = Game.time + 1000;
      console.log("wAttacker:" + attackerId);
    }
  }
  if (rm && (!Memory.invader || Game.time >= sAttackDurationSafeCheck)) {
    // attackerId = getAttackEvents(rm);
    // Memory.invaderId = attackerId;
    // if (attackerId) {
    //   Memory.sAttackDurationSafeCheck = Game.time + 1000;
    //   console.log("invader:" + attackerId);
    // }
    let enemyCreeps = rm.find(FIND_CREEPS, {
      filter: (creep) => {
        return !creep.my;
      },
    });

    invader = enemyCreeps.pop();
    
    Memory.invaderId = invader ? invader.id : null;
  }
}
module.exports = checkForAttackers;
