const profiler = require("./screeps-profiler");
const { mapIDsToGameObjs } = require("./utilties.mapIDsToGameObjs");
const { checkForExtensions } = require("./transferEnergy.checkForExtensions");
const { checkForSpawns } = require("./transferEnergy.checkForSpawns");

function findExtsOrSpawnsToTransferTo2(
  creep,
  target,
  targetRoomName,
  memExtensions,
  memSpawns
) {
  let exts = mapIDsToGameObjs(memExtensions);

  console.log("exts: " + exts);
  // find closest ext or spawn by path
  let a = creep.pos.findClosestByRange(exts);
  // let a = exts.pop();

  if (a) {
    target = a;
    creep.memory.transferTargetId = target.id;

    // remove the target from list
    _.pull(memExtensions, target.id);
  } else {
    // didn't find an extension that needed energy
    // check for spawns
    let spawns = mapIDsToGameObjs(memSpawns);

    // find closest ext or spawn by path
    let a = creep.pos.findClosestByRange(spawns);

    if (a) {
      target = a;
      creep.memory.transferTargetId = target.id;

      // remove the target from list
      _.pull(memSpawns, target.id);
    } else {
      // found neither spawn nor extension that needs energy
      // target still null
      creep.memory.transferTargetId = null;
    }
  }
  return { target: target, memExtensions: memExtensions, memSpawns: memSpawns };
}
exports.findExtsOrSpawnsToTransferTo2 = findExtsOrSpawnsToTransferTo2;
findExtsOrSpawnsToTransferTo2 = profiler.registerFN(
  findExtsOrSpawnsToTransferTo2,
  "findExtsOrSpawnsToTransferTo2"
);
