const smartMove = require("./action.smartMove");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");
const profiler = require("./screeps-profiler");

function claimContr(
  creep,
  targetRoomName,
  exit,
  exitDirection,
  entrance,
  controllerID
) {
  /** creep controller reserve**/
  let contrID = "5bbcaefa9099fc012e639e90";
  let contr = Game.getObjectById(controllerID);
  let eContr = "5bbcaf0c9099fc012e63a0be";
  let eeContr = "5bbcaf1b9099fc012e63a2dd";
  let wContr = "5bbcaeeb9099fc012e639c4d";
  let nContrID = "59bbc5d22052a716c3cea133";
  let nContr = Game.getObjectById("59bbc5d22052a716c3cea133");
  let neContr = "5bbcaf0c9099fc012e63a0b9";

  const direction = creep.memory.direction;
  let retval;

  if (creep.room.name != targetRoomName) {
    if (creep.pos.isNearTo(exit)) {
      return creep.move(exitDirection);
    } else {
      return smartMove(creep, exit, 0, true, null, null, null, 1);
    }
  }

  retval = claimControlla(creep, contr);

  // smartMove(creep, Game.flags.Flag1);
  if (creep.room.name == "E35N31") {
    if (creep.pos.isNearTo(Game.flags.eastExit)) {
      creep.move(RIGHT);
    } else {
      smartMove(creep, Game.flags.eastExit, 1);
    }
  } else if (creep.room.name == "E36N31") {
    smartMove(creep, Game.flags.eeEntrance1, 2);
  } else if (creep.room.name === targetRoomName) {
    let ctrlr = Game.getObjectById(controllerID);
    if (!ctrlr) {
      console.log("no ctrlr wtf");
    } else {
      if (creep.pos.inRangeTo(ctrlr, 1)) {
        creep.claimController(ctrlr);
      } else {
        retval = smartMove(creep, ctrlr, 1);

        if (retval === ERR_TIRED) {
          creep.say("f." + creep.fatigue);
        } else {
          creep.say("ctr." + ctrlr.pos.x + "," + ctrlr.pos.y);
        }
      }
    }
  } else if (creep.room.name === "E36N32") {
    getEnergyEast(creep, "E36N31");
  } else {
    getEnergyEast(creep, "E36N31");
  }
}

claimContr = profiler.registerFN(claimContr, "claimContr");
module.exports = claimContr;

function claimControlla(creep, ctrlr) {
  if (creep.pos.isNearTo(ctrlr)) {
    retval = creep.claimController(ctrlr);
  } else {
    retval = smartMove(creep, ctrlr, 1, true, null, null, null, 1);
  }
  return retval;
}

claimControlla = profiler.registerFN(claimControlla, "claimControlla");
