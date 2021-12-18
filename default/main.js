const checkForAttackers = require("./invasion.checkForAttackers");
const spawnHarvesterChain = require("./spawnHarvesterChain");
const roleTower = require("role.tower");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./action.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const spawnCreepTypeseRm = require("./spawn.eRmspawnCreepTypes");
const spawnCreepTypeseeRm = require("./spawn.eeRmspawnCreepTypes");
const spawnCreepTypesNE = require("./spawn.spawnCreepTypesNE");
const spawnCreepTypesN = require("./spawn.spawnCreepTypesN");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const linkTransfer = require("./linkTransfer");
const profiler = require("./screeps-profiler");
const findDecayed = require("./action.findDecayed");
const { findFixables } = require("./findFixables");
const { checkProgress } = require("./checkProgress");
const { deleteDeadCreeps } = require("./deleteDeadCreeps");
const { areCreepsDying } = require("./areCreepsDying");
const { towersAttackInvader } = require("./towersAttackInvader");
const { reCheckNumOfCreeps } = require("./reCheckNumOfCreeps");
const findRepairable = require("./action.findRepairableStruct");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function () {
  profiler.wrap(function () {
    let lastEnAvail = Memory.enAvail || 0;

    let s1 = Game.spawns.Spawn1;
    Memory.s1 = s1;

    let rm = s1.room;
    Memory.rm = rm;
    Memory.homeRoomName = "E59S48";
    Memory.northRoomName = "E59S47";
    Memory.deepSouthRoomName = "E59S49";

    let enAvail = rm.energyAvailable;
    let enCapRm = rm.energyCapacityAvailable;
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
    towersAttackInvader(Memory.invader, towers);



    const timeToPassForRecheck = 100;
    for(let i = 0; i < towers.length; i++) {
      let t = towers[i];
      let target = null;
      if (t.room.name === Memory.homeRoomName && !Memory.invaderId) {
        if (
          !Memory.e59s48fixables ||
          Memory.e59s48fixables.length <= 0 ||
          Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck
        ) {
          Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);
          Memory.lastSouthCheckFixables = Game.time;
        }
      } else if (t.room.name === Memory.northRoomName && !Memory.nAttackerId) {
        if (
          !Memory.e59s47fixables ||
          Memory.e59s47fixables.length <= 0 ||
          Memory.lastNorthCheckFixables - Game.time > timeToPassForRecheck
        ) {
          Memory.e59s47fixables = findFixables(
            Game.rooms[Memory.northRoomName]
          );
          Memory.lastNorthCheckFixables = Game.time;
        }
      } else {
        if (
          !Memory.e59s48fixables ||
          Memory.e59s48fixables.length <= 0 ||
          Memory.lastSouthCheckFixables - Game.time > timeToPassForRecheck
        ) {
          Memory.e59s48fixables = findFixables(Game.rooms[Memory.homeRoomName]);
          Memory.lastSouthCheckFixables = Game.time;
        }
      }
      target = findRepairable(t);
      if(target) {
        t.repair(target);
      }
    }




















    checkForAttackers();

    let crps = Memory.creeps || [];
    Memory.creeps = crps;
    let numCrps = reCheckNumOfCreeps(crps);
    areCreepsDying(numCrps);

    deleteDeadCreeps();
    crps = Game.creeps;

    if (Game.cpu.bucket > 15) {
      runRoles();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

    if (Game.cpu.bucket > 25) {
      spawnCreepTypes(enAvail, [Game.spawns.Spawn1]);

      // spawnToSource1Chain();
    } else {
      console.log("low cpu bucket: " + Game.cpu.bucket);
    }

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

