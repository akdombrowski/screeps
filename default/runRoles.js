const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleRepairerN = require("role.repairerN");
const roleRepairerNW = require("role.repairerNW");
const roleRepairerNE = require("role.repairerNE");
const roleRepairerE = require("role.repairerE");
const roleHarvester = require("role.harvester.1");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const upControllerN = require("./action.upgradeControllerN");
const upControllerNW = require("./action.upgradeControllerNW");
const upControllerNE = require("./action.upgradeControllerNE");
const upControllerE = require("./action.upgradeControllerE");
const upControllerW = require("./action.upgradeControllerW");
const rezzyContr = require("./action.reserveContr");
const smartMove = require("./action.smartMove");
const deepSouthScout = require("./action.deepSouthScout");
const claimContr = require("./action.claimContr");
const roleHarvesterToTower = require("./role.harvester.ToTower");
const roleHarvesterToSouthTower = require("./role.harvester.SouthTower");
const roleHarvesterToTowerN = require("./role.harvester.towerN");
const roleHarvesterToTowerNE = require("./role.harvester.towerNE");
const roleHarvesterToTowerE = require("./role.harvester.towerE");
const roleHarvesterBuilder = require("./role.harvester.builder");
const roleHarvesterBuilderNE = require("./role.harvester.builderNE");
const claim = require("./action.claimIt");
const roleEEUp = require("./role.eeUpgradeController");
const roleEEWorker = require("./role.worker");
const roleAttackerN = require("./role.attackerN");
const roleAttackerNW = require("./role.attackerNW");
const roleAttackerNWW = require("./role.attackerNWW");
const roleAttackerNE = require("./role.attackerNE");
const claimE = require("./action.claimContrN");
const claimNE = require("./action.claimContrNE");
const claimN = require("./action.claimContrN");
const claimNW = require("./action.claimContrNW");
const claimNWW = require("./action.claimContrNWW");
const claimW = require("./action.claimContrW");
const buildNE = require("./action.buildNE");
const buildNW = require("./action.buildNW");
const buildEE = require("./action.buildEE");
const buildRoad = require("./action.buildRoad");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let workers = [];
  let upControllers = [];
  let roadRepairers = [];
  let roadBuilder = [];
  let attackers = [];
  let claimers = [];
  let linkGets = [];
  let towerHarvesters = [];

  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (!roll && name.startsWith("harv")) {
      creep.memory.role = "h";
      roll = "h";
    } else if (name.startsWith("upC")) {
      creep.memory.role = "upC";
      roll = "upC";
    } else if (name.startsWith("rB")) {
      creep.memory.role = "roadBuilder";
      roll = "roadBuilder";
    }

    if (roll === "h" || roll === "harvester") {
      creep.memory.getEnergy = true;
      harvesters.push(name);
      roleHarvester.run(creep);
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

        roleHarvester.run(creep);
      } else {
        buildRoad(creep);
      }
      roadBuilder.push(name);
    } else if (roll === "roadRepairer") {
      roleRepairer.run(creep);
      roadRepairers.push(name);
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

      upController(creep, Game.flags.e59s48contr, "E59S48");
    } else if (roll === "worker" || roll === "w") {
      workers.push(name);

      roleWorker.run(creep);
    } else if (roll === "healer") {
      hele(creep);
    } else if (roll === "controller") {
      roleController.run(creep);
    } else if (roll === "upgrader") {
      roleUpgrader.run(creep);
    } else if (roll === "roadRepairer" || roll === "r") {
      if (creep.name.charAt(creep.name.length - 1) % 2 === 0) {
        creep.memory.r = Memory.tower1Id;
      } else if (creep.name.charAt(creep.name.length - 1) % 3 === 0) {
        creep.memory.r = STRUCTURE_RAMPART;
      }
      roadRepairers.push(name);
      roleRepairer.run(creep);
    } else if (roll === "c" || name.startsWith("c")) {
      claimers.push(name);
      roll = "c";
      claim(creep, "E37N31", "", "", "", "5bbcaf1b9099fc012e63a2dd");
    } else if (roll === "a" || roll === "attacker" || name.startsWith("a")) {
      if (creep.memory.direction === "north") {
        attackers.push(name);
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
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.roadBuilder = roadBuilder;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
}

module.exports = runRoles;
