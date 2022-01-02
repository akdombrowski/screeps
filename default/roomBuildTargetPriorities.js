const profiler = require("./screeps-profiler");

function roomBuildTargetPriorities(creep, targetRoomName, targets) {
  let target = null;

  if (creep.room.name === targetRoomName) {
    target = targets.find((targetID) => {
      let constructionSite = Game.getObjectById(targetID);
      constructionSite &&
        constructionSite.progress &&
        constructionSite.progress < constructionSite.progressTotal;
    });
  }

  return target;
}
exports.roomBuildTargetPriorities = roomBuildTargetPriorities;
roomBuildTargetPriorities = profiler.registerFN(
  roomBuildTargetPriorities,
  "roomBuildTargetPriorities"
);
