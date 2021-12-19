const checkForAttackers = require("./invasion.checkForAttackers");
const spawnHarvesterChain = require("./spawnHarvesterChain");
const roleTower = require("role.tower");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./action.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const deepSouthspawnCreepTypes = require("./spawn.deepSouthspawnCreepTypes");
const spawnCreepTypeseRm = require("./spawn.eRmspawnCreepTypes");
const spawnCreepTypeseeRm = require("./spawn.eeRmspawnCreepTypes");
const spawnCreepTypesNE = require("./spawn.spawnCreepTypesNE");
const spawnCreepTypesN = require("./spawn.spawnCreepTypesN");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const linkTransfer = require("./linkTransfer");
const profiler = require("./screeps-profiler");
const findDecayed = require("./action.findDecayed");
const { checkProgress } = require("./checkProgress");
const { deleteDeadCreeps } = require("./deleteDeadCreeps");
const { areCreepsDying } = require("./areCreepsDying");
const { towersAttackInvader } = require("./towersAttackInvader");
const { reCheckNumOfCreeps } = require("./reCheckNumOfCreeps");
const { towerRepair } = require("./towerRepair");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let s1 = Game.spawns.Spawn1;
    let northS1 = Game.spawns.NorthSpawn1;
    let deepSouthS1 = Game.spawns.deepSouthSpawn1;
    Memory.s1 = s1;
    Memory.northS1 = northS1;
    Memory.deepSouthS1 = deepSouthS1;

    let rm = s1.room;
    Memory.rm = rm;
    // let northRm = northS1.room;
    // Memory.northRm = northRm;
    let deepSouthRm = deepSouthS1.room;
    Memory.deepSouthRm = deepSouthRm;
    Memory.homeRoomName = "E59S48";
    Memory.northRoomName = "E59S47";
    Memory.deepSouthRoomName = "E59S49";

    let enAvail = rm.energyAvailable;
    let enCapRm = rm.energyCapacityAvailable;
    // let northEnAvail = northRm.energyAvailable;
    // let northEnCapRm = northRm.energyCapacityAvailable;
    let deepSouthEnAvail = deepSouthRm.energyAvailable;
    let deepSouthEnCapRm = deepSouthRm.energyCapacityAvailable;
    Memory.enAvail = enAvail;
    Memory.enCapRm = enCapRm;

    Memory.source1 = "59bbc5d22052a716c3cea136";
    Memory.source2 = "59bbc5d22052a716c3cea135";
    Memory.nSource1 = "59bbc5d22052a716c3cea131";
    Memory.nSource2 = "59bbc5d22052a716c3cea132";

    Memory.tower1Id = "61bc38d236c34cfe01fad9cd";

    Memory.attackDurationSafeCheck = 1000;
    Memory.nattackDurationSafeCheck = 1000;

    let towers = [];
    towers.push(Game.getObjectById(Memory.tower1Id));
    towersAttackInvader(Game.getObjectById(Memory.invaderId), towers);

    towerRepair(towers);

    checkForAttackers();

    let crps = Memory.creeps || [];
    Memory.creeps = crps;
    let numCrps = reCheckNumOfCreeps(crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;

    runRoles();

    spawnCreepTypes(enAvail, [s1]);
    // spawnCreepTypes(northEnAvail, [northS1]);
    deepSouthspawnCreepTypes(deepSouthEnAvail, [deepSouthS1]);

    // if (Game.cpu.bucket > 30) {
    //   linkTransfer(linkSpawn, slinkMiddle);
    //   linkTransfer(linkSpawn, slinkMiddle2);
    // } else {
    //   console.log("low cpu bucket: " + Game.cpu.bucket);
    // }

    checkProgress(numCrps, rm);
  });

  // Profiler stats
  let pTime = Memory.profilerTime;
  let profilerDur = 15000;
  if (!pTime || Game.time - Memory.profilerTime > profilerDur * 1.1) {
    Memory.profilerTime = Game.time;
    Game.profiler.email(profilerDur);
  }
};
