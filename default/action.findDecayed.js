function findDecayed(roomName) {
  let fixables = [];
  let lessThan10Perc = [];
  let lessThan50Perc = [];
  let lessThan90Perc = [];
  let weakest;
  let target;
  let rm = Game.rooms[roomName];

  fixables = rm.find(FIND_STRUCTURES, {
    filter: struct => {
      if (struct.structureType === STRUCTURE_WALL) {
        return false;
      }

      return struct.hits < struct.hitsMax;
    }
  });
  
  let fixablesIds = [];
  _.each(fixables, struct => {
    fixablesIds.push(struct.id);
  });

  if (fixablesIds.length) {
    fixablesIds = _.sortBy(fixablesIds, id => {
      let struct = Game.getObjectById(id);
      return (struct.hitsMax - struct.hits) / struct.hitsMax;
    });
  }

  return fixablesIds;
}

module.exports = findDecayed;
