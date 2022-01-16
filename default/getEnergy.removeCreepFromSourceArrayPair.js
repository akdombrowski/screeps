const profiler = require("./screeps-profiler");

function removeCreepFromSourceArrayPair(creepName, sourceArrayName) {
    _.pull(Memory[sourceArrayName + "Source1Creeps"], creepName);
    _.pull(Memory[sourceArrayName + "Source2Creeps"], creepName);
}
exports.removeCreepFromSourceArrayPair = removeCreepFromSourceArrayPair;
removeCreepFromSourceArrayPair = profiler.registerFN(
    removeCreepFromSourceArrayPair,
    "removeCreepFromSourceArrayPair"
);
