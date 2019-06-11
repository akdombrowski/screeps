const roleTower = {
  /** **/
  run: function(tower) {
    let invader = Game.getObjectById(Memory.invaderId);
    if (invader) {
      console.log("tower attack: " + tower.attack(invader));
    } else if (tower && tower.energy > tower.energyCapacity - 50) {
      let struct = Game.getObjectById(Memory.towerRepairTarget);
      if (!struct || struct.hitsMax <= struct.hits) {
        struct = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: structure => {
            return (
              structure.structureType != STRUCTURE_WALL &&
              structure.hits < structure.hitsMax
            );
          }
        });
      }

      Memory.towerRepairTarget = struct ? struct.id : null;

      if (struct) {
        tower.repair(struct);
      } else {
        let healee = tower.room.find(FIND_CREEPS, {
          filter: creep => {
            return creep.hits < creep.hitsMax;
          }
        });
        if (healee[0]) {
          console.log(tower.heal(healee[0]) + "." + healee[0].name);
        }
      }
    }
  }
};

module.exports = roleTower;
