const getEnergy = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
const smartMove = require("./action.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");
const build = require("./action.build");
const buildEE = require("./action.buildEE");
const buildNE = require("./action.buildNE");


var roleWorker = {
  /** @param {Creep} creep **/
  run: function(creep) {
    let s2 = Game.getObjectById(Memory.s2);
    let name = creep.name;
    let direction = creep.memory.direction;
    let rm = creep.room;
    let pos = creep.pos;
    if (!creep.memory.working) {
      creep.memory.working = false;
    }

    if (
      creep.carry.energy <= 0 ||
      (creep.carry.energy < creep.carryCapacity && !creep.memory.working)
    ) {
      creep.memory.working = false;
      creep.say("h");
      creep.memory.getEnergy = true;

      if (creep.room.name === "E36N31" || creep.room.name === "E36N32") {
        getEnergy(creep, "E35N31");
      } else if (creep.memory.direction) {
        switch (creep.memory.direction) {
          case "east":
            if (creep.memory.sourceDir === "north") {
              getEnergy(creep, "E36N32");
            } else if (creep.memory.sourceDir === "east") {
              getEnergy(creep, "E36N31", "E36N31", Game.flags.east);
            } else {
              getEnergy(creep, "E35N31");
            }
            break;
          case "west":
            getEnergy(creep, "E34N31");
            break;
          case "north":
            getEnergy(creep, "E35N32");
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
    }

    if (creep.memory.working) {
      let retval;
      let targetId = creep.memory.b;
      let target = Game.getObjectById(targetId);
      if (target) {
        if (creep.room.name !== target.room.name) {
          creep.memory.b = null;
          targetId = null;
        }
      }

      if (creep.memory.direction === "south") {
        return build(creep, Game.flags.tower3, "E35N31");
      } else if (creep.memory.direction === "eeast") {
        return buildEE(creep, Game.flags.e36n32contr, "E36N32");
      } else if (creep.memory.direction === "ne") {
        return buildNE(creep, Game.flags.eeController, "E37N31");
      } else if (creep.memory.direction === "n") {
        return buildN(creep, Game.flags.north1, "E35N32");
      }
    }
  },
};

module.exports = roleWorker;
