const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergy.1");
const ermgetEnergyEast = require("./action.getEnergy.1");

function eeUpContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf1b9099fc012e63a2dd";
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  let retval;
  if (creep.room.name == "E35N31") {
    smartMove(creep, Game.flags.eEntrance2, 2);
  } else if (creep.room.name == "E36N31") {
    smartMove(creep, Game.flags.eeEntrance1, 2);
  } else if (
    creep.room.name === rm &&
    creep.pos.x < Game.flags.eeEntrance1.pos.x || creep.pos.x === 49
  ) {
    smartMove(creep, Game.flags.eeEntrance1, 0);
  } else if (creep.room.name === rm) {
    if (_.sum(creep.energy) <= 0 || creep.getEnergy) {
      creep.getEnergy = true;
      creep.transfer = false;
      getEnergy(creep, "E37N31");
    } else if (_.sum(creep.energy) >= creep.energyCapacity || creep.transfer) {
      let contr = Game.getObjectById(controller);
      if (creep.pos.inRangeTo(contr, 1)) {
        creep.upgradeController(contr);
      } else {
        retval = smartMove(creep, contr, 1);

        if (retval === ERR_TIRED) {
          creep.say("f." + creep.fatigue);
        } else {
          creep.say("p2up." + retval);
        }
      }
    }
  }
}

module.exports = eeUpContr;
