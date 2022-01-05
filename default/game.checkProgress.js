const profiler = require("./screeps-profiler");

function checkProgress(totalNumberOfCreeps, rooms, intervalInGameTime) {
  if (Game.time % intervalInGameTime == 0) {
    let emailMessage = "";

    console.log(
      "------------\n" +
        "Total # of Creeps: " +
        totalNumberOfCreeps +
        "\n----------"
    );
    rooms.forEach((room) => {
      const roomController = room.controller;
      const roomLvl = roomController.level;
      const roomProgress = roomController.progress;
      const roomProgressTotal = roomController.progressTotal;
      // calc the percentage of reaching the next level currently at
      const roomProgressPercentage = (roomProgress / roomProgressTotal) * 100;
      const roomEnergyAvailable = room.energyAvailable;
      const roomEnergyCapacity = room.energyCapacityAvailable;
      const lastRoomProgress = Memory[room.name + "Progress"];
      // calc progress made since last check
      const progressMadeSinceLastCheck = roomProgress - lastRoomProgress;
      // calc the perc change
      const progressPercentageSinceLastCheck =
        (progressMadeSinceLastCheck / lastRoomProgress) * 100;
      // save new progress
      Memory[room.name + "Progress"] = roomProgress;

      let crps = -1;

      switch (room.name) {
        case Memory.homeRoomName:
          crps = Memory.creepsHome.length;
          break;

        case Memory.westRoomName:
          crps = Memory.creepsWest.length;
          break;

        case Memory.southRoomName:
          crps = Memory.creepsSouth.length;
          break;

        case Memory.eastRoomName:
          crps = Memory.creepsEast.length;
          break;

        case Memory.northRoomName:
          crps = Memory.creepsNorth.length;
          break;

        default:
          break;
      }

      console.log(
        "---" +
          room.name +
          "---" +
          "\n" +
          "Level: " +
          roomLvl +
          "\n" +
          "creeps: " +
          crps +
          "\n" +
          "progress: " +
          roomProgress / 1000 +
          "k/" +
          roomProgressTotal / 1000 +
          "k" +
          "\n" +
          "percentageOfNextLevel: " +
          roomProgressPercentage.toFixed(2) +
          "%" +
          "\n" +
          "progressMadeSinceLastCheck: " +
          progressMadeSinceLastCheck +
          "\n" +
          "progressPercentageSinceLastCheck: " +
          progressPercentageSinceLastCheck.toFixed(2) +
          "%" +
          "\n" +
          "Energy: " +
          roomEnergyAvailable +
          "/" +
          roomEnergyCapacity +
          "\n------------"
      );

      emailMessage +=
        "---" +
        room.name +
        "---" +
        "\n" +
        "Level: " +
        roomLvl +
        "\n" +
        "progress: " +
        roomProgress / 1000 +
        "k/" +
        roomProgressTotal / 1000 +
        "k" +
        "\n" +
        "percentageOfNextLevel: " +
        roomProgressPercentage.toFixed(2) +
        "%" +
        "\n" +
        "progressMadeSinceLastCheck: " +
        progressMadeSinceLastCheck +
        "\n" +
        "progressPercentageSinceLastCheck: " +
        progressPercentageSinceLastCheck.toFixed(2) +
        "%\n";
    });

    Game.profiler.email(100);

    Game.notify(emailMessage);
  }
}

checkProgress = profiler.registerFN(checkProgress, "checkProgress");
exports.checkProgress = checkProgress;
