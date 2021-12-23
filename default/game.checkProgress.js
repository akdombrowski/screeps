const profiler = require("./screeps-profiler");

function checkProgress(numCrps, rm) {
  if (Game.time % 3600 == 0) {
    if (!Memory.rmProg) {
      Memory.rmProg = 0;
    }

    let rmControllerId = "59bbc5d22052a716c3cea137";
    let rmController = Game.getObjectById(rmControllerId);
    const rmLvl = rmController.level;
    const rmProg = rmController.progress;
    const rmProgTotal = rmController.progressTotal;
    const rmProgPerc = (rmProg / rmProgTotal) * 100;

    Memory.rmProg = rmProg;

    console.log("Creeps: " + numCrps);

    console.log(
      "S: " +
        rmLvl +
        ":" +
        rmProg / 1000 +
        "/" +
        rmProgTotal / 1000 +
        " - " +
        rmProgPerc +
        "%"
    );

    let enAvail = rm.energyAvailable;
    let enCap = rm.energyCapacityAvailable;
    console.log("S:" + enAvail + "," + enCap);

    Game.notify(
      rmLvl +
        ":" +
        rmProg / 1000 +
        "/" +
        rmProgTotal / 1000 +
        "\n" +
        rmProgPerc +
        "%"
    );

    Game.profiler.email(100);
  }
}

checkProgress = profiler.registerFN(checkProgress, "checkProgress");
exports.checkProgress = checkProgress;
