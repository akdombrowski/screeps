const smartMove = require("./action.smartMove");
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
  let contrID = "5bbcaefa9099fc012e639e90";
  let ctrlr = Game.getObjectById(controllerID);
  let eContr = "5bbcaf0c9099fc012e63a0be";
  let eeContr = "5bbcaf1b9099fc012e63a2dd";
  let wContr = "5bbcaeeb9099fc012e639c4d";
  let nContrID = "59bbc5d22052a716c3cea133";
  let nContr = Game.getObjectById("59bbc5d22052a716c3cea133");
  let neContr = "5bbcaf0c9099fc012e63a0b9";
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
  if (creep.pos.isNearTo(ctrlr)) {
    console.log("ctrlr: " + ctrlr);
    console.log("reservation: " + JSON.stringify(ctrlr.reservation));
    console.log("safeMode: " + ctrlr.safeMode);
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
