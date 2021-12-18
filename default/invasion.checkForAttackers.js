const getAttackEvents = require("./invasion.getAttackEvents");
function checkForAttackers() {
  let nRm = Game.rooms[Memory.northRoomName];
  let eRm = Memory.eRm;
  let wRm = Memory.wRm;
  let rm = Game.rooms[Memory.homeRoomName];
  let dSRm = Game.rooms[Memory.deepSouthRoomName];
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
  const attackerCheckWaitTime = 100;
  let attackerId;

  if (Game.getObjectById(Memory.invaderId) === null) {
    Memory.invaderId = null;
  }

  if (Game.getObjectById(Memory.nAttackerId) === null) {
    Memory.nAttackerId = null;
  }

  if (Game.getObjectById(Memory.dSAttackerId) === null) {
    Memory.dSAttackerId = null;
  }

  if (
    dSRm &&
    (!Memory.dSAttackerId || Game.time >= dSAttackDurationSafeCheck)
  ) {
    attackerId = getAttackEvents(dSRm);
    if (!attackerId) {
      let enemyCreeps = dSRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = dSRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = dSRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nrm enemyCreep spotted ");
          attackerId = enemyCreep.id;
        }
      }
    }
    Memory.dSAttackerId = attackerId;
    if (attackerId) {
      Memory.dSAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
      console.log("dSAttacker:" + attackerId);
    }
  }

  if (nRm && (!Memory.nAttackerId || Game.time >= nAttackDurationSafeCheck)) {
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
          console.log("nrm enemyCreep spotted ");
          attackerId = enemyCreep.id;
        }
      }
    }
    Memory.nAttackerId = attackerId;
    if (attackerId) {
      Memory.nAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
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
          console.log("erm enemyCreep spotted ");
          attackerId = enemyCreep.id;
        }
      }
    }
    Memory.eAttackerId = attackerId;
    if (attackerId) {
      Memory.eAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
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
          console.log("nrm enemyCreep spotted ");
          attackerId = enemyCreep.id;
        }
      }
    }

    Memory.wAttackerId = attackerId;
    if (attackerId) {
      Memory.wAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
      console.log("wAttacker:" + attackerId);
    }
  }

  if (rm && (!Memory.invader || Game.time >= attackDurationSafeCheck)) {
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
    Memory.attackDurationSafeCheck = Game.time + attackerCheckWaitTime;
  }

  if (
    neRm &&
    (!Memory.neAttackerId || Game.time >= neAttackDurationSafeCheck)
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
          console.log("nerm enemyCreep spotted ");
          attackerId = enemyCreep.id;
        }
      }
    }

    Memory.neAttackerId = attackerId;
    if (attackerId) {
      console.log("attacker:" + attackerId);
    }
    Memory.neAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
  }

  if (
    nwRm &&
    (!Memory.nwAttackerId || Game.time >= nwAttackDurationSafeCheck)
  ) {
    attackerId = getAttackEvents(nwRm);
    if (!attackerId) {
      let enemyCreeps = nwRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = nwRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = nwRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nwrm enemyCreep spotted ");
          attackerId = enemyCreep.id;
          Memory.nwAttackerId = attackerId;
        }
      } else {
        Memory.nwAttackerId = null;
      }
      Memory.nwAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
    } else {
      Memory.nwAttackerId = attackerId;
    }
  }

  if (
    nwwRm
    // &&
    // (!Memory.nwwAttackerId || Game.time >= nwwAttackDurationSafeCheck)
  ) {
    attackerId = getAttackEvents(nwwRm);
    if (!attackerId) {
      let enemyCreeps = nwwRm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps) {
        enemyCreeps = nwwRm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps) {
        enemyCreeps = nwwRm.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = enemyCreeps.pop();
        if (enemyCreep) {
          console.log("nwwrm enemyCreep spotted ");
          attackerId = enemyCreep.id;
          Memory.nwwAttackerId = attackerId;
        } else {
          Memory.nwwAttackerId = null;
        }
        Memory.nwwAttackDurationSafeCheck = Game.time + attackerCheckWaitTime;
      }
    }
  }
}
module.exports = checkForAttackers;
