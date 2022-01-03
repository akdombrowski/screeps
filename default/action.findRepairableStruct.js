const profiler = require("./screeps-profiler");

function findRepairable(repairer) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (repairer.room.name === Memory.homeRoomName && Memory.homeFixables) {
    weakest = Memory.homeFixables.shift();
  } else if (repairer.room.name === Memory.northRoomName) {
    weakest = Memory.northFixables.shift();
  } else if (
    repairer.room.name === Memory.southRoomName &&
    Memory.southFixables
  ) {
    weakest = Memory.southfixables.shift();
  } else if (
    repairer.room.name === Memory.westRoomName &&
    Memory.westFixables
  ) {
    weakest = Memory.westFixables.shift();
  }

  if (weakest) {
    target = Game.getObjectById(weakest);
  } else {
    target = null;
  }

  return target;
}

findRepairable = profiler.registerFN(findRepairable, "findRepairable");

module.exports = findRepairable;
