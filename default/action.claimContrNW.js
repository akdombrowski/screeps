const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaeeb9099fc012e639c4a";
  let retval;
  controller = Game.getObjectById(controllerId);

  if (creep.pos.inRangeTo(controller, 1)) {
    retval = creep.claimController(controller);
    if(retval === -15) {
      retval = creep.reserveController(controller);
    }
    creep.say("c." + retval);
  } else {
    retval = smartMove(creep, controller, 1);
  }

  return retval;
}

module.exports = claimContr;
