const findRepairable = require("./action.findRepairableStruct");

const roleTower = {
  /** **/
  run: function(tower) {
    let invader = Game.getObjectById(Memory.invaderId);
    let ramp = tower.pos.lookFor(LOOK_STRUCTURES).pop();
    if (invader && invader.room.name === tower.room.name) {
      console.log("tower attack: " + tower.attack(invader));
    } else if (tower && tower.energy > 300) {
      let struct = findRepairable(tower);

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
    } else if (
      ramp.structureType === STRUCTURE_RAMPART &&
      ramp.hits < ramp.hitsMax &&
      (tower.energy > tower.energyCapacity - 100 || ramp.hits <= 600)
    ) {
      tower.repair(ramp);
    }
  }
};

module.exports = roleTower;
