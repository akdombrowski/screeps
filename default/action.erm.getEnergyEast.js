const transferEnergy = require("./action.transferEnergy");
const buildRoad = require("./action.buildRoad");
const transferEnergyeRm = require("./action.transferEnergyeRm");
const smartMove = require("./action.smartMove");

function vest(creep, flag, path) {
  creep.memory.direction = "east";
  const eastSource = Game.getObjectById("5bbcaf0c9099fc012e63a0bd");
  const neSource1 = Game.getObjectById("5bbcaf0c9099fc012e63a0ba");
  const neSource2 = Game.getObjectById("5bbcaf0c9099fc012e63a0bb");
  let ermNeHarvesters = Memory.ermNeHarvesters;
  let ermHarvesters = Memory.ermHarvesters;
  let s2 = Game.getObjectById(Memory.s2);
  const name = creep.name;
  const sourceId = creep.memory.sourceId;

  let target = sourceId ? Game.getObjectById(sourceId) : null;
  let retval = -16;
  console.log("source1:" + target);

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

    if (ermHarvesters[name]) {
      creep.memory.sourceDir = "east";
      if (ermHarvesters.length < 2) {
        creep.memory.buildingRoad = false;
        creep.memory.transfer = true;
      }
    } else if (ermNeHarvesters[name]) {
      creep.memory.sourceDir = "north";
      if (ermNeHarvesters.length < 2) {
        creep.memory.buildingRoad = false;
        creep.memory.transfer = true;
      }
    }

    if (creep.memory.buildingRoad) {
      let retval = buildRoad(creep);
      if (retval != OK) {
        creep.memory.transfer = true;
        if (creep.memory.sourceDir === "north") {
          transferEnergyeRm(creep);
        } else {
          transferEnergy(creep);
        }
      } else {
        creep.memory.buildingRoad = true;
      }
    } else if (creep.memory.transfer) {
      transferEnergy(creep);
    }
    return retval;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  if (!target) {
    if (ermNeHarvesters[name]) {
      if (creep.memory.nesource === 1) {
        target = neSource1;
      } else {
        target = neSource2;
      }
      if (creep.memory.role === "h") {
        let creepsAroundSource1 = neSource1.pos.findInRange(FIND_CREEPS, 1);
        let creepsAroundSource2 = neSource2.pos.findInRange(FIND_CREEPS, 1);
        if (neSource1 && !creepsAroundSource1.length > 1) {
          target = neSource1;
          creep.memory.nesource = 1;
        } else if (neSource2 && !creepsAroundSource2 > 1) {
          target = neSource2;
          creep.memory.nesource = 2;
        } else if (creepsAroundSource1.length < creepsAroundSource2.length) {
          target = neSource1;
          creep.memory.nesource = 1;
        } else {
          target = neSource2;
          creep.memory.nesource = 2;
        }
      }
    } else if (ermHarvesters[name]) {
      target = eastSource;
    }
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      creep.say("h");
      if (retval === OK) {
        creep.memory.sourceId = target.id;
      }
      return retval;
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
      return retval;
    } else {
      retval = smartMove(creep, target, 1);

      return retval;
    }
  } else if (!target) {
    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pos.isNearTo(target.pos)) {
        creep.say("pu");
        retval = creep.pickup(target);
      } else {
        creep.say("pu");
        retval = smartMove(creep, target, 1);
      }

      creep.memory.sourceId = null;
      creep.memory.nesource = null;
      return retval;
    }
  } else {
    console.log("creep.name " + creep.name + " is sad.");
    creep.say("sad");
  }
  return retval;
}

module.exports = vest;
