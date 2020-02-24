const smartMove = require("./action.smartMove");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.erm.getEnergyEast");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0be";
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  let retval;
  if (creep.room.name == "E35N31") {

    if (!creep.pos.isNearTo(exit)) {


    console.log(creep.name + " me")

        retval = smartMove(creep, exit.pos, 1);

      if (retval === ERR_NO_PATH || retval === ERR_NOT_FOUND) {
        creep.memory.path = null;
        creep.say("err");
      } else if (retval === ERR_TIRED) {
        creep.memory.path1 = path1;
        creep.say("m." + creep.fatigue);
      } else {
        creep.memory.path1 = path1;
        creep.say(rm);
      }
    } else {
      console.log(exitDirection);
      creep.move(exitDirection);
      creep.say(exitDirection);
    }
  } else if (creep.room.name === rm) {
    if (_.sum(creep.carry) <= 0 || creep.memory.getEnergy) {
      ermgetEnergyEast(creep, "E36N31");
    } else {
      let contr = Game.getObjectById(controller);
      if (creep.pos.inRangeTo(contr, 3)) {
        creep.upgradeController(contr);
      } else {
        retval = smartMove(creep, contr, 3);

        if (retval === ERR_TIRED) {
          creep.say("f." + creep.fatigue);
        } else {
          creep.say("p2up." + retval);
        }
      }
    }
  } else if (creep.room.name === "E36N32") {
    getEnergyEast(creep, "E36N31");
  } else {
    getEnergyEast(creep, "E36N31");
  }
}

module.exports = claimContr;
