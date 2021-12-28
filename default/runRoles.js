const roleController = require("role.controller");
const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("./role.harvester");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const smartMove = require("./move.smartMove");
const deepSouthScout = require("./action.deepSouthScout");
const claimContr = require("./action.claimContr");
const roleHarvesterToTower = require("./role.harvester.ToTower");
const claim = require("./action.claimIt");
const roleAttackerN = require("./role.attackerN");
const roleAttackerdS = require("./role.attackerdS");
const roleAttackerNW = require("./role.attackerNW");
const roleAttackerNWW = require("./role.attackerNWW");
const roleAttackerNE = require("./role.attackerNE");
const buildRoad = require("./action.buildRoad");
const roleReserver = require("./role.reserver");
const profiler = require("./screeps-profiler");
const roleViewer = require("./role.viewer");
const roleRangedAttacker = require("./role.rangedAttacker");
const roleRangedAttackerdS = require("./role.rangedAttackerdS");
const flee = require("./move.flee");

function setCreepRoomArrayAndAvoidInvaders(
  creep,
  creepsE59S48,
  creepsE59S49,
  creepsE59S47
) {
  const roll = creep.memory.role;
  const direction = creep.memory.direction;
  let retval = -16;
  let shouldContinueToNextCreep = false;

  if (direction === "south") {
    creepsE59S48.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S48);

    if (invader) {
      if (roll != "rangedAttacker" && creep.pos.inRangeTo(invader, 5)) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "deepSouth") {
    creepsE59S49.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S49);

    if (invader) {
      if (roll != "rangedAttacker" && creep.pos.inRangeTo(invader, 5)) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "north") {
    creepsE59S47.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S47);

    if (invader) {
      if (roll != "rangedAttacker" && creep.pos.inRangeTo(invader, 5)) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  }
  return {
    retval: retval,
    shouldContinueToNextCreep: shouldContinueToNextCreep,
    creepsE59S48: creepsE59S48,
    creepsE59S49: creepsE59S49,
    creepsE59S47: creepsE59S47,
  };
}
setCreepRoomArrayAndAvoidInvaders = profiler.registerFN(
  setCreepRoomArrayAndAvoidInvaders,
  "setCreepRoomArrayAndAvoidInvaders"
);

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let harvestersE59S47 = [];
  let harvestersE59S49 = [];
  let harvestersE58S49 = [];
  let workers = [];
  let upControllers = [];
  let upControllersE59S47 = [];
  let upControllersE59S49 = [];
  let upControllersE58S49 = [];
  let roadRepairers = [];
  let roadRepairersE59S47 = [];
  let roadRepairersE59S49 = [];
  let roadRepairersE58S49 = [];
  let roadBuilders = [];
  let rangedAttackers = [];
  let rangedAttackersE59S47 = [];
  let rangedAttackersE59S49 = [];
  let attackers = [];
  let attackersE59S47 = [];
  let attackersE59S49 = [];
  let claimers = [];
  let claimersE58S49 = [];
  let linkGets = [];
  let towerHarvesters = [];
  let reservers = [];
  let viewers = [];
  let viewersE59S47 = [];
  let viewersE59S49 = [];
  let creepsE59S48 = [];
  let creepsE59S49 = [];
  let creepsE59S47 = [];
  let e59s48extensions = Memory.e59s48extensions;
  let e59s47extensions = Memory.e59s47extensions;
  let e59s49extensions = Memory.e59s49extensions;
  let e58s49extensions = Memory.e58s49extensions;
  let e59s48spawns = Memory.e59s48spawns;
  let e59s47spawns = Memory.e59s47spawns;
  let e59s49spawns = Memory.e59s49spawns;
  let e58s49spawns = Memory.e58s49spawns;
  let retval = -16;

  for (let name in crps) {
    if (Game.cpu.getUsed() >= Game.cpu.tickLimit / 10 * 9) {
      return;
    }
    let creep = crps[name];
    let roll = creep.memory.role;
    let ret = -16;
    let shouldContinueToNextCreep = false;

    if (creep.spawning) {
      continue;
    }

    ({
      retval,
      shouldContinueToNextCreep,
      creepsE59S48,
      creepsE59S49,
      creepsE59S47,
    } = setCreepRoomArrayAndAvoidInvaders(
      creep,
      creepsE59S48,
      creepsE59S49,
      creepsE59S47
    ));

    if (roll) {
      if (roll === "h" || roll === "harvester") {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
          creep.memory.getEnergy = true;
        }

        if (creep.memory.direction === "south") {
          harvesters.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(creep, e59s48extensions, e59s48spawns);
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "north") {
          harvestersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(creep, e59s47extensions, e59s47spawns);
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "deepSouth") {
          harvestersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(creep, e59s49extensions, e59s49spawns);
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "e58s49") {
          harvestersE58S49.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(creep, e58s49extensions, e58s49spawns);
            retval = ret.retval;
          }
        } else {
          creep.memory.direction = "south";
          harvesters.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(creep, e59s48extensions, e59s48spawns);
            retval = ret.retval;
          }
        }
      } else if (roll === "reserver") {
        reservers.push(name);
        if (!shouldContinueToNextCreep) {
          roleReserver(
            creep,
            Memory.northRoomName,
            Game.flags.northExit,
            TOP,
            Game.flags.northController,
            "59bbc5d22052a716c3cea133"
          );
        }
      } else if (roll && roll.startsWith("linkGet")) {
        linkGets.push(name);
        if (!shouldContinueToNextCreep) {
          roleLinkGet.run(creep);
        }
      } else if (roll === "roadRepairer") {
        if (creep.memory.direction.startsWith("s")) {
          roadRepairers.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(creep, Memory.homeRoomName, null, null);
          }
        } else if (creep.memory.direction.startsWith("n")) {
          roadRepairersE59S47.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              Memory.northRoomName,
              Game.flags.northExit,
              TOP
            );
          }
        } else if (creep.memory.direction.startsWith("deepSouth")) {
          roadRepairersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              Memory.deepSouthRoomName,
              Game.flags.southExit,
              BOTTOM
            );
          }
        } else if (creep.memory.direction === "e58s49") {
          roadRepairersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
          }
          roleRepairer(
            creep,
            Memory.e58s49RoomName,
            Game.flags.e58s49Exit,
            LEFT
          );
        } else {
          roadRepairers.push(name);
          if (!shouldContinueToNextCreep) {
            roleRepairer(creep, Memory.homeRoomName, null, null);
          }
        }
      } else if (roll === "viewer") {
        if (creep.memory.direction.startsWith("s")) {
          viewersE59S48.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP);
          }
        } else if (creep.memory.direction.startsWith("n")) {
          viewersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP);
          }
        } else if (creep.memory.direction.startsWith("deepSouth")) {
          viewersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP);
          }
        } else {
          viewersE59S48.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP);
          }
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
        if (creep.memory.direction === "south") {
          upControllers.push(name);
        } else if (creep.memory.direction === "deepSouth") {
          upControllersE59S49.push(name);
        } else if (creep.memory.direction === "north") {
          upControllersE59S47.push(name);
        } else {
          creep.memory.direction = "south";

          upControllers.push(name);
        }

        if (!shouldContinueToNextCreep) {
          upController(
            creep,
            Game.flags.e59s48controller,
            Memory.homeRoomName,
            null,
            null,
            "59bbc5d22052a716c3cea137"
          );
        }
      } else if (
        roll === "ucN" ||
        roll === "upControllerN" ||
        roll === "upcN" ||
        roll === "upCN"
      ) {
        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
          creep.memory.up = true;
        }

        if (creep.memory.direction === "north") {
          upControllersE59S47.push(name);
          creep.memory.controllerID = "59bbc5d22052a716c3cea133";

          if (!shouldContinueToNextCreep) {
            upController(
              creep,
              Game.flags.northController,
              Memory.northRoomName,
              Game.flags.northExit,
              TOP,
              "59bbc5d22052a716c3cea133"
            );
          }
        } else if (creep.memory.direction === "e58s49") {
          creep.memory.controllerID = "59bbc5c12052a716c3ce9faa";

          if (!shouldContinueToNextCreep) {
            upController(
              creep,
              Game.flags.e58s49Controller,
              Memory.e58s49RoomName,
              Game.flags.e58s49Exit,
              LEFT,
              "59bbc5c12052a716c3ce9faa"
            );
          }
        } else if (creep.memory.direction === "south") {
          upControllersE59S48.push(name);

          creep.memory.controllerID = "59bbc5d22052a716c3cea133";

          if (!shouldContinueToNextCreep) {
            upController(
              creep,
              Game.flags.northController,
              Memory.northRoomName,
              Game.flags.northExit,
              TOP,
              "59bbc5d22052a716c3cea133"
            );
          }
        } else {
          upControllersE59S48.push(name);
          creep.memory.direction = "south";
          creep.memory.controllerID = "59bbc5d22052a716c3cea133";

          if (!shouldContinueToNextCreep) {
            upController(
              creep,
              Game.flags.northController,
              Memory.northRoomName,
              Game.flags.northExit,
              TOP,
              "59bbc5d22052a716c3cea133"
            );
          }
        }
      } else if (
        roll === "ucdS" ||
        roll === "upControllerdS" ||
        roll === "upcdS" ||
        roll === "upCdS"
      ) {
        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
          creep.memory.up = true;
        }
        upControllersE59S49.push(name);

        creep.memory.controllerID = "59bbc5d22052a716c3cea13a";

        if (!shouldContinueToNextCreep) {
          retval = upController(
            creep,
            Game.flags.deepSouthController,
            Memory.deepSouthRoomName,
            Game.flags.southExit,
            BOTTOM,
            creep.memory.controllerID
          );
        }
      } else if (roll === "worker" || roll === "w") {
        workers.push(name);

        if (creep.memory.direction.startsWith("s")) {
          if (!shouldContinueToNextCreep) {
            roleWorker(creep, null, null, null, null, Memory.homeRoomName);
          }
        } else if (creep.memory.direction.startsWith("n")) {
          if (!shouldContinueToNextCreep) {
            roleWorker(
              creep,
              null,
              null,
              Game.flags.northExit,
              TOP,
              Memory.northRoomName
            );
          }
        } else if (creep.memory.direction === "deepSouth") {
          if (!shouldContinueToNextCreep) {
            roleWorker(
              creep,
              null,
              null,
              Game.flags.southExit,
              BOTTOM,
              Memory.deepSouthRoomName
            );
          }
        } else {
          if (!shouldContinueToNextCreep) {
            roleWorker(creep, null, null, null, null, Memory.homeRoomName);
          }
        }
      } else if (roll === "healer") {
        if (!shouldContinueToNextCreep) {
          hele(creep);
        }
      } else if (roll === "controller") {
        if (!shouldContinueToNextCreep) {
          roleController.run(creep);
        }
      } else if (roll === "upgrader") {
        roleUpgrader.run(creep);
      } else if (roll === "c" || roll === "claimer") {
        claimers.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            Memory.northRoomName,
            Game.flags.northExit,
            TOP,
            "",
            Memory.northControllerID
          );
        }
      } else if (roll === "cN" || roll === "claimerN") {
        let northController = Game.getObjectById(Memory.northControllerID);

        if (northController && northController.safeModeCooldown < 100) {
          console.log("safeModeCooldown: " + northController.safeModeCooldown);
        } else if (
          northController &&
          northController.reservation &&
          northController.reservation.ticksToEnd < 100
        ) {
          console.log("ticksToEnd: " + northController.reservation.ticksToEnd);
        } else {
          // console.log("no ctrlr");
        }

        claimers.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            Memory.northRoomName,
            Game.flags.northExit,
            TOP,
            "",
            Memory.northController,
            Game.flags.northController
          );
        }
      } else if (roll === "a" || roll === "attacker") {
        if (creep.memory.direction === "north") {
          attackersE59S47.push(name);

          if (!shouldContinueToNextCreep) {
            roleAttackerN(creep);
          }
        } else if (creep.memory.direction === "deepSouth") {
          attackersE59S49.push(name);

          if (!shouldContinueToNextCreep) {
            roleAttackerdS(creep);
          }
        } else {
          let invader = Game.getObjectById(Memory.invaderId);
          attackers.push(name);

          if (!shouldContinueToNextCreep) {
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
      } else if (
        roll === "aR" ||
        roll === "rangedAttacker" ||
        name.startsWith("aR")
      ) {
        if (creep.memory.direction === "north") {
          rangedAttackersE59S47.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(creep);
          }
        } else if (creep.memory.direction === "deepSouth") {
          rangedAttackersE59S49.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttackerdS(creep);
          }
        } else {
          rangedAttackers.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(creep);
          }
        }
      } else if (roll == "hChain") {
      } else if (roll == "transferer") {
      } else if (roll == "mover") {
      }
    } else {
      creep.memory.role = "h";
    }
  }

  Memory.harvesters = harvesters;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.harvestersE59S49 = harvestersE59S49;
  Memory.harvestersE58S49 = harvestersE58S49;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.upControllersE59S49 = upControllersE59S49;
  Memory.upControllersE58S49 = upControllersE58S49;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadRepairersE59S49 = roadRepairersE59S49;
  Memory.roadRepairersE58S49 = roadRepairersE58S49;
  Memory.roadBuilders = roadBuilders;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersE59S47 = rangedAttackersE59S47;
  Memory.rangedAttackersE59S49 = rangedAttackersE59S49;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersE58S49 = claimersE58S49;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.viewers = viewers;
  Memory.viewersE59S47 = viewersE59S47;
  Memory.viewersE59S49 = viewersE59S49;
  Memory.creepsE59S48 = creepsE59S48;
  Memory.creepsE59S49 = creepsE59S49;
  Memory.creepsE59S47 = creepsE59S47;
}

runRoles = profiler.registerFN(runRoles, "runRoles");
module.exports = runRoles;
