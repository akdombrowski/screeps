function moveAwayFromCreep(creep) {
  /** creep chain moving **/
  let move = creep.memory._move;
  let path;
  let gameTicksToMove = Memory.gameTicksToMove || 0;
  let name = creep.name;
  gameTicksToMove += 1;
  Memory.gameTicksToMove = gameTicksToMove;

  if (name === "mover1") {
    return false;
  }

  if (gameTicksToMove >= 5) {
    Memory.gameTicksToMove = 0;
    return true;
  }

  // console.log(name + " move " + move);
  
  // I have no move. Am I moving somewhere?
  if (!move && !creep.memory.path) {
    Memory.gameTicksToMove = 0;
    return false;
  }

  // console.log(name + " memorypath " + creep.memory.path);
  // console.log(name + " memorypath " +   Room.deserializePath(move.path));
  try {
    path = move
      ? Room.deserializePath(move.path)
      : Room.deserializePath(creep.memory.path);
  } catch (e) {
    //
    Memory.gameTicksToMove = 0;
  }

  // console.log(name + " path " + JSON.stringify(path));
  // I have no path. Am i going somewhere?
  if (!path || path.length <= 0) {
    Memory.gameTicksToMove = 0;
    return false;
  }

  let i = -1;
  // Check if first step in path exists. The array could exist but be empty.
  let path0 = _.find(path, (step, j) => {
    if (creep.pos.isEqualTo(step.x, step.y)) {
      i = j + 1;
      // console.log(name + " pos " + creep.pos + " step " + step.x + "," + step.y);
    }
    return i === j;
  });
  // console.log(name + " path0 " + JSON.stringify(path0));
  if (!path0) {
    Memory.gameTicksToMove = 0;
    return false;
  }

  // Get my next position and see if there's another creep in the way.
  let x0 = path0.x;
  let y0 = path0.y;
  let dx = path0.dx;
  let dy = path0.dy;
  let nextDirection = path0.direction;
  try {
    // Are there creeps at the spot I want to go?
    let creepsFound = creep.room.lookForAt(LOOK_CREEPS, x0, y0);
    // Are there creeps within one spot of the spot I want to go? Are they moving towards the spot I want to go?
    let creeps = creep.room.getPositionAt(x0, y0).findInRange(FIND_CREEPS, 1);

    // There is a creep in the spot I want to go
    if (creepsFound && creepsFound[0]) {
      // The creep in my spot is too tired to move or has no intention of moving.
      if (
        creepsFound[0].fatigue > 0 ||
        (!creepsFound.memory_move && !creepsFound.memory.path)
      ) {
        Memory.gameTicksToMove = gameTicksToMove;
        return true;
      }
    }

    // Look at the creeps found within 1 spot of my spot.
    let creepInWay = false;
    // creepInWay = _.find(creeps, (c) => {
    //   if (c.name === name) {
    //     return false;
    //   }
    //   p = c.memory._move.path;
    //   // check if path needs to be deserialized
    //   desP = Room.deserializePath(p);
    //   p = desP || p;

    //   console.log(JSON.stringify(p));
    //   // The creeps next pos to move is the same as my spot
    //   if (p[1] && (p[1].x === x0 || p[1].y === y0) && c.fatigue <= 0) {
    //     Memory.gameTicksToMove = gameTicksToMove;
    //     return true;
    //   }
    // });

    if (creepInWay) {
      Memory.gameTicksToMove = 0;
      return true;
    }
  } catch (e) {
    Memory.gameTicksToMove = gameTicksToMove;
    
    // console.log("here:" + e.message);
    
    return true;
  }
  Memory.gameTicksToMove = 0;
  return false;
}

module.exports = moveAwayFromCreep;
