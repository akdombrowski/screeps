var createController = {
  /** spawn controller creep **/
  run: function() {
    var controllers = _.filter(
      Game.creeps,
      creep => creep.memory.role == "controller"
    );
    
    if (controllers.length < 2) {
	  var newName = "Controller" + Game.time;
	  console.log("Controller: " + controllers.length);
	  console.log("Spawning new controller: " + newName);
	  var costs=Memory.cost;
	  var parts=[MOVE, CARRY, WORK];
	  var cost=costs.move + costs.carry + costs.work;
	  while(cost <= Game.spawns['Spawn1'].energy) {
		  if(cost + costs.move + costs.work <= Game.spawns['Spawn1'].energy) {
			  parts.push(WORK, MOVE);
		  }
	  }
      console.log(
        Game.spawns["Spawn1"].spawnCreep(
          [MOVE, MOVE, MOVE, CARRY, WORK],
          newName,
          { memory: { role: "controller" } }
        )
      );
    }
  }
};

module.exports = createController;
