function findRepairable(creep) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;

  weakest = Memory.fixables.pop();
  target = Game.getObjectById(weakest);

  return target;
}

module.exports = findRepairable;
