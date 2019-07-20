function vest(creep, sors) {
  let target;
   if (creep.memory.sors) {
    target = creep.memory.sors;
  } else if (creep.memory.flag) {
    target = creep.room.lookForAt(LOOK_SOURCES, creep.memory.flag).pop();
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_SOURCES);
  }

  let retval = creep.harvest(target);
  if (retval == OK) {
    creep.say(target.id[0]);
    creep.memory.source = target.pos;
  } else if (retval == ERR_NOT_IN_RANGE) {
    creep.say("v");
    creep.moveTo(target);
    creep.memory.source = target.pos;
  } else {
    creep.say(retval);
  }
}

module.exports = vest;
