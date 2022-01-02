const roleController = require("role.controller");
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
const roleRangedAttackerdS = require("./role.rangedAttackerdS");
const roleHarvesterPickerUpper = require("./role.harvester.PickerUpper");
const setCreepRoomArrayAndAvoidInvaders = require("./setCreepRoomArrayAndAvoidInvaders");

function runRoles() {
  let i = 0;
  let crps = Game.creeps;
  let harvesters = [];
  let harvestersSouth = [];
  let harvestersSouthwest = [];
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
  let upControllersE58S48 = [];
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
  let rangedAttackersSouthwest = [];
  let rangedAttackersE59S47 = [];
  let attackers = [];
  let attackersE59S47 = [];
  let attackersE59S49 = [];
  let claimers = [];
  let claimersSouth = [];
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
  let creepsWest = [];
  let creepsNorth = [];
  let homeExtensions = Memory.homeExtensions;
  let southExtensions = Memory.southExtensions;
  let southwestExtensions = Memory.southwestExtensions;
  let westExtensions = Memory.westExtensions;
  let northExtensions = Memory.northExtensions;
  let homeSpawns = Memory.homeSpawns;
  let southSpawns = Memory.southSpawns;
  let southwestSpawns = Memory.southwestSpawns;
  let westSpawns = Memory.westSpawns;
  let northSpawns = Memory.northSpawns;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  const southwestRoomName = Memory.southwestRoomName;
  const westRoomName = Memory.westRoomName;
  const e58s49RoomName = Memory.e58s49RoomName;
  const e58s48RoomName = Memory.e58s48RoomName;
  const southToHome = Game.flags.southToHome;
  const northEntrance = Game.flags.northEntrance;
  const e58s49Entrance = Game.flags.e58s49Entrance;
  const e58s48Entrance = Game.flags.e58s48Entrance;
  const northExit = Game.flags.northExit;
  const southExit = Game.flags.southExit;
  const homeToSouth = Game.flags.homeToSouth;
  const homeToWest = Game.flags.homeToWest;
  const homeToNorth = Game.flags.homeToNorth;
  const southToSouthwest = Game.flags.southToSouthwest;
  const e58s49Exit = Game.flags.e58s49Exit;
  const e58s48Exit = Game.flags.e58s48Exit;
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
            } else if (creep.room.name === e58s49RoomName) {
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
                e58s49RoomName,
                BOTTOM,
                southExit,
                extensions,
                spawns
              );
            } else if (creep.room.name === deepSouthRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                e58s49RoomName,
                BOTTOM,
                southExit,
                extensions,
                spawns
              );
            } else {
              retval = roleHarvesterPickerUpper(
                creep,
                e58s49RoomName,
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
            roleRepairer(creep, Memory.homeRoomName, null, null);
          }
        } else if (creep.memory.direction === "north") {
          roadRepairersNorth.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              northRoomName,
              Game.flags.homeToNorth,
              TOP
            );
          }
        } else if (creep.memory.direction === "west") {
          roadRepairersWest.push(name);

          if (!shouldContinueToNextCreep) {
            roleRepairer(
              creep,
              westRoomName,
              Game.flags.homeToWest,
              LEFT
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
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP, RIGHT);
          }
        } else if (creep.memory.direction.startsWith("n")) {
          viewersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP, BOTTOM);
          }
        } else if (creep.memory.direction === "south") {
          viewersSouth.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.northRoomName, Game.flags.northExit, TOP, TOP);
          }
        } else if (creep.memory.direction === "west") {
          viewersWest.push(name);
          if (!shouldContinueToNextCreep) {
            roleViewer(creep, Memory.westRoomName, Game.flags.homeToWest, LEFT, RIGHT);
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

        creep.memory.controllerID = "59bbc5d22052a716c3cea13a";

        if (!shouldContinueToNextCreep) {
          retval = upController(
            creep,
            Game.flags.e58s49Controller,
            e58s49RoomName,
            Game.flags.e58s49Exit,
            LEFT,
            Memory.e58s49ControllerID
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
        upControllersE58S48.push(name);

        creep.memory.controllerID = "59bbc5c12052a716c3ce9fa8";

        if (!shouldContinueToNextCreep) {
          retval = upController(
            creep,
            Game.flags.e58s48Controller,
            e58s48RoomName,
            Game.flags.e58s48Exit,
            LEFT,
            Memory.e58s48ControllerID
          );
        }
      } else if (roll === "reserver") {
        reservers.push(name);
        if (!shouldContinueToNextCreep) {
          roleReserver(
            creep,
            e58s49RoomName,
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
            e58s49RoomName,
            Game.flags.e58s49Exit,
            LEFT,
            "59bbc5c12052a716c3ce9faa",
            Memory.e58s49Controller
          );
        }
      } else if (roll === "cW" || roll === "claimerW") {
        claimersE58S48.push(name);

        if (!shouldContinueToNextCreep) {
          claim(
            creep,
            e58s48RoomName,
            Game.flags.e58s48Exit,
            LEFT,
            "59bbc5c12052a716c3ce9fa8",
            Memory.e58s48Controller
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
          rangedAttackersE59S47.push(name);

          if (!shouldContinueToNextCreep) {
            roleRangedAttacker(creep);
          }
        } else if (creep.memory.direction === "south") {
          rangedAttackersSouth.push(name);

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
  Memory.harvestersSouth = harvestersSouth;
  Memory.harvestersWest = harvestersWest;
  Memory.harvestersNorth = harvestersNorth;
  Memory.harvestersSouthwest = harvestersSouthwest;
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
  Memory.rangedAttackersSouthwest = rangedAttackersSouthwest;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersSouth = claimersSouth;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.viewers = viewers;
  Memory.viewersWest = viewersWest;
  Memory.viewersSouth = viewersSouth;
  Memory.creepsHome = creepsHome;
  Memory.creepsSouth = creepsSouth;
  Memory.creepsSouthwest = creepsSouthwest;
  Memory.creepsWest = creepsWest;
  Memory.creepsNorth = creepsNorth;
}

runRoles = profiler.registerFN(runRoles, "runRoles");
module.exports = runRoles;
