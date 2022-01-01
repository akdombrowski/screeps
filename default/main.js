const checkForAttackers = require("./invasion.checkForAttackers");
const spawnHarvesterChain = require("./spawnHarvesterChain");
const roleTower = require("role.tower");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./move.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const northSpawnCreepTypes = require("./spawn.northSpawnCreepTypes");
const deepSouthspawnCreepTypes = require("./spawn.deepSouthspawnCreepTypes");
const spawnCreepTypeseRm = require("./spawn.eRmspawnCreepTypes");
const spawnCreepTypeseeRm = require("./spawn.eeRmspawnCreepTypes");
const spawnCreepTypesNE = require("./spawn.spawnCreepTypesNE");
const spawnCreepTypesN = require("./spawn.spawnCreepTypesN");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const linkTransfer = require("./action.linkTransfer");
const profiler = require("./screeps-profiler");
const findDecayed = require("./action.findDecayed");
const { checkProgress } = require("./game.checkProgress");
const { deleteDeadCreeps } = require("./utilities.deleteDeadCreeps");
const { areCreepsDying } = require("./game.areCreepsDying");
const { towersAttackInvader } = require("./tower.attackInvader");
const { reCheckNumOfCreeps } = require("./utilities.reCheckNumOfCreeps");
const { towerRepair } = require("./tower.repair");
const {
  memoryHomeExtensionsRefresh,
} = require("./getEnergy.memoryHomeExtensionsRefresh");
const {
  memoryNorthRoomExtensionsRefresh,
} = require("./getEnergy.memoryNorthRoomExtensionsRefresh");
const {
  memorySouthRoomExtensionsRefresh,
} = require("./getEnergy.memorySouthRoomExtensionsRefresh");
const {
  memoryHomeSpawnsRefresh,
} = require("./getEnergy.memoryHomeSpawnsRefresh");
const {
  memoryNorthRoomSpawnsRefresh,
} = require("./getEnergy.memoryNorthRoomSpawnsRefresh");
const {
  memorySouthRoomSpawnsRefresh,
} = require("./getEnergy.memorySouthRoomSpawnsRefresh");
const { towerHeal } = require("./tower.heal");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let homeRoomSpawn1 = Game.spawns.homeSpawn;
    // let northS1 = Game.spawns.e59s47Spawn1;
    // let deepSouthS1 = Game.spawns.deepSouthSpawn1;
    Memory.homeRoomSpawn1ID = homeRoomSpawn1.id;
    // Memory.northS1 = northS1.id;
    // Memory.deepSouthS1 = deepSouthS1.id;

    let homeRoom = homeRoomSpawn1.room;
    // Memory.homeRoomID = homeRoom.id;
    // let northRoom = northS1.room;
    // Memory.northRoom = northRoom;
    // let deepSouthRoom = deepSouthS1.room;
    // Memory.deepSouthRoom = null;
    Memory.homeRoomName = homeRoom.name;
    Memory.northRoomName = "W27S53";
    Memory.southRoomName = "W27S55";
    Memory.westRoomName = "W28S54";
    Memory.southwestRoomName = "W28S55";
    Memory.southeastRoomName = "W26S55";
    Memory.eastRoomName = "W26S54";
    Memory.easteastRoomName = "W31N29";
    Memory.northwestRoomName = "W28S53";
    Memory.northeastRoomName = "W26S53";
    Memory.northeasteastRoomName = "W31N30";

    // Memory.e58s49RoomName = "E58S49";
    // Memory.e58s48RoomName = "E58S48";

    // Memory.northControllerID = "59bbc5d22052a716c3cea133";
    Memory.southControllerID = "5982fc8cb097071b4adbdb3c";
    // Memory.e58s49ControllerID = "59bbc5c12052a716c3ce9faa";

    let enAvailHomeRoom = homeRoom.energyAvailable;
    let enCapHomeRoom = homeRoom.energyCapacityAvailable;
    // let northEnAvail = northRoom.energyAvailable;
    // let northEnCapRm = northRoom.energyCapacityAvailable;
    // let deepSouthEnAvail = deepSouthRoom.energyAvailable;
    // let deepSouthEnCapRm = deepSouthRoom.energyCapacityAvailable;
    Memory.enAvail = enAvailHomeRoom;
    Memory.enCapRm = enCapHomeRoom;
    // Memory.northEnAvail = northEnAvail;
    // Memory.northEnCapRoom = northEnCapRm;
    // Memory.deepSouthEnAvail = deepSouthEnAvail;
    // Memory.deepSouthEnCapRm = deepSouthEnCapRm;

    // Memory.source1 = "59bbc5d22052a716c3cea136";
    // Memory.source2 = "59bbc5d22052a716c3cea135";
    // Memory.nSource1 = "59bbc5d22052a716c3cea131";
    // Memory.nSource2 = "59bbc5d22052a716c3cea132";

    // Memory.tower1Id = "61bc38d236c34cfe01fad9cd";
    // Memory.dSTower1Id = "61c492d3227d7cef1df2ce6e";

    Memory.attackDurationSafeCheck = 5;
    // Memory.nAttackDurationSafeCheck = 10;
    // Memory.dSAttackDurationSafeCheck = 2;
    // Memory.swAttackDurationSafeCheck = 10;
    Memory.sAttackDurationSafeCheck = 10;
    // Memory.wAttackDurationSafeCheck = 10;

    checkForAttackers();

    // let towers = [];
    // towers.push(Game.getObjectById(Memory.tower1Id));
    // let priorityA = "";
    // let priorityB = "";
    // if (Game.getObjectById(priorityA)) {
    //   towersAttackInvader(Game.getObjectById(priorityA), towers);
    // } else if (Game.getObjectById(priorityB)) {
    //   towersAttackInvader(Game.getObjectById(priorityB), towers);
    // } else {
    //   towersAttackInvader(Game.getObjectById(Memory.invaderIDE59S48), towers);
    // }

    // let dSTowers = [];
    // dSTowers.push(Game.getObjectById(Memory.dSTower1Id));
    // priorityA = "";
    // priorityB = "";
    // if (Game.getObjectById(priorityA)) {
    //   towersAttackInvader(Game.getObjectById(priorityA), dSTowers);
    // } else if (Game.getObjectById(priorityB)) {
    //   towersAttackInvader(Game.getObjectById(priorityB), dSTowers);
    // } else {
    //   towersAttackInvader(Game.getObjectById(Memory.invaderIDE59S49), dSTowers);
    // }

    // // towersAttackInvader(
    // //   Game.getObjectById("61cbe200304e0f5fc28feab1"),
    // //   dSTowers
    // // );

    const timeToPassForRecheck = 100;
    const minEnergyToKeepForInvaders = 400;
    const healInterval = 1;
    const repairInterval = 2;
    // if (!Memory.invaderIDE59S48) {
    //   retval = towerHeal(
    //     towers,
    //     timeToPassForRecheck,
    //     minEnergyToKeepForInvaders,
    //     healInterval
    //   );

    //   if (retval != OK) {
    //     towerRepair(
    //       towers,
    //       timeToPassForRecheck,
    //       minEnergyToKeepForInvaders,
    //       repairInterval
    //     );
    //   }
    // }

    // if (!Memory.invaderIDE59S49) {
    //   retval = towerHeal(
    //     dSTowers,
    //     timeToPassForRecheck,
    //     minEnergyToKeepForInvaders,
    //     healInterval
    //   );

    //   if (retval != OK) {
    //     towerRepair(
    //       dSTowers,
    //       timeToPassForRecheck,
    //       minEnergyToKeepForInvaders,
    //       repairInterval
    //     );
    //   }
    // }

    let crps = Memory.creeps || [];
    Memory.creeps = crps;
    let numCrps = reCheckNumOfCreeps(crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;

    runRoles();

    spawnCreepTypes(enAvailHomeRoom, [homeRoomSpawn1]);
    // northSpawnCreepTypes(northEnAvail, [northS1]);
    // deepSouthspawnCreepTypes(deepSouthEnAvail, [deepSouthS1]);

    if (Game.time % 20) {
      Memory.homeExtensions = memoryHomeExtensionsRefresh(
        null,
        Memory.homeExtensions
      );

      // //   memoryE59S47ExtensionsRefresh();

      // //   memoryE59S49ExtensionsRefresh();
    }

    if (Game.time % 20) {
      memoryHomeSpawnsRefresh(null, Memory.homeSpawns);

      // //   memoryE59S47SpawnsRefresh();

      // //   memoryE59S49SpawnsRefresh();
    }

    // // if (Game.cpu.bucket > 30) {
    // //   linkTransfer(linkSpawn, slinkMiddle);
    // //   linkTransfer(linkSpawn, slinkMiddle2);
    // // } else {
    // //   console.log("low cpu bucket: " + Game.cpu.bucket);
    // // }

    if (Game.cpu.getUsed() >= (Game.cpu.tickLimit / 10) * 9) {
      return;
    }

    let rooms = [homeRoom];
    checkProgress(numCrps, rooms, 3600);
  });

  // Profiler stats
  let pTime = Memory.profilerTime;
  let profilerDur = 5400;
  if (!pTime || Game.time - Memory.profilerTime > profilerDur * 1.1) {
    Memory.profilerTime = Game.time;
    Game.profiler.email(profilerDur);
    Game.profiler.profile(profilerDur);
  }
};
