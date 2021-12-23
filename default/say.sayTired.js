const profiler = require("./screeps-profiler");

function sayTired(creep) {
  creep.say("f." + creep.fatigue + "😴");
}
exports.sayTired = sayTired;
sayTired = profiler.registerFN(sayTired, "sayTired");
