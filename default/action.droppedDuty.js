const smartMove = require("./action.smartMove");
function droppedDuty(creep) {
  let retval = -16;
  let name = creep.name;
  let droppedTarget = Game.getObjectById(creep.memory.droppedTargetId);
  let droppedPickerUpper = Memory.droppedPickerUpperName;
  let tombstoneHunter = Memory.tombstoneHunterName;
  let tombstoneTarget = Game.getObjectById(Memory.tombstoneTargetId);
  let target;

  if (!droppedPickerUpper || droppedPickerUpper === name) {
    droppedTarget = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (source) => {
        if (
          source.resourceType === RESOURCE_ENERGY &&
          source.pos.x < 41 &&
          source.pos.y > 8
        ) {
          return source;
        }
      },
    });
    if (droppedTarget) {
      console.log(name + " droppedPickerUpper:" + droppedTarget);

      creep.memory.droppedTargetId = droppedTarget.id;
      Memory.droppedPickerUpperName = name;
      if (droppedTarget) {
        if (creep.pos.isNearTo(droppedTarget)) {
          creep.say("pu");
          retval = creep.pickup(droppedTarget);
          return retval;
        } else {
          creep.say("m.pu");
          retval = smartMove(creep, droppedTarget, 1);
          return retval;
        }
      }
    }
  }
}
exports.droppedDuty = droppedDuty;
