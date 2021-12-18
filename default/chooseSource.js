const profiler = require("./screeps-profiler");

function chooseSource(creep, sources) {
  if (!sources || sources.length <= 0) {
    return null;
  }

  let target = null;

  if (sources[0].energy <= 0) {
    target = sources[1].energy > 0 ? sources[1] : null;
  }

  if (sources[1] && sources[1] <= 0) {
    target = sources[0].energy > 0 ? sources[0] : null;
  }

  sources = sources.filter((s) => s.energy > 0);
  if (sources.length <= 0) {
    // no sources have energy
    return null;
  }

  if (sources.length === 1) {
    target = sources[0];
  }

  if (!target && creep.pos.inRangeTo(sources[0], 3)) {
    target = sources[0];
  }

  if (!target && creep.pos.inRangeTo(sources[1], 3)) {
    target = sources[1];
  }

  if (!target && sources.length > 0) {
    const numCreepsBySource0 = sources[0].pos.findInRange(
      FIND_CREEPS,
      5
    ).length;
    const numCreepsBySource1 = sources[1].pos.findInRange(
      FIND_CREEPS,
      5
    ).length;
    if (numCreepsBySource0 > numCreepsBySource1 && sources[1].energy > 0) {
      target = sources[1];
    } else if (
      numCreepsBySource1 > numCreepsBySource0 &&
      sources[0].energy > 0
    ) {
      target = sources[0];
    }
  }

  if (!target && sources.length > 0) {
    target = creep.pos.findClosestByPath(sources);
  }
  return target;
}

chooseSource = profiler.registerFN(chooseSource, "chooseSource");
exports.chooseSource = chooseSource;
