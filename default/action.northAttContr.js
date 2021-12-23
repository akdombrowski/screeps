const smartMove = require("./move.smartMove");
const getEnergyEast = require("./action.getEnergyEast");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0b9";
  let contr = Game.getObjectById(controller);
  let path1 = creep.memory.path1;
  let path2; // = creep.memory.path2;
  if (creep.room.name == "E35N31") {
    if (_.sum(creep.carry) >= creep.carryCapacity) {
      if (!creep.pos.isNearTo(exit)) {
        if (!path1) {
          path1 = creep.room.findPath(creep.pos, exit.pos, {
            serialize: true,
            range: 1,
          });
        }
        if (smartMove(creep, exit, 1, false, null, null, null, 1) != OK) {
          path = null;
          creep.say("err");
        } else {
          creep.memory.path1 = path1;
          creep.say(rm);
        }
      } else {
        creep.move(exitDirection);
        creep.say(exitDirection);
      }
    } else if (creep.room.name == rm) {
      if (creep.pos.isNearTo(contr)) {
        creep.attackController(contr);
      } else {
        smartMove(creep, contr, 1, false, null, null, null, 1);
        creep.say(rm);
      }
    }
  } else {
    getEnergyEast(creep);
  }
}

module.exports = claimContr;
