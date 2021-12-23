const profiler = require("./screeps-profiler");

function findMyStructs(structTypes, targetRoomName) {
  let structs = Game.rooms[targetRoomName].find(FIND_MY_STRUCTURES, {
    filter: (struct) => {
      for (let i = 0; i < structTypes.length; i++) {
        if (structTypes[i] === struct.structureType) {
          return struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      }
    },
  });

  const extIDs = structs.map((ext) => ext.id);

  return extIDs;
}
exports.findMyStructs = findMyStructs;
findMyStructs = profiler.registerFN(findMyStructs, "findStructs");
