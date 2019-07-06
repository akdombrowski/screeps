const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");

function tranToTower(creep, minRmEnAvail, flag, dest) {
  let target;
  let retval = -16;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, ermtower1];
  let enAvail = rm.energyAvailable;
  let myTowers = creep.memory.myTowers || [];
  let towers4En = [];
  let minEnergy = -Infinity;
  let towerId;
  let destMem = creep.memory.dest;
  let transfering = creep.memory.transferTower;

  if (rm.energyAvailable < minRmEnAvail && !transfering) {
    console.log(name + " rm energy too high or not transfertower");
    return retval;
  }

  if (
    creep.memory.dest &&
    creep.memory.dest.structureType === STRUCTURE_TOWER
  ) {
    target = Game.getObjectById(creep.memory.dest);

    if(creep.memory.direction === "south") {
      console.log(name + " reuse target " + JSON.stringify(target));
    }
  } else {
    if (myTowers.length <= 0) {
      if (direction === "east") {
        myTowers.push(towers[2]);
      } else if (direction === "south") {
        myTowers.push(towers[0]);
        myTowers.push(towers[1]);
      } else if (direction) {
        myTowers.push(towers[0]);
        myTowers.push(towers[1]);
      } else {
        rm.find(FIND_STRUCTURES, {
          filter: (struct) => {
            let type = struct.structureType;
            if (type === STRUCTURE_TOWER) {
              myTowers.push(struct.id);
            }
          },
        });
      }
      creep.memory.myTowers = myTowers;
    }

    if (_.sum(creep.carry) > 0) {
      creep.memory.transferTower = true;
    }

    target = myTowers[0];

    if(creep.memory.direction === "south") {

      console.log(name + " starting tower " + JSON.stringify(target));
    }

    target = _.find(myTowers, (tower) => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return false;
      }

      // tower has less than 300 energy units
      if (tower.energy < 1000) {
        return tower;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (tower.energy < target.energy) {
        return tower;
      }
    });

    if (target && target.energy >= target.energyCapacity) {
      target = null;
    }
  }

  if (!target) {
    creep.say("wut tower?");
    creep.memory.transferTower = false;
    console.log(name + " no tower");
    return ERR_NOT_FOUND;
  }

  if(creep.memory.direction === "south") {

    console.log(name + " going to transfer to tower, isnearto " + creep.pos.isNearTo(target.pos));
  }
  if (target && creep.pos.isNearTo(target.pos)) {

    creep.memory.path = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);

    if(creep.memory.direction === "south") {

      console.log(name + " transfer to target val " + retval);
      
    }

    if (retval === OK) {
      creep.say("t");
      creep.memory.dest = target.id;
    }
    creep.memory.path = null;
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    // creep.say("m." + target.pos.x + "," + target.pos.y);

    if(creep.memory.direction === "south") {

      console.log(name + " moving to tower " + JSON.stringify(target));
    }

    retval = smartMove(creep, target, 1);
    if (retval === ERR_NOT_FOUND) {
      retval = smartMove(creep, target, 1);
    } else if (retval != OK) {
      creep.say("m." + retval);
    } else {
      creep.say("m");
      creep.memory.dest = target.id;
    }

    creep.memory.dest = target.id;
  } else {
    console.log("else " + name);
    console.log(name + " no target switching off of transentower")
    creep.memory.dest = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.transfer = false;
    creep.memory.transferTower = false;
    creep.memory.path = null;
  }
  
  return retval;
}

module.exports = tranToTower;
