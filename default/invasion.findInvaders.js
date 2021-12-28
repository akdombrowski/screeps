const getAttackEvents = require("./invasion.getAttackEvents");
const profiler = require("./screeps-profiler");

function findInvaders(
  targetRoom,
  lastCheckForInvaderTime,
  attackerCheckWaitTime
) {
  let invaderId = null;
  const targetRoomName = targetRoom.name;

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
          invaderId = enemyCreep.id;
        }
      }
    }

    Memory["invaderID" + targetRoomName] = invaderId;
    Memory["lastCheckForInvaderTime" + targetRoomName] = Game.time;
    if (invaderId) {
      const invader = Game.getObjectById(invaderId);
      const healthPercent = ((invader.hits / invader.hitsMax) * 100).toFixed(2);

      console.log("invader" + targetRoomName + ": " + invaderId);
      console.log(
        "health: " +
          invader.hits +
          "/" +
          invader.hitsMax +
          " " +
          healthPercent +
          "%"
      );
    }

    return invaderId;
  }

  return Memory["invaderID" + targetRoomName];
}
exports.findInvaders = findInvaders;
findInvaders = profiler.registerFN(findInvaders, "findInvaders");
