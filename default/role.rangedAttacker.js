const smartMove = require("./move.smartMove");
const profiler = require("./screeps-profiler");

function roleRangedAttacker(
  creep,
  exitFlag,
  returnFlag,
  targetRoomName,
  targetRoomExitDirection,
  returnRoomName,
  returnRoomExitDirection,
  targetRoomInvaderID,
  returnRoomInvaderID
) {
  const s1 = Game.spawns.Spawn1;
  const creepRoom = creep.room;
  const creepRoomName = creepRoom.name;
  let creeps = Game.creeps;
  let enAvail = creepRoom.energyAvailable;
  let invader;
  let retval;
  let getEnergy = creep.memory.getEnergy;
  let transfer = creep.memory.transfer;
  let creepName = creep.name;
  const homeRoomName = Memory.homeRoomName;
  const eastRoomName = Memory.eastRoomName;

  if (creep) {
    let enemyCreep = Game.getObjectById(targetRoomInvaderID);

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
    } else {
      creep.say("patrol");

      //
      // start patrol
      //
      // move near a position to guard the room
      // or
      // go to the other room to help with their invader
      if (creep.room.name === returnRoomName) {
        if (!Game.getObjectById(returnRoomInvaderID)) {
          // no attacker in return room, go back to target room
          if (creep.pos.isNearTo(exitFlag)) {
            retval = creep.move(targetRoomExitDirection);
          } else {
            retval = smartMove(
              creep,
              exitFlag,
              1,
              true,
              null,
              null,
              null,
              1,
              false,
              null
            );
            if (retval === OK) {
              creep.say("a." + exitFlag.pos.x + "," + exitFlag.pos.y + "🏃‍♂️");
            } else if (retval === ERR_TIRED) {
              creep.say("a." + creep.fatigue + "😴");
            }
          }
        }
      } else if (creep.room.name === targetRoomName) {
        if (Game.getObjectById(returnRoomInvaderID)) {
          // there an invader in return room, go help out
          if (creep.pos.isNearTo(returnFlag)) {
            retval = creep.move(returnRoomExitDirection);
          } else {
            retval = smartMove(
              creep,
              returnFlag,
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
          // no attacker in target room, move near middle
          retval = smartMove(
            creep,
            new RoomPosition(25, 25, targetRoomName),
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

roleRangedAttacker = profiler.registerFN(
  roleRangedAttacker,
  "roleRangedAttacker"
);
module.exports = roleRangedAttacker;
