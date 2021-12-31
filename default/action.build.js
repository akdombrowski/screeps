const smartMove = require("./move.smartMove");
const getEnergy = require("./getEnergy");
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
      target = Game.getObjectById("61cf082ebe69f660f90e86d0");

      if (
        !target ||
        (target.progress && target.progress >= target.progressTotal)
      ) {
        target = Game.getObjectById("61cf08253f190b63aecf8d53");
      }

      if (
        !target ||
        (target.progress && target.progress >= target.progressTotal)
      ) {
        target = Game.getObjectById("61cf0824be69f6175e0e86cf");
      }

      if (
        !target ||
        (target.progress && target.progress >= target.progressTotal)
      ) {
        target = Game.getObjectById("61cf08223762ce777612f327");
      }

      if (
        !target ||
        (target.progress && target.progress >= target.progressTotal)
      ) {
        target = Game.getObjectById("61cf08203762ce861812f326");
      }

      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.northRoomName) {
      target = Game.getObjectById("61ca56f3be69f684c60e542f");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.southRoomName) {
      // tower construction site
      target = Game.getObjectById("61cd727f3762ce4b2612deaa");
      if (target && target.progress < target.progressTotal) {
        // good, keep target
        creep.memory.lastBuildID = target.id;
      } else {
        creep.memory.lastBuildID = null;
        target = null;
      }
    } else if (creep.room.name === Memory.e58s49RoomName) {
      // tower construction site
      target = Game.getObjectById("61cbfc033762cee58312cf62");
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
        if (!Memory.homeSites || Memory.homeSites.length <= 0) {
          arr = Game.rooms[Memory.homeRoomName].find(FIND_CONSTRUCTION_SITES, {
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
            Memory.homeSites = arr.map((site) => site.id);
          } else {
            Memory.homeSites = null;
          }

          if (!target) {
            target = arr.shift();
            creep.memory.lastBuildID = target.id;
            Memory.homeSites.shift();
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.homeSites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          Memory.homeSites = Memory.homeSites.filter((id) => {
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
                Memory.homeSites = null;
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
              Memory.homeSites = null;
            }
          }
        }
      } else if (creep.room.name === Memory.southRoomName) {
        if (Memory.southSites || Memory.southSites.length <= 0) {
          arr = Game.rooms[Memory.southRoomName].find(FIND_CONSTRUCTION_SITES, {
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
            Memory.southSites = arr.map((site) => site.id);
          } else {
            Memory.southSites = null;
          }

          if (!target) {
            target = arr.shift();
            creep.memory.lastBuildID = target.id;
            Memory.southSites.shift();
          }
        }

        let sites = [];
        if (!target) {
          _.forEach(Memory.southSites, (id) => {
            const siteObj = Game.getObjectById(id);
            if (siteObj && siteObj.progress < siteObj.progressTotal) {
              sites.push(siteObj);
            }
          });

          Memory.southSites = Memory.southSites.filter((id) => {
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
                Memory.southSites = null;
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
              Memory.southSites = null;
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
        creep.say("b:" + target.pos.x + "," + target.pos.y);
      } else if (creep.fatigue > 0) {
        creep.say(
          "f." + creep.fatigue + ":" + target.pos.x + "," + target.pos.y
        );
      } else {
        retval = smartMove(creep, target, 3, false, null, null, 200, 1);

        // Couldn't move towards construction target
        if (retval === ERR_INVALID_TARGET || retval === ERR_INVALID_TARGET) {
          creep.say("m.inval");
          target = null;
          creep.memory.b = null;
        } else if (retval === OK && target) {
          creep.say("b:" + target.pos.x + "," + target.pos.y);
          creep.memory.b = targetId;
        } else {
          creep.say("m:" + target.pos.x + "," + target.pos.y + ":" + retval);
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
