const getEnergy = require("./action.getEnergy");

var roleTower = {
  /** @param {Creep} creep **/
  run: function(creep) {

    if (invader) {
      tower1.attack(invader);
    }
    // [{"event":5,"objectId":"5ce87715e727e3413723b950","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}},{"event":9,"objectId":"5ce87e186a175f1460729f7b","data":{"amount":4,"energySpent":4}},{"event":5,"objectId":"5ce87fad6ee37e76c5ac2738","data":{"targetId":"5bbcaefa9099fc012e639e8f","amount":8}},{"event":5,"objectId":"5ce8812b66e33a3411a808dc","data":{"targetId":"5bbcaefa9099fc012e639e8e","amount":8}}]
  
    let attackEvent = Object.values(Game.rooms)[0].getEventLog()[0];
    //   console.log(Object.values(Game.rooms)[0])
    invader = Game.getObjectById("5ce9cee004bcde0c8fc5bbef");
  
    if (attackEvent && attackEvent.event == EVENT_ATTACK) {
      let attacker = attackEvent.objectId;
      invader = attacker;
    }
    
    // console.log("invader " + invader);
    if (tower1) {
      let struct = Game.getObjectById(Memory.towerRepairTarget);

      if (invader) {
        tower1.attack(invader);
      } else {
        if (!struct || struct.hitsMax <= struct.hits) {
          struct = tower1.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => {
              return (
                structure.structureType != STRUCTURE_WALL &&
                structure.hits < structure.hitsMax
              );
            }
          });
        }

        Memory.towerRepairTarget = struct ? struct.id : null;

        if (struct) {
          tower1.repair(struct);
        } else {
          let healee = tower1.room.find(FIND_CREEPS, {
            filter: creep => {
              return creep.hits < creep.hitsMax;
            }
          });
          if (healee[0]) {
            console.log(tower1.heal(healee[0]) + "." + healee[0].name);
          }
        }
  }
};

module.exports = roleTower;
