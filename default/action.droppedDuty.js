const smartMove = require("./action.smartMove");
const profiler = require("./screeps-profiler");
function droppedDuty(creep) {
  let retval = -16;
  let name = creep.name;
  let cRm = creep.room;
  let droppedTarget = Game.getObjectById(creep.memory.droppedTargetId);
  let droppedPickerUpper = Memory.droppedPickerUpperName;
  let tombstoneHunter = Memory.tombstoneHunterName;
  let tombstoneTarget = Game.getObjectById(Memory.tombstoneTargetId);
  let target;

  if (!droppedPickerUpper || droppedPickerUpper === name) {
    droppedTarget = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (source) => {
        if (source.resourceType === RESOURCE_ENERGY && source.room === cRm) {
          return source;
        }
      },
    });

    if (!droppedTarget) {
      droppedTarget = creep.pos.findClosestByPath(FIND_TOMBSTONES);
    }

    console.log(name + " droppedPickerUpper:" + droppedTarget);
    if (droppedTarget) {
      creep.memory.droppedTargetId = droppedTarget.id;
      Memory.droppedPickerUpperName = name;
      if (droppedTarget) {
        if (creep.pos.isNearTo(droppedTarget)) {
          creep.say("pu");
          if(!droppedTarget.resourceType) {
            droppedTarget = droppedTarget.pos.lookFor(LOOK_RESOURCES).pop();
          }

          retval = creep.pickup(droppedTarget);
          console.log(creep + " retval " + retval)
          return retval;
        } else {
          creep.say("m.pu");
          retval = smartMove(creep, droppedTarget, 1);
          return retval;
        }
      }
    } else {
      Memory.droppedPickerUpperName = null;
      retval = ERR_NOT_FOUND;
    }
  }

  return retval;
}

droppedDuty = profiler.registerFN(droppedDuty, "droppedDuty");
exports.droppedDuty = droppedDuty;
