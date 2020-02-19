const getAttackEvents = require("./invasion.getAttackEvents");
function checkForAttackers() {
  let nRm = Memory.nRm;
  let eRm = Memory.eRm;
  let wRm = Memory.wRm;
  let rm = Memory.rm;
  let neRm = Memory.neRm;
  let wAttackDurationSafeCheck = Memory.wAttackDurationSafeCheck;
  let eAttackDurationSafeCheck = Memory.eAttackDurationSafeCheck;
  let nAttackDurationSafeCheck = Memory.nAttackDurationSafeCheck;
  let sAttackDurationSafeCheck = Memory.sAttackDurationSafeCheck;
  let neAttackDurationSafeCheck = Memory.neAttackDurationSafeCheck;
  let attackerId;

  if (nRm && (!Memory.nAttackerId || Game.time >= wAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(nRm);
    if (!attackerId) {
      let enemyCreeps = nRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = nRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = nRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nrm enemyCreep spotted " + JSON.stringify(enemyCreep));
          attackerId = enemyCreep.id;
        }
      }
    }
    Memory.nAttackerId = attackerId;
    if (attackerId) {
      Memory.nAttackDurationSafeCheck = Game.time + 1000;
      console.log("nAttacker:" + attackerId);
    }
  }
  if (eRm && (!Memory.eAttackerId || Game.time >= eAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(eRm);
    if (!attackerId) {
      let enemyCreeps = eRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = eRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = eRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("erm enemyCreep spotted " + JSON.stringify(enemyCreep));
          attackerId = enemyCreep.id;
        }
      }
    }
    Memory.eAttackerId = attackerId;
    if (attackerId) {
      Memory.eAttackDurationSafeCheck = Game.time + 1000;
      console.log("eAttacker:" + attackerId);
    }
  }
  if (wRm && (!Memory.wAttackerId || Game.time >= wAttackDurationSafeCheck)) {
    attackerId = getAttackEvents(wRm);
    if (!attackerId) {
      let enemyCreeps = wRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = wRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = wRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nrm enemyCreep spotted " + JSON.stringify(enemyCreep));
          attackerId = enemyCreep.id;
        }
      }
    }

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
      filter: creep => {
        return !creep.my;
      },
    });

    invader = enemyCreeps.pop();

    Memory.invaderId = invader ? invader.id : null;
  }

  if (
    neRm &&
    (!Memory.nrAttackerId || Game.time >= neAttackDurationSafeCheck)
  ) {
    attackerId = getAttackEvents(neRm);
    if (!attackerId) {
      let enemyCreeps = neRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = neRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = neRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nerm enemyCreep spotted " + JSON.stringify(enemyCreep));
          attackerId = enemyCreep.id;
        }
      }
    }

    Memory.neAttackerId = attackerId;
    if (attackerId) {
      Memory.neAttackDurationSafeCheck = Game.time + 1000;
      console.log("neAttacker:" + attackerId);
    }
  }
}
module.exports = checkForAttackers;
