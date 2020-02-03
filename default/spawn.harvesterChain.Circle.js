function spawnHarvesterChain(enAvail, rm, spawn, target, chainGang, harvesters, transporters, transportersPath) {
  for(let h in harvesters) {
    if(Game.creeps[h]) {
      continue;
    }


  }
  let harvester1 = Game.creeps.harvester1;
  let s = Game.spawns.spawn2;
  console.log(s);
  if (!harvester1 && enAvail >= 300) {
    let name = "harvester1";
    let parts = [WORK, WORK];
    let chosenRole = "hChain";
    let direction = TOP;
    let retval;
    if (rm.lookForAt(LOOK_CREEPS, s.pos.x, s.pos.y - 1)) {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning harvester1: " + retval);
    harvesters.push(name);
  } else if (!harvester1 && !Game.creeps["tr1"] && enAvail >= 200) {
    let name = "tr1";
    let parts = [CARRY, CARRY, CARRY, CARRY];
    let chosenRole = "transferer";
    let direction = TOP_RIGHT;
    let retval;
    if (rm.lookForAt(LOOK_CREEPS, s.pos.x + 1, s.pos.y - 1)) {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning transferer1: " + retval);
    harvesters.push(name);
  } else if (!harvester1 && !Game.creeps["tr2"] && enAvail >= 200) {
    let name = "tr2";
    let parts = [CARRY, CARRY, CARRY, CARRY];
    let chosenRole = "transferer";
    let direction = RIGHT;
    let retval;
    if (rm.lookForAt(LOOK_CREEPS, s.pos.x + 1, s.pos.y)) {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
      });
    } else {
      retval = s.spawnCreep(parts, name, {
        memory: { role: chosenRole },
        directions: [direction],
      });
    }
    console.log("spawning transferer2: " + retval);
    harvesters.push(name);
  }
}
module.exports = spawnHarvesterChain;
