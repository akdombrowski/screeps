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
  let path1 = path[0];
  if (!path1) {
    return false;
  }
  let x0 = path1.x;
  let y0 = path1.y;
  let dx = path1.dx;
  let dy = path1.dy;
  let nextDirection = path.direction;
  try {
    let creepsFound = creep.room.lookForAt(LOOK_CREEPS, x0 + dx, y0 + dy);
    if (creepsFound) {
      return creepsFound >= 1;
    }
  } catch (e) {
    console.log(e.message);
  }
  return false;
}

module.exports = moveAwayFromCreep;
