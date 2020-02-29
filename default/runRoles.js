const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("role.harvester.1");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const upControllerN = require("./action.upgradeControllerN");
const upControllerNE = require("./action.upgradeControllerNE");
const rezzyContr = require("./action.reserveContr");
const smartMove = require("./action.smartMove");
const deepSouthScout = require("./action.deepSouthScout");
const claimContr = require("./action.claimContr");
const roleHarvesterToTower = require("./role.harvester.ToTower");
const roleHarvesterToSouthTower = require("./role.harvester.SouthTower");
const roleHarvesterBuilder = require("./role.harvester.builder");
const roleHarvesterBuilderNE = require("./role.harvester.builderNE");
const claim = require("./action.claimIt");
const roleEEUp = require("./role.eeUpgradeController");
const roleEEWorker = require("./role.worker");
const roleAttackerN = require("./role.attackerN");
const roleAttackerNE = require("./role.attackerNE");
const claimNE = require("./action.claimContrNE");
const claimN = require("./action.claimContrN");
const buildNE = require("./action.buildNE");
const buildEE = require("./action.buildEE");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let workers = [];
  let neworkers = [];
  let nworkers = [];
  let eworkers = [];
  let eeworkers = [];
  let upControllers = [];
  let upControllersN = [];
  let upControllersNE = [];
  let roadRepairers = [];
  let attackers = [];
  let eattackers = [];
  let claimers = [];
  let claimersN = [];
  let claimersNE = [];
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
  Memory.nesource1Creeps = [];
  Memory.nesource2Creeps = [];

  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    // console.log(name + " here2 " + roll);
    if (!roll) {
      continue;
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
      buildEE(creep, Game.flags.eeController, "E37N31");
    } else if (roll === "claimNE") {
      claimNE(
        creep,
        "E36N32",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0b9"
      );
    } else if (roll === "upCNE") {
      upControllersNE.push(name);

      upControllerNE(creep, Game.flags.e36n32contr, "E36N32");
    } else if (roll === "claimN") {
      claimN(
        creep,
        "E35N32",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0b9"
      );
    } else if (roll === "upCN") {
      upControllersN.push(name);

      upControllerN(creep, Game.flags.e36n32contr, "E35N32");
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
    } else if (roll === "nBuilder" || roll === "nworker") {
      nworkers.push(name);

      creep.memory.buildRoom = "E35N32";

      roleWorker.run(creep);
    } else if (roll === "eBuilder" || roll === "eworker") {
      eworkers.push(name);

      creep.memory.buildRoom = "E36N31";

      roleWorker.run(creep);
    } else if (roll === "eeBuilder" || roll === "eeworker") {
      eeworkers.push(name);

      creep.memory.buildRoom = "E37N31";

      roleWorker.run(creep);
    } else if (roll === "neBuilder") {
      neworkers.push(name);
      creep.memory.buildRoom = "E36N32";
      roleWorker.run(creep, Game.flags.neSource1, "E36N32");
    } else if (roll === "eeBuilder") {
      eeworkers.push(name);
      creep.memory.buildRoom = "E37N31";
      roleWorker.run(creep, Game.flags.eeController, "E37N31");
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
  Memory.eworkers = eworkers;
  Memory.eeworkers = eeworkers;
  Memory.neworkers = neworkers;
  Memory.nworkers = nworkers;
  Memory.upControllers = upControllers;
  Memory.upControllersN = upControllersN;
  Memory.upControllersNE = upControllersNE;
  Memory.roadRepairers = roadRepairers;
  Memory.attackers = attackers;
  Memory.eattackers = eattackers;
  Memory.claimers = claimers;
  Memory.claimersNe = claimersN;
  Memory.claimersNe = claimersNE;
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
}

module.exports = runRoles;
