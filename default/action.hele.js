const getEnergy = require("./action.getEnergy");

function hele(creep, flag) {
  let target;
  let s;
  if (
    creep.memory.target &&
    creep.memory.target.ticksToLive < CREEP_LIFE_TIME / 2
  ) {
    target = creep.memory.target;
  } else {
    for (c in Game.creeps) {
      let cr = Game.creeps[c];
      if (c == creep.name) {
        continue;
      }
      if (!target) {
        target = cr;
        continue;
      }

      if (
        cr.ticksToLive < target.ticksToLive &&
        cr.ticksToLive < CREEP_LIFE_TIME
      ) {
        target = Game.creeps[c];
      }
    }
  }

  if (target) {
    creep.memory.heal = target;
  }

  let retval = creep.heal(target);
  if (retval == OK) {
    creep.say("h+ " + target.name);
  } else if (retval == ERR_NOT_IN_RANGE) {
    creep.say("h+ chase");
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ffffff" }
    });
  } else {
    creep.say("h." + retval);
  }
}

module.exports = hele;
