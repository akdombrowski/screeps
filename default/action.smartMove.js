const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps = true,
  pathColor = "#ffffff",
  pathMem = 2000
) {
  let retVal = -16;
  let igCreeps = ignoreCreeps;
  pathMem = pathMem || 2000;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  }

  if (
    moveAwayFromCreep(creep) ||
    !ignoreCreeps //||
  ) {
    pathMem = 0;
    igCreeps = false;
    creep.say("out of my way creep");
  }

  retval = creep.moveTo(dest, {
    reusePath: pathMem,
    ignoreCreeps: igCreeps,
    range: range,
    maxOps: 1000,
    serializeMemory: true,
    visualizePathStyle: { stroke: pathColor }
  });
  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
