const smartMove = require("./move.smartMove");
const getEnergyEast = require("./action.getEnergyEast");

function claimContr(creep, rm, exit, exitDirection, entrance, controller) {
  /** creep controller reserve**/
  controller = "5bbcaf0c9099fc012e63a0b9";
  let path1 = creep.memory.path1;
  let path2; // = creep.memory.path2;
  if (creep.room.name == "E35N31") {
    if (_.sum(creep.carry) >= creep.carryCapacity) {
      if (!creep.pos.isNearTo(exit)) {
        retval = creep.moveTo(exit, {
          range: 1,
          noPathFinding: creep.memory.noPathFinding,
          reusePath: creep.memory.reusePath,
          serializeMemory: true,
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });

        if (retval != OK) {
          creep.memory.reusePath = 0;
          creep.memory.noPathFinding = false;
          path = null;
          creep.say("err");
        } else {
          creep.memoyr.reusePath = 10;
          creep.memory.noPathFinding = true;
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
        creep.attackController(contr);
      } else {
        retval = creep.moveTo(contr, {
          range: 1,
          noPathFinding: creep.memory.noPathFinding,
          reusePath: creep.memory.reusePath,
          serializeMemory: true,
          visualizePathStyle: {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: 0.15,
            opacity: 0.1,
          },
        });

        if (retval !== OK) {
          creep.memory.reusePath = 0;
          creep.memory.noPathFinding = false;
        } else {
          creep.memory.reusePath = 10;
          creep.memory.noPathFinding = true;

          creep.say(rm);
        }
      }
    }
  } else {
    getEnergyEast(creep);
  }
}

module.exports = claimContr;
