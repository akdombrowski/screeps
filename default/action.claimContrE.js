const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaf0c9099fc012e63a0be";
  let retval;
  controller = Game.getObjectById(controllerId);

  if (creep.pos.inRangeTo(controller, 1)) {
    retval = creep.claimController(controller);
    creep.say("c." + retval);
  } else {
    retval = smartMove(creep, controller, 1);
  }

  return retval;
}

module.exports = claimContr;
