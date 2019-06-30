const roleAttacker = {
  /** **/
  run: function(creep) {
    let s1 = Game.spawns.s1;
    let rm = s1.room;
    let creeps = Game.creeps;
    let enAvail = rm.energyAvailable;
    let invader;
    let retval;

    let enemyCreeps = rm.find(FIND_CREEPS, {
      filter: (creep) => {
        return !creep.my;
      },
    });

    invader = enemyCreeps.pop();
    _.forEach(creeps, (c) => {
      // console.log(JSON.stringify(Game.creeps));
      if (c.pos.inRangeTo(invader, 3)) {
        console.log("attack:" + c.rangedAttack(invader));
      } else {
        console.log("move:" + c.moveTo(invader, { range: 3 }));
      }
    });
  },
};

module.exports = roleAttacker;
