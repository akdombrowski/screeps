const smartMove = require("./move.smartMove");
const getEnergy = require("./action.getEnergy");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const { checkIfBlockingSource } = require("./utilities.checkIfBlockingSource");
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
    creep.memory.lastBuildID = null;
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
      target = Game.getObjectById("61bfd993bb403a1ba7823ae4");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.deepSouthRoomName) {
      // tower construction site
      target = Game.getObjectById("61c3a6c5be69f6dd4c0df957");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.e58s49RoomName) {
      // tower construction site
      // target = Game.getObjectById("61c45a353762ce2f67126fe2");
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
      let arrIDs = [];
      if (creep.room.name === Memory.homeRoomName) {
        if (!Memory.e59s48sites || Memory.e59s48sites.length <= 0) {
          arr = Game.rooms.E59S48.find(FIND_CONSTRUCTION_SITES, {
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

          if (arr && arr.length > 0) {
            Memory.e59s48sites = arr.map((site) => site.id);
          } else {
            Memory.e59s48sites = null;
          }

          if (!target) {
            target = arr.shift();
            creep.memory.lastBuildID = target.id;
            Memory.e59s48sites.shift();
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.e59s48sites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          Memory.e59s48sites = Memory.e59s48sites.filter((id) => {
            let site = Game.getObjectById(id);
            if (!site) {
              return false;
            }

            if (site.progress < site.progressTotal) {
              return true;
            }

            return false;
          });
          if (sites) {
            try {
              target = creep.pos.findClosestByPath(sites, {
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
      } else if (creep.room.name === Memory.northRoomName) {
        if (Memory.e59s47sites || Memory.e59s47sites.length <= 0) {
          arr = Game.rooms.E59S47.find(FIND_CONSTRUCTION_SITES, {
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

          if (arr && arr.length > 0) {
            Memory.e59s47sites = arr.map((site) => site.id);
          } else {
            Memory.e59s47sites = null;
          }

          if (!target) {
            target = arr.shift();
            creep.memory.lastBuildID = target.id;
            Memory.e59s47sites.shift();
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.e59s47sites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          Memory.e59s47sites = Memory.e59s47sites.filter((id) => {
            let site = Game.getObjectById(id);
            if (!site) {
              return false;
            }

            if (site.progress < site.progressTotal) {
              return true;
            }

            return false;
          });
          if (sites) {
            try {
              target = creep.pos.findClosestByPath(sites, {
                filter: (site) => {
                  return site.progress < site.progressTotal;
                },
              });
              // target = creep.pos.findClosestByPath(arr);

              if (target && !target.id) {
                target = null;
                creep.memory.buildTarget = null;
                Memory.e59s47sites = null;
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
              Memory.e59s47sites = null;
            }
          }
        }
      } else if (creep.room.name === Memory.deepSouthRoomName) {
        if (!Memory.e59s49sites || Memory.e59s49sites.length <= 0) {
          arr = Game.rooms.E59S49.find(FIND_CONSTRUCTION_SITES, {
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

          if (arr && arr.length > 0) {
            Memory.e59s49sites = arr.map((site) => site.id);

            if (!target) {
              target = arr.shift();
              creep.memory.lastBuildID = target.id;
              Memory.e59s49sites.shift();
            }
          } else {
            Memory.e59s49sites = null;
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.e59s49sites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          Memory.e59s49sites = Memory.e59s49sites.filter((id) => {
            let site = Game.getObjectById(id);
            if (!site) {
              return false;
            }

            if (site.progress < site.progressTotal) {
              return true;
            }

            return false;
          });
          if (sites) {
            try {
              target = creep.pos.findClosestByPath(sites);
              // target = creep.pos.findClosestByPath(arr);

              if (target && !target.id) {
                target = null;
                creep.memory.buildTarget = null;
                Memory.e59s49sites = null;
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
              Memory.e59s49sites = null;
            }
          }
        }
      } else if (creep.room.name === Memory.e58s49RoomName) {
        if (!Memory.e58s49sites || Memory.e58s49sites.length <= 0) {
          arr = Game.rooms.E58S49.find(FIND_CONSTRUCTION_SITES, {
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

          if (arr && arr.length > 0) {
            Memory.e58s49sites = arr.map((site) => site.id);

            if (!target) {
              target = arr.shift();
              creep.memory.lastBuildID = target.id;
              Memory.e58s49sites.shift();
            }
          } else {
            Memory.e58s49sites = null;
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.e58s49sites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          if (Memory.e58s49sites) {
            Memory.e58s49sites = Memory.e58s49sites.filter((id) => {
              let site = Game.getObjectById(id);
              if (!site) {
                return false;
              }

              if (site.progress < site.progressTotal) {
                return true;
              }

              return false;
            });
          }

          if (sites) {
            try {
              target = creep.pos.findClosestByPath(sites);
              // target = creep.pos.findClosestByPath(arr);

              if (target && !target.id) {
                target = null;
                creep.memory.buildTarget = null;
                Memory.e58s49sites = null;
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
              Memory.e58s49sites = null;
            }
          }
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
