const profiler = require("./screeps-profiler");

function roomBuildTargetPriorities(creep, targetRoomName, targets) {
  let target = null;

  if (creep.room.name === targetRoomName) {
    target = targets.find((targetID) => {
      let constructionSite = Game.getObjectById(targetID);

      return (
        constructionSite &&
        constructionSite.progress < constructionSite.progressTotal
      );
    });

    if (target) {
      target = Game.getObjectById(target);
    }
  }

  return target;
}
exports.roomBuildTargetPriorities = roomBuildTargetPriorities;
roomBuildTargetPriorities = profiler.registerFN(
  roomBuildTargetPriorities,
  "roomBuildTargetPriorities"
);
