/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('supplyChain');
 * mod.thing == 'a thing'; // true
 *
 */
const chainMove = require("./chainMove");
const smartMove = require("./action.smartMove");
const supplyChain = require("./supplyChain");

function spawnHarvester(name, direction, spawnDirection) {
  let t = Game.time;
  if (!name || Game.creeps[name]) {
    name = name || "h" + t.slice(0, 2);
  }
  let chosenRole = "harvester";
  direction = direction || "south";
  spawnDirection = spawnDirection || "BOTTOM";
  let parts = [
    CARRY,
    CARRY,
    WORK,
    WORK,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE,
    MOVE
  ];
}

module.exports = spawnToSource1Chain;
