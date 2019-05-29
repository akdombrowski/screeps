/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 */

function supplyChain(creeps, creepSpawn, harvester, source, energyStoredPlace) {
  let hv = Game.creeps[harvester];
  hv.harvest(source);
  console.log(
    "creeps0 " +
      hv.name +
      " " +
      Game.creeps[creeps[0]].room.lookForAt(LOOK_ENERGY, hv)
  );
  let energy = Game.creeps[creeps[0]].room.lookForAt(LOOK_ENERGY, hv.pos)[0];
  Game.creeps[creeps[0]].pickup(energy);

  for (let i = 0; i < creeps.length - 1; i++) {
    let creep = Game.creeps[creeps[i]];

    if (creep) {
      console.log(
        "transfer: " +
          creep.transfer(Game.creeps[creeps[i + 1]], RESOURCE_ENERGY)
      );
    }
  }
  console.log(
    "to storage: " +
      Game.creeps[creepSpawn].transfer(energyStoredPlace, RESOURCE_ENERGY)
  );
}

module.exports = supplyChain;
