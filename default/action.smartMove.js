const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps = true,
  pathColor = "#ffffff",
  pathMem = 200
) {
  let retVal = -16;
  let igCreeps = ignoreCreeps;
  pathMem = pathMem || 200;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  }

  if (moveAwayFromCreep(creep) || !ignoreCreeps) {
    pathMem = 0;
    igCreeps = false;
  }

  retval = creep.moveTo(dest, {
    reusePath: pathMem,
    ignoreCreeps: igCreeps,
    range: range,
    visualizePathStyle: { stroke: pathColor }
  });
  return retval;
}

module.exports = smartMove;
