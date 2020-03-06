const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaeeb9099fc012e639c4a";
  let retval;
  let name = creep.name;
  controller = Game.getObjectById(controllerId);
  let flag = Game.flags.nw;

  const room = creep.room;
  const roomName = room.name;

  if (roomName !== rm) {
    retval = smartMove(creep, controller, 5, false, null, 10, 1000, 2);
    return retval;
  }
  if (!controller) {
    retval = smartMove(creep, flag.pos, 10);
    return retval;
  }

  if (creep.pos.inRangeTo(controller, 1)) {
    retval = creep.claimController(controller);
    if (retval === -15) {
      retval = creep.reserveController(controller);
    }
    creep.say("c." + retval);
  } else {
    retval = smartMove(creep, controller, 1);
  }

  return retval;
}

module.exports = claimContr;
