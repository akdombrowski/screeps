const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./action.getEnergy.1");

const roleAttacker = {
  /** **/
  run: function(creep) {
    let s1 = Game.spawns.Spawn1;
    let rm = s1.room;
    let creeps = Game.creeps;
    let enAvail = rm.energyAvailable;
    let invader;
    let retval;
    let northExit = Game.flags.northExit;
    let getEnergy = creep.memory.getEnergy;
    let transfer = creep.memory.transfer;
    let name = creep.name;

    if (rm.name === "E35N31") {
      if (creep.pos.isNearTo(northExit)) {
        retval = creep.move(BOTTOM);
      } else {
        retval = smartMove(creep, northExit.pos, 1);
      }
      return retval;
    }

    let enemyCreeps = rm.find(FIND_CREEPS, {
      filter: creep => {
        return !creep.my;
      },
    });

    invader = enemyCreeps.pop();
    if (creep.pos.isNearTo(invader)) {
      console.log("attack:" + creep.attack(invader));
    } else {
      console.log("move:" + smartMove(creep, invader, 1));
    }
  },
};

module.exports = roleAttacker;
