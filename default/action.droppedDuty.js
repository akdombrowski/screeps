const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");
function droppedDuty(creep) {
  let retval = -16;
  let creepName = creep.name;
  let creepRoom = creep.room;
  let droppedTarget = Game.getObjectById(creep.memory.droppedTargetId);
  let droppedPickerUpper = Memory.droppedPickerUpperName;
  let tombstoneHunter = Memory.tombstoneHunterName;
  let tombstoneTarget = Game.getObjectById(Memory.tombstoneTargetId);
  let target;

  let droppedResourcesHome = Memory.droppedResourcesHome;
  let tombstonesHome = Memory.tombstonesHome;
  let droppedResourcesNorth = Memory.droppedResourcesNorth;
  let tombstonesNorth = Memory.tombstonesNorth;

  // need to finish north side and then implement finding resource if creep is a pickerUpper
  // if (cRm.name === Memory.homeRoomName) {
  //   if (!droppedResourcesHome || droppedResourcesHome.length <= 0) {
  //     Memory.droppedResourcesHome = cRm.find(FIND_DROPPED_RESOURCES);
  //     droppedResourcesHome = Memory.droppedResourcesHome;
  //   }

  //   if (
  //     (!droppedResourcesHome || droppedResourcesHome.length <= 0) &&
  //     (!tombstonesHome || tombstonesHome.length <= 0)
  //   ) {
  //     cRm.find(FIND_TOMBSTONES);
  //     Memory.tombstonesHome = tombstonesHome;
  //   }

  //   if (droppedResourcesHome) {
  //     let resourcesPickerUppers = [];
  //     for (const d in droppedResourcesHome) {
  //       if (d.pos) {
  //         resourcesPickerUppers.push({
  //           [d.pos.findClosestByPath(FIND_MY_CREEPS, {
  //             filter: function (c) {
  //               return (
  //                 c.getActiveBodyparts(CARRY) > 0 &&
  //                 c.getActiveBodyparts(MOVE) > 0
  //               );
  //             },
  //           })]: d.pos,
  //         });
  //       }
  //     }

  //     Memory.resourcesPickerUppers = resourcesPickerUppers;
  //   }

  //   if (
  //     !Memory.resourcesPickerUppers ||
  //     Memory.resourcesPickerUppers.length <= 0
  //   ) {
  //     let tombstonePickers = [];
  //     for (const t in tombstonesHome) {
  //       if (t.pos) {
  //         tombstonePickers.push({
  //           [t.pos.findClosestByPath(FIND_MY_CREEPS, {
  //             filter: function (c) {
  //               return (
  //                 c.getActiveBodyparts(CARRY) > 0 &&
  //                 c.getActiveBodyparts(MOVE) > 0
  //               );
  //             },
  //           })]: t.pos,
  //         });
  //       }
  //     }

  //     Memory.tombstonePickers = tombstonePickers;
  //   } else if (Memory.resourcesPickerUppers) {
  //     let isMe = Memory.resourcesPickerUppers
  //       .keys()
  //       .find((value) => value === creep.name);

  //     creep.memory.resourcesPickerUpper = isMe;
  //     creep.memory.resourcePosX =
  //       Memory.resourcesPickerUppers[creep.name].pos.x;
  //     creep.memory.resourcePosY =
  //       Memory.resourcesPickerUppers[creep.name].pos.y;
  //   }

  //   if (
  //     !creep.memory.resourcePickerUpper &&
  //     Memory.tombstonePickers &&
  //     Memory.tombstonePickers.length > 0
  //   ) {
  //     let isMe = Memory.tombstonePickers
  //       .keys()
  //       .find((value) => value === creep.name);
  //     creep.memory.tombstonePicker = isMe;
  //   }
  // } else if (cRm.name === Memory.northRoomName) {
  //   if (!droppedResourcesNorth || droppedResourcesNorth.length <= 0) {
  //     Memory.droppedResourcesNorth = cRm.find(FIND_DROPPED_RESOURCES);
  //     droppedResourcesNorth = Memory.droppedResourcesNorth;
  //   }

  //   if (
  //     (!droppedResourcesHome || droppedResourcesHome.length <= 0) &&
  //     (!tombstonesNorth || tombstonesNorth.length <= 0)
  //   ) {
  //     cRm.find(FIND_TOMBSTONES);
  //     Memory.tombstonesNorth = tombstonesNorth;
  //   }

  //   if (droppedResourcesNorth) {
  //     let resourcesPickerUppersNorth = [];
  //     for (const d in droppedResourcesNorth) {
  //       if (d.pos) {
  //         resourcesPickerUppersNorth.push({
  //           [d.pos.findClosestByPath(FIND_MY_CREEPS, {
  //             filter: function (c) {
  //               return (
  //                 c.getActiveBodyparts(CARRY) > 0 &&
  //                 c.getActiveBodyparts(MOVE) > 0
  //               );
  //             },
  //           })]: d.pos,
  //         });
  //       }
  //     }

  //     Memory.resourcesPickerUppersNorth = resourcesPickerUppersNorth;
  //   }

  //   if (
  //     !Memory.resourcesPickerUppersNorth ||
  //     Memory.resourcesPickerUppersNorth.length <= 0
  //   ) {
  //     let tombstonePickersNorth = [];
  //     for (const t in tombstonesNorth) {
  //       if (t.pos) {
  //         tombstonePickersNorth.push({
  //           [t.pos.findClosestByPath(FIND_MY_CREEPS, {
  //             filter: function (c) {
  //               return (
  //                 c.getActiveBodyparts(CARRY) > 0 &&
  //                 c.getActiveBodyparts(MOVE) > 0
  //               );
  //             },
  //           })]: t.pos,
  //         });
  //       }
  //     }

  //     Memory.tombstonePickersNorth = tombstonePickersNorth;
  //   }
  // }

  if (!droppedPickerUpper || droppedPickerUpper === creepName) {
    droppedTarget = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (source) => {
        if (
          source.resourceType === RESOURCE_ENERGY &&
          source.room === creepRoom
        ) {
          return source;
        }
      },
    });

    if (!droppedTarget) {
      droppedTarget = creep.pos.findClosestByPath(FIND_TOMBSTONES);
    }

    if (droppedTarget) {
      creep.memory.lastSourceId = droppedTarget.id;
      creep.memory.droppedTargetId = droppedTarget.id;
      Memory.droppedPickerUpperName = creepName;

      if (droppedTarget) {
        if (creep.pos.isNearTo(droppedTarget)) {
          creep.say("pu");
          if (!droppedTarget.resourceType) {
            droppedTarget = droppedTarget.pos.lookFor(LOOK_RESOURCES).pop();
          }

          retval = creep.pickup(droppedTarget);
          if (retval != OK) {
            retval = creep.harvest(droppedTarget);
          }
          return retval;
        } else {
          creep.say("m.pu");
          retval = smartMove(creep, droppedTarget, 1);

          if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            creep.memory.lastSourceId = null;
            creep.memory.droppedTargetId = null;
            Memory.droppedPickerUpperName = null;
          }

          return retval;
        }
      }
    } else {
      Memory.droppedPickerUpperName = null;
      retval = ERR_NOT_FOUND;
    }
  }

  return retval;
}

droppedDuty = profiler.registerFN(droppedDuty, "droppedDuty");
exports.droppedDuty = droppedDuty;
