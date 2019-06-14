const smartMove = require("./action.smartMove");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0b9";
  let path1 = creep.memory.path1;
  let path2; // = creep.memory.path2;
  if (creep.room.name == "E35N31") {
    if (!creep.pos.isNearTo(exit)) {
      if (!path1) {
        path1 = creep.room.findPath(creep.pos, exit.pos, {
          serialize: true,
          range: 1
        });
      }
      if (creep.moveByPath(path1) != OK) {
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
    let contr = Game.getObjectById(controller);
    if (creep.pos.isNearTo(contr)) {
      creep.reserveController(contr);
    } else {
      if (!path2) {
        path2 = creep.room.findPath(creep.pos, contr.pos, {
          range: 1,
          serialize: true
        });
        creep.memory.path2 = path2;
      }

      creep.moveByPath(path2);
      creep.say(rm);
    }
  }
}

module.exports = claimContr;
