const getEnergy = require("./action.getEnergy");
const transferEnergy = require("./action.transferEnergy");

const roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
      if(creep.memory.getEnergy || creep.carry.energy <= 0) {
          creep.memory.getEnergy = true;
          creep.memory.transfer = false;
          creep.say("🔄 h");
          if(!Memory.southHarvesters || Memory.southHarvesters.length <=2) {
            creep.memory.southHarvester = true;
            Memory.southHarvesters = [creep];
            getEnergy(creep);
          } else {
            getEnergy(creep);
          } 
      } else if (creep.memory.transfer || creep.carry.energy >= creep.carryCapacity) {
        creep.memory.getEnergy = false;
        creep.memory.transfer = true;
        creep.say("⚡t");
        transferEnergy(creep);
    }
  }
};

module.exports = roleHarvester;
