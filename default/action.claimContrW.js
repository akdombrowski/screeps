const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaeeb9099fc012e639c4d";
  let flag = Game.flags.west;
  let retval;
  controller = Game.getObjectById(controllerId);
  const room = creep.room;
  const roomName = room.name;

  if (roomName !== rm) {
    retval = smartMove(creep, controller, 5, false, null, 10, 1000, 2);
    return retval;
  }

  if (controller) {
    if (creep.pos.inRangeTo(controller, 1)) {
      retval = creep.claimController(controller);
      if (retval === ERR_GCL_NOT_ENOUGH) {
        retval = creep.reserveController(controller);
      }
      creep.say("c." + retval);
    } else {
      retval = smartMove(creep, controller, 1);
    }
  } else {
    retval = smartMove(creep, flag, 10);
  }

  return retval;
}

module.exports = claimContr;
