const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaf0c9099fc012e63a0b9";
  let retval;
  controller = Game.getObjectById(controllerId);
  if (rm === creep.room.name && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 50) {
    let target;
    target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (target) {
      if (creep.pos.isNearTo(target)) {
        retval = creep.harvest(target);
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        retval = ERR_TIRED;
      } else {
        creep.say(target.pos.x + "," + target.pos.y);
        retval = smartMove(creep, target, 1);
      }
    } else {
      creep.say("sad");
    }
  } else {
    if (creep.pos.isNearTo(controller)) {
      retval = creep.claimController(controller);
    } else {
      retval = smartMove(creep, controller, 1);
    }
  }

  return retval;
}

module.exports = claimContr;
