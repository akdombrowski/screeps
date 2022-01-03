const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function claimContr(
  creep,
  targetRoomName,
  exit,
  exitDirection,
  entrance,
  controllerID,
  controllerFlag
) {
  /** creep controller reserve**/
  let ctrlr = Game.getObjectById(controllerID);
  let target = null;

  const direction = creep.memory.direction;
  let retval = -16;

  if (creep.room.name != targetRoomName) {
    if (creep.pos.isNearTo(exit)) {
      retval = creep.move(exitDirection);
    } else {
      retval = smartMove(
        creep,
        exit,
        0,
        true,
        null,
        null,
        null,
        1,
        false,
        null
      );
    }
  } else {
    if (!ctrlr) {
      if (controllerFlag) {
        target = controllerFlag.pos.lookFor(LOOK_STRUCTURES).pop();
      }
    } else {
      target = ctrlr;
    }

    if (target) {
      retval = claimControlla(creep, target);
    }
  }

  return retval;
}

claimContr = profiler.registerFN(claimContr, "claimContr");
module.exports = claimContr;

function claimControlla(creep, ctrlr) {
  let retval = -16;
  if (creep.pos.inRangeTo(ctrlr, 1)) {
    if (ctrlr.safeMode && ctrlr.safeMode > 0) {
      creep.say("att");
      retval = creep.attackController(ctrlr);
    } else if (ctrlr.reservation && ctrlr.reservation.ticksToEnd > 0) {
      creep.say("att");
      retval = creep.attackController(ctrlr);
    } else {
      creep.say("claim");
      retval = creep.claimController(ctrlr);
    }
  } else {
    creep.say(ctrlr.pos.x + "," + ctrlr.pos.y);
    retval = smartMove(creep, ctrlr, 1, true, null, null, null, 1, false, null);
  }

  return retval;
}

claimControlla = profiler.registerFN(claimControlla, "claimControlla");
