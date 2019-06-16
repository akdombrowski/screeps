const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function goAnotherRm(creep, otherRmMarker, range) {
  let dest;
  smartMove(creep, otherRmMarker, range);
}

module.exports = goAnotherRm;
