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

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let harvestersS = [];
  let harvestersN = [];
  let harvestersNW = [];
  let harvestersNWW = [];
  let harvestersNE = [];
  let workers = [];
  let neworkers = [];
  let nworkers = [];
  let nwworkers = [];
  let eworkers = [];
  let eeastWorkers = [];
  let eeworkers = [];
  let upControllers = [];
  let upControllersN = [];
  let upControllersNW = [];
  let upControllersW = [];
  let upControllersNE = [];
  let upControllersE = [];
  let eeastUpControllers = [];
  let roadRepairers = [];
  let roadRepairersN = [];
  let roadRepairersNW = [];
  let roadRepairersNE = [];
  let erepairers = [];
  let attackers = [];
  let attackersNW = [];
  let attackersNWW = [];
  let eattackers = [];
  let claimers = [];
  let claimersN = [];
  let claimersNW = [];
  let claimersNWW = [];
  let claimersW = [];
  let claimersNE = [];
  let southHarvesters = [];
  let westHarvesters = [];
  let linkGets = [];
  let eastHarvesters = [];
  let ermHarvesters = [];
  let eeRmHarvesters = [];
  let etowerHarvesters = [];
  let southtowerHarvesters = [];
  let towerHarvestersN = [];
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
      if (
        creep.memory.direction === "north" ||
        name.endsWith("N") ||
        creep.memory.direction === "n"
      ) {
        creep.memory.direction = "north";
        harvestersN.push(name);
      } else if (
        creep.memory.direction === "east" ||
        creep.memory.direction === "e"
      ) {
        if (creep.memory.sourceDir === "north1") {
          harvestersNE.push(name);
        } else if (creep.memory.sourceDir === "north2") {
          harvestersNE.push(name);
        } else if (creep.memory.sourceDir === "east") {
          ermHarvesters.push(name);
        } else if (creep.memory.sourceDir === "east2") {
          ermHarvesters.push(name);
        }
        ermHarvesters.push(name);

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
      } else if (creep.memory.direction === "ne" || name.endsWith("NE")) {
        creep.memory.direction = "ne";
        harvestersNE.push(name);
      } else if (creep.memory.direction === "nw" || name.endsWith("NW")) {
        creep.memory.direction = "nw";
        harvestersNW.push(name);
      } else if (creep.memory.direction === "nww" || name.endsWith("NWW")) {
        creep.memory.direction = "nww";
        harvestersNWW.push(name);
      } else {
        harvestersS.push(name);
      }

      harvesters.push(name);
      roleHarvester.run(creep);
    } else if (roll.startsWith("etowerHarvester")) {
      etowerHarvesters.push(name);
      roleHarvesterToTower.run(creep);
    } else if (roll.startsWith("southtowerHarvester")) {
      harvesters.push(name);
      southtowerHarvesters.push(name);
      roleHarvesterToSouthTower.run(creep);
    } else if (roll.startsWith("ntowerHarvester")) {
      towerHarvestersN.push(name);
      roleHarvesterToTowerN.run(creep);
    } else if (roll.startsWith("linkGet")) {
      linkGets.push(name);
      roleLinkGet.run(creep);
    } else if (roll === "newharvester") {
      if (!creep.pos.isNearTo(source2)) {
        smartMove(creep, source2, 1);
      } else {
        creep.harvest(source2);
      }
    } else if (roll === "eeRezzy" || roll === "upCEE") {
      eeastUpControllers.push(name);
      roleEEUp(creep, "E37N31");
    } else if (roll === "eeworker") {
      eeworkers.push(name);
      buildEE(creep, Game.flags.eeController, "E37N31");
    } else if (roll === "claimNE") {
      claimersNE.push(name);
      claimNE(
        creep,
        "E36N32",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0b9"
      );
    } else if (roll === "claimN") {
      claimersN.push(name);
      claimN(
        creep,
        "E35N32",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0b9"
      );
    } else if (roll === "claimNW") {
      claimersNW.push(name);
      claimNW(
        creep,
        "E34N32",
        Game.flags.eastExit,
        LEFT,
        "eastEntrance1",
        "5bbcaeeb9099fc012e639c4a"
      );
    } else if (roll === "claimW") {
      claimersW.push(name);
      claimW(
        creep,
        "E34N31",
        Game.flags.westExit,
        LEFT,
        "westExit",
        "5bbcaeeb9099fc012e639c4d"
      );
    } else if (roll === "claimNWW") {
      claimersNWW.push(name);
      claimNWW(
        creep,
        "E33N32",
        Game.flags.nww,
        LEFT,
        "nww",
        "5bbcaedb9099fc012e639a93"
      );
    } else if (roll === "northRezzy") {
      rezzyContr(
        creep,
        "E35N32",
        Game.flags.northExit,
        TOP,
        "northEntrance1",
        "5bbcaefa9099fc012e639e8b"
      );
    } else if (roll === "eRezzy" || roll === "upCE") {
      upControllersE.push(name);

      upControllerE(creep, Game.flags.eastController, "E36N31");
    } else if (roll === "westRezzy") {
      rezzyContr(
        creep,
        "E34N31",
        Game.flags.westExit,
        LEFT,
        "westEntrance1",
        "5bbcaeeb9099fc012e639c4d"
      );
    } else if (roll === "upCN") {
      upControllersN.push(name);

      upControllerN(creep, Game.flags.e36n32contr, "E35N32");
    } else if (roll === "upCNE") {
      upControllersNE.push(name);

      upControllerNE(creep, Game.flags.e36n32contr, "E36N32");
    } else if (roll === "upCW") {
      upControllersW.push(name);

      upControllerW(creep, Game.flags.west, "E34N31");
    } else if (roll === "upCNW") {
      upControllersNW.push(name);

      upControllerNW(creep, Game.flags.nw, "E34N32");
    } else if (roll === "eeUp") {
      eeastUpControllers.push(name);
      roleEEUp(creep, "E37N31");
    } else if (roll === "deepSouthRezzy") {
      deepSouthScout(creep);
    } else if (
      roll === "uc" ||
      roll === "upController" ||
      roll === "upc" ||
      roll === "upC"
    ) {
      upControllers.push(name);
      upController(creep);
    } else if (roll === "worker" || roll === "w") {
      if (creep.memory.direction === "east") {
        eworkers.push(name);
      } else {
        workers.push(name);
      }
      roleWorker.run(creep);
    } else if (roll === "nwBuilder" || roll === "nwworker") {
      nwworkers.push(name);

      creep.memory.buildRoom = "E34N32";

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
    } else if (roll === "neBuilder" || roll === "neworker") {
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
    } else if (roll === "roadRepairerN" || roll === "rN") {
      roadRepairersN.push(name);
      roleRepairerN.run(creep);
    } else if (roll === "roadRepairerNE" || roll === "rNE") {
      roadRepairersNE.push(name);
      roleRepairerNE.run(creep);
    } else if (roll === "roadRepairerE" || roll === "rE") {
      erepairers.push(name);
      roleRepairerE.run(creep);
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
  Memory.harvestersS = harvestersS;
  Memory.harvestersN = harvestersN;
  Memory.harvestersNW = harvestersNW;
  Memory.harvestersNWW = harvestersNWW;
  Memory.harvestersNE = harvestersNE;
  Memory.workers = workers;
  Memory.eworkers = eworkers;
  Memory.eeastWorkers = eeastWorkers;
  Memory.eeworkers = eeworkers;
  Memory.neworkers = neworkers;
  Memory.nwworkers = nwworkers;
  Memory.nworkers = nworkers;
  Memory.upControllers = upControllers;
  Memory.upControllersN = upControllersN;
  Memory.upControllersNW = upControllersNW;
  Memory.upControllersW = upControllersW;
  Memory.upControllersNE = upControllersNE;
  Memory.upControllersE = upControllersE;
  Memory.eeastUpControllers = eeastUpControllers;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersN = roadRepairersN;
  Memory.roadRepairersNW = roadRepairersNW;
  Memory.roadRepairersNE = roadRepairersNE;
  Memory.erepairers = erepairers;
  Memory.attackers = attackers;
  Memory.attackersNW = attackersNW;
  Memory.attackersNWW = attackersNWW;
  Memory.eattackers = eattackers;
  Memory.claimers = claimers;
  Memory.claimersN = claimersN;
  Memory.claimersNW = claimersNW;
  Memory.claimersNWW = claimersNWW;
  Memory.claimersW = claimersW;
  Memory.claimersNe = claimersNE;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;
  Memory.eastHarvesters = eastHarvesters;
  Memory.ermHarvesters = ermHarvesters;
  Memory.eeRmHarvesters = eeRmHarvesters;
  Memory.etowerHarvesters = etowerHarvesters;
  Memory.southtowerHarvesters = southtowerHarvesters;
  Memory.towerHarvestersN = towerHarvestersN;
}

module.exports = runRoles;
