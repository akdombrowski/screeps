const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function moveToDifferentRoom(
  creepRoomName,
  exitDirection,
  exit,
  targetRoomName,
  creep,
  retval
) {
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  const southwestRoomName = Memory.southwestRoomName;
  const northwestRoomName = Memory.northwestRoomName;
  const westRoomName = Memory.westRoomName;
  const northToHome = Game.flags.northToHome;
  const homeToSouth = Game.flags.homeToSouth;
  const homeToNorth = Game.flags.homeToNorth;
  const southToHome = Game.flags.southToHome;
  const westToHome = Game.flags.westToHome;
  const southToSouthwest = Game.flags.southToSouthwest;
  const southwestToSouth = Game.flags.southwestToSouth;

  if (creepRoomName === northRoomName) {
    // if in the north room but target is not north, head home, the other rooms are that way
    exitDirection = BOTTOM;
    exit = northToHome;
  } else if (creepRoomName === southRoomName) {
    // if in the deepSouth room but target room is not deepSouth
    if (targetRoomName != southwestRoomName) {
      // if target name is not the SW room, then head north to home room
      // because target room is either north or home room and you have to go the same way to get to either
      exitDirection = TOP;
      exit = southToHome;
    } else {
      // in deep home room but target is west of here, head left
      exitDirection = LEFT;
      exit = southToSouthwest;
    }
  } else if (creepRoomName === southwestRoomName) {
    // if in the deepSouthWest room but target room is not there, head to dS as a start
    exitDirection = RIGHT;
    exit = southwestToSouth;
  } else if (creepRoomName === homeRoomName) {
    if (targetRoomName === southRoomName) {
      exitDirection = BOTTOM;
      exit = homeToSouth;
    } else if (targetRoomName === northRoomName) {
      exitDirection = TOP;
      exit = homeToNorth;
    }
  } else if (creepRoomName === westRoomName) {
    if (targetRoomName === homeRoomName) {
      exitDirection = RIGHT;
      exit = westToHome;
    }
  }

  if (creep.pos.isNearTo(exit)) {
    creep.say("👋");
    retval = creep.move(exitDirection);
  } else {
    creep.say("🎯" + targetRoomName + "🚀");
    retval = smartMove(creep, exit, 1, true, null, null, null, 1, false, null);
  }
  return retval;
}
exports.moveToDifferentRoom = moveToDifferentRoom;
moveToDifferentRoom = profiler.registerFN(
  moveToDifferentRoom,
  "moveToDifferentRoom"
);
