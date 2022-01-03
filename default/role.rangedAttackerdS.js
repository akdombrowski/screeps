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
  let southToHome = Game.flags.southToHome;
  let homeToSouth = Game.flags.homeToSouth;
  let getEnergy = creep.memory.getEnergy;
  let transfer = creep.memory.transfer;
  let creepName = creep.name;
  const homeRoomName = Memory.homeRoomName;
  const southRoomName = Memory.southRoomName;
  if (creep) {
    let enemyCreep = Game.getObjectById(Memory.invaderIDSouth);
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

    const distanceToInvader = 2;
    const distanceToFlagForPatrol = 10;
    if (invader && creep.room.name === invader.room.name) {
      if (creep.pos.inRangeTo(invader, distanceToInvader)) {
        retval = creep.rangedAttack(invader);
      } else {
        creep.memory.path = null;
        retval = smartMove(creep, invader, distanceToInvader);
        creep.say(invader.pos.x + "," + invader.pos.y + ":" + retval);

        if (creep.pos.inRangeTo(invader, 3)) {
          retval = creep.rangedAttack(invader);
          creep.say("a:" + retval);
        }
      }
    } else if (invader && creep.room.name != invader.room.name) {
      if (creep.pos.isNearTo(homeToSouth)) {
        retval = creep.move(BOTTOM);
      } else {
        retval = smartMove(
          creep,
          homeToSouth,
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
    } else {
      Memory.invaderIDSouth = null;
      creep.say("patrol");

      //
      // start patrol
      //
      // move near a position to guard the room
      // or
      // go to the other room to help with their invader
      if (creep.room.name === homeRoomName) {
        if (!Memory.invaderIDHome) {
          // no attacker in home room, go back to S room
          if (creep.pos.isNearTo(southToHome)) {
            retval = creep.move(TOP);
          } else {
            retval = smartMove(
              creep,
              southToHome,
              1,
              true,
              null,
              null,
              null,
              1,
              false,
              null
            );
            creep.say(southToHome.pos.x + "," + southToHome.pos.y + "🏃‍♂️");
          }
        } else if (!creep.pos.inRangeTo(homeToSouth, distanceToFlagForPatrol)) {
          // no attacker in home room, move near southExit to guard it
          retval = smartMove(
            creep,
            homeToSouth,
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
      } else if (creep.room.name === southRoomName) {
        if (Memory.invaderId) {
          // no attacker in S but there's one in home room, go help out
          if (creep.pos.isNearTo(southToHome)) {
            retval = creep.move(TOP);
          } else {
            retval = smartMove(
              creep,
              southToHome,
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
        } else if (!creep.pos.inRangeTo(25, 25, distanceToFlagForPatrol)) {
          // no attacker in dS, move near spawn to be ready
          retval = smartMove(
            creep,
            new RoomPosition(25, 25, Memory.southRoomName),
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
