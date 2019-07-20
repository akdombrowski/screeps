const transferEnergy = require("./action.transferEnergy");

function repairRoad(creep, flag) {
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    console.log("transfer now");
    creep.memory.transfer = true;
    transferEnergy(creep);
  }

  let target;
  if (flag) {
    target = flag;
  } else if (creep.memory.source) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.source).pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
      filter: structure => {
        structure.type == STRUCTURE_ROAD;
      }
    });
  }

  retval = creep.repair(target);
  if (retval == ERR_NOT_IN_RANGE) {
    creep.moveTo(target);
    creep.say("r" + target.pos.x + "," + target.pos.y);
    creep.memory.role = "repair";
  } else {
    creep.say("r" + retval);
  }
}

module.exports = repairRoad;
