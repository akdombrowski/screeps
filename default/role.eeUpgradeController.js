const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergyEEast");
const ermgetEnergyEast = require("./action.getEnergy.1");

function eeUpContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf1b9099fc012e63a2dd";
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  let retval;
  let name = creep.name;

  if (creep.room.name == "E35N31") {
    creep.say("m." + Game.flags.eEntrance2.pos);
    smartMove(creep, Game.flags.eEntrance2, 2);
  } else if (creep.room.name == "E36N31") {
    creep.say("m." + Game.flags.eeEntrance1.pos);
    smartMove(creep, Game.flags.eeEntrance1, 2);
  } else if (
    (creep.room.name === rm && creep.pos.x < Game.flags.eeEntrance1.pos.x) ||
    creep.pos.x === 49
  ) {
    creep.say("m." + Game.flags.eeEntrance1.pos);
    smartMove(creep, Game.flags.eeEntrance1, 0);
  } else if (creep.room.name === rm) {
    if (_.sum(creep.energy) <= 0 || creep.getEnergy) {
      creep.getEnergy = true;
      creep.transfer = false;
      creep.say("m.h");
      getEnergy(creep, "E37N31");
    } else if (_.sum(creep.energy) >= creep.energyCapacity || creep.transfer) {
      let contr = Game.getObjectById(controller);
      if (creep.pos.inRangeTo(contr, 1)) {
        creep.say("uc");
        creep.upgradeController(contr);
      } else {
        creep.say("m." + contr.pos);
        retval = smartMove(creep, contr, 1);

        if (retval === ERR_TIRED) {
          creep.say("f." + creep.fatigue);
        } else {
          creep.say("p2up." + retval);
        }
      }
    }
  } else {
    console.log(name + " did you add a room name to this method call?");
  }
}

module.exports = eeUpContr;
