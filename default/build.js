const smartMove = require("./move.smartMove");
const getEnergy = require("./getEnergy");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");
const {
  roomBuildTargetPriorities,
} = require("./build.roomBuildTargetPriorities");
const { findBuildSite } = require("./find.findBuildSite");

function build(creep, targetRoomName, exitDirection, exit) {
  const name = creep.name;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  let targetId = creep.memory.lastBuildID;
  let target = targetId ? Game.getObjectById(targetId) : null;
  let building = creep.memory.building || true;
  let retval = -16;
  let direction = creep.memory.direction;

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
    building = true;
    creep.memory.building = building;
    creep.memory.lastSourceId = null;
  } else if (creep.store[RESOURCE_ENERGY] <= 0) {
    creep.memory.lastBuildID = null;
    return getEnergy(creep);
  }

  if (building) {
    if (target && target.progress < target.progressTotal) {
      // good, keep target
      creep.memory.lastBuildID = target.id;
    } else {
      // bad get rid of target
      creep.memory.lastBuildID = null;
      target = null;
    }

    if (targetRoomName && creepRoomName != targetRoomName) {
      if (creepRoomName === Memory.northRoomName) {
        // if in the north room but target is not north, head south
        exitDirection = BOTTOM;
        exit = Game.flags.northEntrance;
      } else if (creepRoomName === Memory.southRoomName) {
        // if in the south room but target room is not south and not in SW, head north
        if (targetRoomName != Memory.southwestRoomName) {
          exitDirection = TOP;
          exit = Game.flags.southToHome;
        }
      } else if (creepRoomName === Memory.homeRoomName) {
        if (targetRoomName === Memory.southRoomName) {
          exitDirection = BOTTOM;
          exit = Game.flags.homeToSouth;
        } else if (targetRoomName === Memory.westRoomName) {
          exitDirection = RIGHT;
          exit = Game.flags.homeToWest;
        }
      }

      if (creep.pos.isNearTo(exit)) {
        creep.say(exitDirection);
        retval = creep.move(exitDirection);
      } else {
        creep.say(targetRoomName);
        retval = smartMove(creep, exit, 0, true, null, null, null, 1);
      }
      return retval;
    }

    if (!target) {
      if (creepRoomName === Memory.homeRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.homeRoomName, [
          "61d6a5483762cea863134d9c",
          "61d6a5473762ce7d95134d9b",
          "61d6a5463762ce4c46134d9a",
          "61d6f2a8be69f68e9f0ee3e7",
          "61d6f27ebe69f6085e0ee3df",
          "61d6f27f3762cea1e813508b",
          "61d6a534be69f693b50ee0d6",
          "61d6f2863762cef32f13508d",
          "61d6a0413762ce042d134d7b",
        ]);
      } else if (creepRoomName === Memory.westRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.westRoomName, []);
      } else if (creepRoomName === Memory.southRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.southRoomName, []);
      } else if (creepRoomName === Memory.northRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.northRoomName, []);
      }
    }

    if (target) {
      creep.memory.lastBuildID = target.id;
    }

    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      target.progress >= target.progressTotal
    ) {
      // no target or invalid target
      target = null;
      let ret = {};
      if (creep.room.name === Memory.homeRoomName) {
        ret = findBuildSite(creep.room.name, Memory.homeSites, creep);
        Memory.homeSites = ret.roomSites;
      } else if (creep.room.name === Memory.southRoomName) {
        ret = findBuildSite(creep.room.name, Memory.southSites, creep);
        Memory.southSites = ret.roomSites;
      } else if (creep.room.name === Memory.westRoomName) {
        ret = findBuildSite(creep.room.name, Memory.westSites, creep);
        Memory.westSites = ret.roomSites;
      } else if (creep.room.name === Memory.northRoomName) {
        ret = findBuildSite(creep.room.name, Memory.northSites, creep);
        Memory.northSites = ret.roomSites;
      } else {
        ret = findBuildSite(creep.room.name, Memory.homeSites, creep);
        Memory.homeSites = ret.roomSites;
      }
      target = ret.target;
    }

    if (target) {
      targetId = target.id;

      if (creep.pos.inRangeTo(target, 3)) {
        creep.memory.path = null;

        checkIfBlockingSource(creep, 1);

        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("b:" + target.pos.x + "," + target.pos.y + "🏗️");
      } else if (creep.fatigue > 0) {
        creep.say("b." + creep.fatigue + "😪");
      } else {
        retval = smartMove(creep, target, 3, false, null, null, 200, 1);

        // Couldn't move towards construction target
        if (retval === ERR_INVALID_TARGET || retval === ERR_INVALID_TARGET) {
          creep.say("m." + retval + "😕");
          target = null;
          creep.memory.b = null;
        } else if (retval === OK) {
          creep.say("b:" + target.pos.x + "," + target.pos.y + "🚀");
          creep.memory.b = targetId;
        } else {
          creep.say(
            "b:" + target.pos.x + "," + target.pos.y + "." + retval + "🚀"
          );
          target = null;
          creep.memory.b = null;
        }
      }
    } else {
      // creep.memory.role = "r";
      // creep.memory.working = false;
      creep.say("b.err");
      target = null;
      creep.memory.b = target;
    }
  } else {
    retval = ERR_NOT_ENOUGH_ENERGY;
  }
  return retval;
}

build = profiler.registerFN(build, "build");
module.exports = build;
