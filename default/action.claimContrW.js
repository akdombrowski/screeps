const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let controllerId = "5bbcaeeb9099fc012e639c4d";
  let flag = Game.flags.west;
  let retval;
  controller = Game.getObjectById(controllerId);

  if (controller) {
    if (creep.pos.inRangeTo(controller, 1)) {
      retval = creep.claimController(controller);
      if (retval === ERR_GCL_NOT_ENOUGH) {
        console.log("can't claim");
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