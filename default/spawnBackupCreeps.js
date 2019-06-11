function spawnBackupCreeps(harvesters, enAvail, basicHv) {
  if (harvesters.length < 3 && enAvail >= 200) {
    console.log("make harvesters");
    let t = Game.time;
    let name = "h" + t.toString().slice(4);
    let chosenRole = "h";
    let direction = "south";
    let spawnDirection = BOTTOM;
    let retval;
    retval = Game.spawns.Spawn1.spawnCreep(basicHv, name, {
      memory: { role: chosenRole, direction: direction },
      directions: [spawnDirection, BOTTOM_RIGHT]
    });
    if (retval == OK) {
      console.log("spawned." + name);
    } else {
      console.log("failed hv spawn:" + retval);
    }
  }
}

module.exports = spawnBackupCreeps;
