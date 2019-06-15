const smartMove = require("./action.smartMove");
const getEnergyEast = require("./action.getEnergyEast");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0be";
  let path1 = creep.memory.path1;
  let path2 = creep.memory.path2;
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
      creep.move(exitDirection);
      creep.say(exitDirection);
    }
  } else if (creep.pos.isNearTo(entrance)) {
    let contr = Game.getObjectById(controller);

    if (!path2) {
      path2 = creep.room.findPath(creep.pos, contr.pos, {
        range: 1,
        serialize: true
      });
      creep.memory.path2 = path2;
    }

    creep.moveByPath(path2);
    creep.say("p2");
  } else if (creep.room.name == rm) {
    if (_.sum(creep.carry) <= 0 || creep.memory.getEnergy) {
      getEnergyEast(creep);
    } else {
      let contr = Game.getObjectById(controller);
      if (creep.pos.isNearTo(contr)) {
        creep.upgradeController(contr);
      } else {
        if (!path2) {
          path2 = creep.room.findPath(creep.pos, contr.pos, {
            range: 1,
            serialize: true
          });
          creep.memory.path2 = path2;
        }

        if (creep.moveByPath(path2) != OK) {
          path2 = creep.room.findPath(creep.pos, contr.pos, {
            range: 1,
            serialize: true
          });
          creep.memory.path2 = path2;
        } else {
          creep.say("p2");
        }
      }
    }
  }
}

module.exports = claimContr;
