function moveAwayFromCreep(creep) {
  /** creep chain moving **/
  let move = creep.memory._move;
  let path;
  let gameTicksToMove = Memory.gameTicksToMove || 0;
  gameTicksToMove += 1;
  Memory.gameTicksToMove = gameTicksToMove;
  if (gameTicksToMove >= 5) {
    Memory.gameTicksToMove = 0;
    return true;
  }
  if (!move) {
    return true;
  }
  
  try {
    path = Room.deserializePath(move.path);
  } catch(e) {
    // 
  }

  if (!path) {
    return true;
  }
  let path0 = path[0];
  if (!path0) {
    return true;
  }
  let x0 = path0.x;
  let y0 = path0.y;
  let dx = path0.dx;
  let dy = path0.dy;
  let nextDirection = path0.direction;
  try {
    let creepsFound = creep.room.lookForAt(LOOK_CREEPS, x0, y0);
    let creeps = creep.room.getPositionAt(x0, y0).findInRange(FIND_CREEPS, 1);

    if (creepsFound && creepsFound[0]) {
      if (creepsFound[0].fatigue > 0 || !creepsFound.memory_move) {
        Memory.gameTicksToMove = 0;
        return true;
      }
    }

    _.forEach(creeps, c => {
      p = c.memory._move.path;
      p = Room.deserializePath(p);

      if ((p[0].x === x0 || p[0].y === y0) && c.fatigue > 0) {
        Memory.gameTicksToMove = 0;
        return true;
      }
    });
  } catch (e) {
    console.log(e.message);
  }
  return false;
}

module.exports = moveAwayFromCreep;
