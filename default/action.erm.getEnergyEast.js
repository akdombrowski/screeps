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
  let harvey = ermHarvesters.find(function(element) {
    return element === name;
  });
  let harveyNe = ermNeHarvesters.find(n => {
    return n === name;
  });

  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;

    if (harvey) {
      creep.memory.sourceDir = "east";
      if (ermHarvesters.length < 2) {
        creep.memory.buildingRoad = false;
        creep.memory.transfer = true;
      }
    } else if (harveyNe) {
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
    if (harveyNe) {
      if (creep.memory.nesource === 1) {
        target = neSource1;
      } else {
        target = neSource2;
      }
      if (creep.memory.role === "h") {
        let creepsAroundSource1 = neSource1.pos.findInRange(FIND_CREEPS, 2);
        let creepsAroundSource2 = neSource2.pos.findInRange(FIND_CREEPS, 2);
        console.log(JSON.stringify("1:" + creepsAroundSource1));
        console.log(JSON.stringify("2:" + creepsAroundSource2));
        if (neSource1 && creepsAroundSource1.length < 1) {
          target = neSource1;
          creep.memory.nesource = 1;
        } else if (neSource2 && creepsAroundSource2 < 1) {
          target = neSource2;
          creep.memory.nesource = 2;
        } else if (creepsAroundSource1.length < creepsAroundSource2.length) {
          target = neSource1;
          creep.memory.nesource = 1;
        } else {
          target = neSource2;
          creep.memory.nesource = 2;
        }
        console.log("source1:" + target);
        creep.memory.sourceId = target.id;
      }
    } else if (harvey) {
      target = eastSource;
    }
  }

  if (target) {
    console.log(JSON.stringify(creep.pos.inRangeTo(target, 3)));
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      creep.say("h");
      creep.memory.sourceId = target.id;

      return retval;
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
      return retval;
    } else {
      retval = smartMove(creep, target, 1);
      if (creep.pos.inRangeTo(target, 3)) {
        let waitTime = Memory.waitTime || 0;
        waitTime += 1;
        if (waitTime > 10) {
          waitTime = 0;
          creep.memory.sourceId = null;
          creep.memory.nesource = creep.memory.nesource === 1 ? 2 : 1;
        }
        Memory.waitTime = waitTime;
        console.log("wait:" + waitTime);
        creep.say("change");
      }
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
