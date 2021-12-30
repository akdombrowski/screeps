const profiler = require("./screeps-profiler");

function findRepairable(repairer) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (repairer.room.name === Memory.homeRoomName && Memory.homefixables) {
    weakest = Memory.homefixables.shift();
  } else if (repairer.room.name === Memory.northRoomName) {
    weakest = Memory.northfixables.shift();
  } else if (repairer.room.name === Memory.southRoomName && Memory.southfixables) {
    weakest = Memory.southfixables.shift();
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
