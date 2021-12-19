const smartMove = require("./action.smartMove");
const getEnergy = require("./action.getEnergy");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const { checkIfBlockingSource } = require("./checkIfBlockingSource");
const profiler = require("./screeps-profiler");

function build(creep) {
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
    return getEnergy(creep);
  }

  if (building) {
    if (creep.room.name === Memory.homeRoomName) {
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.northRoomName) {
      target = Game.getObjectById("61b99488d7e4319e2767aef1");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.deepSouthRoomName) {
      target = Game.getObjectById("61bdf95dd2a271e6c6079154");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    }

    if (
      !target ||
      !CONSTRUCTION_COST[target.structureType] ||
      target.progress >= target.progressTotal
    ) {
      let extFound = false;
      let t;
      let arr = [];
      if (creep.room.name === Memory.homeRoomName) {
        console.log(creep.name)
        Memory.e59s48sites = Game.rooms.E59S48.find(FIND_CONSTRUCTION_SITES, {
          filter: (site) => {
            let prog = site.progress;
            let progTot = site.progressTotal;
            let progLeft = progTot - prog;
            let type = site.structureType;
            if (progLeft <= 0) {
              return false;
            } else if (type === STRUCTURE_EXTENSION) {
              extFound = true;
              target = site;
              return true;
            } else if (type === STRUCTURE_SPAWN) {
              target = site;
              return true;
            } else {
              return true;
            }
          },
        });

        if (!target) {
          _.forEach(Memory.e59s48sites, (site) => {
            const siteObj = Game.getObjectById(site.id);
            if (siteObj.progress < siteObj.progressTotal) {
              arr.push(siteObj);
            }
          });
        }
      } else if (creep.room.name === Memory.northRoomName) {
        Memory.e59s47sites = Game.rooms.E59S47.find(FIND_CONSTRUCTION_SITES, {
          filter: (site) => {
            let prog = site.progress;
            let progTot = site.progressTotal;
            let progLeft = progTot - prog;
            let type = site.structureType;
            if (progLeft <= 0) {
              return false;
            } else if (type === STRUCTURE_EXTENSION) {
              extFound = true;
              target = site;
              return site;
            } else {
              return site;
            }
          },
        });

        if (!target) {
          _.forEach(Memory.e59s47sites, (site) => {
            const siteObj = Game.getObjectById(site.id);
            if (siteObj.progress < siteObj.progressTotal) {
              arr.push(siteObj);
            }
          });
        }
      } else if (creep.room.name === Memory.deepSouthRoomName) {
        Memory.e59s49sites = Game.rooms.E59S49.find(FIND_CONSTRUCTION_SITES, {
          filter: (site) => {
            let prog = site.progress;
            let progTot = site.progressTotal;
            let progLeft = progTot - prog;
            let type = site.structureType;
            if (progLeft <= 0) {
              return false;
            } else if (type === STRUCTURE_EXTENSION) {
              extFound = true;
              target = site;
              return site;
            } else {
              return site;
            }
          },
        });

        if (!target) {
          _.forEach(Memory.e59s49sites, (site) => {
            const siteObj = Game.getObjectById(site.id);
            if (siteObj.progress < siteObj.progressTotal) {
              arr.push(siteObj);
            }
          });
        }
      }

      if (arr) {
        try {
          target = creep.pos.findClosestByPath(arr, {
            filter: (site) => {
              return site.progress < site.progressTotal;
            },
          });
          // target = creep.pos.findClosestByPath(arr);

          if (target && !target.id) {
            target = null;
            creep.memory.buildTarget = null;
            Memory.e59s48sites = null;
            return retval;
          } else if (t) {
            target = t;
            targetId = target.id;
            if (targetId === null) {
              target = null;
            }
          } else {
            target = t || target;
            targetId = target ? target.id : null;
          }
        } catch (e) {
          Memory.e59s48sites = null;
        }
      }
    }

    if (target) {
      if (creep.pos.inRangeTo(target, 3)) {
        creep.memory.path = null;

        checkIfBlockingSource(creep, 1);

        retval = creep.build(target);
        creep.memory.b = targetId;
        creep.say("b");
      } else if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
      } else {
        retval = smartMove(creep, target, 3, false, null, null, 200, 1);

        // Couldn't move towards construction target
        if (retval === ERR_INVALID_TARGET || retval === ERR_INVALID_TARGET) {
          creep.say("m.inval");
          target = null;
          creep.memory.b = null;
        } else if (retval === OK && target) {
          creep.say(target.pos.x + "," + target.pos.y);
          creep.memory.b = targetId;
        } else {
          creep.say("m." + retval);
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
