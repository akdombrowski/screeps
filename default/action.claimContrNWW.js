const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaedb9099fc012e639a93";
  let retval;
  let name = creep.name;
  controller = Game.getObjectById(controllerId);
  let flag = Game.flags.nww;

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
