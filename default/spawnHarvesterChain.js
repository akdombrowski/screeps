function spawnHarvesterChain(enAvail, rm, s1, harvesters) {
  let harvester1 = Game.creeps.harvester1;
  let retval = -16;
  console.log(enAvail + " spawn chain")
  if (!harvester1 && enAvail >= 1200) {
    let name = "harvester1";
    let parts = [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
      WORK,
    ];
    let chosenRole = "hChain";
    let direction = TOP;
    if (rm.lookForAt(LOOK_CREEPS, s1.pos.x, s1.pos.y - 1)) {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning harvester1: " + retval + " " + name);
    harvesters.push(name);
  } else if (!harvester1 && enAvail >= 500) {
    let name = "harvester1";
    let parts = [
      WORK,
      WORK,
      WORK,
      WORK,
      WORK
    ];
    let chosenRole = "hChain";
    let direction = TOP;
    if (rm.lookForAt(LOOK_CREEPS, s1.pos.x, s1.pos.y - 1)) {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning harvester1: " + retval + " " + name);
    harvesters.push(name);
  } else if (harvester1 && !Game.creeps["tr1"] && enAvail >= 50) {
    let name = "tr1";
    let parts = [CARRY];
    let chosenRole = "transferer";
    let direction = TOP_RIGHT;
    if (rm.lookForAt(LOOK_CREEPS, s1.pos.x + 1, s1.pos.y - 1)) {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning transferer1: " + retval);
    harvesters.push(name);
  } else if (harvester1 && !Game.creeps["tr2"] && enAvail >= 50) {
    console.log("tr2 inside");
    let name = "tr2";
    let parts = [CARRY];
    let chosenRole = "transferer";
    let direction = RIGHT;
    if (rm.lookForAt(LOOK_CREEPS, s1.pos.x + 1, s1.pos.y)) {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s1.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning transferer2: " + retval);
    harvesters.push(name);
  }
  return retval;
}
module.exports = spawnHarvesterChain;
