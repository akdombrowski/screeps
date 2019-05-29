const transferEnergy = require("./action.transferEnergy");
const moveAwayFromCreep = require("./action.moveAwayFromCreep");

function vest(creep, flag, path) {
  let retal;
  if (_.sum(creep.carry) >= creep.carryCapacity) {
    creep.memory.getEnergy = false;
    if (creep.memory.role == "harvester" || creep.memory.role == "h") {
      creep.memory.transfer = true;
      if (creep.room.name == "E35N32") {
        creep.moveTo(Game.flags.northEntrance1);
      } else if (creep.room.name == "E36N31") {
        creep.moveTo(Game.flags.eastEntrance1);
      }
      transferEnergy(creep);
    }
    return;
  } else {
    creep.memory.transfer = false;
    creep.memory.getEnergy = true;
  }

  let target;
  if (flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, flag);
    creep.say("flag");
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag);
  } else if (creep.memory.sourceId) {
    target = Game.getObjectById(creep.memory.sourceId);
    creep.say("sourceId");
  }

  if (creep.memory.role != "harvester") {
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: structure => {
          if (
            (structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_STORAGE) &&
            _.sum(structure.store) >= creep.carryCapacity
          ) {
            return true;
          }
        }
      });
    }

    if (
      target &&
      (target.structureType == STRUCTURE_CONTAINER ||
        target.structureType == STRUCTURE_STORAGE) &&
      _.sum(target.store) >= creep.carryCapacity
    ) {
      creep.memory.sourceId = target.id;

      if (creep.pos.isNearTo(target.pos)) {
        retval = creep.withdraw(
          target,
          RESOURCE_ENERGY,
          creep.carryCapacity - _.sum(creep.carry)
        );
        if (retval == OK) {
          creep.say("wd." + target.pos.x + "," + target.pos.y);
        } else {
          creep.say("wd." + retval);
        }
        return;
      } else {
        creep.say("wd");
        let pathMem = 200;
    let igCreeps = true;
    if (moveAwayFromCreep(creep)) {
      pathMem = 0;
      igCreeps = false;
    }
        creep.moveTo(target, {
          reusePath: pathMem,
          ignoreCreeps: igCreeps,
          range: 1,
          visualizePathStyle: { stroke: "#ffffff" }
        });
        return;
      }
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
    if (target) {
      if (creep.pos.isNearTo(target.pos)) {
        creep.say("pickup");
        creep.pickup(target);
        return;
      } else {
        creep.say("pickup");
        creep.moveTo(target, {
          reusePath: 20,
          range: 1,
          visualizePathStyle: { stroke: "#ffffff" }
        });
        return;
      }
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_SOURCES, {
      filter: source => {
        return source.energy > 0;
      }
    });
  }

  if (target) {
    if (creep.pos.isNearTo(target)) {
      retval = creep.harvest(target);
      if (retval == OK) {
        creep.say("vest");
        creep.memory.sourceId = target.id;
      } else {
        creep.say("vest.err." + retval);
        creep.memory.sourceId = null;
      }
    } else if (creep.fatigue > 0) {
      creep.say("f." + creep.fatigue);
      return;
    } else if (path) {
      creep.say("m." + target.pos.x + "," + target.pos.y);

      if (creep.fatigue > 0) {
        creep.say("f." + creep.fatigue);
        return;
      }

      creep.moveByPath(path);
    } else if (creep.room.name == "E35N31") {
      creep.moveTo(target, {
        reusePath: 20,
        visualizePathStyle: { stroke: "#ffffff" }
      });
    } else {
      target = null;
      creep.say("sad");
    }
  }
}

module.exports = vest;
