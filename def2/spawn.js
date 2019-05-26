/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 
function spawn(creep) {
    Game.spawns.Spawn1.spawnCreep([MOVE,MOVE,MOVE,CARRY,WORK], 'a' + Game.time);     
}

module.exports = spawn;