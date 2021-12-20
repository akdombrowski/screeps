const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");
const profiler = require("./screeps-profiler");
const { before } = require("lodash");
const { checkIfOkToTransferToTower } = require("./checkIfOkToTransferToTower");
const {
  findExtsOrSpawnsToTransferTo,
} = require("./findExtsOrSpawnsToTransferTo");
const { fleeFromTargetBecauseFull } = require("./fleeFromTargetBecauseFull");

function tran(creep, flag, dest, targetRoomName, exit, exitDirection) {
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
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = creepRoom.energyAvailable;
  let retval = -16;

  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0
  ) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    creep.memory.transferTargetId = null;
    creep.memory.lastSourceId = null;
    creep.memory.getEnergy = true;
    return -19;
  }

  if (creepRoomName != targetRoomName) {
    if (!target) {
      if (creepRoomName === Memory.homeRoomName) {
        let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
          creep,
          target,
          Memory.homeRoomName,
          Memory.e59s48extensions,
          Memory.e59s48spawns
        );

        target = transferTargetsAndMemoryObjects.target;

        Memory.e59s48extensions = transferTargetsAndMemoryObjects.memExtensions;
        Memory.e59s48spawns = transferTargetsAndMemoryObjects.memSpawns;
      } else if (creepRoomName === Memory.northRoomName) {
        let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
          creep,
          target,
          Memory.northRoomName,
          Memory.e59s47extensions,
          Memory.e59s47spawns
        );

        target = transferTargetsAndMemoryObjects.target;
        Memory.e59s47extensions = transferTargetsAndMemoryObjects.memExtensions;
        Memory.e59s47spawns = transferTargetsAndMemoryObjects.memSpawns;
      } else if (creepRoomName === Memory.deepSouthRoomName) {
        let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
          creep,
          target,
          Memory.deepSouthRoomName,
          Memory.e59s49extensions,
          Memory.e59s49spawns
        );

        target = transferTargetsAndMemoryObjects.target;
        Memory.e59s49extensions = transferTargetsAndMemoryObjects.memExtensions;
        Memory.e59s49spawns = transferTargetsAndMemoryObjects.memSpawns;
      }
    }

    // check if we got a target for an ext or spawn
    if (!target) {
      if (
        targetRoomName != Memory.northRoomName &&
        creep.room.name === Memory.northRoomName
      ) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northEntrance;
      } else if (
        targetRoomName != Memory.deepSouthRoomName &&
        creep.room.name === Memory.deepSouthRoomName
      ) {
        // if in the deepSouth room but target room is not deepSouth, head north
        exitDirection = TOP;
        exit = Game.flags.southEntrance;
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

      return retval;
    }
  }

  if (flag && flag.pos) {
    target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  } else if (creep.memory.transferTargetId) {
    target = Game.getObjectById(creep.memory.transferTargetId);
  }

  if (
    target &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
  ) {
    target = null;
    creep.memory.flag = null;
    creep.memory.transferTargetId = null;
    creep.memory.path = null;
  }

  const minAmountOfEnAvailToTransferToTower = 500;
  target = checkIfOkToTransferToTower(
    target,
    enAvail,
    creep,
    minAmountOfEnAvailToTransferToTower
  );

  if (target) {

  if (
    !target &&
    creepRoomName === Memory.homeRoomName &&
    targetRoomName === Memory.homeRoomName
  ) {
    let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      Memory.homeRoomName,
      Memory.e59s48extensions,
      Memory.e59s48spawns
    );

    target = transferTargetsAndMemoryObjects.target;

    Memory.e59s48extensions = transferTargetsAndMemoryObjects.memExtensions;

    Memory.e59s48spawns = transferTargetsAndMemoryObjects.memSpawns;
  } else if (
    !target &&
    creepRoomName === Memory.northRoomName &&
    targetRoomName === Memory.northRoomName
  ) {
    let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      Memory.northRoomName,
      Memory.e59s47extensions,
      Memory.e59s47spawns
    );

    target = transferTargetsAndMemoryObjects.target;
    Memory.e59s47extensions = transferTargetsAndMemoryObjects.memExtensions;
    Memory.e59s47spawns = transferTargetsAndMemoryObjects.memSpawns;
  } else if (
    !target &&
    creepRoomName === Memory.deepSouthRoomName &&
    targetRoomName === Memory.deepSouthRoomName
  ) {
    let transferTargetsAndMemoryObjects = findExtsOrSpawnsToTransferTo(
      creep,
      target,
      Memory.deepSouthRoomName,
      Memory.e59s49extensions,
      Memory.e59s49spawns
    );

    target = transferTargetsAndMemoryObjects.target;
    Memory.e59s49extensions = transferTargetsAndMemoryObjects.memExtensions;
    Memory.e59s49spawns = transferTargetsAndMemoryObjects.memSpawns;
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

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0) {
      creep.memory.transfer = false;
    }

    retval = creep.transfer(target, RESOURCE_ENERGY);

    if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.memory.path = null;
      creep.say("t");
      return retval;
    } else if (retval === ERR_FULL) {
      retval = fleeFromTargetBecauseFull(creep, retval, target);
      return retval;
    } else {
      creep.say("ouch");
      return creep.move(BOTTOM);
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (target) {
    creep.memory.transferTargetId = target.id;

    retval = smartMove(creep, target, 1);

    if (creep.pos.isNearTo(target)) {
      return -17;
    }

    if (retval !== OK) {
      creep.memory.path = null;

      console.log(
        name +
          " move to target failed in transferEnergy m.err." +
          retval +
          " target: " +
          target +
          " target.pos: " +
          target.pos
      );

      creep.say("m.err." + retval);
      return retval;
    } else if (retval === OK) {
      creep.memory.transferTargetId = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
      return retval;
    }
  } else {
    console.log(
      name +
        " transferEnergy no target: " +
        target +
        " creep.pos: " +
        creep.pos +
        " targetRoomName: " +
        targetRoomName
    );

    creep.memory.path = null;
    creep.say("t.err");
  }

  return retval;
}

tran = profiler.registerFN(tran, "tran");
module.exports = tran;
