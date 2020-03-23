const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");

function tranN(creep, flag, dest) {
  let target;
  let s2 = Game.getObjectById(Memory.s2);
  let name = creep.name;
  let retval = -16;
  let extensionNeedsEnergy = false;
  let towerId1 = "5e5dcc407c6d8f35385b7da7";
  let tower1 = Game.getObjectById(towerId1);
  let towers = [tower1];
  let enAvail = creep.room.energyAvailable;

  if (creep.room.name === "E35N32") {
    if (target && target.store.getFreeCapacity(RESOURCE_ENERGY) < 50) {
      target = null;
    }

    if (
      target &&
      target.structureType === STRUCTURE_TOWER &&
      rm &&
      enAvail < 1000
    ) {
      target = null;
    }

    if (enAvail > 1000 && !target) {
      target = towers[0];
      target = _.find(towers, tower => {
        // tower doesn't exist or doesn't have an energy component
        if (!tower) {
          return false;
        }

        // tower has free space
        if (tower.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
          return tower;
        }

        // current target tower has more energy than this tower, switch to this tower
        if (
          tower.store.getFreeCapacity(RESOURCE_ENERGY) >
          target.store.getFreeCapacity(RESOURCE_ENERGY)
        ) {
          return tower;
        }
      });
    }

    if (
      !target &&
      creep.room.energyAvailable < creep.room.energyCapacityAvailable
    ) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          let type = structure.structureType;
          if (
            (type === STRUCTURE_EXTENSION || type === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          ) {
            extensionNeedsEnergy = true;
            return true;
          }
        },
      });
    }

    if (target && creep.pos.isNearTo(target)) {
      retval = creep.transfer(target, RESOURCE_ENERGY);
      creep.say("t");
    } else {
      retval = smartMove(creep, target, 1);
      creep.say("m");
    }

    return retval;
  } else if (creep.room.name === "E34N31") {
    retval = smartMove(
      creep,
      Game.getObjectById("5d1330677594977c6d3f49ad"),
      3
    );
    return retval;
  } else if (creep.room.name === "E35N32") {
    if (creep.pos.y >= 49) {
      retval = creep.move(BOTTOM);
    } else {
      retval = smartMove(creep, Game.flags.northEntrance1, 1);
    }
    return retval;
  } else if (creep.memory.dest) {
    target = Game.getObjectById(creep.memory.dest);
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
  } else if (creep.room.name !== "E35N32") {
    retval = smartMove(creep, Game.flags.tower1N, 5);

    return retval;
  }

  if (target && target.energy >= target.energyCapacity) {
    target = null;
  }

  if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        let type = structure.structureType;
        if (
          (type === STRUCTURE_EXTENSION || type === STRUCTURE_SPAWN) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        ) {
          extensionNeedsEnergy = true;
          return true;
        }
      },
    });
  }

  if(!target) {
    let exts;

    exts = Game.rooms["E35N32"].find(FIND_STRUCTURES, {
      filter: struct => {
        return struct.structureType === STRUCTURE_EXTENSION;
      },
    });
    Memory.e35n32Extensions = [];
    _.each(exts, ext => {
      Memory.e35n32Extensions.push(ext.id);
    });
    if (!Memory.e35n32Extensions) {
    } else {
      let extsObjs = [];
      _.each(Memory.e35n32Extensions, (val, key, collection) => {
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
          ((type === STRUCTURE_EXTENSION &&
            structure !== Memory.spawnExts[0] &&
            structure !== Memory.spawnExts[1]) ||
            (structure.structureType === STRUCTURE_SPAWN &&
              structure.name === "spawn2")) &&
          (structure.store[RESOURCE_ENERGY] < 40 ||
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
          structure.structureType == STRUCTURE_STORAGE ||
          structure.structureType == STRUCTURE_CONTAINER
        ) {
          return structure.store.getFreeCapacity(RESOURCE_ENERGY);
        }
      },
    });
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
    retval = smartMove(creep, target, 1);

    if (retval != OK) {
      creep.say("err." + retval);
    } else {
      creep.say("m." + target.pos.x + "," + target.pos.y);
    }

    creep.memory.dest = target.id;
  } else {
    creep.memory.dest = null;
    creep.say("t.err");
  }

  if (_.sum(creep.carry) == 0) {
    creep.memory.transfer = false;
  }
}

module.exports = tranN;
