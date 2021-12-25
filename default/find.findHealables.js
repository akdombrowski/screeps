const profiler = require("./screeps-profiler");

function findHealables(room) {
  if (!room) {
    return null;
  }

  let healables = room.find(FIND_MY_CREEPS, {
    filter: (creep) => creep.hits < creep.hitsMax,
  });

  healables.sort(function compareFn(firstEl, secondEl) {
    const first = -1;
    const second = 1;
    const firstElMissingHealth = firstEl.hitsMax - firstEl.hits;
    const secondElMissingHealth = secondEl.hitsMax - secondEl.hits;
    const isFirstElAtHalfHealthOrLower = firstEl.hitsMax / firstEl.hits >= 2;
    const isSecondElAtHalfHealthOrLower = secondEl.hitsMax / secondEl.hits >= 2;

    if (isFirstElAtHalfHealthOrLower) {
      return first;
    }

    if (isSecondElAtHalfHealthOrLower) {
      return second;
    }

    if (firstElMissingHealth > secondElMissingHealth) {
      return first;
    } else {
      return second;
    }
  });

  return healables.map((f) => f.id);
}

findHealables = profiler.registerFN(findHealables, "findHealables");
exports.findHealables = findHealables;
