const smartMove = require("./action.smartMove");
const getEnergyEast = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let centralContr = "5bbcaefa9099fc012e639e90";
  let eContr = "5bbcaf0c9099fc012e63a0be";
  let eeContr = "5bbcaf1b9099fc012e63a2dd";
  let wContr = "5bbcaeeb9099fc012e639c4d";
  let nContr = "5bbcaefa9099fc012e639e8b";
  let neContr = "5bbcaf0c9099fc012e63a0b9";
  
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  let retval;
  
  // smartMove(creep, Game.flags.Flag1);
  if (creep.room.name == "E35N31") {
    smartMove(creep, Game.flags.eastExit, 2);
  } else if (creep.room.name == "E36N31") {
    smartMove(creep, Game.flags.eeEntrance1, 2);
  } else if (creep.room.name === rm && creep.pos.x < Game.flags.eeEntrance1.pos.x) {
    smartMove(creep, Game.flags.eeEntrance1, 0);
  } else if (creep.room.name === rm) {
    let contr = Game.getObjectById(controller);
    if (creep.pos.inRangeTo(contr, 1)) {
      creep.claimController(contr);
    } else {
      retval = smartMove(creep, contr, 1);

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
