const roleWorker = require("role.worker");
const roleRepairer = require("role.repairer");
const roleHarvester = require("./role.harvester");
const roleLinkGet = require("role.linkGet");
const hele = require("./action.hele");
const upController = require("./action.upgradeController");
const smartMove = require("./move.smartMove");
const claim = require("./action.claimIt");
const roleAttackerN = require("./role.attackerN");
const roleAttackerdS = require("./role.attackerdS");
const roleReserver = require("./role.reserver");
const profiler = require("./screeps-profiler");
const roleViewer = require("./role.viewer");
const roleRangedAttacker = require("./role.rangedAttacker");
const roleHarvesterPickerUpper = require("./role.harvester.PickerUpper");
const setCreepRoomArrayAndAvoidInvaders = require("./setCreepRoomArrayAndAvoidInvaders");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let harvestersSouth = [];
  let harvestersSouthwest = [];
  let harvestersNorthwest = [];
  let harvestersWest = [];
  let harvestersNorth = [];
  let pickerUppersHome = [];
  let pickerUppersSouth = [];
  let pickerUppersSouthwest = [];
  let pickerUppersE59S49 = [];
  let workers = [];
  let upControllers = [];
  let upControllersSouth = [];
  let upControllersNorth = [];
  let upControllersWest = [];
  let upControllersSouthwest = [];
  let upControllersE59S47 = [];
  let upControllersE59S49 = [];
  let upControllersE58S49 = [];
  let roadRepairers = [];
  let roadRepairersSouth = [];
  let roadRepairersNorth = [];
  let roadRepairersWest = [];
  let roadRepairersSouthwest = [];
  let roadBuilders = [];
  let rangedAttackers = [];
  let rangedAttackersSouth = [];
  let rangedAttackersNorth = [];
  let rangedAttackersWest = [];
  let rangedAttackersEast = [];
  let rangedAttackersSouthwest = [];
  let rangedAttackersE59S47 = [];
  let attackers = [];
  let attackersE59S47 = [];
  let attackersE59S49 = [];
  let claimers = [];
  let claimersSouth = [];
  let claimersNorth = [];
  let claimersWest = [];
  let claimersEast = [];
  let claimersSouthwest = [];
  let claimersE58S48 = [];
  let linkGets = [];
  let towerHarvesters = [];
  let reservers = [];
  let reserversSouth = [];
  let reserversSouthwest = [];
  let viewers = [];
  let viewersWest = [];
  let viewersSouth = [];
  let viewersSouthwest = [];
  let viewersE59S47 = [];
  let creepsHome = [];
  let creepsSouth = [];
  let creepsSouthwest = [];
  let creepsNorthwest = [];
  let creepsWest = [];
  let creepsNorth = [];
  let creepsEast = [];
  let homeExtensions = Memory.homeExtensions;
  let southExtensions = Memory.southExtensions;
  let southwestExtensions = Memory.southwestExtensions;
  let northwestExtensions = Memory.northwestExtensions;
  let westExtensions = Memory.westExtensions;
  let northExtensions = Memory.northExtensions;
  let homeSpawns = Memory.homeSpawns;
  let southSpawns = Memory.southSpawns;
  let southwestSpawns = Memory.southwestSpawns;
  let northwestSpawns = Memory.northwestSpawns;
  let westSpawns = Memory.westSpawns;
  let northSpawns = Memory.northSpawns;
  // room names
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  const southwestRoomName = Memory.southwestRoomName;
  const westRoomName = Memory.westRoomName;
  const northEastRoomName = Memory.northEastRoomName;
  const northwestRoomName = Memory.northWestRoomName;
  const eastRoomName = Memory.eastRoomName;
  // flags
  const southToHome = Game.flags.southToHome;
  const eastToHome = Game.flags.eastToHome;
  const homeToEast = Game.flags.homeToEast;
  const northEntrance = Game.flags.northEntrance;
  const e58s49Entrance = Game.flags.e58s49Entrance;
  const southExit = Game.flags.southExit;
  const homeToSouth = Game.flags.homeToSouth;
  const homeToWest = Game.flags.homeToWest;
  const homeToNorth = Game.flags.homeToNorth;
  const northToHome = Game.flags.northToHome;
  const westToHome = Game.flags.westToHome;
  const westToNorthwest = Game.flags.westToNorthwest;
  const southToSouthwest = Game.flags.southToSouthwest;
  const e58s49Exit = Game.flags.e58s49Exit;
  const southControllerFlag = Game.flags.southController;

  let retval = -16;

  for (let name in crps) {
    if (Game.cpu.getUsed() >= (Game.cpu.tickLimit / 100) * 80) {
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
      creepsHome,
      creepsSouth,
      creepsWest,
      creepsNorth,
    } = setCreepRoomArrayAndAvoidInvaders(
      creep,
      creepsHome,
      creepsSouth,
      creepsWest,
      creepsNorth,
      6
    ));

    if (roll) {
      if (roll === "h" || roll === "harvester") {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
          creep.memory.getEnergy = true;
        }

        if (creep.memory.direction === "home") {
          harvesters.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              homeExtensions,
              homeSpawns,
              homeRoomName,
              northEntrance,
              BOTTOM
            );

            homeExtensions = ret.extensions;
            homeSpawns = ret.spawns;
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "north") {
          harvestersNorth.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              northExtensions,
              northSpawns,
              northRoomName,
              homeToNorth,
              TOP
            );

            northExtensions = ret.extensions;
            northSpawns = ret.spawns;
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "south") {
          harvestersSouth.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              southExtensions,
              southSpawns,
              southRoomName,
              homeToSouth,
              BOTTOM
            );

            southExtensions = ret.extensions;
            southSpawns = ret.spawns;
            retval = ret.retval;
          }
        } else if (creep.memory.direction === "southwest") {
          harvestersSouthwest.push(name);

          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              southwestExtensions,
              southwestSpawns,
              southwestRoomName,
              southToSouthwest,
              LEFT
            );
            retval = ret.retval;
            southwestExtensions = ret.extensions;
            southwestSpawns = ret.spawns;
          }
        } else if (creep.memory.direction === "west") {
          harvestersWest.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              westExtensions,
              westSpawns,
              westRoomName,
              homeToWest,
              LEFT
            );
            retval = ret.retval;
            westExtensions = ret.extensions;
            westSpawns = ret.spawns;
          }
        } else if (creep.memory.direction === "northwest") {
          harvestersNorthwest.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              northwestExtensions,
              northwestSpawns,
              northwestRoomName,
              westToNorthwest,
              TOP
            );
            retval = ret.retval;
            northwestExtensions = ret.extensions;
            northwestSpawns = ret.spawns;
          }
        } else {
          creep.memory.direction = "home";
          harvesters.push(name);
        }
      } else if (roll === "pickerUpper" || roll === "pU") {
        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
          creep.memory.getEnergy = true;
        }

        if (creep.memory.direction === "home") {
          pickerUppersHome.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === deepSouthRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                homeRoomName,
                TOP,
                southEntrance,
                homeExtensions,
                homeSpawns
              );
            } else if (creep.room.name === northRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                homeRoomName,
                BOTTOM,
                northEntrance,
                homeExtensions,
                homeSpawns
              );
            } else {
              retval = roleHarvesterPickerUpper(
                creep,
                homeRoomName,
                null,
                null,
                homeExtensions,
                homeSpawns
              );
            }
          }
        } else if (creep.memory.direction === "south") {
          pickerUppersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === homeRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                southRoomName,
                BOTTOM,
                homeToSouth,
                southExtensions,
                southSpawns
              );
            } else if (creep.room.name === northEastRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                deepSouthRoomName,
                RIGHT,
                e58s49Entrance,
                e59s49extensions,
                e59s49spawns
              );
            } else {
              retval = roleHarvesterPickerUpper(
                creep,
                deepSouthRoomName,
                TOP,
                southEntrance,
                e59s49extensions,
                e59s49spawns
              );
            }
          }
        } else if (creep.memory.direction === "southwest") {
          pickerUppersSouthwest.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === northRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                southwestRoomName,
                LEFT,
                southToSouthwest,
                southwestExtensions,
                southwestSpawns
              );
            } else if (creep.room.name === homeRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                northEastRoomName,
                BOTTOM,
                southExit,
                extensions,
                spawns
              );
            } else if (creep.room.name === deepSouthRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                northEastRoomName,
                BOTTOM,
                southExit,
                extensions,
                spawns
              );
            } else {
              retval = roleHarvesterPickerUpper(
                creep,
                northEastRoomName,
                LEFT,
                e58s49Exit,
                extensions,
                spawns
              );
            }
          }
        } else {
          creep.memory.direction = "home";
          pickerUppersHome.push(name);
          retval = -16;
        }
      } else if (roll && roll.startsWith("linkGet")) {
        linkGets.push(name);
        if (!shouldContinueToNextCreep) {
          roleLinkGet.run(creep);
        }
      } else if (roll === "roadRepairer") {
        if (creep.memory.direction === "home") {
          roadRepairers.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              westRoomName,
              homeToWest,
              LEFT,
              homeRoomName,
              westToHome,
              RIGHT
            );
          }
        } else if (creep.memory.direction === "north") {
          roadRepairersNorth.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(creep, northRoomName, Game.flags.homeToNorth, TOP);
          }
        } else if (creep.memory.direction === "west") {
          roadRepairersWest.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              westRoomName,
              homeToWest,
              LEFT,
              westRoomName,
              westToHome,
              RIGHT
            );
          }
        } else if (creep.memory.direction === "south") {
          roadRepairersSouth.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(creep, southRoomName, homeToSouth, BOTTOM);
          }
        } else {
          roadRepairers.push(name);
          if (!shouldContinueToNextCreep) {
            roleRepairer(creep, Memory.homeRoomName, null, null);
          }
        }
      } else if (roll === "viewer") {
        if (creep.memory.direction === "home") {
          viewersE59S48.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(
              creep,
              Memory.northRoomName,
              Game.flags.homeToNorth,
              TOP,
              RIGHT
            );
          }
        } else if (creep.memory.direction.startsWith("n")) {
          viewersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(
              creep,
              Memory.northRoomName,
              Game.flags.homeToNorth,
              TOP,
              BOTTOM
            );
          }
        } else if (creep.memory.direction === "south") {
          viewersSouth.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(
              creep,
              Memory.northRoomName,
              Game.flags.homeToSouth,
              TOP,
              TOP
            );
          }
        } else if (creep.memory.direction === "west") {
          viewersWest.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(
              creep,
              Memory.westRoomName,
              Game.flags.homeToWest,
              LEFT,
              RIGHT
            );
          }
        } else {
          viewersSouth.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, southRoomName, homeToSouth, BOTTOM, TOP);
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
        if (creep.memory.direction === "home") {
          upControllers.push(name);
        } else if (creep.memory.direction === "south") {
          upControllersSouth.push(name);
        } else if (creep.memory.direction === "north") {
          upControllersE59S47.push(name);
        } else {
          creep.memory.direction = "home";

          upControllers.push(name);
        }

        if (!shouldContinueToNextCreep) {
          upController(
            creep,
            Game.flags.homeRoomController,
            Memory.homeRoomName,
            null,
            null,
            "5982fc8cb097071b4adbdb39"
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
      } else if (
        roll === "ucSW" ||
        roll === "upControllerSW" ||
        roll === "upcSW" ||
        roll === "upCSW"
      ) {
        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
          creep.memory.up = true;
        }
        upControllersE58S49.push(name);

        creep.memory.controllerID = Memory.southwestControllerId;

        if (!shouldContinueToNextCreep) {
          retval = upController(
            creep,
            Game.flags.southwestRoomController,
            southwestRoomName,
            Game.flags.southToSouthwest,
            LEFT,
            Memory.southwestControllerID
          );
        }
      } else if (
        roll === "ucW" ||
        roll === "upControllerW" ||
        roll === "upcW" ||
        roll === "upCW"
      ) {
        if (creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()) {
          creep.memory.up = true;
        }
        upControllersWest.push(name);

        creep.memory.controllerID = "59f1a13882100e1594f37ed5";

        if (!shouldContinueToNextCreep) {
          retval = upController(
            creep,
            Game.flags.westRoomController,
            westRoomName,
            Game.flags.homeToWest,
            LEFT,
            Memory.westRoomControllerID
          );
        }
      } else if (roll === "reserver") {
        reservers.push(name);
        if (!shouldContinueToNextCreep) {
          roleReserver(
            creep,
            northEastRoomName,
            e58s49Exit,
            LEFT,
            Game.flags.e58s49Controller,
            "59bbc5c12052a716c3ce9faa"
          );
        }
      } else if (roll === "c" || roll === "claimer") {
        claimers.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            northRoomName,
            homeToNorth,
            TOP,
            Memory.northControllerID,
            Memory.northRoomController
          );
        }
      } else if (roll === "cW" || roll === "claimerW") {
        claimersWest.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            westRoomName,
            homeToWest,
            LEFT,
            westToHome,
            Memory.westControllerID,
            Game.flags.westRoomController
          );
        }
      } else if (roll === "cS" || roll === "claimerS") {
        claimersSouth.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            southRoomName,
            homeToSouth,
            LEFT,
            "5982fc8cb097071b4adbdb3c",
            southControllerFlag
          );
        }
      } else if (roll === "cN" || roll === "claimerN") {
        claimersNorth.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            Memory.northRoomName,
            Game.flags.northExit,
            TOP,
            "",
            Memory.northControllerId,
            Game.flags.northRoomController
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
          rangedAttackersNorth.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(
              creep,
              homeToNorth,
              northToHome,
              northRoomName,
              TOP,
              homeRoomName,
              BOTTOM,
              Memory.invaderIDNorth,
              Memory.invaderIDHome
            );
          }
        } else if (creep.memory.direction === "south") {
          rangedAttackersSouth.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(
              creep,
              homeToSouth,
              southToHome,
              southRoomName,
              BOTTOM,
              homeRoomName,
              TOP,
              Memory.invaderIDSouth,
              Memory.invaderIDHome
            );
          }
        } else if (creep.memory.direction === "east") {
          rangedAttackersEast.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(
              creep,
              homeToEast,
              eastToHome,
              eastRoomName,
              RIGHT,
              homeRoomName,
              LEFT,
              Memory.invaderIDEast,
              Memory.invaderIDHome
            );
          }
        } else if (creep.memory.direction === "west") {
          rangedAttackersWest.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(
              creep,
              homeToWest,
              westToHome,
              westRoomName,
              LEFT,
              homeRoomName,
              RIGHT,
              Memory.invaderIDWest,
              Memory.invaderIDHome
            );
          }
        } else {
          rangedAttackers.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(
              creep,
              homeToNorth,
              northToHome,
              homeRoomName,
              BOTTOM,
              null,
              TOP,
              Memory.invaderIDHome,
              Memory.invaderIDHome
            );
          }
        }
      } else if (roll == "hChain") {
      } else if (roll == "transferer") {
      } else if (roll == "mover") {
      }
    } else {
      harvesters.push(name);
      creep.memory.role = "h";
    }
  }

  Memory.harvesters = harvesters;
  Memory.harvestersSouth = harvestersSouth;
  Memory.harvestersWest = harvestersWest;
  Memory.harvestersNorth = harvestersNorth;
  Memory.harvestersSouthwest = harvestersSouthwest;
  Memory.harvestersNorthwest = harvestersNorthwest;
  Memory.pickerUppersHome = pickerUppersHome;
  Memory.pickerUppersSouth = pickerUppersSouth;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersSouth = upControllersSouth;
  Memory.upControllersNorth = upControllersNorth;
  Memory.upControllersWest = upControllersWest;
  Memory.upControllersSouthwest = upControllersSouthwest;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersSouth = roadRepairersSouth;
  Memory.roadRepairersNorth = roadRepairersNorth;
  Memory.roadRepairersWest = roadRepairersWest;
  Memory.roadRepairersSouthwest = roadRepairersSouthwest;
  Memory.roadBuilders = roadBuilders;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersSouth = rangedAttackersSouth;
  Memory.rangedAttackersNorth = rangedAttackersNorth;
  Memory.rangedAttackersWest = rangedAttackersWest;
  Memory.rangedAttackersEast = rangedAttackersEast;
  Memory.rangedAttackersSouthwest = rangedAttackersSouthwest;
  Memory.attackers = attackers;
  Memory.claimers = claimers;
  Memory.claimersWest = claimersWest;
  Memory.claimersEast = claimersEast;
  Memory.claimersNorth = claimersNorth;
  Memory.claimersSouth = claimersSouth;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.viewers = viewers;
  Memory.viewersWest = viewersWest;
  Memory.viewersSouth = viewersSouth;
  Memory.creepsHome = creepsHome;
  Memory.creepsSouth = creepsSouth;
  Memory.creepsSouthwest = creepsSouthwest;
  Memory.creepsNorthwest = creepsNorthwest;
  Memory.creepsWest = creepsWest;
  Memory.creepsEast = creepsEast;
  Memory.creepsNorth = creepsNorth;
}

runRoles = profiler.registerFN(runRoles, "runRoles");
module.exports = runRoles;
