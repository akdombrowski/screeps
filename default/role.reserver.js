const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const findRepairable = require("./action.findRepairableStruct");

var roleReserver = {
  /** @param {Creep} creep **/
  run: function (
    creep,
    targetRoomName,
    exit,
    exitDirection,
    controllerFlag,
    controllerID
  ) {
    let retval = -16;
    const name = creep.name;
    const creepPos = creep.pos;
    const creepRoom = creep.room;
    const creepRoomName = creep.room.name;
    const controller = Game.getObjectById(controllerID);

    if (creepRoomName != targetRoomName) {
      if (creep.pos.isNearTo(exit)) {
        retval = creep.move(exitDirection);
      } else {
        retval = smartMove(creep, exit, 0, true, null, null, null, 1);
      }
    }

    if (controllerFlag && controller) {
      creep.memory.lastReservedControllerID = controller.id;
      if (creep.pos.inRangeTo(controllerFlag, 1)) {
        retval = creep.reserveController(controller);

        if (retval == OK) {
          creep.say("res");
        } else {
          creep.say("err." + retval);
        }
      } else {
        retval = smartMove(creep, target, 1);
        creep.memory.rx = target.pos.x;
        creep.memory.ry = target.pos.y;

        if (creep.fatigue > 0) {
          creep.say("f." + creep.fatigue);
        } else if (retval == ERR_INVALID_TARGET) {
          creep.say("invalTarg");
          target = null;
          creep.memory.lastReservedControllerID = null;
        } else {
          creep.say(target.pos.x + "," + target.pos.y);
        }
      }
    } else {
      console.log(name + " role.reserver poop");
      creep.say("poop");
    }

    return retval;
  },
};

module.exports = roleReserver;
