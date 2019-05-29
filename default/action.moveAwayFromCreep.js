function moveAwayFromCreep(creep) {
  /** creep chain moving **/
  let creepsFound = creep.pos.findInRange(FIND_CREEPS, 1).length;
  return creepsFound >= 1;
};

module.exports = moveAwayFromCreep;
