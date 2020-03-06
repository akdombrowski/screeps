const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaf0c9099fc012e63a0b9";
  let retval;
  controller = Game.getObjectById(controllerId);

  const room = creep.room;
  const roomName = room.name;

  if (roomName !== rm) {
    retval = smartMove(creep, controller, 5, false, null, 10, 1000, 2);
    return retval;
  }

  if (creep.pos.inRangeTo(controller, 1)) {
    retval = creep.claimController(controller);
    creep.say("c." + retval);
  } else {
    retval = smartMove(creep, controller, 1);
  }

  return retval;
}

module.exports = claimContr;
