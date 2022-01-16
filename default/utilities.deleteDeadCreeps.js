const profiler = require("./screeps-profiler");

function deleteDeadCreeps() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];

      _.pull(Memory.homeSource1Creeps, creep.name);
      _.pull(Memory.homeSource2Creeps, creep.name);
      _.pull(Memory.northwestSource1Creeps, creep.name);
      _.pull(Memory.northwestSource2Creeps, creep.name);

      Memory.droppedPickerUpperName = null;
      console.log("del.", name);
    }
  }
}

deleteDeadCreeps = profiler.registerFN(deleteDeadCreeps, "deleteDeadCreeps");
exports.deleteDeadCreeps = deleteDeadCreeps;
