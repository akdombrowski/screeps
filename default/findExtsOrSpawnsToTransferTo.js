const profiler = require("./screeps-profiler");
const { mapIDsToGameObjs } = require("./mapIDsToGameObjs");
const { checkForExtensions } = require("./checkForExtensions");
const { checkForSpawns } = require("./checkForSpawns");

function findExtsOrSpawnsToTransferTo(
  creep,
  target,
  targetRoomName,
  memExtensions,
  memSpawns
) {
  let exts;

  memExtensions = checkForExtensions(targetRoomName, creep);

  exts = mapIDsToGameObjs(memExtensions);

  // find closest ext or spawn by path
  let a = creep.pos.findClosestByRange(exts);
  // let a = exts.pop();

  if (a) {
    target = a;
    creep.memory.transferTargetId = target.id;

    console.log(creep.name + " 0memExts in findExtsOrSpawns: " + memExtensions);
    console.log(creep.name  + " 0memExts length in findExtsOrSpawns: " + memExtensions.length);

    // remove the target from list
    _.pull(memExtensions, target.id);

    console.log(creep.name + " 1memExts length in findExtsOrSpawns: " + memExtensions.length);
    console.log(creep.name + " 1memExts in findExtsOrSpawns: " + memExtensions);
  } else {
    // didn't find an extension that needed energy
    // check for spawns
    memSpawns = checkForSpawns(targetRoomName, creep);

    exts = mapIDsToGameObjs(memSpawns);

    // find closest ext or spawn by path
    let a = creep.pos.findClosestByPath(exts);

    if (a) {
      target = a;
      creep.memory.transferTargetId = target.id;

      // remove the target from list
      _.pull(memSpawns, target.id);
    } else {
      // found neither spawn nor extension that needs energy
      // target still null
    }
  }
  return { target: target, memExtensions: memExtensions, memSpawns: memSpawns };
}
exports.findExtsOrSpawnsToTransferTo = findExtsOrSpawnsToTransferTo;
findExtsOrSpawnsToTransferTo = profiler.registerFN(
  findExtsOrSpawnsToTransferTo,
  "findExtsOrSpawnsToTransferTo"
);
