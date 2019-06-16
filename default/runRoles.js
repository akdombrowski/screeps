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
  let eastHarvesters = [];
  let southHarvesters = [];
  let westHarvesters = [];
  let linkGets = [];
  for (let name in crps) {
    let creep = crps[name];
    let roll = creep.memory.role;

    if (Game.cpu.getUsed() > Game.cpu.tickLimit - Game.cpu.tickLimit / 10) {
      return;
    }
    if (roll == "h" || roll == "harvester") {
      if (creep.memory.direction == "north") {
        northHarvesters.push(name);
      } else if (creep.memory.direction == "east") {
        creep.memory.buildSpawn = true;
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
    } else if (roll == "uc" || name.startsWith("uc")) {
      upControllers.push(name);
      upController(creep);
    } else if (roll == "worker" || roll == "w" || name.startsWith("w")) {
      if (name.charAt(name.length - 1) % 2 === 0) {
        // new tower2
        creep.memory.b = "5cfd459e7ce9da6cbae21ac1";
      } else {
        // contr link
        creep.memory.b = "5cfd1e2d6ccdc90ec20870cb";
      }
      workers.push(name);
      roleWorker.run(creep);
    } else if (roll == "healer" || name.startsWith("he")) {
      hele(creep);
    } else if (roll == "controller" || name.startsWith("co")) {
      roleController.run(creep);
    } else if (roll == "upgrader" || name.startsWith("up")) {
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
            creep.moveTo(Game.flags.eastController);
          }
        } else {
          creep.moveTo(Game.flags.eastExit);
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
            creep.moveTo(Game.flags.northController);
          }
        } else {
          creep.moveTo(Game.flags.northController);
        }
      }
    } else if (roll == "a" || name.startsWith("a")) {
      attackers.push(creep);
      if (creep.pos.isNearTo(invader)) {
        creep.attack(invader);
      } else if (invader) {
        creep.moveTo(invader, { range: 1 });
      } else {
        creep.moveTo(Game.spawns.Spawn1, { range: 1 });
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
  Memory.eastHarvesters = eastHarvesters;
  Memory.westHarvesters = westHarvesters;
  Memory.southHarvesters = southHarvesters;
  Memory.linkGets = linkGets;
}

module.exports = runRoles;
