const checkForAttackers = require("./invasion.checkForAttackers");
const roleTower = require("role.tower");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const westSpawnCreepTypes = require("./spawn.westSpawnCreepTypes");
const northSpawnCreepTypes = require("./spawn.northSpawnCreepTypes");
const deepSouthspawnCreepTypes = require("./spawn.deepSouthspawnCreepTypes");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const linkTransfer = require("./action.linkTransfer");
const profiler = require("./screeps-profiler");
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
  memoryWestRoomExtensionsRefresh,
} = require("./getEnergy.memoryWestRoomExtensionsRefresh");
const {
  memoryHomeSpawnsRefresh,
} = require("./getEnergy.memoryHomeSpawnsRefresh");
const {
  memoryNorthRoomSpawnsRefresh,
} = require("./getEnergy.memoryNorthRoomSpawnsRefresh");
const {
  memorySouthRoomSpawnsRefresh,
} = require("./getEnergy.memorySouthRoomSpawnsRefresh");
const {
  memoryWestRoomSpawnsRefresh,
} = require("./getEnergy.memoryWestRoomSpawnsRefresh");
const { towerHeal } = require("./tower.heal");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let homeRoomSpawn1 = Game.spawns.homeRoomSpawn1;
    let westRoomSpawn1 = Game.spawns.westRoomSpawn1;
    // let northS1 = Game.spawns.e59s47Spawn1;
    // let deepSouthS1 = Game.spawns.deepSouthSpawn1;
    Memory.homeRoomSpawn1ID = homeRoomSpawn1.id;
    Memory.westRoomSpawn1ID = westRoomSpawn1.id;
    // Memory.northS1 = northS1.id;
    // Memory.deepSouthS1 = deepSouthS1.id;

    let homeRoom = homeRoomSpawn1.room;
    // Memory.homeRoomID = homeRoom.id;
    // let northRoom = northS1.room;
    // Memory.northRoom = northRoom;
    // let deepSouthRoom = deepSouthS1.room;
    // Memory.deepSouthRoom = null;
    let westRoom = westRoomSpawn1.room;
    Memory.homeRoomName = homeRoom.name;
    Memory.northRoomName = "W37N25";
    Memory.southRoomName = "W37N23";
    Memory.westRoomName = "W38N24";
    Memory.southwestRoomName = "W38N23";
    Memory.southeastRoomName = "W36N23";
    Memory.eastRoomName = "W36N24";
    Memory.easteastRoomName = "W31N29";
    Memory.northwestRoomName = "W38N25";
    Memory.northeastRoomName = "W36N25";
    Memory.northeasteastRoomName = "W31N30";

    Memory.northControllerID = "59f1a14c82100e1594f38058";
    Memory.northEastControllerID = "59f1a15b82100e1594f38290";
    Memory.southControllerID = "59f1a14d82100e1594f3805f";
    Memory.southwestControllerID = "59f1a13882100e1594f37ed7";
    Memory.westControllerID = "5982fc52b097071b4adbd31b";

    let homeEnAvail = homeRoom.energyAvailable;
    let homeEnCap = homeRoom.energyCapacityAvailable;
    // let northEnAvail = northRoom.energyAvailable;
    // let northEnCapRm = northRoom.energyCapacityAvailable;
    // let deepSouthEnAvail = deepSouthRoom.energyAvailable;
    // let deepSouthEnCapRm = deepSouthRoom.energyCapacityAvailable;
    let westEnAvail = westRoom.energyAvailable;
    let westEnCap = westRoom.energyCapacityAvailable;
    Memory.homeEnAvail = homeEnAvail;
    Memory.homeEnCap = homeEnCap;
    // Memory.northEnAvail = northEnAvail;
    // Memory.northEnCapRoom = northEnCapRm;
    // Memory.deepSouthEnAvail = deepSouthEnAvail;
    // Memory.deepSouthEnCapRm = deepSouthEnCapRm;
    Memory.westEnAvail = westEnAvail;
    Memory.westEnCap = westEnCap;

    Memory.homeSource1ID = "5982fc5eb097071b4adbd46a";
    Memory.homeSource2ID = "5982fc5eb097071b4adbd468";
    // Memory.nSource1 = "59bbc5d22052a716c3cea131";
    // Memory.nSource2 = "59bbc5d22052a716c3cea132";

    Memory.tower1Id = "61dc1041f191ab6e5ccbc707";
    Memory.westTower1Id = "61d5a2551053fefa678b4e6b";
    // Memory.dSTower1Id = "61c492d3227d7cef1df2ce6e";

    Memory.attackDurationSafeCheck = 1;
    Memory.nAttackDurationSafeCheck = 10;
    Memory.dSAttackDurationSafeCheck = 10000;
    Memory.swAttackDurationSafeCheck = 10000;
    Memory.sAttackDurationSafeCheck = 10;
    Memory.wAttackDurationSafeCheck = 1;

    checkForAttackers();

    let towers = [];
    towers.push(Game.getObjectById(Memory.tower1Id));
    let priorityA = "";
    let priorityB = "";
    if (Game.getObjectById(priorityA)) {
      towersAttackInvader(Game.getObjectById(priorityA), towers);
    } else if (Game.getObjectById(priorityB)) {
      towersAttackInvader(Game.getObjectById(priorityB), towers);
    } else {
      towersAttackInvader(Game.getObjectById(Memory.invaderIDHome), towers);
    }

    // // let dSTowers = [];
    // // dSTowers.push(Game.getObjectById(Memory.dSTower1Id));
    // // priorityA = "";
    // // priorityB = "";
    // // if (Game.getObjectById(priorityA)) {
    // //   towersAttackInvader(Game.getObjectById(priorityA), dSTowers);
    // // } else if (Game.getObjectById(priorityB)) {
    // //   towersAttackInvader(Game.getObjectById(priorityB), dSTowers);
    // // } else {
    // //   towersAttackInvader(Game.getObjectById(Memory.invaderIDE59S49), dSTowers);
    // // }

    // let westTowers = [];
    // westTowers.push(Game.getObjectById(Memory.westTower1Id));
    // priorityA = "";
    // priorityB = "";
    // if (Game.getObjectById(priorityA)) {
    //   towersAttackInvader(Game.getObjectById(priorityA), dSTowers);
    // } else if (Game.getObjectById(priorityB)) {
    //   towersAttackInvader(Game.getObjectById(priorityB), dSTowers);
    // } else {
    //   towersAttackInvader(Game.getObjectById(Memory.invaderIDWest), westTowers);
    // }

    const timeToPassForRecheck = 100;
    const minEnergyToKeepForInvaders = 400;
    const healInterval = 1;
    const repairInterval = 2;
    if (!Memory.invaderIDHome) {
      retval = towerHeal(
        towers,
        timeToPassForRecheck,
        minEnergyToKeepForInvaders,
        healInterval
      );

      if (retval != OK) {
        towerRepair(
          towers,
          timeToPassForRecheck,
          minEnergyToKeepForInvaders,
          repairInterval
        );
      }
    }

    // if (!Memory.invaderIDWest) {
    //   retval = towerHeal(
    //     westTowers,
    //     timeToPassForRecheck,
    //     minEnergyToKeepForInvaders,
    //     healInterval
    //   );

    //   if (retval != OK) {
    //     towerRepair(
    //       westTowers,
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

    spawnCreepTypes(homeEnAvail, [homeRoomSpawn1]);
    westSpawnCreepTypes(westEnAvail, [westRoomSpawn1]);
    // northSpawnCreepTypes(northEnAvail, [northS1]);
    // deepSouthspawnCreepTypes(deepSouthEnAvail, [deepSouthS1]);

    if (Game.time % 25) {
      Memory.homeExtensions = memoryHomeExtensionsRefresh(
        null,
        Memory.homeExtensions
      );
      // Memory.westExtensions = memoryWestRoomExtensionsRefresh(
      //   null,
      //   Memory.westExtensions
      // );
    }

    if (Game.time % 100) {
      Memory.homeSpawns = memoryHomeSpawnsRefresh(null, Memory.homeSpawns);
      // Memory.westSpawns = memoryWestRoomSpawnsRefresh(null, Memory.westSpawns);
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
