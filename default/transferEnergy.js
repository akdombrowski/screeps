const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./move.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");
const { before } = require("lodash");
const {
  checkIfOkToTransferToTower,
} = require("./transferEnergy.checkIfOkToTransferToTower");
const {
  findExtsOrSpawnsToTransferTo,
} = require("./find.findExtsOrSpawnsToTransferTo");
const {
  fleeFromTargetBecauseFull,
} = require("./move.fleeFromTargetBecauseFull");
const { sayTired } = require("./say.sayTired");
const {
  findExtsOrSpawnsForRoom,
} = require("./transferEnergy.findExtsOrSpawnsForRoom");
const {
  checkForFlagTargetStructure,
} = require("./checkForFlagTargetStructure");
const {
  checkTransferToTower,
} = require("./transferEnergy.checkTransferToTower");
const { doesTargetNeedEnergy } = require("./doesTargetNeedEnergy");

function tran(
  creep,
  flag,
  dest,
  targetRoomName,
  exit,
  exitDirection,
  extensions,
  spawns
) {
  let targetId = creep.memory.transferTargetId;
  let target = Game.getObjectById(targetId);
  let creepRoom = creep.room;
  let creepRoomName = creepRoom.name;
  let name = creep.name;
  let pos = creep.pos;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let fatigue = creep.fatigue;
  let s1 = Memory.s1;
  let spawn2 = Game.spawns.spawn2;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let westTower1 = Game.getObjectById(Memory.westTower1Id);
  let dSTower1 = Game.getObjectById(Memory.dSTower1Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = creepRoom.energyAvailable;
  let retval = -16;

  creep.memory.lastSourceId = null;

  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0
  ) {
    // creep.memory.path = null;
    creep.memory.transfer = false;
    creep.memory.transferTargetId = null;
    creep.memory.getEnergy = true;
    return { retval: -19, extensions: extensions, spawns: spawns };
  } else {
    creep.memory.getEnergy = false;
    creep.memory.transfer = true;
  }

  if (!target) {
    if (creep.room.name === Memory.homeRoomName) {
      const minRoomEnergy = 300;
      const maxTowerEnergy = 950;
      const minTowerEnergy = 299;

      target = checkTransferToTower(
        creepRoom,
        tower1,
        creep,
        minRoomEnergy,
        maxTowerEnergy,
        minTowerEnergy
      );
      // } else if (creep.room.name === Memory.westRoomName) {
      //   const minRoomEnergy = 50;
      //   const maxTowerEnergy = 950;
      //   const minTowerEnergy = 300;

      //   target = checkTransferToTower(
      //     creepRoom,
      //     westTower1,
      //     creep,
      //     minRoomEnergy,
      //     maxTowerEnergy,
      //     minTowerEnergy
      //   );
    }
  }

  // check if target needs energy transferred to it
  target = doesTargetNeedEnergy(target, creep, 50);

  // check if there's a structure at the flag given needing energy
  if (!target) {
    target = checkForFlagTargetStructure(flag, creep, extensions, spawns);
  }

  // check if target needs energy transferred to it
  target = doesTargetNeedEnergy(target, creep, 50);

  if (creepRoomName != targetRoomName) {
    if (!target) {
      ({ tar, ext, spa } = findExtsOrSpawnsForRoom(creep, extensions, spawns));
      target = tar;
      extensions = ext;
      spawns = spa;
    }

    // check if we got a target for an ext or spawn
    if (!target) {
      if (
        targetRoomName != Memory.northRoomName &&
        creep.room.name === Memory.northRoomName
      ) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northToHome;
      } else if (creep.room.name === Memory.southRoomName) {
        // if in the deepSouth room but target room is not deepSouth
        if (targetRoomName != Memory.southwestRoomName) {
          // if target name is not the SW room, then head north to home room
          exitDirection = TOP;
          exit = Game.flags.southToHome;
        } else {
          exitDirection = LEFT;
          exit = Game.flags.southToSouthwest;
        }
      } else if (creep.room.name === Memory.homeRoomName) {
        // if in the homeroom but target room is not homeroom,
        if (targetRoomName != Memory.northRoomName) {
          // we're not heading north, so head south
          // east and west are blocked in this spawn area
          exitDirection = BOTTOM;
          exit = Game.flags.homeToSouth;
        } else {
          // we're heading north
          exitDirection = TOP;
          exit = Game.flags.homeToNorth;
        }
      } else if (creep.room.name === Memory.southwestRoomName) {
        // if in the deepSouth room but target room is not deepSouth
        if (targetRoomName != Memory.westRoomName) {
          // if target name is not the SW room, then head north to home room
          exitDirection = RIGHT;
          exit = Game.flags.southwestToSouth;
        } else {
          exitDirection = TOP;
          exit = Game.flags.southwestToWest;
        }
      }

      if (creep.pos.isNearTo(exit)) {
        creep.say(exitDirection);
        retval = creep.move(exitDirection);
      } else {
        creep.say(targetRoomName);
        retval = smartMove(
          creep,
          exit,
          1,
          true,
          null,
          null,
          null,
          1,
          false,
          null
        );
      }

      return { retval: retval, extensions: extensions, spawns: spawns };
    }
  }

  if (!target) {
    let transferTargetsAndMemoryObjects = {};
    creep.memory.transferTargetId = null;
    transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      targetRoomName,
      extensions,
      spawns
    );

    target = transferTargetsAndMemoryObjects.target;
    extensions = transferTargetsAndMemoryObjects.extensions;
    spawns = transferTargetsAndMemoryObjects.spawns;
  }

  // towers
  if (!target && enAvail > 500) {
    let towers = creep.room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER },
    });
    let currTarget = towers[0];
    let prevTarget = towers[0];

    //
    //
    //
    //
    // .########..#######..########...#######...##.
    // ....##....##.....##.##.....##.##.....##.####
    // ....##....##.....##.##.....##.##.....##..##.
    // ....##....##.....##.##.....##.##.....##.....
    // ....##....##.....##.##.....##.##.....##..##.
    // ....##....##.....##.##.....##.##.....##.####
    // ....##.....#######..########...#######...##.
    //
    // CHANGE TO FINDING FIRST TOWER THAT DOESN'T HAVE ENOUGH ENERGY
    //
    //
    //
    _.each(towers, (tower) => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return;
      }

      if (!tower.store[RESOURCE_ENERGY] || tower.store[RESOURCE_ENERGY] <= 0) {
        currTarget = tower;
        return false;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (
        currTarget &&
        currTarget.store &&
        tower.store &&
        currTarget.store.getUsedCapacity([RESOURCE_ENERGY]) >
          tower.store.getUsedCapacity([RESOURCE_ENERGY])
      ) {
        currTarget = tower;
        return true;
      }
      prevTarget = tower;
      return;
    });

    target = currTarget;

    if (
      target &&
      target.store &&
      target.store.getFreeCapacity([RESOURCE_ENERGY]) <= 0
    ) {
      target = null;
    }
  }

  // storage or containers
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        if (
          structure.store &&
          (structure.structureType === STRUCTURE_STORAGE ||
            structure.structureType === STRUCTURE_CONTAINER)
        ) {
          return (
            structure.store[RESOURCE_ENERGY] <
            structure.store.getCapacity(RESOURCE_ENERGY)
          );
        }
      },
    });
  }

  // if (
  //   target === Game.spawns.Spawn1 &&
  //   target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
  // ) {
  //   retval = smartMove(
  //     creep,
  //     Game.spawns.Spawn1,
  //     1,
  //     false,
  //     null,
  //     null,
  //     null,
  //     1,
  //     true,
  //     null
  //   );
  //   target = null;
  //   return retval;
  // }

  if (target && creep.pos.inRangeTo(target, 1)) {
    creep.memory.path = null;

    creep.memory.transferTargetId = target.id;
    retval = creep.transfer(target, RESOURCE_ENERGY);

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
      creep.memory.transfer = false;
      creep.memory.transferTargetId = null;
    }

    if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.memory.path = null;
      creep.say("t🤑");
    } else if (retval === ERR_FULL) {
      retval = fleeFromTargetBecauseFull(creep, retval, target);
    } else {
      creep.say("t.retval🤕");
      retval = creep.move(BOTTOM);
    }
    return { retval: retval, extensions: extensions, spawns: spawns };
  } else if (creep.fatigue > 0) {
    sayTired(creep);
    return { retval: ERR_TIRED, extensions: extensions, spawns: spawns };
  } else if (target) {
    creep.memory.transferTargetId = target.id;

    retval = smartMove(creep, target, 1);

    if (creep.name === "hNW750820_300") {
      console.log("roleharvester: " + creep.memory.path);
    }

    if (creep.pos.isNearTo(target)) {
      return { retval: -17, extensions: extensions, spawns: spawns };
    }

    if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.say("t." + target.pos.x + "," + target.pos.y + ".🚀");
      return { retval: retval, extensions: extensions, spawns: spawns };
    } else if (retval === ERR_TIRED) {
      creep.memory.transferTargetId = target.id;
      creep.say("t." + creep.fatigue + "😴");
    } else {
      creep.memory.path = null;

      if (creep.name === "hNW750820_300") {
        console.log("rharvester: " + creep.memory.path);
      }

      // console.log(name + " move failed in transferEnergy m.err." + retval);
      // console.log(" target: " + target);
      // console.log(" target.pos: " + target.pos);
      // console.log(" creep.pos: " + creep.pos);

      creep.say(
        "t." + retval + "." + target.pos.x + "," + target.pos.y + "🚀" + "🤪"
      );
      return { retval: retval, extensions: extensions, spawns: spawns };
    }
  } else {
    // console.log(
    //   name +
    //     " transferEnergy no target: " +
    //     target +
    //     " creep.pos: " +
    //     creep.pos +
    //     " targetRoomName: " +
    //     targetRoomName
    // );

    // creep.memory.path = null;
    creep.say("t.💩");
  }

  return { retval: retval, extensions: extensions, spawns: spawns };
}

tran = profiler.registerFN(tran, "tran");
module.exports = tran;
