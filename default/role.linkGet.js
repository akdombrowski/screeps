const smartMove = require("./action.smartMove");

const linkGet = {
  /** **/
  run: function(creep) {
    let target;
    let retval = -16;
    let linkExit = Game.getObjectById(Memory.linkExitId);

    if (!creep) {
      console.log("creep is gone");
      return;
    }

    if (creep.memory.linkGetEnergy || _.sum(creep.energy <= 0)) {
      creep.memory.linkGetEnergy = true;
      target = linkExit;
      if (target && target.structureType === STRUCTURE_LINK) {
        target = target;
        creep.say("m.link");
      } else {
        target = null;
        creep.say("linkSad");
        return;
      }

      if (target && creep.pos.isNearTo(target.pos)) {
        retval = creep.withdraw(target, RESOURCE_ENERGY);
        if (retval == OK) {
          creep.say("wd");
          creep.memory.dest = target.pos;
        }
      } else if (target) {
        creep.say("m." + target.pos.x + "," + target.pos.y);

        retval = smartMove(creep, target, 1, true, "#00ffff", 2000, 1000);

        if (retval != OK) {
          creep.say("m." + retval);
        } else {
          creep.say("m");
        }

        if (creep.fatigue > 0) {
          creep.say("f." + creep.fatigue);
        }

        creep.memory.dest = target.pos;
      } else if (_.sum(creep.carry) < creep.carryCapacity) {
        creep.memory.linkGetEnergy = true;
        creep.say("e");
      } else {
        creep.memory.dest = null;
        creep.say("t.err." + retval);
      }

      if (_.sum(creep.carry) == 0) {
        creep.memory.linkGetEnergy = false;
      }
    } else {
      creep.memory.linkGetEnergy = false;

      let contr = Game.getObjectById(Memory.rmControllerId);
      if (creep.pos.inRangeTo(contr, 3)) {
        creep.upgradeController(contr);
        creep.say("ucl");
      } else {
        smartMove(creep, contr, 3, true, "#fff00f", 0, 2000);
        creep.say("m");
      }

      if (_.sum(creep.carry) <= 0) {
        creep.memory.linkGetEnergy = true;
      }
    }
  }
};
module.exports = linkGet;
