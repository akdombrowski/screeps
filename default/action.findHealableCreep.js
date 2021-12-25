const profiler = require("./screeps-profiler");

function findHealable(repairer) {
  let healables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (repairer.room.name === Memory.homeRoomName && Memory.e59s48healables) {
    weakest = Memory.e59s48healables.shift();
  } else if (repairer.room.name === Memory.northRoomName) {
    weakest = Memory.e59s47healables.shift();
  } else if (repairer.room.name === Memory.deepSouthRoomName) {
    weakest = Memory.e59s49healables.shift();
  }

  if (weakest) {
    target = Game.getObjectById(weakest);
  } else {
    target = null;
  }

  return target;
}

findHealable = profiler.registerFN(findHealable, "findHealable");

module.exports = findHealable;
