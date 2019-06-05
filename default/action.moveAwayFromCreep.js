function moveAwayFromCreep(creep) {
  /** creep chain moving **/
  let move = creep.memory._move;
  let path;
  if (!move) {
    return false;
  }
  path = Room.deserializePath(move.path);

  if (!path) {
    return false;
  }
  let path0 = path[0];
  if (!path0) {
    return false;
  }
  let x0 = path0.x;
  let y0 = path0.y;
  let dx = path0.dx;
  let dy = path0.dy;
  let nextDirection = path.direction;
  try {
    let creepsFound = creep.room.lookForAt(LOOK_CREEPS, x0, y0);

    if (creepsFound && creepsFound[0]) {
      return creepsFound[0].fatigue <= 0;
    }
  } catch (e) {
    console.log(e.message);
  }
  return false;
}

module.exports = moveAwayFromCreep;
