const profiler = require("./screeps-profiler");

function findBuildSite(creepRoomName, roomSites) {
  let extFound = false;
  let arr = [];
  let target = null;

  if (!roomSites || roomSites.length <= 0) {
    arr = Game.rooms[creepRoomName].find(FIND_CONSTRUCTION_SITES, {
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

    if (target) {
      return { target: target, roomSites: null };
    }

    if (arr && arr.length > 0) {
      roomSites = arr.map((site) => site.id);

      target = arr.shift();
      creep.memory.lastBuildID = target.id;
      roomSites.shift();

      return { target: target, roomSites: roomSites };
    } else {
      roomSites = null;

      return { target: null, roomSites: null };
    }
  }

  let sites = [];
  if (!target) {
    // filter out the sites that no longer exist or have finished
    roomSites = roomSites.filter((id) => {
      let site = Game.getObjectById(id);
      if (!site) {
        return false;
      }

      if (site.progress < site.progressTotal) {
        return true;
      }

      return false;
    });

    // add all ids from roomSites as game objects in sites array
    _.forEach(roomSites, (id) => {
      const siteObj = Game.getObjectById(id);
      if (siteObj && siteObj.progress < siteObj.progressTotal) {
        sites.push(siteObj);
      }
    });

    // if we have game objects for the ids...
    if (sites) {
      // find the closest unfinished construction site
      try {
        target = creep.pos.findClosestByRange(sites, {
          filter: (site) => {
            return site.progress < site.progressTotal;
          },
        });

        if (target && !target.id) {
          // we have something for target, but it doesn't have an id...
          target = null;
          creep.memory.buildTarget = null;
          roomSites = null;
          return retval;
        }
      } catch (e) {
        roomSites = null;
      }
    }
  }
  return { target: target, roomSites: roomSites };
}
exports.findBuildSite = findBuildSite;
findBuildSite = profiler.registerFN(findBuildSite, "findBuildSite");
