const smartMove = require("./action.smartMove");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0be";
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  let retval;
  if (creep.room.name == "E35N31") {
    smartMove(creep, Game.flags.eEntrance2, 2);
  } else if (creep.room.name == "E36N31") {
    smartMove(creep, Game.flags.eeEntrance1, 2);
  } else if (creep.room.name === rm) {
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
  } else if (creep.room.name === "E36N32") {
    getEnergyEast(creep, "E36N31");
  } else {
    getEnergyEast(creep, "E36N31");
  }
}

module.exports = claimContr;
