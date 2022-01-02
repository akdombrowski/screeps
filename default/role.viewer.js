const getEnergy = require("./getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const build = require("./action.build");
const findRepairable = require("./action.findRepairableStruct");
const { findFixables } = require("./find.findFixables");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");

function roleViewer(creep, targetRoomName, exit, exitDirection) {
  let mem_repair = creep.memory.repair;
  let retval = -16;
  const lastRepairableStructId = creep.memory.lastRepairableStructId;
  const name = creep.name;
  const creepPos = creep.pos;
  const creepRoom = creep.room;
  const creepRoomName = creep.room.name;
  let mem_direction = creep.memory.direction;
  let mem_getEnergy = creep.memory.getEnergy;
  let target = Game.getObjectById(creep.memory.lastSourceId);

    if (targetRoomName && creepRoomName != targetRoomName) {
      if (creepRoomName === Memory.northRoomName) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northToHouse;
      } else if (creepRoomName === Memory.southRoomName) {
        // if in the South room but target room is not deepSouth, head north
        exitDirection = TOP;
        exit = Game.flags.southToHome
      }

      if (creep.pos.isNearTo(exit)) {
        creep.say(exitDirection);
        retval = creep.move(exitDirection);
      } else {
        creep.say(targetRoomName);
        retval = smartMove(creep, exit, 0, true, null, null, null, 1);
      }
      return retval;
    }
}

roleViewer = profiler.registerFN(roleViewer, "roleRepairer");
module.exports = roleViewer;
