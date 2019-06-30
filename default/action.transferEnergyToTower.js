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

  if(myTowers.length <= 0) {
    rm.find(FIND_STRUCTURES, {
      filter: (struct) => {
        let type = struct.structureType;
        if(type === STRUCTURE_TOWER) {
          myTowers.push(struct.id);
        }
      }
    })
  }

  target = _.forEach(myTowers, (id) => {
    tower = Game.getObjectById(id);
    if (tower.energy < 300) {
      return tower;
    }

    if(!target) {
      return tower;
    }

    if(target.energy === tower.energy &&
      creep.pos.getRangeTo(tower) < creep.pos.getRangeTo(target)) {
        return target;
    }
  });

  if (target && (target.energy >= target.energyCapacity || target.energy < minRmEnAvail)) {
    target = null;
  }

  if(!target) {
    creep.say("wut tower?")
    return ERR_NOT_FOUND;
  }
  if (target && creep.pos.isNearTo(target.pos)) {
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval == OK) {
      creep.say("t");
      creep.memory.dest = target.id;
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    // creep.say("m." + target.pos.x + "," + target.pos.y);

    retval = smartMove(creep, target, 1);

    if (retval != OK) {
      creep.say("m." + retval);
    } else {
      creep.say("m");
    }

    creep.memory.dest = target.id;
  } else {
    creep.memory.dest = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.transfer = false;
  }
}

module.exports = tranToTower;
