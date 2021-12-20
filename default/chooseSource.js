const profiler = require("./screeps-profiler");

function chooseSource(creep, sources) {
  const name = creep.name;
  if (!sources || sources.length <= 0) {
    return null;
  }

  let target = null;

  if (sources[0].energy <= 0) {
    target = sources[1] && sources[1].energy > 0 ? sources[1] : null;
  }

  if (sources[1] && sources[1] <= 0) {
    target = sources[0].energy > 0 ? sources[0] : null;
  }

  let sources2 = sources.filter((s) => s.energy && s.energy > 0);
  // no sources have energy
  if (sources2.length <= 0) {
    // if we have more than two sources
    if (sources.length > 1) {
      if (
        sources[0].ticksToRegeneration < sources[1].ticksToRegeneration &&
        sources[0].ticksToRegeneration < 50
      ) {
        target = sources[0];
      } else if (
        sources[1].ticksToRegeneration < sources[0].ticksToRegeneration &&
        sources[1].ticksToRegeneration < 50
      ) {
        target = sources[1];
      } else {
        target = null;
      }
    } else if (sources[0].ticksToRegeneration < 50) {
      // only one source available. it will regen soon, so go to it
      target = sources[0];
    }
  }

  if (!target && sources2.length === 1) {
    target = sources[0];
  }

  if (!target && sources[0] && creep.pos.inRangeTo(sources[0], 2)) {
    target = sources2[0];
  }

  if (!target && sources[1] && creep.pos.inRangeTo(sources[1], 2)) {
    target = sources[1];
  }

  if (!target && sources.length > 0) {
    const numCreepsBySource0 = sources[0]
      ? sources[0].pos.findInRange(FIND_CREEPS, 3).length
      : Infinity;
    const numCreepsBySource1 = sources[1]
      ? sources[1].pos.findInRange(FIND_CREEPS, 3).length
      : Infinity;

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
