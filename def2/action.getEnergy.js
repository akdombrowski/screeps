const transferEnergy = require("./action.transferEnergy");

function vest(creep, flag) {
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    console.log("transfer now");
    creep.memory.transfer = true;
    transferEnergy(creep);
    creep.memory.source = null;
  }

  let target;
  if (flag) {
    target = flag;
  } else if (creep.memory.source) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.source).pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.memory.source = target.pos;
  }

  retval = creep.harvest(target);
  if (retval == OK) {
    creep.say("v");
  } else if (retval == ERR_NOT_IN_RANGE) {
    creep.say("v" + target.pos.x + "," + target.pos.y);
    creep.moveTo(target, {
      visualizePathStyle: { stroke: "#ff00ff" }
    });
  } else {
    creep.say("v" + retval);
  }
}

module.exports = vest;
