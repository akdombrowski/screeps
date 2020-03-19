function spawnHarvesterChain(enAvail, rm, s1, harvesters) {
  let harvester1 = Game.creeps.harvester1;
  let retval = -16;

  if (!harvester1 && enAvail >= 1000) {
    let name = "harvester1";
    let parts = [];
    // 12 energy harvesting per tick with 6 work parts. Energy sources replenish after 300 ticks. This puts the harvester with minimal downtime for source replenish.  (10 would be exact but we can be a little more aggressive for overlapping timelines). This is as efficient as we can get.
    // Be more aggressive to fill up storage and link for other creeps
    for (let i = 0; i < 10; i++) {
      parts.push(WORK);
    }
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
    let parts = [WORK, WORK, WORK, WORK, WORK];
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
