function findRepairable(creep) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (creep.room.name === Memory.homeRoomName && Memory.e59s48fixables) {
    weakest = Memory.e59s48fixables.pop();
  } else if (creep.room.name === "E36N31") {
    weakest = Memory.e36n31fixables.pop();
  } else if (creep.room.name === "E36N32") {
    weakest = Memory.e36n32fixables.pop();
  } else if (creep.room.name === "E35N32") {
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
