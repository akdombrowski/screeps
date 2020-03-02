function findRepairable(creep) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  if (creep.room.name === "E35N31") {
    weakest = Memory.e35n31fixables.pop();
  } else if (creep.room.name === "E36N31") {
    weakest = Memory.e36n31fixables.pop();
  } else if (creep.room.name === "E36N32") {
    weakest = Memory.e36n32fixables.pop();
  } else if (creep.room.name === "E35N32") {
    weakest = Memory.e35n32fixables.pop();
  }
  target = Game.getObjectById(weakest);

  return target;
}

module.exports = findRepairable;
