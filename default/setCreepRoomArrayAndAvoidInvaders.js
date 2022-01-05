const profiler = require("./screeps-profiler");
const flee = require("./move.flee");

function setCreepRoomArrayAndAvoidInvaders(
  creep,
  creepsHome,
  creepsSouth,
  creepsWest,
  creepsNorth,
  distanceToInvaderToTriggerFlee
) {
  const roll = creep.memory.role;
  const direction = creep.memory.direction;
  let retval = -16;
  let shouldContinueToNextCreep = false;

  if (direction === "home") {
    creepsHome.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDHome);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "south") {
    creepsSouth.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDSouth);

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
    creepsNorth.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDNorth);

    if (invader) {
      if (
        roll != "rangedAttacker" &&
        creep.pos.inRangeTo(invader, distanceToInvaderToTriggerFlee)
      ) {
        retval = flee(creep, invader.pos, 20);
        shouldContinueToNextCreep = true;
      }
    }
  } else if (direction === "west") {
    creepsWest.push(creep.name);

    let invader = Game.getObjectById(Memory.invaderIDWest);

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
    creepsHome: creepsHome,
    creepsSouth: creepsSouth,
    creepsWest: creepsWest,
    creepsNorth: creepsNorth,
  };
}
module.exports = setCreepRoomArrayAndAvoidInvaders;
setCreepRoomArrayAndAvoidInvaders = profiler.registerFN(
  setCreepRoomArrayAndAvoidInvaders,
  "setCreepRoomArrayAndAvoidInvaders"
);
