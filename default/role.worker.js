const getEnergy = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
const getEnergyN = require("./action.getEnergyNorth");
const getEnergyNE = require("./action.getEnergyNE");
const getEnergyW = require("./action.getEnergyWest");
const getEnergyE = require("./action.getEnergyE");
const smartMove = require("./action.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const build = require("./action.build");
const buildE = require("./action.buildE");
const buildEE = require("./action.buildEE");
const buildNE = require("./action.buildNE");
const buildN = require("./action.buildN");

var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep, flag, workRoom) {
    let s2 = Game.getObjectById(Memory.s2);
    let name = creep.name;
    let direction = creep.memory.direction;
    let rm = creep.room;
    let pos = creep.pos;
    let retval = -16;

    if (
      !creep.store[RESOURCE_ENERGY] ||
      creep.carry.energy <= 0 ||
      (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        !creep.memory.working)
    ) {
      creep.memory.working = false;
      creep.say("h");
      creep.memory.getEnergy = true;

      if (creep.memory.direction) {
        switch (creep.memory.direction) {
          case "east":
            if (creep.memory.sourceDir === "north") {
              getEnergyE(creep, "E36N32");
            } else if (creep.memory.sourceDir === "east") {
              getEnergyE(creep, "E36N31", "E36N31", Game.flags.east);
            } else {
              getEnergyE(creep, "E35N31");
            }
            break;
          case "eeast":
            getEnergyEE(creep, "E37N31");
            break;
          case "west":
            getEnergyW(creep, "E34N31");
            break;
          case "north":
            getEnergyN(creep, "E35N32");
            break;
          case "ne":
            getEnergyNE(creep, "E36N32");
            break;
          default:
            getEnergy(creep, "E35N31");
            break;
        }
      } else {
        getEnergy(creep, "E35N31");
      }
      return;
    } else if (
      !creep.memory.working &&
      creep.carry.energy >= creep.carryCapacity
    ) {
      creep.memory.working = true;
      creep.memory.getEnergy = false;
    } else if (!creep.memory.working) {
      creep.memory.working = false;
      return retval;
    }

    if (creep.memory.working) {
      if (
        creep.memory.direction === "s" ||
        creep.memory.direction === "south"
      ) {
        return build(creep, Game.flags.tower3, "E35N31");
      } else if (
        creep.memory.direction === "ee" ||
        creep.memory.direction === "eeast"
      ) {
        return buildEE(creep, Game.flags.eeController, "E37N31");
      } else if (creep.memory.direction === "ne") {
        return buildNE(creep, Game.flags.nesource1, "E36N32");
      } else if (
        creep.memory.direction === "n" ||
        creep.memory.direction === "north"
      ) {
        return buildN(creep, Game.flags.north1, "E35N32");
      } else if (
        creep.memory.direction === "e" ||
        creep.memory.direction === "east"
      ) {
        return buildE(creep, Game.flags.east, "E36N31");
      }
    }
  },
};

module.exports = roleWorker;
