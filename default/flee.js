const profiler = require("./screeps-profiler");

function flee(creep, maxOps, path, pathColor) {
  let ret = PathFinder.search(
    creep.pos,
    { pos: new RoomPosition(25, 25, creep.room.name), range: 20 },
    {
      flee: true,
      maxOps: maxOps,
      maxRooms: 1,
    }
  );
  retval = creep.moveByPath(ret.path);

  let px = ret.path.length > 0 ? ret.path[0].x : "";
  let py = ret.path.length > 0 ? ret.path[0].y : "";
  creep.say("ah!" + px + "," + py);
  if (retval === OK || retval === ERR_TIRED) {
    creep.room.visual.poly(path, {
      stroke: pathColor,
      strokeWidth: 0.1,
      lineStyle: "dashed",
      opacity: 0.2,
    });
  }
  return retval;
}
flee = profiler.registerFN(flee, "flee");
