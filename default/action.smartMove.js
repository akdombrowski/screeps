const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const getAPath = require("./getAPath");
const getRandomColor = require("./getRandomColor");

function smartMove(
  creep,
  dest,
  range,
  ignoreCreeps = false,
  pathColor = "#ffffff",
  pathMem = 2000,
  maxOps = 100,
  maxRms = 4
) {
  let s;
  let retval = -16;
  let blockage;
  let noPathFinding = true;
  let path = creep.memory.path;
  let rm = creep.room;
  let name = creep.name;
  let pos = creep.pos;
  let desPath;
  pathColor = pathColor || getRandomColor();
  pathMem = Math.random() * 100 - 1;
  let ops = maxOps || Math.random() * 100000;
  let roll = creep.memory.role;
  let direction = creep.memory.direction;

  if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (!dest) {
    creep.say("no destination");
    return retval;
  }

  // keep them separate to allow fine tuning of maxOps
  if (name === "claimNE" || roll === "claimW" || roll === "claimNW") {
    maxOps = 1000;
  } else if (roll.endsWith("WW")) {
    maxOps = 1000;
    maxRooms = 6;
  } else if (roll === "upCNE") {
    maxOps = 1000;
  } else if (roll === "upCN") {
    maxOps = 500;
  } else if (roll === "upCNW") {
    maxOps = 1000;
  } else if (name.endsWith("NE")) {
    maxOps = 700;
  } else if (direction === "west") {
    maxOps = 500;
  } else if (name.startsWith("claim")) {
    maxOps = 200;
  } else if (name.endsWith("E")) {
    maxOps = 500;
  } else if (roll === "neBuilder") {
    maxOps = 500;
  } else if (roll === "worker" && direction === "eeast") {
    maxOps = 500;
  } else if (name.startsWith("etowerHarvester")) {
    maxOps = 500;
  } else if (name.startsWith("eeUp")) {
    maxOps = 200;
  } else if (
    creep.memory.sourceDir === "eeast" &&
    (roll === "worker" || roll === "eeworker")
  ) {
    maxOps = 500;
  }

  let destPos = dest;
  if (destPos && (dest.room || dest.roomName)) {
    let rmName = dest.roomName;
    if (!rmName) {
      rmName = dest.room.name;
    }

    if (!(destPos instanceof RoomPosition)) {
      destPos = new RoomPosition(dest.pos.x, dest.pos.y, rmName);
    }
  } else {
    return null;
  }

  if (moveAwayFromCreep(creep)) {
    path = null;
  }

  // no path in memory.path. get one.
  if (!path || pathMem < 1) {
    // path = getAPath(
    //   creep,
    //   dest,
    //   range,
    //   ignoreCreeps,
    //   pathColor,
    //   pathMem,
    //   maxOps
    // );
  }

  // // No path. Try finding path using maxOps.
  // if (!path) {
  //   // path should already be set to null/undefined but do it again here to be explicit
  //   path = null;
  //   creep.memory.path = path;
  //   console.log(name + ": no path");
  //   return ERR_NO_PATH;
  // }

  // // Check if 1st path try, or path from memory, gets us where we want to go.
  // if (path) {
  //   let beforePos = creep.pos;
  //   let afterPos = Room.deserializePath(path)[0];
  //   retval = creep.moveByPath(path);

  //   if (
  //     !beforePos ||
  //     !afterPos ||
  //     (beforePos.x === afterPos.x && beforePos.y === afterPos.y)
  //   ) {
  //     retval = ERR_NO_PATH;
  //   }
  // }
  retval = creep.moveTo(destPos, {
    plainCost: 3,
    range: range,
    ignoreCreeps: ignoreCreeps,
    noPathFinding: false,
    reusePath: pathMem,
    maxOps: maxOps,
    maxRooms: maxRms,
    serializeMemory: true,
    visualizePathStyle: {
      fill: "transparent",
      stroke: pathColor,
      lineStyle: "dashed",
      strokeWidth: 0.15,
      opacity: 0.1,
    },
  });

  if (retval === OK) {
    creep.say(destPos.x + "," + destPos.y);

    if (creep.pos.inRangeTo(dest, range)) {
      creep.memory.path = null;
    }
    return retval;
  } else if (retval === ERR_NOT_FOUND) {
    // path doesn't match creep's location
    path = null;
    creep.say("no match");
    creep.memory.path = null;
  } else {
    path = null;
    creep.memory.path = path;
    retval = ERR_NO_PATH;

    creep.say("nopath." + retval);
    creep.memory.path = path;
    // second chance path was also out of range
  }

  if (retval === ERR_INVALID_TARGET || retval === ERR_NOT_FOUND) {
    creep.memory.path = null;
  } else if (retval === ERR_NO_PATH) {
    creep.memory.path = null;
  }

  creep.say("m." + retval);
  return retval;
}

module.exports = smartMove;
