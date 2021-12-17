const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("role.harvester.1");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const smartMove = require("./action.smartMove");
const deepSouthScout = require("./action.deepSouthScout");
const claimContr = require("./action.claimContr");
const roleHarvesterToTower = require("./role.harvester.ToTower");
const claim = require("./action.claimIt");
const roleAttackerN = require("./role.attackerN");
const roleAttackerNW = require("./role.attackerNW");
const roleAttackerNWW = require("./role.attackerNWW");
const roleAttackerNE = require("./role.attackerNE");
const buildRoad = require("./action.buildRoad");
const roleReserver = require("./role.reserver");
const profiler = require("./screeps-profiler");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let harvestersE59S47 = [];
  let workers = [];
  let upControllers = [];
  let upControllersE59S47 = [];
  let roadRepairers = [];
  let roadRepairersE59S47 = [];
  let roadBuilders = [];
  let attackers = [];
  let attackersE59S47 = [];
  let claimers = [];
  let linkGets = [];
  let towerHarvesters = [];
  let reservers = [];

  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (creep.spawning) {
      continue;
    }

    if (roll === "h" || roll === "harvester" || roll.startsWith("h")) {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
        creep.memory.getEnergy = true;
      }

      if (creep.memory.direction.startsWith("s")) {
        harvesters.push(name);
      } else if (creep.memory.direction.startsWith("n")) {
        harvestersE59S47.push(name);
      } else {
        harvesters.push(name);
      }

      roleHarvester(creep);
    } else if (roll === "hN" || roll === "harvesterN") {
      if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
        creep.memory.getEnergy = true;
      }

      harvestersE59S47.push(name);
      roleHarvester(creep);
    } else if (roll === "reserver") {
      reservers.push(name);
      roleReserver(
        creep,
        Memory.northRoomName,
        Game.flags.northExit,
        TOP,
        Game.flags.northController,
        "59bbc5d22052a716c3cea133"
      );
    } else if (roll && roll.startsWith("towerHarvester")) {
      towerHarvesters.push(name);
      roleHarvesterToTower.run(creep);
    } else if (roll && roll.startsWith("linkGet")) {
      linkGets.push(name);
      roleLinkGet.run(creep);
    } else if (roll === "newharvester") {
      if (!creep.pos.isNearTo(source2)) {
        smartMove(creep, source2, 1);
      } else {
        creep.harvest(source2);
      }
    } else if (roll === "roadBuilder") {
      if (creep.memory.getEnergy || creep.store[RESOURCE_ENERGY] <= 0) {
        creep.memory.getEnergy = true;

        roleHarvester(creep);
      } else {
        buildRoad(creep);
      }
      roadBuilders.push(name);
    } else if (roll === "roadRepairer") {
      if (creep.memory.direction.startsWith("s")) {
        roadRepairers.push(name);
        roleRepairer(creep, Memory.homeRoomName, null, null);
      } else if (creep.memory.direction.startsWith("n")) {
        roadRepairersE59S47.push(name);
        roleRepairer(creep, Memory.northRoomName, Game.flags.northExit, TOP);
      } else {
        roadRepairers.push(name);
        roleRepairer(creep, Memory.homeRoomName, null, null);
      }
    } else if (
      roll === "uc" ||
      roll === "upController" ||
      roll === "upc" ||
      roll === "upC"
    ) {
      if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
        creep.memory.up = true;
      }
      upControllers.push(name);

      upController(
        creep,
        Game.flags.e59s48controller,
        Memory.homeRoomName,
        null,
        null,
        "59bbc5d22052a716c3cea137"
      );
    } else if (
      roll === "ucN" ||
      roll === "upControllerN" ||
      roll === "upcN" ||
      roll === "upCN"
    ) {
      if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
        creep.memory.up = true;
      }
      upControllersE59S47.push(name);

      if (creep.memory.direction === "north") {
        creep.memory.controllerID = "59bbc5d22052a716c3cea133";
        upController(
          creep,
          Game.flags.northController,
          Memory.northRoomName,
          Game.flags.northExit,
          TOP,
          "59bbc5d22052a716c3cea133"
        );
      } else {
        creep.memory.controllerID = "59bbc5d22052a716c3cea133";
        upController(
          creep,
          Game.flags.northController,
          Memory.northRoomName,
          Game.flags.northExit,
          TOP,
          "59bbc5d22052a716c3cea133"
        );
      }
    } else if (roll === "worker" || roll === "w") {
      workers.push(name);

      roleWorker(creep);
    } else if (roll === "healer") {
      hele(creep);
    } else if (roll === "controller") {
      roleController.run(creep);
    } else if (roll === "upgrader") {
      roleUpgrader.run(creep);
    } else if (roll === "c" || roll === "claimer") {
      claimers.push(name);
      roll = "c";
      claim(
        creep,
        Memory.northRoomName,
        Game.flags.northExit,
        TOP,
        "",
        "59bbc5d22052a716c3cea133"
      );
    } else if (roll === "a" || roll === "attacker" || name.startsWith("a")) {
      if (creep.memory.direction === "north") {
        attackersE59S47.push(name);
        roleAttackerN.run(creep);
      } else if (creep.memory.direction === "ne") {
        eattackers.push(name);
        roleAttackerNE.run(creep);
      } else if (creep.memory.direction === "nw") {
        attackersNW.push(name);
        roleAttackerNW.run(creep);
      } else if (creep.memory.direction === "nww") {
        attackersNWW.push(name);
        roleAttackerNWW.run(creep);
      } else {
        let invader = Game.getObjectById(Memory.invaderId);
        attackers.push(name);
        if (creep.pos.isNearTo(invader)) {
          creep.attack(invader);
        } else if (invader) {
          creep.moveTo(invader, { range: 1 });
        } else {
          smartMove(creep, Game.spawns.Spawn1, 1);
          if (Game.spawns.Spawn1.pos.isNearTo(creep)) {
            Game.spawns.Spawn1.recycleCreep(creep);
          }
        }
      }
    } else if (roll == "hChain") {
    } else if (roll == "transferer") {
    } else if (roll == "mover") {
    } else {
      creep.memory.role = "h";
    }
  }

  Memory.harvesters = harvesters;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadBuilders = roadBuilders;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.claimers = claimers;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
}

runRoles = profiler.registerFN(runRoles, "runRoles");
module.exports = runRoles;
