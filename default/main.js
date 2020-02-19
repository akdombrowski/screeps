const checkForAttackers = require("./invasion.checkForAttackers");
const spawnHarvesterChain = require("./spawnHarvesterChain");
const roleTower = require("role.tower");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./action.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const spawnCreepTypeseRm = require("./spawn.eRmspawnCreepTypes");
const spawnCreepTypeseeRm = require("./spawn.eeRmspawnCreepTypes");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");
const profiler = require("./screeps-profiler");
const findDecayed = require("./action.findDecayed");

// This line monkey patches the global prototypes.
profiler.enable();
module.exports.loop = function() {
  profiler.wrap(function() {
    let lastEnAvail = Memory.enAvail || 0;

    let s1 = Game.spawns.Spawn1;
    let s2 = Game.spawns.s2;
    let eespawn = Game.spawns.eespawn;
    let rm = Game.rooms.E35N31;
    let nRm = Game.rooms.E35N32;
    let wRm = Game.rooms.E34N31;
    let eRm = Game.rooms.E36N31;
    let enRm = Game.rooms.E36N32;
    let eeRm = Game.rooms.E37N31;

    let enAvail =
      rm.energyAvailable +
      Game.spawns.spawn2.store.getUsedCapacity(RESOURCE_ENERGY);
    let enCap = rm.energyCapacityAvailable;

    let enAvaileRm = eRm.energyAvailable;
    let enCapeRm = eRm.energyCapacityAvailable;

    let enAvaileeRm =
      eeRm.energyAvailable +
      Game.spawns.eespawn.store.getUsedCapacity(RESOURCE_ENERGY);
    let enCapeeRm = eeRm.energyCapacityAvailable;

    let crps = Game.creeps;
    let numCrps = Object.keys(crps).length;

    let harvesters = Memory.harvesters || [];
    let upControllers = Memory.upControllers || [];
    let workers = Memory.workers || [];
    let roadRepairers = Memory.roadRepairers || [];
    let claimers = Memory.claimers || [];

    let north = Game.flags.north1;
    let east = Game.flags.east;
    let south = "";

    let northHarvesters = Memory.northHarvesters || [];
    let eastHarvesters = Memory.eastHarvesters || [];
    let westHarvesters = Memory.westHarvesters || [];
    let southHarvesters = Memory.southHarvesters || [];

    let northAttack = Memory.northAttack || null;
    let eastAttack = Memory.eastAttack || null;
    let westAttack = Memory.westAttack || null;

    let invaderId = Memory.invaderId;
    let invader = invaderId ? Game.getObjectById(invaderId) : null;

    let nAttackDurationSafeCheck =
      Memory.nAttackDurationSafeCheck || Game.time + 100;
    let eAttackDurationSafeCheck =
      Memory.eAttackDurationSafeCheck || Game.time + 100;
    let wAttackDurationSafeCheck =
      Memory.wAttackDurationSafeCheck || Game.time + 100;
    let sAttackDurationSafeCheck =
      Memory.sAttackDurationSafeCheck || Game.time + 100;

    let source1 = rm.lookForAt(LOOK_SOURCES, 41, 8).pop();
    let source2 = rm.lookForAt(LOOK_SOURCES, 29, 15).pop();
    let source1eRm = eRm.lookForAt(LOOK_SOURCES, 9, 10).pop();

    let tower1Id = "5cf3b09b75f7e26764ee4276";
    let tower2Id = "5d0182c6667a4642d4259e3f";
    let tower3Id = "5d55c927ea104379d90d9176";
    let etower1Id = "5d0f99d929c9cb5363cba23d";
    let tower1 = Game.getObjectById(tower1Id);
    let tower2 = Game.getObjectById(tower2Id);
    let tower3 = Game.getObjectById(tower3Id);
    let etower1 = Game.getObjectById(etower1Id);

    let rmControllerId = Memory.rmControllerId || "5bbcaefa9099fc012e639e90";
    let rmController = Game.getObjectById(rmControllerId);
    let ermControllerId = Memory.ermControllerId || "5bbcaf0c9099fc012e63a0be";
    let ermController = Game.getObjectById(ermControllerId);
    let e1 = Memory.extension1;
    let e2 = Memory.extension2;
    let e3 = Memory.extension3;
    let e4 = Memory.extension4;
    let e5 = Memory.extension5;
    let exts = Memory.spawnExts;
    let stor1 = Memory.stor1;

    let linkEntranceId = Memory.linkEntranceId || "5cfd3d207e979d09d3c5ad2c";
    let linkEntrance = Game.getObjectById(linkEntranceId);
    Memory.linkEntranceId = linkEntranceId;

    let linkExitId = Memory.linkExitId || "5cfd8274d7150267ad4571be";
    let linkExit = Game.getObjectById(linkExitId);
    Memory.linkExitId = linkExitId;

    Memory.spawnExts = [e1, e4];
    Memory.extension1 = "5cf733caf7020f7e680e392f";
    Memory.extension4 = "5cf714bb21281831d9ecd4c0";
    Memory.stor1 = "";

    Memory.rmControllerId = rmControllerId;
    Memory.ermControllerId = ermControllerId;

    Memory.store1 = "5d0178505a74ac0a0094daab";
    Memory.link1 = linkEntranceId;
    Memory.eAttackDurationSafeCheck = eAttackDurationSafeCheck;
    Memory.nAttackDurationSafeCheck = nAttackDurationSafeCheck;
    Memory.wAttackDurationSafeCheck = wAttackDurationSafeCheck;
    Memory.sAttackDurationSafeCheck = sAttackDurationSafeCheck;
    Memory.invaderId = invader ? invaderId : null;
    Memory.northHarvesters = northHarvesters;
    Memory.eastHarvesters = eastHarvesters;
    Memory.westHarvesters = westHarvesters;
    Memory.southHarvesters = southHarvesters;
    Memory.north = north;
    Memory.east = east;

    Memory.source1 = source1;
    Memory.source2 = source2;
    Memory.source1eRm = source1eRm.id;

    Memory.s1 = s1;

    Memory.tower1Id = tower1Id;
    Memory.tower2Id = tower2Id;
    Memory.tower3Id = tower3Id;
    Memory.etower1Id = etower1Id;

    Memory.enAvail = enAvail;
    Memory.enCap = enCap;
    Memory.numCrps = numCrps;
    Memory.enAvaileRm = enAvaileRm;
    Memory.enCapeRm = enCapeRm;

    Memory.rm = rm;
    Memory.nRm = nRm;
    Memory.wRm = wRm;
    Memory.eRm = eRm;
    Memory.s2 = s2.id;
    Memory.eespawn = eespawn.id;

    if (invader) {
      if (tower1) {
        tower1.attack(invader);
      }

      if (tower2) {
        tower2.attack(invader);
      }
    }

    checkForAttackers();

    if (numCrps < 4 && Object.keys(Memory.creeps).length >= 4) {
      Game.notify("Creeps are dying. " + numCrps + " left.");
    } else if (numCrps < 10 && Object.keys(Memory.creeps).length >= 10) {
      Game.notify("Less than 10 creeps left.");
    }

    for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("del.", name);
        if (name === "harvester1") {
          Memory.harvester1 = null;
        } else if (name === "transferer1") {
          Memory.transferer1 = null;
        } else if (name === "mover1") {
          Memory.mover1 = null;
        }
      }
    }
    crps = Game.creeps;
    numCrps = Object.keys(crps).length;

    if (Game.cpu.bucket > 400) {
      if (spawnHarvesterChain(enAvail, rm, s1, harvesters) != OK) {
        spawnCreepTypes(enAvail);
      }

      spawnToSource1Chain();

      spawnCreepTypeseRm(enAvaileRm);
      spawnCreepTypeseeRm(enAvaileeRm);
    }

    if (Game.cpu.bucket > 0) {
      runRoles();
      linkTran(linkEntrance, linkExit);
    }

    if (tower1) {
      roleTower.run(tower1);
    }
    if (tower2) {
      roleTower.run(tower2);
    }
    if (etower1) {
      roleTower.run(etower1);
    }

    if (!Memory.e35n31fixables || Memory.e35n31fixables.length < 4) {
      Memory.e35n31fixables = findDecayed("E35N31");
    }
    if (!Memory.e36n31fixables || Memory.e36n31fixables.length < 4) {
      Memory.e36n31fixables = findDecayed("E36N31");
    }
    if (!Memory.e36n32fixables || Memory.e36n32fixables.length < 4) {
      Memory.e36n32fixables = findDecayed("E36N32");
    }

    if (Game.time % 3600 == 0) {
      if (!Memory.rmProg) {
        Memory.rmProg = 0;
      }

      if (!Memory.ermProg) {
        Memory.ermProg = 0;
      }

      let rmLvl = rmController.level;
      let rmProg = rmController.progress;
      let rmProgTot = rmController.progressTotal;
      const ermLvl = ermController.level;
      const ermProg = ermController.progress;
      const ermProgTot = ermController.progressTotal;
      let rmProgRate = (rmProg - Memory.rmProg) / Memory.rmProg;
      let ermProgRate = (ermProg - Memory.ermProg) / Memory.ermProg;
      let rmProgPerc = rmProgRate * 100;
      let ermProgPerc = ermProgRate * 100;

      console.log("Creeps: " + numCrps);

      console.log(
        "S: " +
          rmLvl +
          ":" +
          rmProg / 1000 +
          "/" +
          rmProgTot / 1000 +
          " - " +
          rmProgPerc +
          "%"
      );
      console.log(
        "E: " +
          ermLvl +
          ":" +
          ermProg / 1000 +
          "/" +
          ermProgTot / 1000 +
          " - " +
          ermProgPerc +
          "%"
      );

      console.log("S:" + enAvail + "," + enCap);
      console.log("E:" + enAvaileRm + "," + enCapeRm);

      Game.notify(
        "S: " +
          rmLvl +
          ":" +
          rmProg / 1000 +
          "/" +
          rmProgTot / 1000 +
          "\n" +
          rmProgPerc +
          "%" +
          "\n" +
          "E: " +
          ermLvl +
          ":" +
          ermProg / 1000 +
          "/" +
          ermProgTot / 1000 +
          "\n" +
          ermProgPerc +
          "%" +
          "\n" +
          enAvail +
          "," +
          enCap +
          "\n" +
          enAvaileRm +
          "," +
          enCapeRm
      );

      Memory.rmProg = rmProg;
      Memory.ermProg = ermProg;
    }
  });

  // Profiler stats
  let pTime = Memory.profilerTime;
  let profilerDur = 15000;
  if (!pTime || Game.time - Memory.profilerTime > profilerDur * 1.1) {
    Memory.profilerTime = Game.time;
    Game.profiler.email(profilerDur);
  }
};
