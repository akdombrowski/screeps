const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const transEnTower = require("./action.transEnTower");

function tran(creep, flag, dest) {
  let target;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let s1 = Memory.s1;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let eetower1 = Game.getObjectById(Memory.eetower1);
  let eespawnId = "5d356b280382bc5e2a8ad9f8";
  let eespawn = Game.getObjectById(eespawnId);
  let towers = [eetower1];
  let enAvail = rm.energyAvailable;
  let retval = -16;

  if (!creep.store[RESOURCE_ENERGY] || creep.store.getUsedCapacity() <= 0 || creep.memory.getEnergy) {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
    creep.memory.path = null;

    return ERR_NOT_ENOUGH_RESOURCES;
  }

  creep.memory.transfer = true;
  creep.memory.getEnergy = false;

  let nextToExt = creep.pos.findInRange(FIND_STRUCTURES, 1, {
    filter: { structureType: STRUCTURE_EXTENSION },
  });
  let ext = nextToExt.pop();
  if (ext && ext.store.getFreeCapacity() > 0) {
    retval = creep.transfer(ext, RESOURCE_ENERGY);
    return retval;
  }

  if (
    (creep.room.name === "E37N31" && eespawn.store.getFreeCapacity() > 0) ||
    !eespawn.store[RESOURCE_ENERGY]
  ) {
    target = eespawn;
  } else if (creep.memory.dest) {
    target = Game.getObjectById(creep.memory.dest);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    rm.energyAvailable &&
    rm.energyAvailable <= 1000
  ) {
    target = null;
  }

  if (enAvail > 300) {
    target = towers[0];
    target = _.find(towers, tower => {
      // tower doesn't exist or doesn't have an energy component
      if (!tower) {
        return false;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (
        !tower.store[RESOURCE_ENERGY] ||
        tower.store[RESOURCE_ENERGY] < target.store[RESOURCE_ENERGY]
      ) {
        return tower;
      }
    });
  }

  if (!target) {
    let exts;

    exts = Game.rooms["E37N31"].find(FIND_STRUCTURES, {
      filter: struct => {
        return struct.structureType === STRUCTURE_EXTENSION;
      },
    });
    Memory.e37n31Extensions = [];
    _.each(exts, ext => {
      Memory.e37n31Extensions.push(ext.id);
    });
    if (!Memory.e37n31Extensions) {
    } else {
      let extsObjs = [];
      _.each(Memory.e37n31Extensions, (val, key, collection) => {
        extsObjs.push(Game.getObjectById(val));
      });
      exts = extsObjs;
    }

    let a = creep.pos.findClosestByPath(exts, {
      filter: function(structure) {
        if (!structure) {
          return false;
        }
        let type = structure.structureType;
        if (
          (type === STRUCTURE_EXTENSION ||
            structure.structureType === STRUCTURE_SPAWN) &&
          (structure.store[RESOURCE_ENERGY] < 50 ||
            !structure.store[RESOURCE_ENERGY])
        ) {
          target = structure;
          return target;
        }
      },
    });
    if (a) {
      target = a;
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType === STRUCTURE_STORAGE
        ) {
          return (
            !structure.store ||
            structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        } else if (
          structure.structureType === STRUCTURE_CONTAINER &&
          structure.store
        ) {
          return (
            !structure.store ||
            structure.store[RESOURCE_ENERGY] <
              structure.store.getCapacity(RESOURCE_ENERGY)
          );
        }
      },
    });
  }

  if (target && creep.pos.isNearTo(target.pos)) {
    creep.memory.path = null;
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.say("t");
      creep.memory.dest = target.id;
    } else {
      creep.say("err." + retval);
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
  } else if (target) {
    creep.say("m." + target.pos.x + "," + target.pos.y);

    retval = smartMove(creep, target, 1, false, null, null, 50, 1);

    if (retval !== OK) {
      creep.memory.path = null;
      creep.memory.dest = null;
      creep.say("m.err." + retval);
    } else if (retval === OK) {
      creep.memory.dest = target.id;
      creep.say("m");
    }
  } else {
    creep.memory.dest = null;
    creep.memory.path = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.path = null;
    creep.memory.transfer = false;
  }

  if (retval) {
    return retval;
  }
}

module.exports = tran;
