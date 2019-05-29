/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 */
 
 function supplyChain(creeps, creepSpawn, harvester, source, spawn) {
     
     let hv = Game.creeps[harvester]
     console.log(harvester + " harvesting: " + hv.harvest(source));
     
     let energy = Game.creeps[creeps[0]].room.lookForAt(LOOK_ENERGY, hv.pos)[0];
     console.log(hv.name + " dropped:" + energy);
     console.log(creeps[0] + " pickup:" + Game.creeps[creeps[0]].pickup(energy));
    
     for (let i=0; i < creeps.length - 1; i++) {
         let creep = Game.creeps[creeps[i]];
         
         if(creep) {
            console.log(creeps[i] + " transfer:" + creep.transfer(Game.creeps[creeps[i+1]], RESOURCE_ENERGY));
         }
     } 
     console.log(creepSpawn + " to " + spawn + ":" + Game.creeps[creepSpawn].transfer(spawn, RESOURCE_ENERGY));
     
 }

module.exports = supplyChain;