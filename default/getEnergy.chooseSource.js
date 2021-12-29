const profiler = require("./screeps-profiler");

function chooseSource(creep, sources) {
  const name = creep.name;
  if (!sources || sources.length <= 0) {
    return null;
  }

  let target = null;
  let isSource0Empty = false;
  let isSource1Empty = false;

  // first source has no energy
  if (sources[0].energy <= 0) {
    target = sources[1] && sources[1].energy > 0 ? sources[1] : null;
    isSource0Empty = true;
  }

  // there is a second source
  // and
  // it doesn't have energy
  if (sources[1] && sources[1].energy <= 0) {
    target = sources[0].energy > 0 ? sources[0] : null;
    isSource1Empty = true;
  }

  // get all sources that have some energy
  let sources2 = sources.filter((s) => s.energy && s.energy > 0);

  // if our array is empty, it means no sources have energy
  if (!target && sources2.length <= 0) {
    // use original sources passed in
    // if there was more than 1...
    if (sources.length > 1) {
      // if we have more than two original sources
      // check which is closer to regeneration
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
      // only one source available and it will regen soon,
      // so go to it
      target = sources[0];
    }
  } else if (!target && sources2.length === 1) {
    // there's only 1 source out of the sources passed in,
    // that has energy
    target = sources[0];
  }

  // Ok, so at this point, if we don't have a target, we know that we have more than 1 source with energy via the sources2 array. And since screeps docs say any room will only have at most 2 sources, we can know that we have 2 sources (if this function is only used to compare between sources in single room, I can't imagine getting to the point in the game where I need to worry about comparing more than 2 sources from multiple rooms)

  // Check how crowded each source is.
  if (!target) {
    const numCreepsBySource0 = sources[0]
      ? sources[0].pos.findInRange(FIND_CREEPS, 2).length
      : Infinity;
    const numCreepsBySource1 = sources[1]
      ? sources[1].pos.findInRange(FIND_CREEPS, 2).length
      : Infinity;

    if (numCreepsBySource0 > 3 && numCreepsBySource0 > numCreepsBySource1 + 1) {
      // source0 has at least 5 creeps near it and is more
      // crowded than source1
      target = sources[1];
    } else if (
      numCreepsBySource1 > 3 &&
      numCreepsBySource1 > numCreepsBySource0 + 1
    ) {
      target = sources[0];
    }
  }

  // Ok, so at this point we know that we have more than 1
  // source with energy and they're about equally crowded

  // if source0 exists and the creep is close to it,
  // just go to that one
  if (!target && creep.pos.inRangeTo(sources[0], 3)) {
    target = sources2[0];
  }

  // if not close to the first source, check if your close
  // to the second one
  if (!target && creep.pos.inRangeTo(sources[1], 3)) {
    target = sources[1];
  }

  // Ok, so at this point we know that we have more than 1
  // source with energy and they're about equally crowded
  // and you're not close to either one

  // As a last ditch effort find the one closest by range
  // (to save on cpu)
  if (!target) {
    target = creep.pos.findClosestByRange(sources);
  }

  // and finally, we have our chosen source 👑, or it might
  // be null 🙃
  return target;
}

chooseSource = profiler.registerFN(chooseSource, "chooseSource");
exports.chooseSource = chooseSource;
