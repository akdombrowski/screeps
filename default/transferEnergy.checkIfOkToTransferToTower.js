const profiler = require("./screeps-profiler");

function checkIfOkToTransferToTower(
  target,
  enAvail,
  creep,
  minAmountOfEnAvail
) {
  if (!target ||
    target.structureType != STRUCTURE_TOWER ||
    enAvail < minAmountOfEnAvail) {
    target = null;
    creep.memory.path = null;
    creep.memory.transferTargetId = null;
    creep.memory.flag = null;
  }

  return target;
}
exports.checkIfOkToTransferToTower = checkIfOkToTransferToTower;
checkIfOkToTransferToTower = profiler.registerFN(
  checkIfOkToTransferToTower,
  "checkIfOkToTransferToTower"
);
