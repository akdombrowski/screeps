const moveAwayFromCreep = require("./action.moveAwayFromCreep");
const smartMove = require("./action.smartMove");
const traneRm = require("./action.transferEnergyeRm");
const tranee = require("./action.transferEnergyEEast");
const tranW = require("./action.transferEnergyW");
const transEnTower = require("./action.transEnTower");

function tran(creep, flag, dest) {
  let target;
  let rm = creep.room;
  let name = creep.name;
  let direction = creep.memory.direction;
  let sourceDir = creep.memory.sourceDir;
  let fatigue = creep.fatigue;
  let s1 = Memory.s1;
  let spawn2 = Game.spawns.spawn2;
  let tower1 = Game.getObjectById(Memory.tower1Id);
  let tower2 = Game.getObjectById(Memory.tower2Id);
  let tower3 = Game.getObjectById(Memory.tower3Id);
  let tower4 = Game.getObjectById(Memory.tower4Id);
  let tower5 = Game.getObjectById(Memory.tower5Id);
  let tower6 = Game.getObjectById(Memory.tower6Id);
  let ermtower1 = Game.getObjectById(Memory.ermtower1Id);
  let towers = [tower1, tower2, tower3, tower4, tower5, tower6];
  let enAvail = rm.energyAvailable;
  let retval = -16;

  if (_.sum(creep.carry) < 50) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    return -18;
  }

  if (direction === "eeast") {
    return tranee(creep);
  }

  if (
    !creep.store[RESOURCE_ENERGY] ||
    creep.store.getUsedCapacity(RESOURCE_ENERGY) <= 0
  ) {
    creep.memory.path = null;
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
    return -19;
  }
  console.log(name + " " + creep.pos.isNearTo(Game.flags.northEntrance1));

  if (creep.memory.role === "h" || creep.memory.role === "harvester") {
    if (creep.room.name === "E35N32") {
      if (
        creep.pos === Game.flags.northEntrance1 ||
        creep.pos.inRangeTo(Game.flags.northEntrance1, 1)
      ) {
        if (fatigue > 0) {
          retval = ERR_TIRED;
        } else {
          console.log(name + " move bottom ");
          retval = creep.move(BOTTOM);
        }
      } else {
        retval = smartMove(creep, Game.flags.northEntrance1, 1);
      }

      creep.say("northEntrance");
      return retval;
    } else if (creep.room.name === "E36N31") {
      retval = traneRm(creep);
      return retval;
    } else if (creep.room.name === "E34N31") {
      if (creep.pos.x > 49) {
        if (fatigue <= 0) {
          retval = creep.move(RIGHT);
        } else {
          retval = ERR_TIRED;
        }
      } else {
        retval = smartMove(creep, tower6, 3);
      }
      return retval;
    } else if (creep.room.name === "E35N31" && direction === "west") {
      if (creep.pos.x < 2) {
        if (fatigue <= 0) {
          retval = creep.move(RIGHT);
        } else {
          retval = ERR_TIRED;
        }
      } else {
        retval = tranW(creep);
      }
      return retval;
    } else if (creep.room.name === "E35N31" && creep.pos.y < 1) {
      if (fatigue <= 0) {
        retval = creep.move(BOTTOM);
      } else {
        retval = ERR_TIRED;
      }
      return retval;
    } else if (flag) {
      target = flag.pos.lookFor(LOOK_STRUCTURES).pop();
    } else if (creep.memory.dest) {
    } else if (creep.memory.flag) {
      target = creep.room.lookForAt(LOOK_STRUCTURES, creep.memory.flag).pop();
    }
  }

  if (
    target &&
    target.store[RESOURCE_ENERGY] &&
    target.store.getUsedCapacity(RESOURCE_ENERGY) >=
      target.store.getCapacity(RESOURCE_ENERGY)
  ) {
    target = null;
    creep.memory.flag = null;
  }

  if (
    target &&
    target.structureType === STRUCTURE_TOWER &&
    rm &&
    enAvail < 1000
  ) {
    target = null;
    creep.memory.flag = null;
  }

  let extensionNeedsEnergy = false;
  if (!target && (direction === "south" || direction === "west" || direction === "north")) {
    let exts;

    exts = Game.rooms["E35N31"].find(FIND_STRUCTURES, {
      filter: struct => {
        return struct.structureType === STRUCTURE_EXTENSION;
      },
    });
    Memory.e35n31Extensions = [];
    _.each(exts, ext => {
      Memory.e35n31Extensions.push(ext.id);
    });
    if (!Memory.e35n31Extensions) {
    } else {
      let extsObjs = [];
      _.each(Memory.e35n31Extensions, (val, key, collection) => {
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
          (structure.store[RESOURCE_ENERGY] <= 150 ||
            !structure.store[RESOURCE_ENERGY])
        ) {
          if (direction === "west" && structure.pos.x < 10) {
            target = structure;
            return structure;
          } else if (direction !== "west" && structure.pos.x > 10) {
            target = structure;
            return target;
          }
        }
      },
    });
    if (a) {
      target = a;
    }
  }

  if (
    !target &&
    (direction === "south" || direction === "east" || direction === "west") &&
    enAvail > 1000
  ) {
    target = towers[0];
    target = _.each(towers, tower => {
      if (!tower.store[RESOURCE_ENERGY]) {
        return true;
      }
      // tower doesn't exist or doesn't have an energy component
      if (!tower || !tower.store.getFreeCapacity(RESOURCE_ENERGY)) {
        return false;
      }

      // Skip tower 6 for south creeps
      if (creep.memory.direction === "south" && tower.id === tower6.id) {
        return false;
      }

      // current target tower has more energy than this tower, switch to this tower
      if (
        target &&
        target.store[RESOURCE_ENERGY] &&
        tower.stor[RESOURCE_ENERGY] &&
        tower.store.getFreeCapacity([RESOURCE_ENERGY]) >
          target.store.getFreeCapacity([RESOURCE_ENERGY])
      ) {
        target = tower;
        return true;
      }
      return false;
    })[0];

    if (
      target &&
      target.store[RESOURCE_ENERGY] &&
      target.store.getFreeCapacity([RESOURCE_ENERGY]) <= 0
    ) {
      target = null;
    }
  }

  if (!target) {
    let spawns = [s1, spawn2];
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: structure => {
        if (
          structure.structureType === STRUCTURE_STORAGE &&
          !name.startsWith("h")
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

  if (target && creep.pos.inRangeTo(target, 1)) {
    creep.memory.path = null;
    if (target instanceof String || target instanceof Number) {
      target = Game.getObjectById(target);
    }
    retval = creep.transfer(target, RESOURCE_ENERGY);
    if (retval === OK) {
      creep.memory.path = null;
      creep.say("t");
      return retval;
    }
  } else if (creep.fatigue > 0) {
    creep.say("f." + creep.fatigue);
    return ERR_TIRED;
  } else if (target) {
    retval = smartMove(creep, target, 1);

    if (creep.pos.isNearTo(target)) {
      return -17;
    }
    if (retval !== OK) {
      creep.memory.path = null;

      creep.say("m.err." + retval);
      return retval;
    } else if (retval === OK) {
      creep.memory.dest = target.id;
      creep.say(target.pos.x + "," + target.pos.y);
      return retval;
    }
  } else {
    console.log(name + " no target " + target);
    creep.memory.path = null;
    creep.say("t.err");
  }

  if (retval) {
    console.log(name + " here retval " + retval);
    return retval;
  }
}

module.exports = tran;
