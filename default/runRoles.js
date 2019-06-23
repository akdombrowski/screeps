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

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let workers = [];
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
  let eastWorkers = [];
  let ermNeHarvesters = [];
  let ermHarvesters = [];

  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (!roll) {
      continue;
    }

    if (Game.cpu.getUsed() > Game.cpu.tickLimit - Game.cpu.tickLimit / 5) {
      return;
    }
    if (roll == "h" || roll == "harvester") {
      if (creep.memory.direction == "north") {
        northHarvesters.push(name);
      } else if (creep.memory.direction == "east") {
        if (creep.memory.sourceDir === "north") {
          ermNeHarvesters.push(name);
        } else if (creep.memory.sourceDir === "east") {
          ermHarvesters.push(name);
        } 
        eastHarvesters.push(name);
      } else if (creep.memory.direction == "west") {
        westHarvesters.push(name);
      } else {
        southHarvesters.push(name);
      }

      harvesters.push(name);
      roleHarvester.run(creep);
    } else if (roll.startsWith("linkGet")) {
      linkGets.push(name);
      roleLinkGet.run(creep);
    } else if (roll == "newharvester") {
      if (!creep.pos.isNearTo(source2)) {
        smartMove(creep, source2, 1);
      } else {
        creep.harvest(source2);
      }
    } else if (roll == "northRezzy") {
      rezzyContr(
        creep,
        "E35N32",
        Game.flags.northExit,
        TOP,
        "northEntrance1",
        "5bbcaefa9099fc012e639e8b"
      );
    } else if (roll == "eastRezzy") {
      eastUpControllers.push(name);

      claimContr(
        creep,
        "E36N31",
        Game.flags.eastExit,
        RIGHT,
        "eastEntrance1",
        "5bbcaf0c9099fc012e63a0be"
      );
    } else if (roll == "westRezzy") {
      rezzyContr(
        creep,
        "E34N31",
        Game.flags.westExit,
        LEFT,
        "westEntrance1",
        "5bbcaeeb9099fc012e639c4d"
      );
    } else if (roll == "deepSouthRezzy") {
      deepSouthScout(creep);
    } else if (roll == "uc") {
      upControllers.push(name);
      upController(creep);
    } else if (roll == "worker" || roll == "w") {
      if (creep.memory.direction === "east") {
        eastWorkers.push(name);
      } else {
        workers.push(name);
      }
      roleWorker.run(creep);
    } else if (roll == "healer") {
      hele(creep);
    } else if (roll == "controller") {
      roleController.run(creep);
    } else if (roll == "upgrader") {
      roleUpgrader.run(creep);
    } else if (roll == "roadRepairer" || roll == "r") {
      if (creep.name.charAt(creep.name.length - 1) % 2 == 0) {
        creep.memory.r = Memory.tower1Id;
      } else if (creep.name.charAt(creep.name.length - 1) % 3 == 0) {
        creep.memory.r = STRUCTURE_RAMPART;
      }
      roadRepairers.push(name);
      roleRepairer.run(creep);
    } else if (roll == "c" || name.startsWith("c")) {
      claimers.push(name);
      roll = "c";
      if (creep.memory.east) {
        if (creep.pos.isNearTo(Game.flags.eastExit)) {
          creep.move(RIGHT);
        } else if (creep.room.name == "E36N31") {
          if (creep.pos.isNearTo(Game.flags.eastController)) {
            creep.say(
              creep.reserveController(
                Game.getObjectById("5bbcaf0c9099fc012e63a0be")
              )
            );
          } else {
            smartMove(creep, Game.flags.eastController, 1);
          }
        } else {
          smartMove(creep, Game.flags.eastExit, 1);
        }
      } else {
        if (creep.pos.isNearTo(Game.flags.northExit)) {
          creep.move(RIGHT);
        } else if (creep.room.name == "E35N32") {
          if (creep.pos.isNearTo(Game.flags.northController)) {
            creep.say(
              creep.reserveController(
                Game.getObjectById("5bbcaefa9099fc012e639e8b")
              )
            );
          } else {
            creep.moveTo(creep, Game.flags.northController, 1);
          }
        } else {
          creep.moveTo(creep, Game.flags.northController, 1);
        }
      }
    } else if (roll == "a" || name.startsWith("a")) {
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
    }
  }

  Memory.harvesters = harvesters;
  Memory.workers = workers;
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
  Memory.eastWorkers = eastWorkers;
  Memory.ermNeHarvesters = ermNeHarvesters;
  Memory.ermHarvesters = ermHarvesters;
}

module.exports = runRoles;
