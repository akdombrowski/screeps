const smartMove = require("./move.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./getEnergy");

const roleAttacker = {
  /** **/
  run: function(creep) {
    let s1 = Game.spawns.Spawn1;
    let rm = creep.room;
    let creeps = Game.creeps;
    let enAvail = rm.energyAvailable;
    let invader;
    let retval;
    let northExit = Game.flags.northExit;
    let neExit1 = Game.flags.neEntrance1;
    let getEnergy = creep.memory.getEnergy;
    let transfer = creep.memory.transfer;
    let name = creep.name;

    if (rm.name === "E35N31") {
      if (creep.pos.isNearTo(northExit)) {
        retval = creep.move(TOP);
      } else if (creep.pos.y > 2 && creep.pos.y < 49) {
        retval = smartMove(creep, northExit.pos, 1);
      } else {
        retval = creep.move(TOP);
      }

      return retval;
    } else if (rm.name === "E35N32") {
      if (creep.pos.y >= 48) {
        retval = smartMove(creep, Game.flags.north1, 3);
      }
      return retval;
    } else if (rm.name === "E36N31") {
      if (creep.pos.y <= 1) {
        if (creep.pos.x > neExit1.pos.x) {
          creep.move(LEFT);
        } else {
          retval = creep.move(TOP);
        }
      } else {
        retval = smartMove(creep, neExit1, 1);
      }
      return retval;
    }

    let enemyCreeps = rm.find(FIND_HOSTILE_STRUCTURES);

    if (!enemyCreeps) {
      enemyCreeps = rm.find(FIND_HOSTILE_CREEPS);
    }

    if (!enemyCreeps) {
      enemyCreeps = rm.find(FIND_HOSTILE_SPAWNS);
    }

    invader = enemyCreeps.pop();
    if (creep.pos.isNearTo(invader)) {
      retval = creep.attack(invader);
    } else {
      retval = smartMove(creep, invader, 1);
    }
    return retval;
  },
};

module.exports = roleAttacker;
