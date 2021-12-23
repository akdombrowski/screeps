const profiler = require("./screeps-profiler");
const { mapIDsToGameObjs } = require("./utilties.mapIDsToGameObjs");
const { checkForExtensions } = require("./transferEnergy.checkForExtensions");
const { checkForSpawns } = require("./transferEnergy.checkForSpawns");

function findExtsOrSpawnsToTransferTo(
  creep,
  target,
  targetRoomName,
  extensions,
  spawns
) {
  let exts;

  extensions = checkForExtensions(targetRoomName, creep, extensions);

  exts = mapIDsToGameObjs(extensions);


  // find closest ext or spawn by path
  let a = creep.pos.findClosestByRange(exts);
  // let a = exts.pop();

  if (a) {
    target = a;
    creep.memory.transferTargetId = target.id;

    // remove the target from list
    _.pull(extensions, target.id);
  } else {
    // didn't find an extension that needed energy
    // check for spawns
    spawns = checkForSpawns(targetRoomName, creep, spawns);

    exts = mapIDsToGameObjs(spawns);

    // find closest ext or spawn by path
    let a = creep.pos.findClosestByPath(exts);

    if (a) {
      target = a;
      creep.memory.transferTargetId = target.id;

      // remove the target from list
      _.pull(spawns, target.id);
    } else {
      // found neither spawn nor extension that needs energy
      // target still null
    }
  }

  return { target: target, extensions: extensions, spawns: spawns };
}
exports.findExtsOrSpawnsToTransferTo = findExtsOrSpawnsToTransferTo;
findExtsOrSpawnsToTransferTo = profiler.registerFN(
  findExtsOrSpawnsToTransferTo,
  "findExtsOrSpawnsToTransferTo"
);
