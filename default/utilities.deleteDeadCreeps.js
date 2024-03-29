const { pullFromSourceArrays } = require("./getEnergy.pullFromSourceArrays");
const profiler = require("./screeps-profiler");

function deleteDeadCreeps() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];

      pullFromSourceArrays(name);

      Memory.droppedPickerUpperName = null;
      console.log("del.", name);
    }
  }
}

deleteDeadCreeps = profiler.registerFN(deleteDeadCreeps, "deleteDeadCreeps");
exports.deleteDeadCreeps = deleteDeadCreeps;

