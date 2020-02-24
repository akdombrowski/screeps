const getEnergy = require("./action.getEnergy.1");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function upController(creep, flag) {
 let controllerId = "5bbcaf0c9099fc012e63a0b9";
 let retval;
 controller = Game.getObjectById(controllerId);
 if (
   rm === creep.room.name &&
   creep.store.getFreeCapacity(RESOURCE_ENERGY) > 50
 ) {
   let target;
   target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
   if (target) {
     if (creep.pos.isNearTo(target)) {
       retval = creep.harvest(target);
     } else if (creep.fatigue > 0) {
       creep.say("f." + creep.fatigue);
       retval = ERR_TIRED;
     } else {
       creep.say(target.pos.x + "," + target.pos.y);
       retval = smartMove(creep, target, 3);
     }
   } else {
     creep.say("sad");
   }
 } else {
   if (creep.pos.inRangeTo(controller, 3)) {
     retval = creep.upgradeController(controller);
     creep.say("c." + retval);
   } else {
     retval = smartMove(creep, controller, 1);
   }
 }

 return retval;
}

module.exports = upController;
