var createVester = {
  /** spawn builder creep **/
  run: function() {
    var harvesters = _.filter(
      Game.creeps,
      creep => creep.memory.role == "harvester"
    );
    console.log("Harvesters: " + harvesters.length);
    var newName = "Harvester" + Game.time;
    let retval = Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, CARRY, MOVE],
      newName,
      { memory: { role: "harvester" } }
    );

    if (retval == OK) {
      console.log("Spawning new harvester: " + newName);
    } else {
      console.log("spawn harvester err: " + retval);
    }
  }
};

module.exports = createVester;
