const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");
function pickupDroppedEnergyOrWithdrawFromTombstone(
  creep,
  minAmountOfResource
) {
  const creepName = creep.name;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  let droppedTarget = null;
  if (creep.memory.droppedTargetId) {
    droppedTarget = Game.getObjectById(creep.memory.droppedTargetId);
  }

  // look for dropped energy
  if (!droppedTarget) {
    droppedTarget = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
      filter: (droppedResource) => {
        if (
          droppedResource.resourceType === RESOURCE_ENERGY &&
          droppedResource.room === creepRoom
        ) {
          return droppedResource.amount > minAmountOfResource;
        }

        return false;
      },
    });
  }

  // look for tombstones with energy
  if (!droppedTarget) {
    droppedTarget = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
      filter: (tombstone) => {
        if (tombstone.room.name === creepRoomName) {
          return tombstone.store[RESOURCE_ENERGY] > minAmountOfResource;
        }

        return false;
      },
    });
  }

  if (droppedTarget) {
    creep.memory.lastSourceId = droppedTarget.id;
    creep.memory.droppedTargetId = droppedTarget.id;
    Memory[creep.room.name + "droppedPickerUpperNames"].push(creepName);

    if (droppedTarget) {
      if (creep.pos.isNearTo(droppedTarget)) {
        creep.say("pu");
        if (!droppedTarget.resourceType) {
          retval = creep.withdraw(droppedTarget, RESOURCE_ENERGY);
        } else {
          retval = creep.pickup(droppedTarget);
        }

        if (retval === OK) {
          creep.memory.lastSourceId = null;
          creep.memory.droppedTargetId = null;
          Memory[creep.room.name + "droppedPickerUpperNames"] = _.without(
            Memory[creep.room.name + "droppedPickerUpperNames"],
            creepName
          );
        }
      } else {
        retval = smartMove(
          creep,
          droppedTarget,
          1,
          true,
          null,
          null,
          null,
          1,
          false,
          null
        );
        creep.say("m.pu" + droppedTarget.pos.x + "," + droppedTarget.pos.y);
      }
    }
    return retval;
  }
}
function droppedDuty(creep) {
  let retval = -16;
  let creepName = creep.name;
  let creepRoom = creep.room;
  let creepRoomName = creepRoom.name;
  let droppedTarget = Game.getObjectById(creep.memory.droppedTargetId);
  let droppedPickerUpperName = Memory[creep.room.name + "droppedPickerUpper"];
  let droppedPickerUpperNames =
    Memory[creep.room.name + "droppedPickerUpperNames"];
  let tombstoneHunter = Memory.tombstoneHunterName;
  let tombstoneTarget = Game.getObjectById(Memory.tombstoneTargetId);
  let target;

  let droppedResourcesHome = Memory.droppedResourcesHome;
  let tombstonesHome = Memory.tombstonesHome;
  let droppedResourcesNorth = Memory.droppedResourcesNorth;
  let tombstonesNorth = Memory.tombstonesNorth;
  let amIOnDroppedDuty;
  const minAmountOfResource = 50;

  if (droppedPickerUpperNames) {
    amIOnDroppedDuty = droppedPickerUpperNames.includes(creepName);

    droppedPickerUpperNames = droppedPickerUpperNames.filter(
      (name) => Game.creeps[name]
    );

    Memory[creepRoomName + "droppedPickerUpperNames"] = droppedPickerUpperNames;
  } else {
    Memory[creepRoomName + "droppedPickerUpperNames"] = [];
    droppedPickerUpperNames = [];
  }

  if (
    !droppedPickerUpperNames ||
    amIOnDroppedDuty ||
    droppedPickerUpperNames.length < 3
  ) {
    pickupDroppedEnergyOrWithdrawFromTombstone(creep, minAmountOfResource);
  } else {
    creep.memory.droppedTargetId = null;
    creep.memory.lastSourceId = null;
    Memory[creep.room.name + "droppedPickerUpperNames"] = _.without(
      Memory[creep.room.name + "droppedPickerUpperNames"],
      creepName
    );
    retval = ERR_NOT_FOUND;
  }
  return retval;
}

droppedDuty = profiler.registerFN(droppedDuty, "droppedDuty");
exports.droppedDuty = droppedDuty;
