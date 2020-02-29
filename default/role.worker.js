const getEnergy = require("./action.getEnergy.1");
const getEnergyEE = require("./action.getEnergyEEast");
const smartMove = require("./action.smartMove");
const yucreepin = require("./action.checkForAnotherCreepNearMe");

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

      if (
        !target ||
        !CONSTRUCTION_COST[target.structureType] ||
        target.progress >= target.progressTotal
      ) {
        let extFound = false;
        let t;
        if (!Memory.e35n31sites) {
          Memory.e35n31sites = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: site => {
              let prog = site.progress;
              let progTot = site.progressTotal;
              let progLeft = progTot - prog;
              let type = site.structureType;
              if (prog >= progTot) {
                return false;
              } else if (type === STRUCTURE_EXTENSION) {
                extFound = true;
                t = site;
              } else {
                return site;
              }
            },
          });
        }

        let arr = [];
        let newArr = _.forEach(Memory.e35n31sites, site => {
          return arr.push(Game.getObjectById(site.id));
        });

        target = creep.pos.findClosestByPath(arr);
        if (target && !target.id) {
          target = null;
          creep.memory.buildTarget = null;
          Memory.e35n31sites = null;
          return retval;
        } else {
          target = t || target;
          targetId = target ? target.id : null;
        }
      }

      if (target) {
        if (creep.pos.inRangeTo(target, 3)) {
          if (yucreepin(creep)) {
            retval = smartMove(creep, s2, 5);

            // Couldn't move towards construction target
            if (retval === ERR_INVALID_TARGET) {
              creep.say("m.inval");
              target = null;
              creep.memory.b = null;
            } else if (retval === OK && target) {
              creep.say("m." + target.pos.x + "," + target.pos.y);
              creep.memory.b = targetId;
            } else {
              creep.say("m." + retval);
              target = null;
              creep.memory.b = null;
            }
          } else {
            retval = creep.build(target);
            creep.memory.b = targetId;
            creep.say("b");
          }
        } else if (creep.fatigue > 0) {
          creep.say("f." + creep.fatigue);
        } else {
          retval = smartMove(creep, target, 3);
          // Couldn't move towards construction target
          if (retval === ERR_INVALID_TARGET || retval === ERR_INVALID_TARGET) {
            creep.say("m.inval");
            target = null;
            creep.memory.b = null;
          } else if (retval === OK && target) {
            creep.say("m." + target.pos.x + "," + target.pos.y);
            creep.memory.b = targetId;
          } else {
            creep.say("m." + retval);
            target = null;
            creep.memory.b = null;
          }
        }
      } else if (creep.room.name === "E35N32") {
        retval = smartMove(creep, Game.flags.northEntrance1, 1);
        creep.say("w.n");
      } else {
        // creep.memory.role = "r";
        // creep.memory.working = false;
        creep.say("w.err");
        target = null;
        creep.memory.b = target;
      }
    }
  },
};

module.exports = roleWorker;
