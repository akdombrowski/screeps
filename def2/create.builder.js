var createBuilder = {
  /** spawn builder creep **/
  run: function() {
    var builders = _.filter(
      Game.creeps,
      creep => creep.memory.role == "builder"
    );
    
    if (builders.length < 2) {
	  var newName = "Builder" + Game.time;
	  console.log("Builder: " + builders.length);
	  console.log("Spawning new builder: " + newName);
	  var costs=BODYPART_COST;
	  var parts=[MOVE, CARRY, WORK];
	  var cost=costs.move + costs.carry + costs.work;

	  while(cost <= Game.spawns['Spawn1'].energy) {
		  if(cost + costs.move + costs.work <= Game.spawns['Spawn1'].energy) {
			  parts.push(WORK, MOVE);
		  }
	  }
      console.log(
        Game.spawns["Spawn1"].spawnCreep(
          [WORK, MOVE, MOVE, CARRY, MOVE],
          newName,
          { memory: { role: "builder" } }
        )
      );
    }
  }
};

module.exports = createBuilder;
