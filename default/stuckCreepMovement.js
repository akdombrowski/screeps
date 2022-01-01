const profiler = require("./screeps-profiler");

function stuckCreepMovement(creep, lastCreepPos, dest, range, pathColor) {
  const creepPos = creep.pos;
  const stuck = creep.memory.stuck;
  let retval = -16;

  // check for valid last creep position
  if (lastCreepPos && lastCreepPos.x) {
    // convert to RoomPosition object just in case
    lastCreepPos = new RoomPosition(
      lastCreepPos.x,
      lastCreepPos.y,
      lastCreepPos.roomName
    );

    // check if we're still at the same position we were last tick
    if (lastCreepPos.isEqualTo(creepPos.x, creepPos.y)) {
      // stuck means they were at the same position the previous two ticks
      // since the current tick is equal to their last position, that means if they're also stuck, the've been in the same spot for 3 ticks. Try using moveTo with ignore creeps set to false to get out of stuck position
      if (stuck) {
        creep.memory.path = null;
        retval = creep.moveTo(dest, {
          reusePath: 2,
          serializeMemory: false,
          ignoreCreeps: false,
          maxRooms: 1,
          maxOps: 100,
          range: range,
          visualizePathStyle: {
            fill: "transparent",
            stroke: pathColor,
            lineStyle: "dashed",
            strokeWidth: 0.45,
            opacity: 0.2,
          },
        });

        // if we successfully used moveTo, capture the path by converting it to something moveByPath can use
        if (retval === OK) {
          creep.memory.stuck = false;

          // path used by moveTo is stored in creep memory's _move object
          if (creep.memory._move) {
            // stores new path in creep's memory
            convertToMoveByPathFriendlyPath(creep);
          }
        }

        // we want to return from smartMove overall too, and not do any more pathfinding and use moveByPath
        return retval;
      }

      // we're at the same position as the last tick, but not two ticks ago
      // mark ourselves as stuck in case we're still at this position next tick
      creep.memory.stuck = true;
      creep.memory.path = null;
    } else {
      // we're not at the same position as last tick
      creep.memory.stuck = false;
    }
  }

  // we didn't use moveTo, signal that by returning something moveTo wouldn't return, -1.
  return -1;
}
exports.stuckCreepMovement = stuckCreepMovement;
stuckCreepMovement = profiler.registerFN(
  stuckCreepMovement,
  "stuckCreepMovement"
);

function convertToMoveByPathFriendlyPath(creep) {
  let newPathArray = [];
  path = creep.memory._move.path;

  // moveTo prints a path that uses the current position and the change in x and y axes to show the next position the creep is going to be at. We want to convert an array of those into an array of room positions that correspond to that next position in the path.
  path.forEach((step) => {
    // console.log(JSON.stringify(step));
    let px = step.x + step.dx;
    let py = step.y + step.dy;
    let roomName = creep.room.name;
    let pos = new RoomPosition(px, py, roomName);
    newPathArray.push(pos);
  });

  // save the moveByPath-friendly path in creep's memory
  creep.memory.path = newPathArray;
}
convertToMoveByPathFriendlyPath = profiler.registerFN(
  convertToMoveByPathFriendlyPath,
  "convertToMoveByPathFriendlyPath"
);
