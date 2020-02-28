const smartMove = require("./action.smartMove");

function reserveContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
  if (creep.room.name === "E35N31") {
    creep.say("alive")
    if (!creep.pos.isNearTo(exit)) {
      if (smartMove(creep, exit, 1) != OK) {
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
  } else if (creep.room.name === rm) {
    let contr = Game.getObjectById(controller);
    if (creep.pos.inRangeTo(contr, 1)) {
      creep.reserveController(contr);
      creep.say("res");
    } else {
      smartMove(creep, contr, 1);
      creep.say(rm);
    }
  }
}

module.exports = reserveContr;
