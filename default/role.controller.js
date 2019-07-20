const smartMove = require("./action.smartMove");

var roleController = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.controlling && creep.carry.energy == 0) {
      creep.memory.controlling = false;
      creep.say("harvest");
      getEnergy(creep, Game.getObject.byId("5bbcaefa9099fc012e639e8f"));
      return;
    }

    if (
      !creep.memory.controlling &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.controlling = true;
      creep.say("controlling");
    }

    if (creep.memory.controlling) {
      if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
      } else {
        let target = Game.getObjectById("5bbcaefa9099fc012e639e90");
        if (creep.pos.inRangeTo(target, 3) && creep.fatigue <= 0) {
          smartMove(creep, target, 3);
        } else {
          creep.upgradeController(target);
          creep.say("u");
        }
      }
    } else {
      creep.memory.controlling = false;
      let source = Game.getObject.byId("5bbcaefa9099fc012e639e8f");
      getEnergy(creep, source);
    }
  }
};

module.exports = roleController;
