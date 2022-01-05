const smartMove = require("./move.smartMove");
const getEnergy = require("./getEnergy");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
const profiler = require("./screeps-profiler");
const {
  roomBuildTargetPriorities,
} = require("./build.roomBuildTargetPriorities");
const { findBuildSite } = require("./findBuildSite");

function build(creep) {
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

    if (!target) {
      if (creepRoomName === Memory.homeRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.homeRoomName, [
          "61d3f131be69f6109b0ebba9",
          "61d3f1323f190bc2fccfc5aa",
          "61d3f1333762cee3d81329b1",
          "61d58231be69f6ecd50ed578",
          "61d3f13ebe69f68b8f0ebbab",
          "61d3f13f3f190b2640cfc5ad",
        ]);
      } else if (creepRoomName === Memory.westRoomName) {
        target = roomBuildTargetPriorities(creep, Memory.westRoomName, [
          "61d0a10b3762cef8fb1300fc",
          "61d0a10a3f190b79aacf9bdd",
          "61d0a10c3f190b4f69cf9bde",
          "61d0a10d3f190ba392cf9bdf",
          "61d0a10f3762cea19d1300fd",
        ]);
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
        ret = findBuildSite(creep.room.name, Memory.homeSites);
        Memory.homeSites = ret.roomSites;
      } else if (creep.room.name === Memory.southRoomName) {
        ret = findBuildSite(creep.room.name, Memory.southSites);
        Memory.southSites = ret.roomSites;
      } else if (creep.room.name === Memory.westRoomName) {
        ret = findBuildSite(creep.room.name, Memory.westSites);
        Memory.westSites = ret.roomSites;
      } else if (creep.room.name === Memory.northRoomName) {
        ret = findBuildSite(creep.room.name, Memory.northSites);
        Memory.northSites = ret.roomSites;
      } else {
        ret = findBuildSite(creep.room.name, Memory.homeSites);
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
