const getAttackEvents = require("./invasion.getAttackEvents");
const profiler = require("./screeps-profiler");

function findInvaders(
  targetRoom,
  lastCheckForInvaderTime,
  attackerCheckWaitTime
) {
  let invaderId = null;

  if (
    targetRoom &&
    Game.time >= lastCheckForInvaderTime + attackerCheckWaitTime
  ) {
    invaderId = getAttackEvents(targetRoom);
    if (!invaderId) {
      let enemyCreeps = targetRoom.find(FIND_HOSTILE_CREEPS);

      if (enemyCreeps.length <= 0) {
        enemyCreeps = targetRoom.find(FIND_HOSTILE_STRUCTURES);
      }

      if (enemyCreeps.length <= 0) {
        enemyCreeps = targetRoom.find(FIND_HOSTILE_SPAWNS);
      }

      if (enemyCreeps) {
        let enemyCreep = null;
        if (enemyCreeps.length > 1) {
          enemyCreeps.sort((firstEl, secondEl) => {
            if (
              firstEl.getActiveBodyparts(HEAL) >
              secondEl.getActiveBodyparts(HEAL)
            ) {
              return -1;
            } else {
              return 1;
            }
          });
          enemyCreep = enemyCreeps.shift();
        } else {
          // will be undefined if array is empty
          enemyCreep = enemyCreeps.pop();
        }

        if (enemyCreep) {
          console.log(targetRoom.name + " enemyCreep spotted ");
          invaderId = enemyCreep.id;
        }
      }
    }

    Memory["invaderID" + targetRoom] = invaderId;
    Memory["lastCheckForInvaderTime" + targetRoom.name] = Game.time;
    if (invaderId) {
      console.log("invader" + targetRoom.name + ": " + invaderId);
    }

    return invaderId;
  }

  return Memory["invaderID" + targetRoom];
}
exports.findInvaders = findInvaders;
findInvaders = profiler.registerFN(findInvaders, "findInvaders");
