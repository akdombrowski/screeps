const energy = require("./energy");
const getEnergy = require("./action.getEnergy");
const construction = require("./construction");
const spawn = require("./spawn");

module.exports.loop = function() {
  let creepsMap = Game.creeps;
  let creeps = Memory.creeps;
  let roles = Memory.roles;

  if (creeps == null) {
    creeps = [];
  }

  if (roles == null) {
    roles = { con: [], up: [], en: [], he: [], att: [] };
  }

  for (let name in creepsMap) {
    let creep = creepsMap[name];
    if (!creeps[name]) {
      creeps.push(creep);
    }
    getEnergy(creep);
  }
  Memory.creepsMap = creepsMap;
  Memory.creeps = creeps;
  Memory.roles = roles;

  if (Game.spawns.s1.room.energyAvailable >= 300) {
    spawn();
  }
};
