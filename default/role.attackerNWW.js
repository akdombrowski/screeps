const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./action.getEnergy");

const roleAttacker = {
  /** **/
  run: function(creep) {
    let s1 = Game.spawns.Spawn1;
    const rm = creep.room;
    const rmName = rm.name;
    let creeps = Game.creeps;
    let enAvail = rm.energyAvailable;
    let invader;
    let retval = -16;
    let northExit = Game.flags.northExit;
    let getEnergy = creep.memory.getEnergy;
    let transfer = creep.memory.transfer;
    let name = creep.name;
    const pos = creep.pos;
    const fatigue = creep.fatigue;
    let nwwAttacker = Game.getObjectById(Memory.nwwAttackerId);
    let nwAttacker = Game.getObjectById(Memory.nwAttackerId);

    if ((pos.x <= 2 || pos.x > 48) && rmName === "E34N32" && nwwAttacker) {
      if (fatigue > 0) {
        retval = ERR_TIRED;
        creep.say("f." + fatigue);
      } else {
        retval = creep.move(LEFT);
        creep.say("m.LEFT." + retval);
      }
      return retval;
    }

    if (nwwAttacker && !pos.inRangeTo(nwwAttacker, 1)) {
      retval = smartMove(creep, nwwAttacker, 1, false, "#0ff123", 0, 1000, 8);
      return retval;
    } else if (nwAttacker && !pos.inRangeTo(nwAttacker, 1) && !nwwAttacker) {
      Memory.nwwAttackerId = null;
      if (pos.x < 2 && rmName !== "E35N31") {
        if (fatigue > 0) {
          creep.say("f." + fatigue);
        } else {
          retval = creep.move(RIGHT);
          creep.say("m.RIGHT." + retval);
        }
      } else {
        retval = smartMove(
          creep,
          nwAttacker,
          1,
          false,
          "#ff0123",
          0,
          1000,
          8
        );
      }
      return retval;
    }

    let enemyCreep;
    if (nwwAttacker) {
      enemyCreep = nwwAttacker;
    } else if (nwAttacker) {
      enemyCreep = nwAttacker;
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
      retval = smartMove(creep, invader, 1, false, "#43ff00", 0, 1000, 2);
    }
    return retval;
  },
};

module.exports = roleAttacker;
