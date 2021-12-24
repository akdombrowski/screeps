const profiler = require("./screeps-profiler");

function checkProgress(numCrps, rooms, intervalInGameTime) {
  if (Game.time % intervalInGameTime == 0) {
    let emailMessage = "";

    console.log("Total # of Creeps: " + numCrps);
    rooms.forEach((room) => {
      const rmController = room.controller;
      const rmLvl = rmController.level;
      const rmProg = rmController.progress;
      const rmProgTotal = rmController.progressTotal;
      const rmProgPerc = (rmProg / rmProgTotal) * 100;
      const enAvail = room.energyAvailable;
      const enCap = room.energyCapacityAvailable;

      Memory[room.name + "Progess"] = rmProg;

      console.log("Total # of " + room.name + " Creeps: " + Memory["creeps" + room.name]);

      console.log(
        room.name +
          " Level " +
          rmLvl +
          ". progress:" +
          rmProg / 1000 +
          "/" +
          rmProgTotal / 1000 +
          "\n" +
          rmProgPerc +
          "%"
      );

      console.log(room.name + ":" + enAvail + "," + enCap);

      emailMessage =
        emailMessage +
        " \n" +
        rm.name +
        " Level " +
        rmLvl +
        ". progress:" +
        rmProg / 1000 +
        "/" +
        rmProgTotal / 1000 +
        "\n" +
        rmProgPerc +
        "%. # of " +
        rm.name +
        " creeps: " +
        Memory.homeRoomCreeps;
    });

    Game.profiler.email(100);
  }
}

checkProgress = profiler.registerFN(checkProgress, "checkProgress");
exports.checkProgress = checkProgress;
