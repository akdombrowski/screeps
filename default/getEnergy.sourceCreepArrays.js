const profiler = require("./screeps-profiler");

function sourceCreepArrays(target, creep, roomDirection) {
  let lastSourceArraysCleanupTime = Memory.lastSourceArraysCleanupTime;
  const cleanupTimeInterval = 60;

  if (!lastSourceArraysCleanupTime) {
    Memory.lastSourceArraysCleanupTime = 0;
    lastSourceArraysCleanupTime = Memory.lastSourceArraysCleanupTime;
  }

  if (!Memory[roomDirection + "Source1Creeps"]) {
    Memory[roomDirection + "Source1Creeps"] = [];
  }

  if (!Memory[roomDirection + "Source2Creeps"]) {
    Memory[roomDirection + "Source2Creeps"] = [];
  }

  let source1Creeps = Memory[roomDirection + "Source1Creeps"] || [];
  let source2Creeps = Memory[roomDirection + "Source2Creeps"] || [];

  if (target.id === Memory[roomDirection + "Source1ID"]) {
    if (!source1Creeps.find((name) => name === creep.name)) {
      source1Creeps.push(creep.name);
    }
    _.pull(source2Creeps, creep.name);
  } else if (target.id === Memory[roomDirection + "Source2ID"]) {
    if (!source2Creeps.find((name) => name === creep.name)) {
      source2Creeps.push(creep.name);
    }
    _.pull(source1Creeps, creep.name);
  }

  Memory[roomDirection + "Source1Creeps"] = source1Creeps;
  Memory[roomDirection + "Source2Creeps"] = source2Creeps;

  if (Game.time - lastSourceArraysCleanupTime > cleanupTimeInterval) {
    _.remove(Memory[roomDirection + "Source1Creeps"], (name) => {
      console.log(name + " " + Game.creeps[name]);
      return !Game.creeps[name];
    });
    _.remove(Memory[roomDirection + "Source2Creeps"], (name) => {
      console.log(name + " source2 " + Game.creeps[name]);
      return !Game.creeps[name];
    });

    Memory.lastSourceArraysCleanupTime = Game.time;
  }
}
exports.sourceCreepArrays = sourceCreepArrays;
sourceCreepArrays = profiler.registerFN(sourceCreepArrays, "sourceCreepArrays");
