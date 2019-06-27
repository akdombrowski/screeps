const getEnergy = require("./action.getEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
var roleRepairer = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let repair = creep.memory.repair;

    if (!repair && creep.carry.energy == creep.carryCapacity) {
      creep.memory.repair = true;
      creep.memory.getEnergy = false;
      creep.say("r");
    } else if (!repair) {
      creep.say("h");
      creep.memory.getEnergy = true;
      getEnergy(creep);
      return;
    }

    if (repair) {
      let struct;
      let target;
      let targetObj;
      if (creep.memory.r) {
        target = Game.getObjectById(creep.memory.r);
        targetObj = Game.getObjectById(target);
      }

      if (target === STRUCTURE_RAMPART) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            if (structure.structureType == STRUCTURE_RAMPART) {
              return structure.hits < structure.hitsMax;
            }
          },
        });
      } else if (target === STRUCTURE_ROAD) {
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            if (structure.structureType == STRUCTURE_ROAD) {
              return structure.hits < structure.hitsMax;
            }
          },
        });
      } else if (target && target.hits >= target.hitsMax) {
        target = null;
      } else {
        target = null;
      }

      if (!target || target.hits >= target.hitsMax) {
        let t;
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            if (
              !structure.progress ||
              structure.progress >= structure.progressTotal
            ) {
              return false;
            }

            if (structure.structureType === STRUCTURE_RAMPART) {
              return structure.hits < structure.hitsMax;
            } else if (
              structure.structureType === STRUCTURE_ROAD ||
              structure.structureType === STRUCTURE_CONTAINER
            ) {
              t = structure;
            }
          },
        });
        target = !target ? t : target;
      }

    //   let mostRepairNeeded;
    //   if (!target || target.hits >= target.hitsMax) {
    //     target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    //       filter: (structure) => {
              
    //         if (!mostRepairNeeded) {
    //           mostRepairNeeded = structure;
    //         } else {
    //           let highestRepair =
    //             mostRepairNeeded.hitsMax - mostRepairNeeded.hits;
    //           let structRepair = structure.hitsMax - structure.hits;

    //           if (highestRepair < structRepair) {
    //             Memory.towerRepairTarget = mostRepairNeeded;
    //             mostRepairNeeded = structure;
    //           }
    //         }
    //         return structure.hits <= structure.hitsMax / 2;
    //       },
    //     });

    //     if (
    //       target &&
    //       mostRepairNeeded.hitsMax - mostRepairNeeded.hits >
    //         target.hitsMax - target.hits
    //     ) {
    //       target = mostRepairNeeded;
    //     }
    //   }

      if (target) {
        if (creep.pos.inRangeTo(target, 3)) {
          let retval = creep.repair(target);

          if (retval == OK) {
            creep.say("r");
          } else if (retval == ERR_NOT_ENOUGH_ENERGY) {
            creep.memory.repair = false;
            getEnergy(creep);
            creep.say("r.En");
          } else {
            creep.say("r.err");
          }
        } else {
          smartMove(creep, target, 1);
          creep.memory.r = target.pos;
          if (creep.fatigue > 0) {
            creep.say("f." + creep.fatigue);
          } else if (retval == ERR_INVALID_TARGET) {
            creep.say("r." + "inval");
            target = null;
          } else {
            creep.say("m" + target.pos.x + "," + target.pos.y);
          }
        }
      } else if (creep.carry < creep.carryCapacity / 2) {
        creep.memory.repair = false;
        creep.memory.getEnergy = true;
        getEnergy(creep);
      } else {
        creep.memory.role = "w";
        console.log(creep.name + ":repair target is null");
      }
    }
  },
};

module.exports = roleRepairer;
