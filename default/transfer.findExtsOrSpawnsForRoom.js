const profiler = require("./screeps-profiler");
const {
  findExtsOrSpawnsToTransferTo,
} = require("./find.findExtsOrSpawnsToTransferTo");

function findExtsOrSpawnsForRoom(creep, extensions, spawns) {
  let creepRoom = creep.room;
  let creepRoomName = creepRoom.name;
  const direction = creep.memory.direction;
  let target = null;
  let transferTargetsAndMemoryObjects = null;

  if (creepRoomName === Memory.homeRoomName && direction != "deepSouth") {
    transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      Memory.homeRoomName,
      extensions,
      spawns
    );
  } else {
    transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      creep.room.name,
      extensions,
      spawns
    );
  }

  if (transferTargetsAndMemoryObjects) {
    target = transferTargetsAndMemoryObjects.target;
    extensions = transferTargetsAndMemoryObjects.extensions;
    spawns = transferTargetsAndMemoryObjects.spawns;
  }

  if (target) {
    creep.memory.transferTargetId = target.id;
  }
  return { target, extensions, spawns };
}
exports.findExtsOrSpawnsForRoom = findExtsOrSpawnsForRoom;
findExtsOrSpawnsForRoom = profiler.registerFN(
  findExtsOrSpawnsForRoom,
  "findExtsOrSpawnsForRoom"
);
