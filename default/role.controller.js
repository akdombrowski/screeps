var roleController = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.controlling && creep.carry.energy == 0) {
      creep.memory.controlling = false;
      creep.say("ð harvest");
      getEnergy(creep, Game.getObject.byId("5bbcaefa9099fc012e639e8f"));
      return;
    }

    if (
      !creep.memory.controlling &&
      creep.carry.energy == creep.carryCapacity
    ) {
      creep.memory.controlling = true;
      creep.say("ð§ controlling");
    }

    if (creep.memory.controlling) {
      if (creep.fatigue > 0) {
        creep.say("ðð»." + creep.fatigue);
      } else {
        var target = Game.getObjectById("5bbcaefa9099fc012e639e90");
        if (creep.pos.inRangeTo(target, 3) && creep.fatigue <= 0) {
          creep.moveTo(target, {
            range: 3,
            visualizePathStyle: { stroke: "#ffffff" }
          });
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
