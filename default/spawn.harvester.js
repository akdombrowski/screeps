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

function spawnHarvester(name, direction, parts, spawn, spawnDirection) {
  let t = Game.time;
  if (!name || Game.creeps[name]) {
    name = name || "h" + t.toString().slice(4);
  }
  let chosenRole = "harvester";
  let opts = { role: "harvester" };
  opts.direction = direction || "south";

  if (!spawn.pos.findInRange(FIND_CREEPS, 1)) {
    opts.spawnDirection = spawnDirection || "BOTTOM";
  }

  if (!parts) {
    parts = [
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
  let enNeeded = 0;
  parts.forEach(part => {
    part = part.toLowerCase();
    enNeeded += BODY_PART_COST[part];
  });
}

module.exports = spawnToSource1Chain;
