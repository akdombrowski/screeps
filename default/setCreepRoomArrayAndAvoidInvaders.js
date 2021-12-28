const profiler = require("./screeps-profiler");
const flee = require("./move.flee");

function setCreepRoomArrayAndAvoidInvaders(
  creep,
  creepsE59S48,
  creepsE59S49,
  creepsE59S47,
  creepsE58S49,
  distanceToInvaderToTriggerFlee
) {
  const roll = creep.memory.role;
  const direction = creep.memory.direction;
  let retval = -16;
  let shouldContinueToNextCreep = false;

  if (direction === "south") {
    creepsE59S48.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S48);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "deepSouth") {
    creepsE59S49.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S49);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "north") {
    creepsE59S47.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE59S47);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "e58s49") {
    creepsE58S49.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDE58S49);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
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
    creepsE58S49: creepsE58S49,
  };
}
module.exports = setCreepRoomArrayAndAvoidInvaders;
setCreepRoomArrayAndAvoidInvaders = profiler.registerFN(
  setCreepRoomArrayAndAvoidInvaders,
  "setCreepRoomArrayAndAvoidInvaders"
);
