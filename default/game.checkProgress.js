const profiler = require("./screeps-profiler");

function checkProgress(totalNumberOfCreeps, rooms, intervalInGameTime) {
  if (Game.time % intervalInGameTime == 0) {
    let emailMessage = "";

    console.log("Total # of Creeps: " + totalNumberOfCreeps);
    rooms.forEach((room) => {
      const roomController = room.controller;
      const roomLvl = roomController.level;
      const roomProgress = roomController.progress;
      const roomProgressTotal = roomController.progressTotal;
      const roomProgressPercentage = (roomProgress / roomProgressTotal) * 100;
      const roomEnergyAvailable = room.energyAvailable;
      const roomEnergyCapacity = room.energyCapacityAvailable;
      const lastRoomProgress = Memory[room.name + "Progress"] || roomProgress;
      const progressMadeSinceLastCheck = roomProgress - lastRoomProgress;
      const progressPercentageSinceLastCheck =
        (progressMadeSinceLastCheck / lastRoomProgress) * 100;
      Memory[room.name + "Progess"] = roomProgress;

      console.log(
        "Total " + room.name + " Creeps: " + Memory["creeps" + room.name].length
      );

      console.log(
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
          "percentageUntilNextLevel: " +
          roomProgressPercentage +
          "%" +
          "\n" +
          "progressMadeSinceLastCheck: " +
          progressMadeSinceLastCheck +
          "\n" +
          "progressPercentageSinceLastCheck: " +
          progressPercentageSinceLastCheck +
          "%"
      );

      console.log(
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
        "percentageUntilNextLevel: " +
        roomProgressPercentage +
        "%" +
        "\n" +
        "progressMadeSinceLastCheck: " +
        progressMadeSinceLastCheck +
        "\n" +
        "progressPercentageSinceLastCheck: " +
        progressPercentageSinceLastCheck +
        "%";
    });

    Game.profiler.email(100);

    Game.notify(emailMessage);
  }
}

checkProgress = profiler.registerFN(checkProgress, "checkProgress");
exports.checkProgress = checkProgress;
