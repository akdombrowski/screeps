const profiler = require("./screeps-profiler");

function findFixables(room) {
  if (!room) {
    return null;
  }

  let fixables = room.find(FIND_STRUCTURES, {
    filter: function (struct) {
      if (struct.structureType === STRUCTURE_ROAD) {
        return struct.hits < struct.hitsMax;
      } else if (struct.structureType === STRUCTURE_STORAGE) {
        return struct.hits < struct.hitsMax;
      } else if (struct.structureType === STRUCTURE_CONTAINER) {
        return struct.hits < struct.hitsMax;
      } else if (struct.structureType === STRUCTURE_TOWER) {
        return struct.hits < struct.hitsMax;
      } else {
        return false;
      }
    },
  });

  fixables.sort(function compareFn(firstEl, secondEl) {
    const first = -1;
    const second = 1;
    if (firstEl.hitsMax / firstEl.hits >= 2) {
      return first;
    }

    if (secondEl.hitsMax / secondEl.hits >= 2) {
      return second;
    }

    if (firstEl.hitsMax - firstEl.hits > secondEl.hitsMax - secondEl.hits) {
      return first;
    } else {
      return second;
    }
  });

  return fixables.map((f) => f.id);
}

findFixables = profiler.registerFN(findFixables, "findFixables");
exports.findFixables = findFixables;
