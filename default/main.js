const checkForAttackers = require("./invasion.checkForAttackers");

const spawnHarvesterChain = require("./spawnHarvesterChain");

const getAttackEvents = require("./invasion.getAttackEvents");
const lookForInvaders = require("./lookForInvaders");
const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("role.harvester");
const roleTower = require("role.tower");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const chainMove = require("./chainMove");
const rezzyContr = require("./action.reserveContr");
const spawnToSource1Chain = require("./action.spawnToSource1Chain");
const smartMove = require("./action.smartMove");
const spawnCreepTypes = require("./spawn.spawnCreepTypes");
const runRoles = require("./runRoles");
const linkTran = require("./action.linkTran");

module.exports.loop = function() {
  let lastEnAvail = Memory.enAvail || 0;

  let s1 = Game.spawns.Spawn1;
  let rm = Game.rooms.E35N31;
  let nRm = Game.rooms.E35N32;
  let wRm = Game.rooms.E34N31;
  let eRm = Game.rooms.E36N31;

  let enAvail = rm.energyAvailable;
  let enCap = rm.energyCapacityAvailable;

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

  let tower1Id = Memory.tower1Id || "5cf3b09b75f7e26764ee4276";
  let tower2Id = Memory.tower2Id || "5cfd5e7adee9d942d5155ed6";
  let tower1 = Game.getObjectById(tower1Id);
  let tower2 = Game.getObjectById(tower2Id);

  let rmControllerId = Memory.rmControllerId || "5bbcaefa9099fc012e639e90";
  let rmController = Game.getObjectById(rmControllerId);
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

  Memory.store1 = "5cebff7d396a7f7297d784b1";
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

  Memory.s1 = s1;

  Memory.tower1Id = tower1Id;
  Memory.tower2Id = tower2Id;

  Memory.enAvail = enAvail;
  Memory.enCap = enCap;
  Memory.numCrps = numCrps;

  Memory.rm = rm;
  Memory.nRm = nRm;
  Memory.wRm = wRm;
  Memory.eRm = eRm;

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
    Game.notify("Creeps are dying.");
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

  spawnHarvesterChain(enAvail, rm, s1, harvesters);

  spawnToSource1Chain();

  spawnCreepTypes(
    enAvail,
    southHarvesters,
    workers,
    upControllers,
    eastHarvesters,
    eAttackDurationSafeCheck,
    northHarvesters,
    nAttackDurationSafeCheck,
    westHarvesters,
    wAttackDurationSafeCheck,
    roadRepairers,
    numCrps,
    s1,
    harvesters
  );

  crps = Game.creeps;
  numCrps = Object.keys(crps).length;

  harvesters = [];
  workers = [];
  upControllers = [];
  roadRepairers = [];
  attackers = [];
  claimers = [];
  northHarvesters = [];
  eastHarvesters = [];
  southHarvesters = [];
  westHarvesters = [];
  linkGets = [];

  runRoles();

  if (tower1) {
    roleTower.run(tower1);
  }
  if (tower2) {
    roleTower.run(tower2);
  }

  linkTran(linkEntrance, linkExit);

  if (Game.time % 10 == 0) {
    console.log("Creeps:" + numCrps);
    console.log(
      rmController.level +
        ":" +
        rmController.progress / 1000 +
        "/" +
        rmController.progressTotal / 1000
    );
    console.log(enAvail + "," + enCap);
  }
};
module.exports.spawnCreepTypes = spawnCreepTypes;
