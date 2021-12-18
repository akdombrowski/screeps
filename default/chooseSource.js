const profiler = require("./screeps-profiler");

function chooseSource(creep, sources) {
  const name = creep.name;
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

  let sources2 = sources.filter((s) => s.energy > 0);
  // no sources have energy
  if (sources2.length <= 0) {
    if (sources.length > 1) {
      if (sources[0].ticksToRegeneration < sources[1].ticksToRegeneration) {
        target = sources[0];
      } else {
        target = sources[1];
      }
    } else {
      target = sources[0];
    }
  }

  if (sources2.length === 1) {
    target = sources[0];
  }

  if (!target && creep.pos.inRangeTo(sources[0], 2)) {
    target = sources2[0];
  }

  if (!target && creep.pos.inRangeTo(sources[1], 2)) {
    target = sources[1];
  }

  if (!target && sources.length > 0) {
    const numCreepsBySource0 = sources[0].pos.findInRange(
      FIND_CREEPS,
      3
    ).length;
    const numCreepsBySource1 = sources[1].pos.findInRange(
      FIND_CREEPS,
      3
    ).length;

    if (numCreepsBySource0 > numCreepsBySource1) {
      target = sources[1];
    } else {
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
