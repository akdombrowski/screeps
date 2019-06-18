const smartMove = require("./action.smartMove");

function goAnotherRm(creep, otherRoomFlag, range) {
  let dest;
  let currRoom = creep.room;
  let exit;
  smartMove(creep, otherRmFlag, range);
}

module.exports = goAnotherRm;
