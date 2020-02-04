const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("role.harvester.1");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const rezzyContr = require("./action.reserveContr");
const smartMove = require("./action.smartMove");
const deepSouthScout = require("./action.deepSouthScout");
const claimContr = require("./action.claimContr");
const roleHarvesterToTower = require("./role.harvester.ToTower");
const roleHarvesterToSouthTower = require("./role.harvester.SouthTower");
const roleHarvesterBuilder = require("./role.harvester.builder");
const claim = require("./action.claimIt");
const roleEEUp = require("./role.eeUpgradeController");
const roleEEWorker = require("./role.worker");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let workers = [];
  let neworkers = [];
  let eworkers = [];
  let upControllers = [];
  let roadRepairers = [];
  let attackers = [];
  let claimers = [];
  let northHarvesters = [];
  let southHarvesters = [];
  let westHarvesters = [];
  let linkGets = [];
  let eastHarvesters = [];
  let eastUpControllers = [];
  let eeastUpControllers = [];
  let eastWorkers = [];
  let ermNeHarvesters = [];
  let ermHarvesters = [];
  let eeRmHarvesters = [];
  let etowerHarvesters = [];
  let southtowerHarvesters = [];
  let eeUps = [];
  let eeworkers = [];
  Memory.nesource1Creeps = [];
  Memory.nesource2Creeps = [];

  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (!roll) {
      continue;
    }

    if (Game.cpu.getUsed() > Game.cpu.tickLimit / 20) {
      // console.log("cpu needs a breather: " + Game.cpu.getUsed() + "/" + Game.cpu.tickLimit);
      return;
    }

    if (roll === "h" || roll === "harvester") {
      if (creep.memory.direction === "north" || name.endsWith("N")) {
        creep.memory.direction = "north";
        northHarvesters.push(name);
      } else if (creep.memory.direction === "east" && !name.endsWith("EE")) {
        if (creep.memory.sourceDir === "north1") {
          ermNeHarvesters.push(name);
        } else if (creep.memory.sourceDir === "north2") {
          ermNeHarvesters.push(name);
        } else if (creep.memory.sourceDir === "east") {
          ermHarvesters.push(name);
        } else if (creep.memory.sourceDir === "east2") {
          ermHarvesters.push(name);
        }

        if (creep.memory.nesourceNumber === 1) {
          Memory.nesource1Creeps.push(name);
        } else if (creep.memory.nesourceNumber === 2) {
          Memory.nesource2Creeps.push(name);
        }
        eastHarvesters.push(name);
      } else if (creep.memory.direction === "west") {
        westHarvesters.push(name);
      } else if (creep.memory.direction === "eeast" || name.endsWith("EE")) {
        creep.memory.direction = "eeast";
        eeRmHarvesters.push(name);
      } else {
        southHarvesters.push(name);
      }

      harvesters.push(name);
      roleHarvester.run(creep);
    } else if (roll.startsWith("etowerHarvester")) {
      harvesters.push(name);
      etowerHarvesters.push(name);
      roleHarvesterToTower.run(creep);
    } else if (roll.startsWith("southtowerHarvester")) {
      harvesters.push(name);
      southtowerHarvesters.push(name);
      roleHarvesterToSouthTower.run(creep);
    } else if (roll.startsWith("linkGet")) {
      linkGets.push(name);
      roleLinkGet.run(creep);
    } else if (roll === "newharvester") {
      if (!creep.pos.isNearTo(source2)) {
        smartMove(creep, source2, 1);
      } else {
        creep.harvest(source2);
      }
    } else if (roll === "eeUp") {
      eeastUpControllers.push(name);
      roleEEUp(creep, "E37N31");
    } else if (roll === "eeRezzy") {
      eeastUpControllers.push(name);
      roleEEUp(creep, "E37N31");
    } else if (roll === "eeworker") {
      eeworkers.push(name);
      roleHarvesterBuilder.run(creep);
    } else if (roll === "northRezzy") {
      rezzyContr(
        creep,
        "E35N32",
        Game.flags.northExit,
        TOP,
        "northEntrance1",
        "5bbcaefa9099fc012e639e8b"
      );
    } else if (roll === "eRezzy") {
      eastUpControllers.push(name);

      claimContr(
        creep,
        "E36N31",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0be"
      );
    } else if (roll === "westRezzy") {
      rezzyContr(
        creep,
        "E34N31",
        Game.flags.westExit,
        LEFT,
        "westEntrance1",
        "5bbcaeeb9099fc012e639c4d"
      );
    } else if (roll === "deepSouthRezzy") {
      deepSouthScout(creep);
    } else if (roll === "uc" || roll === "upController") {
      upControllers.push(name);
      upController(creep);
    } else if (roll === "worker" || roll === "w") {
      if (creep.memory.direction === "east") {
        eastWorkers.push(name);
      } else {
        workers.push(name);
      }
      roleWorker.run(creep);
    } else if (roll === "eBuilder" || roll === "eworker") {
      eworkers.push(name);

      creep.memory.buildRoom = "E36N31";

      roleHarvesterBuilder.run(creep);
    } else if (roll === "eeBuilder" || roll === "eeworker") {
      eeworkers.push(name);

      creep.memory.buildRoom = "E37N31";

      roleHarvesterBuilder.run(creep);
    } else if (roll === "neBuilder") {
      neworkers.push(name);
      creep.memory.buildRoom = "E36N32";
      roleHarvesterBuilder.run(creep);
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
    } else if (roll === "a" || name.startsWith("a")) {
      attackers.push(creep);
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
    } else if (roll == "hChain") {
    } else if (roll == "transferer") {
    } else if (roll == "mover") {
    } else {
      creep.memory.role = "h";
    }
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
  Memory.eworkers = eworkers;
  Memory.neworkers = neworkers;
  Memory.upControllers = upControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.northHarvesters = northHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;
  Memory.eastHarvesters = eastHarvesters;
  Memory.eastUpControllers = eastUpControllers;
  Memory.eeastUpControllers = eeastUpControllers;
  Memory.eastWorkers = eastWorkers;
  Memory.ermNeHarvesters = ermNeHarvesters;
  Memory.ermHarvesters = ermHarvesters;
  Memory.eeRmHarvesters = eeRmHarvesters;
  Memory.etowerHarvesters = etowerHarvesters;
  Memory.southtowerHarvesters = southtowerHarvesters;
  Memory.eeUps = eeUps;
  Memory.eeworkers = eeworkers;
}

module.exports = runRoles;
