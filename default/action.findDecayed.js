function findDecayed(roomName) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;
  let rm = Game.rooms[roomName];
  let fixablesIds = [];

  if (rm) {
    fixables = rm.find(FIND_STRUCTURES, {
      filter: struct => {
        if (struct.structureType === STRUCTURE_WALL) {
          return false;
        }

        return struct.hits < struct.hitsMax;
      },
    });

    // sort by the difference of hits and hits max (how much more before getting to full structural health).
    // since sortBy sorts by ascending value, we'll use the negative of the difference b/w hits and hitsmax
    _.sortBy(fixables, value => {
      if(value.hits < 1000) {
        return -value.hits;
      }
      return value.hits - value.hitsMax;
    });


    _.each(fixables, struct => {
      fixablesIds.push(struct.id);
    });

    if (fixablesIds.length) {
      fixablesIds = _.sortBy(fixablesIds, id => {
        let struct = Game.getObjectById(id);
        return (struct.hitsMax - struct.hits) / struct.hitsMax;
      });
    }
  }

  return fixablesIds;
}

module.exports = findDecayed;
