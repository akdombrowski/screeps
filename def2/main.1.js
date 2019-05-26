var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleController = require("role.controller");
var createHarvester = require("create.harvester");
var createBuilder = require("create.builder");
var createController = require("create.controller");
var roleWorker = require("role.worker");
const hele = require("./action.hele");
const getEnergy = require("./action.getEnergy");

let creepsMap = Game.creeps;
let creeps = Memory.creeps;
let roles = Memory.roles;

module.exports.loop = function() {
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
  }

  if (roles.en.length < 1) {
    energy(creep);
  } else if (roles.con.length < 1) {
    construction(creep);
  } else if (roles.he.length < 1) {
    heale(creep);
  } else if (roles.up.length < 1) {
    upgrade(creep);
  } else {
    energy(creep);
  }
};
