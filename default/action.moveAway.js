function moveAway(creep, nearbySources, nearbyCreeps) {
  let name = creep.name;
  let rm = creep.room;
  let creepPos = creep.pos;
  let creepX = creepPos.x;
  let creepY = creepPos.y;
  let retval = -16;
  const terrain = rm.getTerrain();

  let goals1 = _.map(nearbySources, function (source) {
    // We can't actually walk on sources-- set `range` to 1
    // so we path next to it.
    if (source.pos) {
      return { pos: source.pos, range: 1 };
    }
  });

  let goals2 = _.map(nearbyCreeps, function (c) {
    if (c.pos) {
      return { pos: c.pos, range: 1 };
    }
  });

  let goals = [...goals1, ...goals2];

  let pathFinderSearchResults = PathFinder.search(creep.pos, goals, {
    // We need to set the defaults costs higher so that we
    // can set the road cost lower in `roomCallback`
    plainCost: 2,
    swampCost: 10,
    flee: true,

    roomCallback: function (roomName) {
      let room = Game.rooms[roomName];
      // In this example `room` will always exist, but since
      // PathFinder supports searches which span multiple rooms
      // you should be careful!
      if (!room) return;
      let costs = new PathFinder.CostMatrix();

      // Avoid nearby sources
      nearbySources.forEach(function (struct) {
        costs.set(struct.pos.x, struct.pos.y, 0xff);
      });

      // Avoid nearby creeps
      nearbyCreeps.forEach(function (creep) {
        costs.set(creep.pos.x, creep.pos.y, 0xff);
      });

      // right
      if (terrain.get(creepX + 1, creepY) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // right top
      if (terrain.get(creepX + 1, creepY + 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // top
      if (terrain.get(creepX, creepY + 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // left top
      if (terrain.get(creepX - 1, creepY + 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // left
      if (terrain.get(creepX - 1, creepY) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // left bottom
      if (terrain.get(creepX - 1, creepY - 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // bottom
      if (terrain.get(creepX, creepY - 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      // right bottom
      if (terrain.get(creepX + 1, creepY - 1) === TERRAIN_MASK_WALL) {
        costs.set(creepX + 1, creepY, 0xff);
      }

      return costs;
    },
  });

  if (!pathFinderSearchResults.incomplete) {
    retval = creep.moveByPath(pathFinderSearchResults.path);
  }

  return retval;
}

module.exports = moveAway;
