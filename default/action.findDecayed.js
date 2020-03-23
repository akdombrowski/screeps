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


        return struct.hits < struct.hitsMax;
      },
    });

    // sort by the difference of hits and hits max (how much more before getting to full structural health).
    // since sortBy sorts by ascending value, we'll use the negative of the difference b/w hits and hitsmax
    let fixables2 = _.sortBy(fixables, value => {
      if(value.hits < value.hitsMax) {

        return -value.hits;
      }

      return -value.hits - 1000000;
    });

    _.each(fixables2, struct => {
      fixablesIds.push(struct.id);
    });
  }

  return fixablesIds;
}

module.exports = findDecayed;
