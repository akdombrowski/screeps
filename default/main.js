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
  memoryE59S48ExtensionsRefresh,
} = require("./getEnergy.memoryE59S48ExtensionsRefresh");
const {
  memoryE59S47ExtensionsRefresh,
} = require("./getEnergy.memoryE59S47ExtensionsRefresh");
const {
  memoryE59S49ExtensionsRefresh,
} = require("./getEnergy.memoryE59S49ExtensionsRefresh");
const {
  memoryE59S48SpawnsRefresh,
} = require("./getEnergy.memoryE59S48SpawnsRefresh");
const {
  memoryE59S47SpawnsRefresh,
} = require("./getEnergy.memoryE59S47SpawnsRefresh");
const {
  memoryE59S49SpawnsRefresh,
} = require("./getEnergy.memoryE59S49SpawnsRefresh");
const { towerHeal } = require("./tower.heal");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let s1 = Game.spawns.Spawn1;
    // let northS1 = Game.spawns.e59s47Spawn1;
    let deepSouthS1 = Game.spawns.deepSouthSpawn1;
    Memory.s1 = s1.id;
    // Memory.northS1 = northS1.id;
    Memory.deepSouthS1 = deepSouthS1.id;

    let rm = s1.room;
    Memory.rm = rm.id;
    // let northRoom = northS1.room;
    // Memory.northRoom = northRoom;
    let deepSouthRoom = deepSouthS1.room;
    Memory.deepSouthRoom = null;
    Memory.homeRoomName = "E59S48";
    Memory.northRoomName = "E59S47";
    Memory.deepSouthRoomName = "E59S49";
    Memory.e58s49RoomName = "E58S49";

    Memory.northControllerID = "59bbc5d22052a716c3cea133";

    let enAvail = rm.energyAvailable;
    let enCapRm = rm.energyCapacityAvailable;
    // let northEnAvail = northRoom.energyAvailable;
    // let northEnCapRm = northRoom.energyCapacityAvailable;
    let deepSouthEnAvail = deepSouthRoom.energyAvailable;
    let deepSouthEnCapRm = deepSouthRoom.energyCapacityAvailable;
    Memory.enAvail = enAvail;
    Memory.enCapRm = enCapRm;
    // Memory.northEnAvaioom = northEnCapRm;
    Memory.deepSouthEnAvail = deepSouthEnAvail;
    Memory.deepSouthEnCapRm = deepSouthEnCapRm;

    Memory.source1 = "59bbc5d22052a716c3cea136";
    Memory.source2 = "59bbc5d22052a716c3cea135";
    Memory.nSource1 = "59bbc5d22052a716c3cea131";
    Memory.nSource2 = "59bbc5d22052a716c3cea132";

    Memory.tower1Id = "61bc38d236c34cfe01fad9cd";
    Memory.dSTower1Id = "61c492d3227d7cef1df2ce6e";

    Memory.attackDurationSafeCheck = 1000;
    Memory.nattackDurationSafeCheck = 1000;

    let towers = [];
    towers.push(Game.getObjectById(Memory.tower1Id));
    towersAttackInvader(Game.getObjectById(Memory.invaderId), towers);
    let dSTowers = [];
    dSTowers.push(Game.getObjectById(Memory.dSTower1Id));
    towersAttackInvader(Game.getObjectById(Memory.dSAttackerId), dSTowers);

    const timeToPassForRecheck = 100;
    const minEnergyToKeepForInvaders = 200;
    const healInterval = 1;
    const repairInterval = 2;
    if (!Memory.invaderId) {
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

    if (!Memory.dSAttackerId) {
      retval = towerHeal(
        dSTowers,
        timeToPassForRecheck,
        minEnergyToKeepForInvaders,
        healInterval
      );

      if (retval != OK) {
        towerRepair(
          dSTowers,
          timeToPassForRecheck,
          minEnergyToKeepForInvaders,
          repairInterval
        );
      }
    }

    checkForAttackers();

    let crps = Memory.creeps || [];
    Memory.creeps = crps;
    let numCrps = reCheckNumOfCreeps(crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;

    runRoles();

    spawnCreepTypes(enAvail, [s1]);
    // northSpawnCreepTypes(northEnAvail, [northS1]);
    deepSouthspawnCreepTypes(deepSouthEnAvail, [deepSouthS1]);

    // if (Game.time % 20) {
    //   memoryE59S48ExtensionsRefresh();

    //   memoryE59S47ExtensionsRefresh();

    //   memoryE59S49ExtensionsRefresh();
    // }

    // if (Game.time % 20) {
    //   memoryE59S48SpawnsRefresh();

    //   memoryE59S47SpawnsRefresh();

    //   memoryE59S49SpawnsRefresh();
    // }

    // if (Game.cpu.bucket > 30) {
    //   linkTransfer(linkSpawn, slinkMiddle);
    //   linkTransfer(linkSpawn, slinkMiddle2);
    // } else {
    //   console.log("low cpu bucket: " + Game.cpu.bucket);
    // }

    let rooms = [rm, deepSouthRoom];
    checkProgress(numCrps, rooms, 3600);
  });

  // Profiler stats
  let pTime = Memory.profilerTime;
  let profilerDur = 15000;
  if (!pTime || Game.time - Memory.profilerTime > profilerDur * 1.1) {
    Memory.profilerTime = Game.time;
    Game.profiler.email(profilerDur);
  }
};
