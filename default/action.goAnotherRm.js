const smartMove = require("./action.smartMove");

function goAnotherRm(creep, otherRoomFlag, range) {
  let dest;
  let currRoom = creep.room;
  let exit;
  let retval;

  retval = smartMove(creep, otherRmFlag, range);
  return retval;
}

module.exports = goAnotherRm;
