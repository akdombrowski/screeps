const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");
const buildRoad = require("./action.buildRoad");
const smartMove = require("./action.smartMove");
const build = require("./action.build");
const transEnTower = require("./action.transEnTower");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    const name = creep.name;
    const direction = creep.memory.direction;
    const sourceDir = creep.memory.sourceDir;
    const fatigue = creep.fatigue;
    const rm = creep.room;
    const homeRmName = Memory.homeRoomName;
    let retval = -16;

    if (creep.store.getFreeCapacity() <= 0) {
      retval = ERR_FULL;
      creep.memory.getEnergy = false;
      if (creep.memory.role.startsWith("h")) {
        retval = transferEnergy(creep);
      }
      return retval;
    }

    if (
      creep.memory.getEnergy ||
      !creep.store[RESOURCE_ENERGY] ||
      creep.store[RESOURCE_ENERGY] <= 0
    ) {
      creep.memory.buildRoad = false;
      creep.memory.transferTower = false;
      creep.memory.getEnergy = true;
      creep.memory.transfer = false;
      creep.memory.destID = null;

      retval = getEnergy(creep, homeRmName);
    } else if (creep.memory.transfer || creep.store[RESOURCE_ENERGY] > 0) {
      if (!creep.store[RESOURCE_ENERGY] || creep.store[RESOURCE_ENERGY] <= 0) {
        creep.memory.getEnergy = true;
        creep.memory.transEnTower = false;
        creep.memory.transfer = false;
        creep.memory.buildRoad = false;
        return ERR_NOT_ENOUGH_RESOURCES;
      }
      creep.memory.transEnTower = false;
      creep.memory.getEnergy = false;
      creep.memory.transfer = true;
      retval = -16;

      retval = transferEnergy(creep);

      if (retval === ERR_TIRED) {
        creep.say("f." + fatigue);
        return retval;
      }

      if (retval === -17) {
        return retval;
      }

      if (retval === -5 || retval === -2) {
        creep.memory.path = null;
        return retval;
      }

      if (retval !== OK && direction === "south") {
        creep.memory.transferTower = true;
        creep.memory.buildRoad = false;

        retval = transEnTower(creep, 2000);
      }

      // didn't give energy to tower. build road.
      if (
        (direction === "south" &&
          retval != OK &&
          !creep.memory.transfer &&
          !creep.memory.transferTower &&
          creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (site) => {
              return site.structureType === STRUCTURE_ROAD;
            },
          })) ||
        creep.memory.buildRoad
      ) {
        retval = buildRoad(creep);
        if (retval === OK) {
          creep.memory.buildRoad = true;
        }
      } else if (retval === OK && creep.memory.transferTower) {
        creep.say("tower");
      }

      if (retval === ERR_TIRED) {
        creep.say("f." + fatigue);
      }

      // didn't build road and didn't transto tower
      if (retval != OK) {
        creep.say("sad." + retval);
      }
    } else {
      creep.memory.getEnergy = true;
    }
  },
};

module.exports = roleHarvester;
