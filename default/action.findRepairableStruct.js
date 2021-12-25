const profiler = require("./screeps-profiler");

function findRepairable(repairer) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (repairer.room.name === Memory.homeRoomName && Memory.e59s48fixables) {
    weakest = Memory.e59s48fixables.shift();
  } else if (repairer.room.name === Memory.northRoomName) {
    weakest = Memory.e59s47fixables.shift();
  } else if (repairer.room.name === Memory.deepSouthRoomName) {
    weakest = Memory.e59s49fixables.shift();
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
