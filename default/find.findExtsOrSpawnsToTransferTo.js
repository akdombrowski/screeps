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
  let spwns;
  let extsAndSpwns;

  extensions = checkForExtensions(targetRoomName, creep, extensions);

  exts = mapIDsToGameObjs(extensions);

  spawns = checkForSpawns(targetRoomName, creep, spawns);

  spwns = mapIDsToGameObjs(spawns);

  extsAndSpwns = exts.concat(spwns);

  // find closest ext or spawn by path
  let a = creep.pos.findClosestByRange(extsAndSpwns);
  // let a = exts.pop();

  if (a) {
    target = a;
    creep.memory.transferTargetId = target.id;

    if (a.structureType === STRUCTURE_EXTENSION) {
      // remove the target extension from the extensions list
      _.pull(extensions, target.id);
    } else {
      // remove the target spawn from the spawns list
      _.pull(spawns, target.id);
    }
  } else {
    // found neither spawn nor extension that needs energy
    // target still null or whatever was passed in
  }

  return { target: target, extensions: extensions, spawns: spawns };
}
exports.findExtsOrSpawnsToTransferTo = findExtsOrSpawnsToTransferTo;
findExtsOrSpawnsToTransferTo = profiler.registerFN(
  findExtsOrSpawnsToTransferTo,
  "findExtsOrSpawnsToTransferTo"
);
