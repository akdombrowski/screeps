const smartMove = require("./move.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./getEnergy.action.getEnergy");

const roleAttacker = {
  /** **/
  run: function(creep) {
    let s1 = Game.spawns.Spawn1;
    let rm = creep.room;
    const rmName = rm.name;
    let creeps = Game.creeps;
    let enAvail = rm.energyAvailable;
    let invader;
    let retval;
    let northExit = Game.flags.northExit;
    let getEnergy = creep.memory.getEnergy;
    let transfer = creep.memory.transfer;
    let name = creep.name;
    const pos = creep.pos;
    let nwAttacker = Game.getObjectById(Memory.nwAttackerId);
    let nwwAttacker = Game.getObjectById(Memory.nwwAttackerId);



    if ((pos.y >= 46 || pos.y < 1) && rmName === "E34N31") {
      retval = creep.move(TOP);
      creep.say("m.TOP." + retval);
      return retval;
    }
    if (nwAttacker && !creep.pos.inRangeTo(nwAttacker, 1)) {
      retval = smartMove(creep, nwAttacker, 1, false, "#0ff123", 0, 1000, 6);
      return retval;
    } else if (
      rm.name !== "E33N32" &&
      nwwAttacker &&
      !nwAttacker
    ) {
      Memory.nwAttackerId = null;
      retval = smartMove(
        creep,
        Game.flags.nww.pos,
        5,
        false,
        "#0f0ff0",
        0,
        1000,
        8
      );
      return retval;
    }

    // if (pos.x < 2) {
    //   retval = creep.move(RIGHT);
    //   creep.say("m.RIGHT." + retval);
    //   return retval;
    // } else if (pos.y < 1) {
    //   retval = creep.move(TOP);
    //   c;
    //   creep.say("m.TOP." + retval);
    //   return retval;
    // } else if (pos.x > 48) {
    //   retval = creep.move(LEFT);
    //   creep.say("m.LEFT." + retval);
    //   return retval;
    // } else if (pos.y >= 48) {
    //   retval = creep.move(TOP);
    //   creep.say("m.TOP." + retval);
    //   return retval;
    // }

    let enemyCreep;
    if (Memory.nwAttackerId) {
      enemyCreep = Game.getObjectById(Memory.nwAttackerId);
    } else if (Memory.nwwAttackerId) {
      enemyCreep = Game.getObjectById(Memory.nwwAttackerId);
    }

    if (enemyCreep) {
      invader = enemyCreep;
    } else {
      let enemyCreeps = rm.find(FIND_HOSTILE_STRUCTURES);

      if (!enemyCreeps || enemyCreeps.length <= 0) {
        enemyCreeps = rm.find(FIND_HOSTILE_CREEPS);
      }

      if (!enemyCreeps || enemyCreeps.length <= 0) {
        enemyCreeps = rm.find(FIND_HOSTILE_SPAWNS);
      }

      invader = enemyCreeps.pop();
    }

    if (creep.pos.isNearTo(invader)) {
      retval = creep.attack(invader);
    } else {
      retval = smartMove(creep, invader, 1);
    }
    return retval;
  },
};

module.exports = roleAttacker;
