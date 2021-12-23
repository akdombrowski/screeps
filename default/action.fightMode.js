const smartMove = require("./move.smartMove");

function fight(creep, tagetId) {
  targetId = targetId || creep.memory.targetId;
  let target = targetId ? Game.getObjectById(targetId) : null;
  let retval = -16;
  let hasRanged = false;
  let hasAtt = false;
  if (creep.body) {
    _.forEach(creep.body, part => {
      if (part.type === RANGED_ATTACK) {
        hasRanged = true;
      }

      if (part.type === ATTACK) {
        hasAtt = true;
      }
    });
  }

  if (target) {
    if (hasRanged) {
      if (creep.pos.inRangeTo(target, 3)) {
        creep.rangedAttack(target);
      } else {
        smartMove(creep, target, 3);
      }
    } else if (hasAtt) {
      if (creep.pos.isNearTo(target)) {
        creep.attack(target);
      } else {
        smartMove(creep, target, 1);
      }
    }
  }
  let otherCreep = creep.pos.findInRange(FIND_CREEPS, 1).pop();
  if (otherCreep.name != creep.name) {
    return otherCreep;
  } else {
    return null;
  }
}

module.exports = fight;
