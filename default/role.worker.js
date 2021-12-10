const getEnergy = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
const getEnergyN = require("./action.getEnergyNorth");
const getEnergyNE = require("./action.getEnergyNE");
const getEnergyNW = require("./action.getEnergyNW");
const getEnergyW = require("./action.getEnergyWest");
const getEnergyE = require("./action.getEnergyE");
const smartMove = require("./action.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const build = require("./action.build");
const buildE = require("./action.buildE");
const buildEE = require("./action.buildEE");
const buildNE = require("./action.buildNE");
const buildN = require("./action.buildN");
const buildNW = require("./action.buildNW");

var roleWorker = {
  /** @param {Creep} creep **/
  run: function (creep, flag, workRoom) {
    let s1 = Game.getObjectById(Memory.s1);
    let name = creep.name;
    let direction = creep.memory.direction;
    let rm = creep.room;
    let pos = creep.pos;
    let retval = -16;
    let homeRoomName = Memory.homeRoomName;

    if (
      !creep.store[RESOURCE_ENERGY] ||
      creep.store[RESOURCE_ENERGY] <= 0 ||
      (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
        !creep.memory.working)
    ) {
      creep.memory.working = false;
      creep.say("h");
      creep.memory.getEnergy = true;

      if (creep.memory.direction) {
        switch (creep.memory.direction) {
          case "east":
          case "e":
            if (creep.memory.sourceDir === "north") {
              getEnergyE(creep, "E36N32");
            } else if (creep.memory.sourceDir === "east") {
              getEnergyE(creep, "E36N31", "E36N31", Game.flags.east);
            } else {
              getEnergyE(creep, "E35N31");
            }
            break;
          case "eeast":
          case "ee":
            getEnergyEE(creep, "E37N31");
            break;
          case "west":
          case "w":
            getEnergyW(creep, "E34N31");
            break;
          case "north":
          case "n":
            getEnergyN(creep, "E35N32");
            break;
          case "ne":
          case "northeast":
            getEnergyNE(creep, "E36N32");
            break;
          case "nw":
          case "northwest":
            getEnergyNW(creep, "E34N32");
            break;
          default:
            getEnergy(creep, homeRoomName);
            break;
        }
      } else {
        getEnergy(creep, homeRoomName);
      }
      return;
    } else if (
      !creep.memory.working &&
      creep.store[RESOURCE_ENERGY] >= creep.store.getCapacity()
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
      } else if (
        creep.memory.direction === "nw" ||
        creep.memory.direction === "northwest"
      ) {
        return buildNW(creep, Game.flags.nw, "E34N32");
      } else {

        return build(creep);
      }
    }
  },
};

module.exports = roleWorker;
