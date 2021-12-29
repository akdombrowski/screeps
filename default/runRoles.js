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
  let harvestersE59S47 = [];
  let harvestersE59S49 = [];
  let harvestersE58S49 = [];
  let harvestersE58S48 = [];
  let pickerUppersHome = [];
  let pickerUppersSouth = [];
  let pickerUppersE59S47 = [];
  let pickerUppersE59S49 = [];
  let pickerUppersE58S49 = [];
  let workers = [];
  let upControllers = [];
  let upControllersSouth = [];
  let upControllersE59S47 = [];
  let upControllersE59S49 = [];
  let upControllersE58S49 = [];
  let upControllersE58S48 = [];
  let roadRepairers = [];
  let roadRepairersSouth = [];
  let roadRepairersE59S47 = [];
  let roadRepairersE59S49 = [];
  let roadRepairersE58S49 = [];
  let roadRepairersE58S48 = [];
  let roadBuilders = [];
  let rangedAttackers = [];
  let rangedAttackersSouth = [];
  let rangedAttackersE59S47 = [];
  let rangedAttackersE59S49 = [];
  let attackers = [];
  let attackersE59S47 = [];
  let attackersE59S49 = [];
  let claimers = [];
  let claimersSouth = [];
  let claimersE58S49 = [];
  let claimersE58S48 = [];
  let linkGets = [];
  let towerHarvesters = [];
  let reservers = [];
  let reserversSouth = [];
  let viewers = [];
  let viewersSouth = [];
  let viewersE59S47 = [];
  let viewersE59S49 = [];
  let creepsHome = [];
  let creepsSouth = [];
  let creepsE59S49 = [];
  let creepsE59S47 = [];
  let creepsE58S49 = [];
  let creepsE58S48 = [];
  let homeExtensions = Memory.homeExtensions;
  let southExtensions = Memory.southExtensions;
  let e59s47extensions = Memory.e59s47extensions;
  let e59s49extensions = Memory.e59s49extensions;
  let e58s49extensions = Memory.e58s49extensions;
  let e58s48extensions = Memory.e58s48extensions;
  let homeSpawns = Memory.homeSpawns;
  let southSpawns = Memory.southSpawns;
  let e59s47spawns = Memory.e59s47spawns;
  let e59s49spawns = Memory.e59s49spawns;
  let e58s49spawns = Memory.e58s49spawns;
  let e58s48spawns = Memory.e58s48spawns;
  const homeRoomName = Memory.homeRoomName;
  const northRoomName = Memory.northRoomName;
  const southRoomName = Memory.southRoomName;
  const e58s49RoomName = Memory.e58s49RoomName;
  const e58s48RoomName = Memory.e58s48RoomName;
  const southToHome = Game.flags.southToHome;
  const northEntrance = Game.flags.northEntrance;
  const e58s49Entrance = Game.flags.e58s49Entrance;
  const e58s48Entrance = Game.flags.e58s48Entrance;
  const northExit = Game.flags.northExit;
  const southExit = Game.flags.southExit;
  const homeToSouth = Game.flags.homeToSouth;
  const e58s49Exit = Game.flags.e58s49Exit;
  const e58s48Exit = Game.flags.e58s48Exit;

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
      creepsE59S48: creepsHome,
      creepsE59S49,
      creepsE59S47,
      creepsE58S49,
    } = setCreepRoomArrayAndAvoidInvaders(
      creep,
      creepsHome,
      creepsE59S49,
      creepsE59S47,
      creepsE58S49
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
          harvestersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              e59s47extensions,
              e59s47spawns,
              "E59S47",
              northExit,
              TOP
            );

            e59s47extensions = ret.extensions;
            e59s47spawns = ret.spawns;
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
        } else if (creep.memory.direction === "e58s49") {
          harvestersE58S49.push(name);
          if (Memory.creepsE59S49.length > 5) {
            if (!shouldContinueToNextCreep) {
              ret = roleHarvester(
                creep,
                e58s49extensions,
                e58s49spawns,
                "E58S49",
                e58s49Exit,
                LEFT
              );
              retval = ret.retval;
              e58s49extensions = ret.extensions;
              e58s49spawns = ret.spawns;
            }
          } else {
            // emergency switch to harvesting and transferring staying in dS room
            if (!shouldContinueToNextCreep) {
              ret = roleHarvester(
                creep,
                e59s49extensions,
                e59s49spawns,
                "E59S49",
                southExit,
                BOTTOM
              );

              e59s49extensions = ret.extensions;
              e59s49spawns = ret.spawns;
              retval = ret.retval;
            }
          }
        } else if (creep.memory.direction === "e58s49") {
          harvestersE58S48.push(name);
          if (!shouldContinueToNextCreep) {
            ret = roleHarvester(
              creep,
              e58s48extensions,
              e58s48spawns,
              "E58S48",
              e58s48Exit,
              LEFT
            );
            retval = ret.retval;
            e58s48extensions = ret.extensions;
            e58s48spawns = ret.spawns;
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
                TOP,
                southEntrance,
                homeExtensions,
                homeSpawns
              );
            }
          }
        } else if (creep.memory.direction === "north") {
          pickerUppersE59S47.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === deepSouthRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                northRoomName,
                TOP,
                southEntrance,
                e59s47extensions,
                e59s47spawns
              );
            } else if (creep.room.name === southRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                northRoomName,
                TOP,
                northExit,
                e59s47extensions,
                e59s47spawns
              );
            } else {
              retval = roleHarvesterPickerUpper(
                creep,
                northRoomName,
                TOP,
                northExit,
                e59s47extensions,
                e59s47spawns
              );
            }
          }
        } else if (creep.memory.direction === "deepSouth") {
          pickerUppersE59S49.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === northRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                deepSouthRoomName,
                TOP,
                southEntrance,
                e59s49extensions,
                e59s49spawns
              );
            } else if (creep.room.name === homeRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                deepSouthRoomName,
                TOP,
                northExit,
                e59s49extensions,
                e59s49spawns
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
        } else if (creep.memory.direction === "e58s49") {
          pickerUppersE58S49.push(name);
          if (!shouldContinueToNextCreep) {
            if (creep.room.name === northRoomName) {
              retval = roleHarvesterPickerUpper(
                creep,
                e58s49RoomName,
                BOTTOM,
                northEntrance,
                extensions,
                spawns
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
          roadRepairersE58S49.push(name);
          if (!shouldContinueToNextCreep) {
          }
          roleRepairer(
            creep,
            Memory.e58s49RoomName,
            Game.flags.e58s49Exit,
            LEFT
          );
        } else if (creep.memory.direction === "e58s48") {
          roadRepairersE58S48.push(name);
          if (!shouldContinueToNextCreep) {
          }
          roleRepairer(
            creep,
            Memory.e58s48RoomName,
            Game.flags.e58s48Exit,
            LEFT
          );
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
        if (creep.memory.direction === "home") {
          upControllers.push(name);
        } else if (creep.memory.direction === "deepSouth") {
          upControllersE59S49.push(name);
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
          upControllersE58S49.push(name);

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
        } else if (creep.memory.direction === "home") {
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
          creep.memory.direction = "home";
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
      } else if (roll === "controller") {
        if (!shouldContinueToNextCreep) {
          roleController.run(creep);
        }
      } else if (roll === "upgrader") {
        roleUpgrader.run(creep);
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
  Memory.harvestersSouth = harvestersSouth;
  Memory.harvestersE59S47 = harvestersE59S47;
  Memory.harvestersE59S49 = harvestersE59S49;
  Memory.harvestersE58S49 = harvestersE58S49;
  Memory.harvestersE58S48 = harvestersE58S48;
  Memory.pickerUppersHome = pickerUppersHome;
  Memory.pickerUppersSouth = pickerUppersSouth;
  Memory.pickerUppersE59S47 = pickerUppersE59S47;
  Memory.pickerUppersE59S49 = pickerUppersE59S49;
  Memory.pickerUppersE58S49 = pickerUppersE58S49;
  Memory.workers = workers;
  Memory.upControllers = upControllers;
  Memory.upControllersSouth = upControllersSouth;
  Memory.upControllersE59S47 = upControllersE59S47;
  Memory.upControllersE59S49 = upControllersE59S49;
  Memory.upControllersE58S49 = upControllersE58S49;
  Memory.upControllersE58S48 = upControllersE58S48;
  Memory.roadRepairers = roadRepairers;
  Memory.roadRepairersSouth = roadRepairersSouth;
  Memory.roadRepairersE59S47 = roadRepairersE59S47;
  Memory.roadRepairersE59S49 = roadRepairersE59S49;
  Memory.roadRepairersE58S49 = roadRepairersE58S49;
  Memory.roadRepairersE58S48 = roadRepairersE58S48;
  Memory.roadBuilders = roadBuilders;
  Memory.rangedAttackers = rangedAttackers;
  Memory.rangedAttackersSouth = rangedAttackersSouth;
  Memory.rangedAttackersE59S47 = rangedAttackersE59S47;
  Memory.rangedAttackersE59S49 = rangedAttackersE59S49;
  Memory.attackers = attackers;
  Memory.attackersE59S47 = attackersE59S47;
  Memory.attackersE59S49 = attackersE59S49;
  Memory.claimers = claimers;
  Memory.claimersSouth = claimersSouth;
  Memory.claimersE58S49 = claimersE58S49;
  Memory.claimersE58S48 = claimersE58S48;
  Memory.linkGets = linkGets;
  Memory.towerHarvesters = towerHarvesters;
  Memory.viewers = viewers;
  Memory.viewersSouth = viewersSouth;
  Memory.viewersE59S47 = viewersE59S47;
  Memory.viewersE59S49 = viewersE59S49;
  Memory.creepsHome = creepsHome;
  Memory.creepsSouth = creepsSouth;
  Memory.creepsE59S49 = creepsE59S49;
  Memory.creepsE59S47 = creepsE59S47;
  Memory.creepsE58S49 = creepsE58S49;
  Memory.creepsE58S48 = creepsE58S48;
}

runRoles = profiler.registerFN(runRoles, "runRoles");
module.exports = runRoles;
