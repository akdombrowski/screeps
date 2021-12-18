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
  } else if (repairer.room.name === "E36N32") {
    weakest = Memory.e36n32fixables.pop();
  } else if (repairer.room.name === "E35N32") {
    weakest = Memory.e35n32fixables.pop();
  }

  if (weakest) {
    target = Game.getObjectById(weakest);
  } else {
    target = null;
  }

  return target;
}

module.exports = findRepairable;
