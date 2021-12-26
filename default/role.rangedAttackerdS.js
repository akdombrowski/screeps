const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function roleRangedAttackerdS(creep) {
  const s1 = Game.spawns.Spawn1;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  let creeps = Game.creeps;
  let enAvail = creepRoom.energyAvailable;
  let invader;
  let retval;
  let northExit = Game.flags.northExit;
  let southExit = Game.flags.southExit;
  let southEntrance = Game.flags.southEntrance;
  let getEnergy = creep.memory.getEnergy;
  let transfer = creep.memory.transfer;
  let creepName = creep.name;
  const homeRoomName = Memory.homeRoomName;
  const deepSouthRoomName = Memory.deepSouthRoomName;
  if (creep) {
    let enemyCreep = Game.getObjectById(Memory.dSAttackerId);
    if (enemyCreep) {
      invader = enemyCreep;
    } else {
      let enemies = creepRoom.find(FIND_HOSTILE_CREEPS);

      if (!enemies || enemies.length <= 0) {
        enemies = creepRoom.find(FIND_HOSTILE_SPAWNS);
      }

      if (!enemies || enemies.length <= 0) {
        enemies = creepRoom.find(FIND_HOSTILE_STRUCTURES);
      }

      invader = enemies.pop();
    }

    const distanceToInvader = 3;
    const distanceToFlagForPatrol = 10;
    if (invader) {
      if (creep.pos.inRangeTo(invader, distanceToInvader)) {
        retval = creep.rangedAttack(invader);
      } else {
        creep.memory.path = null;
        retval = smartMove(creep, invader, distanceToInvader);
        creep.say(invader.pos.x + "," + invader.pos.y + ":" + retval);
      }
    } else {
      // no attacker in creepRoom
      Memory.dSAttackerId = null;
      creep.say("patrol");

      //
      // start patrol
      //
      // move near a position to guard the room
      // or
      // go to the other room to help with their invader
      if (creep.room.name === homeRoomName) {
        if (!Memory.invaderId) {
          // no attacker in home room, go back to dS room
          if (creep.pos.isNearTo(southExit)) {
            retval = creep.move(BOTTOM);
          } else {
            retval = smartMove(
              creep,
              southExit,
              1,
              true,
              null,
              null,
              null,
              1,
              false,
              null
            );
            creep.say(southExit);
          }
        } else if (!creep.pos.inRangeTo(southExit, distanceToFlagForPatrol)) {
          // no attacker in home room, move near southExit to guard it
          retval = smartMove(
            creep,
            Game.flags.southExit,
            distanceToFlagForPatrol,
            false,
            null,
            null,
            null,
            1,
            false,
            null
          );
        }
      } else if (creep.room.name === deepSouthRoomName) {
        const deepSouthSpawn1 = Game.getObjectById(Memory.deepSouthS1);
        if (!Memory.dSAttackerId && Memory.invaderId) {
          // no attacker in dS but there's one in home room, go help out
          if (creep.pos.isNearTo(southEntrance)) {
            retval = creep.move(TOP);
          } else {
            retval = smartMove(
              creep,
              Game.flags.southEntrance,
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
        } else if (!creep.pos.inRangeTo(deepSouthSpawn1)) {
          // no attacker in dS, move near spawn to be ready
          retval = smartMove(
            creep,
            deepSouthSpawn1,
            distanceToFlagForPatrol,
            true,
            null,
            null,
            null,
            1,
            false,
            null
          );
        }
      }
    }
  }

  return retval;
}

roleRangedAttackerdS = profiler.registerFN(
  roleRangedAttackerdS,
  "roleRangedAttackerdS"
);
module.exports = roleRangedAttackerdS;
